const express = require('express');
const router = express.Router();
const controller = require('./controllers/controller');

router.get('/accessToken', controller.getAccessToken);

module.exports = router;

