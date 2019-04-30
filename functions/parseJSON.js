const dateHelper = require('./getDate');

function getShowsOnDate(date, file) {
    var day = dateHelper.getWeekday(date);
    var len = file[day].length;
    var dateList = "";
    if(len != 1) {
        for(var i = 0; i < len - 1; i++) {
            dateList += file[day][i]["title"] + ", ";
        }
        dateList += "and ";
    }
    dateList += file[day][len-1]["title"];
    return dateList;
}

function getShowsOnSeason(number, file) {
    animeList = file.anime;
    animeList.sort((a, b) => (a.score > b.score) ? -1 : 1);
    var animeToSay = "";
    if(number != 1) {
        for(var i = 0; i < number - 1; i++) {
            animeToSay += animeList[i]['title'] + ", "
        }
        animeToSay += 'and ';
    }
    animeToSay += animeList[number-1]['title'];
    return animeToSay;
}

module.exports.getShowsOnDate = getShowsOnDate;
module.exports.getShowsOnSeason = getShowsOnSeason;