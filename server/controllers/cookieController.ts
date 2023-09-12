import {nanoid} from "nanoid";
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';

interface CookieControllerInterface {
  setRememberMeCookie: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkRememberMeCookie: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  setSSIDCookie: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

//expiry's
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const cookieController = {
  setRememberMeCookie: async (req: Request, res: Response, next: NextFunction) => {
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
  },

  checkRememberMeCookie: async (req: Request, res: Response, next: NextFunction) => {
    const rememberMeCookie = req.cookies.plugKeepMeLoggedIn;

    if (rememberMeCookie) {
      const userFound = await User.findOne({ keepMeLoggedIn: `${rememberMeCookie}` });
      res.locals.userFound = userFound.username;
      res.locals.valid = true;
      return next();
    } else {
      res.locals.valid = false;
      return next();
    }
  },

  setSSIDCookie: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = res.locals.sessionToken;
      await res.cookie('ssid', token, { httpOnly: true });
      return next();
    } catch (err) {
      console.error('Error setting cookie:', err);
      return next(err);
    }
  },
};

export default cookieController;
