const db = require('../models/pgModel.js');

// function getStringBeforeParenthesis(str) {
//   const indexOfParenthesis = str.indexOf('(');
//   if (indexOfParenthesis !== -1) {
//     return str.substring(0, indexOfParenthesis).trim(); // trim to remove any spaces before '('
//   }
//   return str;
// }

function normalize(str) {
  // Check for and remove everything after '('
  const indexOfParenthesis = str.indexOf('(');
  if (indexOfParenthesis !== -1) {
    str = str.substring(0, indexOfParenthesis).trim(); // trim to remove any spaces before '('
  }

  // Check for and remove everything after 'feat.'
  const indexOfFeat = str.toLowerCase().indexOf('feat.');
  if (indexOfFeat !== -1) {
    str = str.substring(0, indexOfFeat).trim(); // trim to remove any spaces before 'feat.'
  }

  return str;
}

const discogsSearch = async (req, res, next) => {
  const artist = req.query.artist.split('/')[0];
  let song = normalize(req.query.song);
  // song = getStringBeforeParenthesis(song)
  function determineTableName(baseName, firstCharacter) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    if (alphabet.includes(firstCharacter.toLowerCase())) {
      return `${baseName}_${firstCharacter.toLowerCase()}`;
    } else {
      return `${baseName}_default`;
    }
  }
  console.log(song)
  console.log(artist)
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
    const initialQuery = `
      WITH AliasArtists AS (
        SELECT DISTINCT artist_id
        FROM artist_alias
        WHERE alias_name = $1
    )
    SELECT MIN(aa.artist_id) AS artist_id, aa.alias_name
    FROM artist_alias aa
    JOIN AliasArtists a ON aa.artist_id = a.artist_id
    GROUP BY aa.alias_name;
      `;

    db.query(initialQuery, [`${artist}`], (error, results) => {
      if (error) {
        throw error;
      }
      const aliasNames = results.rows.map(row => row.alias_name);
      const secondQuery = `
        WITH MatchedTracks AS (
      SELECT rt.track_id
      FROM ${trackTableName} rt
      JOIN release_track_artist rta ON rt.track_id = rta.track_id
      WHERE rta.artist_name = ANY($1)
      AND rt.title = $2
    )
      SELECT rta2.artist_name, rta2.role
      FROM release_track_artist rta2
      JOIN MatchedTracks mt ON rta2.track_id = mt.track_id
      WHERE rta2.extra = 'true';
  `;

      db.query(secondQuery, [aliasNames, song], (error, trackResults) => {
        if (error) {
          throw error;
        }
        const uniqueNames = new Set();
        const uniqueResults = trackResults.rows.filter((entry) => {
          if (!uniqueNames.has(entry.artist_name)) {
            uniqueNames.add(entry.artist_name);
            return true;
          }
          return false;
        });
        if (uniqueResults.length <= 0) {
              res.locals.data = 'No credits available';
              return next();
            }
        console.log(uniqueResults);
        res.locals.data = uniqueResults;
        res.locals.alias = aliasNames;
        return next();
      });
    });


    //   const query = `
    //   WITH MatchedTracks AS (
    //     SELECT rt.track_id
    //     FROM ${trackTableName} rt 
    //     JOIN ${artistTableName} rta
    //     ON rt.release_id = rta.release_id 
    //     WHERE REPLACE(rta.artist_name, '.', '') ILIKE REPLACE($1, '.', '') 
    //     AND REPLACE(LOWER(rt.title), '.', '') = REPLACE(LOWER($2), '.', '')
    // )
    // SELECT rta2.artist_name, rta2.role
    // FROM release_track_artist rta2
    // JOIN MatchedTracks mt ON rta2.track_id = mt.track_id
    // WHERE rta2.extra = 'true';

    //   `;

    // db.query(query, [`${artist}%`, song], (error, results) => {
    //   if (error) {
    //     throw error;
    //   }
    //   console.log(results)
    //   const uniqueData = results.rows.reduce((acc, row) => {
    //     if (!acc[row.artist_name]) {
    //       acc[row.artist_name] = {
    //         name: row.artist_name,
    //         artistRole: row.role,
    //       };
    //     }
    //     return acc;
    //   }, {});
    //   let processedData = Object.values(uniqueData);
    //   if (processedData.length <= 0) {
    //     res.locals.data = 'No credits available';
    //     return next();
    //   }
    //   // console.log(processedData);
    //   res.locals.data = processedData;
    //   return next();
    // });

  } catch (err) {
    console.log(err);
    return next(err);
  }

}


module.exports = {
  discogsSearch,
}