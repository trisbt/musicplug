const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/accessToken', controller.getAccessToken);

module.exports = router;

