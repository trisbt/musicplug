import User from '../models/userModel';
import Session from '../models/sessionModel';
import {nanoid} from "nanoid";
import { Request, Response, NextFunction } from 'express';

interface SessionControllerInterface{
  isLoggedIn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  startSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
const ONE_HOUR = 60 * 60 * 1000; // 1 hour expiry ms

const sessionController = {
  isLoggedIn: async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies.ssid;
  
    try {
      const session = await Session.findOne({ sessionToken }).exec();
  
      if (session) {
        // Renew the session by updating the createdAt timestamp
        session.createdAt = new Date();
        await session.save();
  
        // Renew the SSID cookie by resetting its expiration
        res.cookie('ssid', sessionToken, { httpOnly: true, maxAge: ONE_HOUR });
  
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
        // If there's no valid session, check for the "Remember Me" cookie
        const rememberMeCookie = req.cookies.plugKeepMeLoggedIn;
  
        if (!rememberMeCookie) {
          return res.status(401).json({ error: 'Invalid session' });
        }
  
        const user = await User.findOne({ keepMeLoggedIn: rememberMeCookie }).exec();
        if (!user) {
          return res.status(401).json({ error: 'Invalid "Remember Me" token' });
        }
  
        // If "Remember Me" is valid, start a new session
        res.locals.user = user;
        await sessionController.startSession(req, res, next);
      }
    } catch (err) {
      console.error('Error validating session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  startSession: async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.user.id;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;
  
    while (attempts < MAX_ATTEMPTS) {
      const hash = nanoid();
      try {
        const cookieId = id.toString();
        const sessionToken = hash;
        await Session.create({ sessionToken, cookieId });
  
        // Set the SSID cookie with 1 hour expiration
        res.cookie('ssid', sessionToken, { httpOnly: true, maxAge: ONE_HOUR });
  
        res.locals.sessionToken = sessionToken;
        return next();
      } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.cookieId) {
          // Detected a duplicate cookieId error
          await clearSessionByCookieId(err.keyValue.cookieId);
          attempts++;
        } else {
          console.error('Error creating session:', err);
          return next(err);
        }
      }
    }
  
    // If reached here, it means we've made 3 attempts and all failed
    console.error('Failed to create session after', MAX_ATTEMPTS, 'attempts due to cookieId conflict.');
    return next(new Error('Failed to create session'));
  },
};

const clearSessionByCookieId = async (cookieId) => {
  try {
    await Session.deleteOne({ cookieId: cookieId }).exec();
  } catch (err) {
    console.error('Failed to clear session', err);
    throw err;
  }
};


export default sessionController;
