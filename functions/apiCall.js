import { request } from "https";

function getShowsToday(conv) {
    return new Promise((resolve, reject) => {
        var request = require("request");
        var options = {
            "method": "GET",
            "hostname": [
                "api",
                "jikan",
                "moe"
            ],
            "path": [
                "v3",
                "schedule",
                "monday"
            ],
            "headers": {
                "cache-control": "no-cache",
                "Postman-Token": "b96fe673-8970-4d14-a16f-cc86811a486e"
            }
        };
        request(options, function (error, response, body){
            if(error) {
                reject(error);
            } else {
                console.log('first is body, second is response');
                console.log(body);
                console.log('-----------------------------------');
                console.log(response);
                resolve();
            }
        });
    });
}

export { getShowsToday };