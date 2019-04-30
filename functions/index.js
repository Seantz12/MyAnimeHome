const { dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');
const app = dialogflow();
const parse = require('./parseJSON');
const dateHelper = require('./getDate');
const infoHelper = require('./showInfo');
const jikanjs = require('jikanjs');
const context = require('./context');

process.env.DEBUG = 'dialogflow:debug';

let setUpGlobals = (conv) => {
    global.MAX_REPEATS = 3;
    global.MAX_PROMPTS = 3;
    global.app = app;
};

let setUpSession = (conv) => {
    if(!conv.data.mySession) {
        let session = conv.data.mySession = {};
        session.numberOfPrompts = 0;
    }
};

/******************************************************************************/
// Generic Intents

app.intent('Default Fallback Intent', (conv) => {
    let session = conv.data.mySession;
    repeatPhrase = "Sorry, I didn't catch that. Could you say that again?";
    if(session.lastPrompt == repeatPhrase) {
        if(session.numberOfPrompts == 1) {
            conv.ask(session.lastPrompt);
            ++session.numberOfPrompts;
        } else {
            conv.close("Sorry I couldn't help you more. Have a great day!");
        }
    } else {
        session.lastPrompt = repeatPhrase;
        conv.ask(session.lastPrompt);
        session.numberOfPrompts = 1;
    }
});

app.intent('Default Welcome Intent', (conv) => {
    setUpSession(conv);
    setUpGlobals(conv);
    let session = conv.data.mySession;
    session.lastPrompt = 
        "Hi, I'm your Anime Home. I can tell you what anime is airing today. " + 
        "How can I help you?";
    conv.ask(session.lastPrompt);
});

app.intent('Repeat Intent', (conv) => {
    let session = conv.data.mySession;
    conv.ask("Sorry, let me repeat that. " + session.lastPrompt);
});

app.intent('Thank You Intent', (conv) => {
    let session = conv.data.mySession;
    session.lastPrompt = "You're welcome! How else can I help you?";
    conv.ask(session.lastPrompt);
});

app.intent('Goodbye', (conv) => {
    conv.close("Goodbye!");
});

/******************************************************************************/
// Anime Description Intents

app.intent('Anime Anyday Intent', async (conv, params) => {
    // TODO:
    // If param.sdate is not defined, then will cause error as day is undefined
    // Change airing to be the day (ex. Should say "Tomorrow we are...")
    let result = await jikanjs.loadSchedule(dateHelper.getWeekday(params.date));
    let session = conv.data.mySession;
    session.lastPrompt = 
        "Today we're airing " + parse.getShowsOnDate(params.date, result) + ".";
    conv.ask(session.lastPrompt);
});

app.intent('Top Anime This Season Intent', async (conv, params) => {
    let result = 
        await jikanjs.loadSeason(dateHelper.getYear(), dateHelper.getSeason());
    let session = conv.data.mySession;
    if(params.number == '') params.number = 1;
    if(params.number == 1) {
        session.lastPrompt = 'The top anime this season is ';
    } else {
        session.lastPrompt = 
            `The top ${params.number} anime this season are: `;
    }
    session.lastPrompt += 
        parse.getShowsOnSeason(params.number, result) + ".";
    conv.ask(session.lastPrompt);
});

app.intent('When Is Anime Coming Out Intent', async (conv, params) => {
    // TODO:
    // Setup try/catch for search paramter of less than three characters
    let showId = await infoHelper.getShowId(params.showName);
    let show = await jikanjs.loadAnime(showId);
    let session = conv.data.mySession;
    if(show.airing == false) {
        session.lastPrompt = "This show isn't airing this season";
        conv.ask(session.lastPrompt);
    } else {
        var words = show.broadcast.split(" ");
        // Broadcast is returned as "day at ..." so day is the first word
        var day = words[0]; 
        session.lastPrompt = `In Japan, ${show.title} airs on ${day}`;
        conv.ask(session.lastPrompt);
    }
});

app.intent('Rating Intent', async (conv, params) => {
    let showId = await infoHelper.getShowId(params.showName);
    let show = await jikanjs.loadAnime(showId);
    let session = conv.data.mySession;
    session.lastPrompt = 
        `The show ${show.title} has a rating of ${show.score}. ` +
        `It is ranked ${show.rank}`;
    conv.ask(session.lastPrompt);
});

app.intent('Description Intent', async (conv, params) => {
    let showId = await infoHelper.getShowId(params.showName);
    let show = await jikanjs.loadAnime(showId);
    let session = conv.data.mySession;
    var sen = show.synopsis.split('.');
    session.lastPrompt = 
        `Sure, here is the synopsis for ${show.title}. ` + sen[0] + ". " + 
        sen[1] + ". If you want to hear the rest, say more.";
    conv.ask(session.lastPrompt);
    context.setContext(conv, "description", 1, { synopsis: sen });
});

app.intent('More Description Intent', (conv) => {
    let session = conv.data.mySession;
    var synop = conv.contexts.get("description").parameters.synopsis;
    session.lastPrompt = `Sure. `;
    for(var i = 2; i < synop.length - 1; i++) {
        session.lastPrompt += synop[i] + ". ";
    }
    conv.ask(session.lastPrompt);
});

/******************************************************************************/
// User Account Intents

app.intent('Setup MAL Account', async (conv, params) => {
    let session = conv.data.mySession;
    try {
        await jikanjs.loadUser(params.username);
        conv.user.storage.username = params.username;
        session.lastPrompt = 
            "Ok! I've connected to your MyAnimeList account! " +
            "You can now ask for information about yourself!"
        conv.ask(session.lastPrompt);
    } catch {
        session.lastPrompt = 
            "Sorry! That user doesn't exist, please try again.";
        conv.ask(session.lastPrompt);
    }
});

/******************************************************************************/

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);