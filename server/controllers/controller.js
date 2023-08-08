const fetch = require('node-fetch');
require('dotenv').config();

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

const getAccessToken = (req, res) => {
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
                // console.log('token', token)
                res.locals.token = token;
                return res.next()
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

const getSpotifyData = (req, res, next) => {
    console.log(res.locals.token);
}

module.exports = {
    getAccessToken,
    getSpotifyData,
};
