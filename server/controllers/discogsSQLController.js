const db = require('../models/pgModel.js');

function getStringBeforeParenthesis(str) {
  const indexOfParenthesis = str.indexOf('(');
  if (indexOfParenthesis !== -1) {
    return str.substring(0, indexOfParenthesis).trim(); // trim to remove any spaces before '('
  }
  return str;
}

const discogsSearch = async (req, res, next) => {
  const artist = req.query.artist.split('/')[0];
  let song = req.query.song;
  song = getStringBeforeParenthesis(song);
  function determineTableName(baseName, firstCharacter) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    if (alphabet.includes(firstCharacter.toLowerCase())) {
        return `${baseName}_${firstCharacter.toLowerCase()}`;
    } else {
        return `${baseName}_default`;
    }
}
  const validArtistTableNames = [
    "release_track_artist_a",
    "release_track_artist_b",
    "release_track_artist_c",
    "release_track_artist_d",
    "release_track_artist_e",
    "release_track_artist_f",
    "release_track_artist_g",
    "release_track_artist_h",
    "release_track_artist_i",
    "release_track_artist_j",
    "release_track_artist_k",
    "release_track_artist_l",
    "release_track_artist_m",
    "release_track_artist_n",
    "release_track_artist_o",
    "release_track_artist_p",
    "release_track_artist_q",
    "release_track_artist_r",
    "release_track_artist_s",
    "release_track_artist_t",
    "release_track_artist_u",
    "release_track_artist_v",
    "release_track_artist_w",
    "release_track_artist_x",
    "release_track_artist_y",
    "release_track_artist_z",
    "release_track_artist_default",
  ];
    
  const validTrackTableNames = [
    "release_track_a",
    "release_track_b",
    "release_track_c",
    "release_track_d",
    "release_track_e",
    "release_track_f",
    "release_track_g",
    "release_track_h",
    "release_track_i",
    "release_track_j",
    "release_track_k",
    "release_track_l",
    "release_track_m",
    "release_track_n",
    "release_track_o",
    "release_track_p",
    "release_track_q",
    "release_track_r",
    "release_track_s",
    "release_track_t",
    "release_track_u",
    "release_track_v",
    "release_track_w",
    "release_track_x",
    "release_track_y",
    "release_track_z",
    "release_track_default",
  ];

  const artistTableName = determineTableName('release_track_artist', artist.charAt(0));
  const trackTableName = determineTableName('release_track', song.charAt(0));

  if (!validArtistTableNames.includes(artistTableName)) {
    // Handle the invalid table name case. 
    console.error('Invalid table name derived:', artistTableName);
    return res.status(400).send('Invalid artist name.');
  }

  if (!validTrackTableNames.includes(trackTableName)) {
    // Handle the invalid table name case. 
    console.error('Invalid table name derived:', trackTableName);
    return res.status(400).send('Invalid artist name.');
  }

  try {
    const query = `
        WITH Track AS (
            SELECT rt.track_id
            FROM ${artistTableName} rta
            JOIN ${trackTableName} rt 
            ON rta.release_id = rt.release_id AND rta.track_id = rt.track_id
            WHERE rta.artist_name ILIKE $1 AND LOWER(rt.title) = LOWER($2)
        )
        SELECT rta.artist_name, rta.extra, rta.role
        FROM release_track_artist rta
        WHERE rta.track_id IN (SELECT track_id FROM Track);
    `;
    db.query(query, [`${artist}%`, song], (error, results) => {
      if (error) {
        throw error;
      }
      const uniqueData = results.rows.reduce((acc, row) => {
        if (!acc[row.artist_name]) {
          acc[row.artist_name] = {
            name: row.artist_name,
            artistRole: row.role, 
          };
        }
        return acc;
      }, {});
      let processedData = Object.values(uniqueData);
      if(processedData.length <= 0){
        res.locals.data = 'No credits available';
        return next();
      }
      // console.log(processedData);
      res.locals.data = processedData;
      return next();
    });

  } catch (err) {
    console.log(err);
    return next(err);
  }

}


module.exports = {
  discogsSearch,
}