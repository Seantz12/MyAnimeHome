function parseJSON(conv, day, file) {
    var len = file[day].length;
    conv.data.mySession.animeList = "";
    for(var i = 0; i < len - 1; i++) {
        conv.data.mySession.animeList += file[day][i]["title"] + ", ";
    }
    conv.data.mySession.animeList += "and " + file[day][len - 1]["title"];
    console.log(conv.data.mySession.animeList);
}

module.exports.parseJSON = parseJSON;