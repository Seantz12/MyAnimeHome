const jikanjs = require('jikanjs');

var getShowId = async (name) => {
    let result = await jikanjs.search('anime', name);
    show = result.results[0];
    return show.mal_id;
}

module.exports.getShowId = getShowId;