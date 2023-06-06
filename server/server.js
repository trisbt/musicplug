const express = require('express');
const app = express();
const route = require('./route');
const path = require('path');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');
app.use(cors());

// const mongoURI =
// mongoose.connect(mongoURI);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', route);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

//need to setup login
// app.post('/login', userController.verifyUser, cookieController.setSSIDCookie, (req, res) => {
//     // what should happen here on successful log in?
//     res.send('Login Successful!');
// });


const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
