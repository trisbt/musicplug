const express = require('express');
const app = express();
const route = require('./route');
const path = require('path');
const cors = require('cors');

app.use(cors());


app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', route);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
