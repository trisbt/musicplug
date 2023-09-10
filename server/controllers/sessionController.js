const Session = require('../models/sessionModel');
const User = require('../models/userModel');
const { nanoid } = require("nanoid");

const sessionController = {};

sessionController.isLoggedIn = async (req, res, next) => {
  const sessionToken = req.cookies.ssid;
  try {
    const session = await Session.findOne({ sessionToken }).exec();
    
    if (session) {
      const user = await User.findById(session.cookieId).exec();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.locals.verifiedUser = {
        username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
      };  
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
  // console.log(res.locals.user.id)
  const id = res.locals.user.id
  const hash = nanoid();
  try {
    const cookieId = id.toString();
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
