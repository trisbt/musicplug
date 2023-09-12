import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import userController from './controllers/userController';
import discogsSQLController from './controllers/discogsSQLController';
import cookieController from './controllers/cookieController';
import spotifyController from './controllers/spotifyController';
import sessionController from './controllers/sessionController';

const app = express();
const apiRouter = express.Router();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection
const mongoURI: string = process.env.mongoURI!;
mongoose.connect(mongoURI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));


//spotify searches
apiRouter.get('/search', spotifyController.getAccessToken, spotifyController.getSpotifyData, (req, res) => {
    return res.status(200).json(res.locals.data);
});
apiRouter.get('/advancedSearch', spotifyController.getAccessToken, spotifyController.getSpotifyAudio, (req, res) => {
    return res.status(200).json(res.locals.data);
});
apiRouter.get('/getTracks', spotifyController.getAccessToken, spotifyController.getSpotifyTracks, (req, res) => {
    return res.status(200).json(res.locals.data);
});
apiRouter.get('/toptracks', spotifyController.getAccessToken,spotifyController.getSpotifyTopTracks, (req, res) => {
    return res.status(200).json(res.locals.data);
})


//discogs searches thru db
apiRouter.get('/getCredits', discogsSQLController.discogsSearch, (req, res) => {
    return res.status(200).json({data:res.locals.data, alias:res.locals.alias});
});

//sign up 
apiRouter.post('/signup', userController.createUser, (req, res) => {
    return res.redirect('/');
});

//verify user 
apiRouter.post('/login', userController.verifyUser, sessionController.startSession, cookieController.setSSIDCookie, cookieController.setRememberMeCookie, (req, res, next) => {
    return res.status(200).json({
        message: "logged in", 
    });
});
//validated session
apiRouter.get('/validate', sessionController.isLoggedIn, (req, res) => {
    return res.status(200).json({
        message: "user validated",
        userInfo: res.locals.verifiedUser,
    });
})
//logout
apiRouter.post('/logout', userController.logoutUser, (req, res) => {
    return res.status(200).json({message: 'logged out'});
})

//remember me
apiRouter.get('/crm', cookieController.checkRememberMeCookie, (req, res) => {
    return res.status(200).json({valid: res.locals.valid, username: res.locals.userFound});
});

//change password user
apiRouter.post('/acct', userController.changePassword, (req, res) => {
    return res.status(200).json(res.locals.message);
})

apiRouter.post('/deleteacct', userController.deleteAccount, (req, res) => {
    return res.status(200).json(res.locals.message);
})


//get favs 
apiRouter.post('/favs', userController.getFavorites, (req, res) => {
    return res.status(200).json(res.locals.userFavs);
});

//add favs to user
apiRouter.post('/addFavs', userController.addFavorites, (req, res) => {
    return res.status(200).json(res.locals.userFavs);
});

//delete favs from table
apiRouter.post('/removefavs', userController.deleteFavorites, (req, res) => {
    return res.status(200).json({ message: "Favorites deleted successfully." });
})

app.use('/api', apiRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port: number = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
