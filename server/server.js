const express = require('express');
const app = express();
const route = require('./routes/auth route');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
// const sessionController = require('./controllers/sessionController');

app.use(cors());
const mongoURI = 'mongodb+srv://tristanbott30:Windmark34@plug.aiaeziw.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI);

app.use(express.json());

//sign up working -- need to set windowref in signup component
app.post('/signup', userController.createUser, (req, res) => {
    // console.log('Request body:', JSON.stringify(req.body));
    res.redirect('http://localhost:3000');
});

app.post('/login', userController.verifyUser, (req, res) => {
    console.log('test')
    res.send('Login Successful');
})

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', route);

//route handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
