const express = require('express');
const app = express();
const route = require('./routes/auth route');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');

app.use(cors());
const mongoURI = 'mongodb+srv://tristanbott30:Windmark34@plug.aiaeziw.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI);

app.use(express.json());

app.post('http://localhost:4000/signup', userController.createUser, (req, res) => {
    console.log('test')
    res.status(200).redirect('/');
});

app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', route);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
