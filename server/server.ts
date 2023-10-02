import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import discogsSQLController from './controllers/discogsSQLController';
import spotifyController from './controllers/spotifyController';

const app = express();
const apiRouter = express.Router();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..')));



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
apiRouter.get('/getById', spotifyController.getAccessToken,spotifyController.getSpotifyDataById, (req, res) => {
    return res.status(200).json(res.locals.data);
})


//discogs searches thru db
apiRouter.get('/getCredits', discogsSQLController.discogsSearch, (req, res) => {
    return res.status(200).json({data:res.locals.data, alias:res.locals.alias});
});



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
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'index.html'));

});




const port: number = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
