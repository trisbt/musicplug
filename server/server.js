const express = require('express');
const app = express();
const { exec } = require('child_process');
var request = require('request'); // "Request" library

var client_id = 'f0bb764e36ca4e2395b1c38f84c9764c'; // Your client id
var client_secret = 'de53aa33fd804b3e9c570370cb07b0f9'; // Your secret

// your application requests authorization
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};
// Endpoint to execute the cURL command and send the response
app.get('/', (req, res) => {
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            var token = body.access_token;
            var curlCommand = `curl -X GET "https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V" \
                          -H "Authorization: Bearer ${token}"`;

            exec(curlCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing cURL command: ${error}`);
                    res.status(500).send({ error: 'Internal Server Error' });
                    return;
                }
                res.send(stdout);
            });
        } else {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
