var URL_BASE = "https://api.jikan.moe"

function getShowsToday(conv) {
    return new Promise((resolve, reject) => {
        var request = require("request");
        // let date = conv.request.user.lastSeen;
        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        var d = new Date();
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
                try {
                    JSON.parse(body);
                } catch (e) {
                    console.log("bad");
                    return false;
                }
                let newbody = JSON.stringify(body, null, " ");
                console.log(newbody);
                resolve();
            }
        });
    });
}

module.exports.getShowsToday = getShowsToday;