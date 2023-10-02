import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

interface SpotifyControllerInterface {
  getAccessToken: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  getSpotifyData: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  getSpotifyAudio: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  getSpotifyTracks: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  getSpotifyTopTracks: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  getSpotifyDataById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}

const spotifyController: SpotifyControllerInterface = {

  getAccessToken: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      };

      const response = await fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: authOptions.body
      });

      const data = await response.json();
      if (data.access_token) {
        res.locals.token = data.access_token;
        next();
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (error) {
      next(error);
    }
  },

  getSpotifyData: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const { token } = res.locals;
      const query = req.query.query;
      const limit = 25;
      const offset = req.query.offset;

      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist%2Ctrack&limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const data = await response.json();
      res.locals.data = data;
      next();
    } catch (error) {
      next(error);
    }
  },

  getSpotifyAudio: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const token = res.locals.token;
      const id = req.query.query;

      const response = await fetch(`https://api.spotify.com/v1/audio-features/?ids=${id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const data = await response.json();
      res.locals.data = data;
      next();
    } catch (error) {
      next(error);
    }
  },

  getSpotifyTracks: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const token = res.locals.token;
      const id = req.query.query;

      const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const data = await response.json();
      res.locals.data = data;
      next();
    } catch (error) {
      next(error);
    }
  },

  getSpotifyTopTracks: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const token = res.locals.token;

      const response = await fetch(`https://api.spotify.com/v1/playlists/37i9dQZEVXbNG2KDcFcKOF?si=ce928cdd687a4612/tracks`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const data = await response.json();
      const trackData = data.tracks.items.slice(0, 10).map(item => item.track);
      const trackID = data.tracks.items.slice(0, 10).map(item => item.track.id);

      const audioResponse = await fetch(`https://api.spotify.com/v1/audio-features/?ids=${trackID}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const audioData = await audioResponse.json();
      
      const combinedResults = trackData.map((track, index) => {
        return {
          ...track,
          ...audioData.audio_features[index]
        }
      });

      res.locals.data = combinedResults;
      return next();
    } catch (error) {
      next(error);
    }
  },


  getSpotifyDataById: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const { token } = res.locals;
      const { id } = req.query;
      const idResponse = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const trackData = await idResponse.json();
      const advancedResponse = await fetch(`https://api.spotify.com/v1/audio-features/?ids=${id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const audioData = await advancedResponse.json();
      res.locals.data = { trackData: trackData, audioData: audioData.audio_features[0] };
      return next();
    } catch (error) {
      next(error);
    }
  },
};

export default spotifyController;


