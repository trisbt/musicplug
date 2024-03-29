import { query as db } from '../models/pgModel';

import { Request, Response, NextFunction } from 'express';


function normalize(str: string): string {
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

interface DiscogsSearchInterface {
  discogsSearch: (req: DiscogsSearchRequest, res: Response, next: NextFunction) => Promise<void>
}
interface DiscogsSearchRequest extends Request {
  query: {
    artist: string;
    song: string;
  };
}



const discogsSQLController: DiscogsSearchInterface = {
  discogsSearch: async (req: DiscogsSearchRequest, res: Response, next: NextFunction): Promise<void> => {
    let artist: string = req.query.artist.split('/')[0];
    let song: string = normalize(req.query.song);

    function determineTableName(baseName: string, firstCharacter: string) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      if (alphabet.includes(firstCharacter.toLowerCase())) {
        return `${baseName}_${firstCharacter.toLowerCase()}`;
      } else {
        return `${baseName}_default`;
      }
    }

    const validArtistTableNames: string[] = [
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

    const validTrackTableNames: string[] = [
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

    const artistTableName: string = determineTableName('release_track_artist', artist.charAt(0));
    const trackTableName: string = determineTableName('release_track', song.charAt(0));

    if (!validArtistTableNames.includes(artistTableName)) {
      // Handle the invalid table name case. 
      console.error('Invalid table name derived:', artistTableName);
      res.status(400).send('Invalid artist name.');
      return;
    }

    if (!validTrackTableNames.includes(trackTableName)) {
      // Handle the invalid table name case. 
      console.error('Invalid table name derived:', trackTableName);
      res.status(400).send('Invalid artist name.');
      return;
    }
    //handle duplicate discogs names here for now
    if (artist === 'Travis Scott') {
      artist = "Travis Scott (2)";
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

      db(initialQuery, [`${artist}`], (error, results) => {
        if (error) {
          throw error;
        }
        const aliasNames = results.rows.map(row => row.alias_name);
        if (aliasNames.length === 0) {
          aliasNames.push(artist)
        }
        // console.log(aliasNames)
        const secondQuery = `
        WITH MatchedTracks AS (
        SELECT rt.track_id
        FROM ${trackTableName} rt
        JOIN release_track_artist rta ON rt.track_id = rta.track_id
        WHERE rta.artist_name = ANY($1)
        AND LOWER(rt.title) = LOWER($2)
      )
        SELECT rta2.artist_name, rta2.role
        FROM release_track_artist rta2
        JOIN MatchedTracks mt ON rta2.track_id = mt.track_id
        WHERE rta2.extra = 'true';
    `;

        db(secondQuery, [aliasNames, song], (error, trackResults) => {
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
          res.locals.data = uniqueResults;
          res.locals.alias = aliasNames;
          return next();
        });
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
}
export default discogsSQLController;