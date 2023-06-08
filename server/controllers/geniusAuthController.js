// const fetch = require('node-fetch');

// let clientid = 'XJTopHXtfyPWDTKMyVO4Yi8q2Z6rXSfwuohupT-kz6UnK5r1BTK-dmNLcIYFYXdU'; // Your client id
// let clientsecret = 'ZELzWdoaH_esmE2TQimPbdgVFRStKdnGDssO1weErbXlB_sB2xNaXRSAjAiLIZFf7fXZnQFtyywDU-MMXYmcVQ'; // Your secret
// let clientaccess_token = 'oLJ3HV2evNygH4j--uTKP0dcHb9wJ2kQ-dkI4ho3_ISU4_ifJDydJWtEBGsiUt6B';
// // // const express = require('express');
// // // const router = express.Router();

// // const getGeniusAccessToken = (req, res) => {
// // }
// // module.exports = {
// //     getGeniusAccessToken
// // };
// // const fetch = require('node-fetch');

// const getGeniusAccessToken = () => {
//     // Set up the request URL for token exchange
//     const tokenUrl = 'https://api.genius.com/oauth/token';

//     // Set up the request body data for token exchange
//     const requestBody = {
//         client_id: clientid,
//         client_secret: clientsecret,
//         grant_type: 'client_credentials'
//     };

//     // Make a request to exchange client credentials for an access token
//     return fetch(tokenUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(requestBody)
//     })
//         .then(tokenResponse => {
//             if (!tokenResponse.ok) {
//                 throw new Error('Request to exchange client credentials for access token failed');
//             }
//             return tokenResponse.json();
//         })
//         .then(tokenData => tokenData.access_token)
//         .catch(error => {
//             console.error('Error obtaining access token:', error);
//             throw new Error('Failed to obtain access token');
//         });
// };

// const middleware = (req, res, next) => {
//     // Get the Genius access token
//     getGeniusAccessToken()
//         .then(accessToken => {
//             // Store the access token in the request object for later use
//             req.geniusAccessToken = accessToken;
//             next();
//         })
//         .catch(error => {
//             console.error('Error in middleware:', error);
//             res.status(500).json({ error: 'An error occurred in the middleware' });
//         });
// };

// module.exports = {
//     middleware
// };
