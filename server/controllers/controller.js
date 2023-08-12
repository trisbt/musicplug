const fetch = require('node-fetch');
require('dotenv').config();

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

const getAccessToken = (req, res, next) => {
    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };

    fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: authOptions.body
    })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                const token = data.access_token;
                res.locals.token = token;
                return next();
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

const getSpotifyData = (req, res, next) => {
    const { token } = res.locals;
    const query = req.query.query;
    const limit = 50;
    const offset = req.query.offset;

    fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist%2Ctrack&limit=${limit}&offset=${offset}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .then(data => {
            res.locals.data = data;
            return next();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const getSpotifyAudio = (req, res, next) => {
    const token = res.locals.token;
    const id = req.query.query;
    fetch(`https://api.spotify.com/v1/audio-features/?ids=${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .then(data => {
            res.locals.data = data;
            return next();
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

const getSpotifyTracks = (req, res, next) => {
    const token = res.locals.token;
    const id = req.query.query;
    fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .then(data => {
            res.locals.data = data;
            return next();
        })
        .catch(error => {
            console.error('Error:', error);
        });

}


module.exports = {
    getAccessToken,
    getSpotifyData,
    getSpotifyAudio,
    getSpotifyTracks,
};
