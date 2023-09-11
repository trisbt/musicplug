const { nanoid } = require("nanoid");
const User = require('../models/userModel');
const cookieController = {};

//add to user schema
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

cookieController.setRememberMeCookie = async (req, res, next) => {
    if (!res.locals.user.rememberMe) {
        return next();
    }

    try {
        const keepMeLoggedIn = nanoid();
        await res.cookie('plugKeepMeLoggedIn', keepMeLoggedIn, { httpOnly: true, maxAge: ONE_WEEK });

        const filter = { username: res.locals.user.username };
        const update = { keepMeLoggedIn }
        await User.findOneAndUpdate(filter, update, { new: true });

        return next();
    } catch (err) {
        console.error('Error setting remember me cookie:', err);
        return next(err);
    }
};


cookieController.checkRememberMeCookie = async (req, res, next) => {
    const rememberMeCookie = req.cookies.plugKeepMeLoggedIn;

    if (rememberMeCookie) {
        const userFound = await User.findOne({keepMeLoggedIn: `${rememberMeCookie}`});
        res.locals.userFound = userFound.username;
        res.locals.valid = true;
        return next();
    } else {
        res.locals.valid = false;
        return next();
    }
}

const ONE_HOUR = 60 * 60 * 1000;

cookieController.setSSIDCookie = async (req, res, next) => {
    try {
        const token = res.locals.sessionToken;
        await res.cookie('ssid', token, { httpOnly: true });
        return next();
    } catch (err) {
        console.error('Error setting cookie:', err);
        return next(err);
    }
};



module.exports = cookieController;
