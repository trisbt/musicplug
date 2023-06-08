const Session = require('../models/sessionModel');

const sessionController = {};

/**
* isLoggedIn - find the appropriate session for this request in the database, then
* verify whether or not the session is still valid.
*/
sessionController.isLoggedIn = (req, res, next) => {
  // write code here
  return next();
};

/**
* startSession - create and save a new Session into the database.
*/
sessionController.startSession = (req, res, next) => {
  //write code here
  Session.create(res.locals.user, (err, session) => {
    return next();
  })
};

module.exports = sessionController;
