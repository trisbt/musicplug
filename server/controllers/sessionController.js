const Session = require('../models/sessionModel');
const { nanoid } = require("nanoid");



const sessionController = {};

/**
* isLoggedIn - find the appropriate session for this request in the database, then
* verify whether or not the session is still valid.
*/
sessionController.isLoggedIn = async (req, res, next) => {
  // Extract the session token from the request cookies
  const sessionToken = req.cookies.ssid;
  try {
    // Find a session with the provided session token
    const session = await Session.findOne({ sessionToken }).exec();

    // Check if session exists and is still valid
    if (session) {
      // Session is valid, proceed with the next middleware
      return next();
    } else {
      // Session is invalid, return an error response
      return res.status(401).json({ error: 'Invalid session' });
    }
  } catch (err) {
    console.error('Error validating session:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


/**
* startSession - create and save a new Session into the database.
*/
sessionController.startSession = async (req, res, next) => {
  const hash = nanoid();
  try {
    const cookieId = res.locals.user._id.toString();
    const sessionToken = hash; 
    await Session.create({ sessionToken, cookieId });
    res.locals.sessionToken = sessionToken;
    // res.locals.user = null;
    return next();
  } catch (err) {
    console.error('Error creating session:', err);
    return next(err);
  }
};




module.exports = sessionController;
