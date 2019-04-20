var URL_BASE = "https://api.jikan.moe"

function getShowsToday(conv) {
    return new Promise((resolve, reject) => {
        var request = require("request");
        var path = "/v3/schedule/monday"
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
                console.log('first is body, second is response');
                console.log(body);
                console.log('-----------------------------------');
                resolve();
            }
        });
    });
}

module.exports.getShowsToday = getShowsToday;