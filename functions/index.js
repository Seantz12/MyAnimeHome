const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const app = dialogflow();
const api = require('./apiCall');
const parse = require('./parseJSON');
const dateHelper = require('./getDate');
const infoHelper = require('./showInfo');
const jikanjs = require('jikanjs');

process.env.DEBUG = 'dialogflow:debug'; 

let setUpGlobals = (conv) => {
  global.MAX_REPEATS = 3;
  global.MAX_PROMPTS = 3;
  global.app = app;
};

let setUpSession = (conv) => {
  if (!conv.data.mySession) {
    let session = conv.data.mySession = {};
    session.numberOfPrompts = 0;
  }
};

app.intent('Default Fallback Intent', (conv) => {
  let session = conv.data.mySession;
  if (session.lastPrompt == "Sorry I didn't catch that, could you try saying that again?") {
    if (session.numberOfPrompts == 1) {
      conv.ask(session.lastPrompt);
      ++session.numberOfPrompts;
    } else {
      conv.close("Sorry I couldn't help you more. Have a great day!");
    }
  } else {
    session.lastPrompt = "Sorry I didn't catch that, could you try saying that again?";
    conv.ask(session.lastPrompt);
    session.numberOfPrompts = 1;
  }
});

app.intent('Default Welcome Intent', (conv) => {
  setUpSession(conv);
  setUpGlobals(conv);
  let session = conv.data.mySession;
  session.lastPrompt = "Hi, I'm your Anime Home. I can tell you what anime is airing today. How can I help you?";
  conv.ask(session.lastPrompt);
});

app.intent('Repeat Intent', (conv) => {
  let session = conv.data.mySession;
  conv.ask("Sorry, let me repeat that. " + session.lastPrompt);
});

app.intent('Anime Anyday Intent', (conv, params) => {
  // TODO:
  // If param.sdate is not defined, then will cause error as day is undefined
  // Change airing to be the day (ex. Should say "Tomorrow we are...")
  return jikanjs.loadSchedule(dateHelper.getWeekday(params.date)).then((results) => {
    let session = conv.data.mySession;
    session.lastPrompt = "Today we are airing " + parse.getShowsOnDate(params.date, results) + ".";
    conv.ask(session.lastPrompt);
  });
});

app.intent('Top Anime This Season Intent', (conv, params) => {
  return jikanjs.loadSeason(dateHelper.getYear(), dateHelper.getSeason()).then((results) => {
    let session = conv.data.mySession;
    if(params.number == '') params.number = 1;
    if(params.number == 1) {
      session.lastPrompt = 'The top anime this season is ';
    } else {
      session.lastPrompt = `The top ${params.number} anime this season are: `;
    }
    session.lastPrompt += parse.getShowsOnSeason(params.number, results) + ".";
    conv.ask(session.lastPrompt);
  });
});

app.intent('When Is Anime Coming Out Intent', (conv, params) => {
  // TODO:
  // Setup try/catch for search paramter of less than three characters
  return (infoHelper.getShowId(params.showName)).then((showId) => jikanjs.loadAnime(showId)).then((show) => {
    let session = conv.data.mySession;
    if(show.airing == false) {
      session.lastPrompt = "This show isn't airing this season";
      conv.ask(session.lastPrompt);
    } else {
      var words = show.broadcast.split(" ");
      var day = words[0]; // Broadcast is returned as "Day at ..." so day is the first word
      session.lastPrompt = `In Japan, ${show.title} airs on ${day}`;
      conv.ask(session.lastPrompt);
    }
  });
});

app.intent('Rating Intent', (conv, params) => {
  return (infoHelper.getShowId(params.showName)).then((showId) => jikanjs.loadAnime(showId)).then((show) => {
    let session = conv.data.mySession;
    session.lastPrompt = `The show ${show.title} has a rating of ${show.score}. It is ranked ${show.rank}`;
    conv.ask(session.lastPrompt);
  });
});

app.intent('Setup MAL Account', (conv, params) => {
  let session = conv.data.mySession;
  try { 
    return jikanjs.loadUser(params.username).then(() => {
      conv.user.storage.username = params.username;
      session.lastPrompt = `Ok! I've connected to your MyAnimeList account! You can now ask for information about yourself!`
      conv.ask(session.lastPrompt);
    });
  } catch {
    session.lastPrompt = "Sorry! That user doesn't exist, please try again.";
    conv.ask(session.lastPrompt);
  }
});

app.intent('Thank You Intent', (conv) => {
  let session = conv.data.mySession;
  session.lastPrompt = "You're welcome! How else can I help you?";
  conv.ask(session.lastPrompt);
});


app.intent('Goodbye', (conv) => {
  conv.close("Goodbye!");
});



exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);