const fetch = require('node-fetch');
require('dotenv').config();

const discogsToken = process.env.discogsToken;

function getStringBeforeParenthesis(str) {
  const indexOfParenthesis = str.indexOf('(');
  if (indexOfParenthesis !== -1) {
    return str.substring(0, indexOfParenthesis).trim(); // trim to remove any spaces before '('
  }
  return str;
} function normalizeString(str) {
  return str.replace(/’/g, "'");
}

const discogsSearch = async (req, res, next) => {
  const artists = req.query.artist;
  const albums = req.query.album;
  const song = req.query.song;

  function isSongMatch(trackTitle, song) {
    const normalizedTrackTitle = normalizeString(trackTitle.toLowerCase());
    const normalizedSong = normalizeString(song.toLowerCase());
    const noFeatSong = normalizedSong.replace(/\(.*\)/, "").trim();

    return normalizedTrackTitle === normalizedSong ||
      normalizedTrackTitle === noFeatSong ||
      getStringBeforeParenthesis(normalizedSong) === getStringBeforeParenthesis(normalizedTrackTitle);
  }

  try {
    //search for masters
    const response = await fetch(`https://api.discogs.com/database/search?q=${artists + albums}&token=${discogsToken}`);
    const data = await response.json();
    let found = false;
    const creditsArr = [];

    const processedMasterIds = new Set();
    //iterate over the all masters
    for (let result of data.results) {
      const masterId = result.master_id;
      //if master available then perform 2nd fetch
      if (!processedMasterIds.has(masterId)) {
        const masterResponse = await fetch(`https://api.discogs.com/masters/${masterId}`);
        const masterData = await masterResponse.json();
        processedMasterIds.add(masterId);
        const currMaster = masterData.tracklist;

        if (!Array.isArray(currMaster)) {
          console.log(typeof result);
          console.error('currMaster is not an array:', result.master_url);
          continue;
        }

        //iterate over current master
        for (const track of currMaster) {

          //match only if extraartists available and song matches the title
          if (track.hasOwnProperty('extraartists') && isSongMatch(track.title, song)) {
            // console.log(track)
            const crew = track.extraartists;
            //build the credits array
            for (const per of crew) {
              creditsArr.push(per.role, per.name);
            }
            res.locals.data = creditsArr;
            console.log(creditsArr)
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