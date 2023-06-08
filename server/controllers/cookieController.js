const cookieController = {};
// const User = require('../models/userModel');

// /**
// * setCookie - set a cookie with a random number
// */
cookieController.setCookie = async (req, res, next) => {
    // write code here
    res.cookie('plug', 'yoooo');
    res.cookie('secret', `${Math.floor(Math.random() * 99).toString()}`);
    return next();
}

// /**
// * setSSIDCookie - store the user id in a cookie
// */
cookieController.setSSIDCookie = (req, res, next) => {
    try {
        res.cookie('ssid', res.locals.user, { httpOnly: true });
        return next();
    } catch (err) {
        console.error('Error setting cookie:', err);
        return next(err);
    }
};


module.exports = cookieController;
