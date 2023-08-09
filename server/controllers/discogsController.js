const fetch = require('node-fetch');
require('dotenv').config();

const discogsToken = process.env.discogsToken;

const discogsSearch = (req, res, next) => {
    const artists = req.query.artist;
    const albums = req.query.album;
    fetch(`https://api.discogs.com/database/search?q=${artists + albums}&token=${discogsToken}`)
        .then(response => response.json())
        .then(data => {
            const masterId = data.results[0].master_id;
            fetch(`https://api.discogs.com/masters/${masterId}`)
                .then(response => response.json())
                .then(data => {
                    res.locals.data = data;
                    return next();
                 })
                 .catch(err => {
                    console.log(err);
                    return;
                })
        })
        .catch(err => {
            console.log(err);
            return;
        })
}

module.exports = {
    discogsSearch,
}