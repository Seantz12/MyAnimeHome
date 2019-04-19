import { request } from "https";

function getShowsToday(conv) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body){
            if(error) {
                reject(error);
            } else {
                //do stuff with the result (response)
                resolve();
            }
        });
    });
}