const Session = require('../models/sessionModel');
const { nanoid } = require("nanoid");

const sessionController = {};

sessionController.isLoggedIn = async (req, res, next) => {
  const sessionToken = req.cookies.ssid;
  try {
    const session = await Session.findOne({ sessionToken }).exec();
    if (session) {
      return next();
    } else {
      return res.status(401).json({ error: 'Invalid session' });
    }
  } catch (err) {
    console.error('Error validating session:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

sessionController.startSession = async (req, res, next) => {
  const hash = nanoid();
  try {
    const cookieId = res.locals.user._id.toString();
    const sessionToken = hash; 
    await Session.create({ sessionToken, cookieId });
    res.locals.sessionToken = sessionToken;
    return next();
  } catch (err) {
    console.error('Error creating session:', err);
    return next(err);
  }
};




module.exports = sessionController;
