const jikanjs = require('jikanjs');

var getShowId = (name) => jikanjs.search('anime', name).then((results) => {
        console.log('hey');
        show = results.results[0];
        return show.mal_id;
    });

module.exports.getShowId = getShowId;