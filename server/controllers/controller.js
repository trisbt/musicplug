const fetch = require('node-fetch');

let client_id 
let client_secret

const getAccessToken = (req, res) => {
    console.log('oauth')
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
                res.status(200).json({ token });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

module.exports = {
    getAccessToken
};
