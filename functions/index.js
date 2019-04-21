const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const app = dialogflow();
const api = require('./apiCall');
const parse = require('./parseJSON');
const dateHelper = require('./getDate');
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
  return jikanjs.loadSchedule(dateHelper.getWeekyday(params.date)).then((anime) => {
    let session = conv.data.mySession;
    parse.parseJSON(conv, dateHelper.getWeekyday(params.date), anime);
    session.lastPrompt = "Today we are airing " + session.animeList;
    conv.ask(session.lastPrompt);
  });
});

app.intent('Top Anime This Season Intent', (conv, params) => {
  if(params.number == '') params.number = 1;
  return jikanjs.loadSeason(dateHelper.getYear(), dateHelper.getSeason()).then((allAnime) => {
    animeList = allAnime.anime;
    animeList.sort((a, b) => (a.score > b.score) ? -1 : 1);
    var animeToSay = ""
    for(var i = 0; i < params.number-1; i++) {
      animeToSay += animeList[i]['title'] + ", "
    }
    animeToSay += 'and ' + animeList[params.number-1]['title'];
    if(params.number == 1) {
      conv.ask('The top anime this season is ' + animeToSay);
    } else {
      conv.ask(`The top ${params.number} anime this season are: ` + animeToSay);
    }
  });
});

app.intent('When Is Anime Coming Out Intent', (conv, params) => {

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