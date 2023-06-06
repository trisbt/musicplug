const fetch = require('node-fetch');

let client_id = 'f0bb764e36ca4e2395b1c38f84c9764c'; // Your client id
let client_secret = 'de53aa33fd804b3e9c570370cb07b0f9'; // Your secret

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
