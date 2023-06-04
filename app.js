// /**
//  * This is an example of a basic node.js script that performs
//  * the Client Credentials oAuth2 flow to authenticate against
//  * the Spotify Accounts.
//  *
//  * For more information, read
//  * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
//  */

// var request = require('request'); // "Request" library

// var client_id = 'f0bb764e36ca4e2395b1c38f84c9764c'; // Your client id
// var client_secret = 'de53aa33fd804b3e9c570370cb07b0f9'; // Your secret

// // your application requests authorization
// var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//         'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
//     },
//     form: {
//         grant_type: 'client_credentials'
//     },
//     json: true
// };

// // request.post(authOptions, function (error, response, body) {
// //   if (!error && response.statusCode === 200) {

// //     // use the access token to access the Spotify Web API
// //     var token = body.access_token;
// //     var options = {
// //       url: 'https://api.spotify.com/v1/users/studiolife',
// //       headers: {
// //         'Authorization': 'Bearer ' + token
// //       },
// //       json: true
// //     };
// //    // request.get(options, function (error, response, body) {
// //     //   console.log(body);
// //     // });

// //   }
// // });

// request.post(authOptions, function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//         // use the access token to access the Spotify Web API
//         var token = body.access_token;
//         var options = {
//             url: 'https://api.spotify.com/v1/users/studiolife',
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             },
//             json: true
//         };

//         // Execute cURL command separately to make the GET request
//         let curlCommand = `curl -X GET "https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V" \
//                       -H "Authorization: Bearer ${token}"`;

//         // Execute the cURL command using child_process.exec
//         const { exec } = require('child_process');
//         exec(curlCommand, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error executing cURL command: ${error}`);
//                 return;
//             }
//             console.log(stdout);
//         });
//     }
// });

