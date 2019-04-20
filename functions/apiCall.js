var URL_BASE = "https://api.jikan.moe"

function getShowsOn(conv, date=null) {
    return new Promise((resolve, reject) => {
        var request = require("request");
        // let date = conv.request.user.lastSeen;
        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        if(date == null) var d = new Date();
        else var d = new Date(date);
        var day = days[d.getDay()];
        var path = "/v3/schedule/" + day;
        var url = URL_BASE + path;
        var options = { 
        method: 'GET',
        url: url,
        headers: 
            { 'Postman-Token': 'd9846809-881d-4dac-929f-6e57266cdc61',
                'cache-control': 'no-cache' } 
        };
        request(options, function (error, response, body){
            if(error) {
                reject(error);
            } else {
                console.log(body);
                conv.data.mySession.true = 3;
                resolve();
            }
        });
    });
}

module.exports.getShowsOn = getShowsOn;