const express = require('express');
const app = express();
const route = require('./routes/auth route');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
// const geniusRoute = require('./routes/geniusRoute');
// const sessionController = require('./controllers/sessionController');
const cookieParser = require('cookie-parser');

app.use(cors());
const mongoURI = 'mongodb+srv://tristanbott30:Windmark34@plug.aiaeziw.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI);

app.use(express.json());
app.use(cookieParser());

//set cookie
app.get('/', cookieController.setCookie, (req, res) => {
    return res.status(200).send('yooo')
})

//sign up working -- had to set windowref in signup component
app.post('/signup', userController.createUser, (req, res) => {
    // console.log('Request body:', JSON.stringify(req.body));
    res.redirect('http://localhost:3000');
});
//verify user exists
app.post('/login', userController.verifyUser, cookieController.setSSIDCookie, (req, res) => {
    // console.log('test')
    res.send('Login Successful');
})

//add favs to user
app.post('/favs', userController.addFavorites, (req, res) => {
    console.log('fav added');
    res.json(req.body);
})

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', route);
app.use('/oauth', route);
// app.use('/api', geniusRoute); // Mount the geniusRoute

//route handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
