const fetch = require('node-fetch');
require('dotenv').config();

const discogsToken = process.env.discogsToken;

const discogsSearch = async (req, res, next) => {
    const artists = req.query.artist;
    const albums = req.query.album;

    try {
        const response = await fetch(`https://api.discogs.com/database/search?q=${artists + albums}&token=${discogsToken}`);
        const data = await response.json();
        let found = false;  // a flag to indicate if a track with 'extraartists' is found
    
        for (let result of data.results) {
            const masterId = result.master_id;
            if (masterId) { 

                const masterResponse = await fetch(`https://api.discogs.com/masters/${masterId}`);
                const masterData = await masterResponse.json();
                const tracklist = masterData.tracklist;
                for(const track of tracklist) {
                    if (track.hasOwnProperty('extraartists')) {
                        res.locals.data = masterData;
                        found = true;
                        break;  
                    }
                }
                if (found) break;
            }
        }
    
        if (!found) {
            res.locals.data = 'No masters found with extra artists.';
        }
    
        return next();
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
    
}




// const discogsSearch = (req, res, next) => {
//     const artists = req.query.artist;
//     const albums = req.query.album;
//     fetch(`https://api.discogs.com/database/search?q=${artists + albums}&token=${discogsToken}`)
//         .then(response => response.json())
//         .then(data => {
//             const masterId = data.results[0].master_id;
//             fetch(`https://api.discogs.com/masters/${masterId}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     res.locals.data = data;
//                     return next();
//                  })
//                  .catch(err => {
//                     console.log(err);
//                     return;
//                 })
//         })
//         .catch(err => {
//             console.log(err);
//             return;
//         })
// }

module.exports = {
    discogsSearch,
}