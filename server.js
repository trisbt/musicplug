const express = require('express');
const app = express();
// const { exec } = require('child_process');
const path = require('path');
// var request = require('request'); // "Request" library
const fetch = require('node-fetch');

let client_id = 'f0bb764e36ca4e2395b1c38f84c9764c'; // Your client id
let client_secret = 'de53aa33fd804b3e9c570370cb07b0f9'; // Your secret

// your application requests authorization
app.get('http://localhost:4000/', (req, res) => {
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
                const apiUrl = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V';
                const headers = {
                    'Authorization': 'Bearer ' + token
                };

                fetch(apiUrl, { headers })
                    .then(response => response.json())
                    .then(data => {
                        res.send(data);
                    })
                    .catch(error => {
                        console.error('Error executing fetch:', error);
                        res.status(500).send({ error: 'Internal Server Error' });
                    });
            } else {
                res.status(500).send({ error: 'Internal Server Error' });
            }
        })
        .catch(error => {
            console.error('Error executing fetch:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        });
});


// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve the 'index.html' file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(4000, () => {
    console.log('Server listening on port 4000');
});
