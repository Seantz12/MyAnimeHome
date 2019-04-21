const dateHelper = require('./getDate');

function getShowsOnDate(date, file) {
    var len = file[day].length;
    var day = dateHelper.getWeekyday(date);
    var dateList = "";
    for(var i = 0; i < len - 1; i++) {
        dateList += file[day][i]["title"] + ", ";
    }
    dateList += "and " + file[day][len - 1]["title"];
    return dateList;
}

module.exports.getShowsOnDate = getShowsOnDate;