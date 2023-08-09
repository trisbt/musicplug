const express = require('express');
const cors = require('cors');
const app = express();
// const route = require('./routes/auth route');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const discogsController = require('./controllers/discogsController');
const cookieController = require('./controllers/cookieController');
const controller = require('./controllers/controller')
const sessionController = require('./controllers/sessionController');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:3000",
    credentials: true,
  }))

const mongoURI = process.env.mongoURI;
mongoose.connect(mongoURI);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));


//spotify searches
app.get('/search', controller.getAccessToken, controller.getSpotifyData, (req, res) => {
    return res.status(200).json(res.locals.data);
});
app.get('/advancedSearch', controller.getAccessToken, controller.getSpotifyAudio, (req, res) => {
    return res.status(200).json(res.locals.data);
});
app.get('/getTracks', controller.getAccessToken, controller.getSpotifyTracks, (req, res) => {
    return res.status(200).json(res.locals.data);
});

//discogs searches
app.get('/getCredits', discogsController.discogsSearch, (req, res) => {
    return res.status(200).json(res.locals.data);
});

//sign up 
app.post('/signup', userController.createUser, (req, res) => {
    res.redirect('/');
});

//verify user 
app.post('/login', userController.verifyUser, sessionController.startSession, cookieController.setSSIDCookie, (req, res, next) => {
    res.status(200).json({message: "logged in", user: res.locals.user});
});
app.post('/logout', userController.logoutUser, (req, res) => {
    res.status(200).json({message: 'logged out'});
})
app.get('/validate', sessionController.isLoggedIn, (req, res) => {
    res.status(200).json({message: "user validated"});
})

//get favs 
app.post('/favs', userController.getFavorites, (req, res) => {
    res.json(res.locals.userFavs);
});

//add favs to user
app.post('/addFavs', userController.addFavorites, (req, res) => {
    console.log('fav added');
    res.json(req.body);
});


app.use((err, req, res, next) => {
    //Define a default error object
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occured' },
    };
    // define an errorObj to combine new errors
    const errObj = Object.assign(defaultErr, err);
    console.log('Error: ', errObj.log);
    // return to the client the status and error message
    return res.status(errObj.status || 500).send(errObj.message);
  });

//route handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
