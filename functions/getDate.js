function getWeekday(date) {
    var weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var d = new Date(date);
    return weekday[d.getDay()];
}

function getAiringWeekday(date) {
    var weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var d = new Date(date);
    return weekday[(d.getDay() + 1) % 7]; // Airing day is one ahead of given value
}

function getSeason() {
    var d = new Date();
    var month = d.getMonth();
    var season = "";
    if(month >= 0 && month <= 2) season = "winter";
    else if(month >= 3 && month <= 5) season = "spring";
    else if(month >= 6 && month <= 8) season = "summer";
    else if(month >= 9 && month <= 11) season = "fall";
    return season;
}

function getYear() {
    var d = new Date();
    var year = d.getFullYear();
    return year;
}

module.exports.getWeekday = getWeekday;
module.exports.getAiringWeekday = getAiringWeekday;
module.exports.getSeason = getSeason;
module.exports.getYear = getYear;