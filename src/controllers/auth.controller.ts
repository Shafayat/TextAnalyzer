import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import passport from 'passport';

/**
 * Handles user signup.
 * 
 * Expects 'username' and 'password' in the request body.
 * - Returns 400 if either is missing.
 * - Returns 409 if the username already exists.
 * - Hashes the password and creates a new user.
 * - Responds with 201 and the new user's username (without password) on success.
 */

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    return res.status(201).json({ username: user.username });
  } catch (err) {
    next(err);
  }
};


/**
 * Handles user sign-in.
 * 
 * Uses Passport's 'local' strategy to authenticate the user.
 * - Expects 'username' and 'password' in the request body.
 * - Returns 401 if authentication fails.
 * - For API calls: returns JSON with username
 * - For form submissions: redirects to dashboard
 */

export const signin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Unauthorized' });
    req.logIn(user, (err: any) => {
      if (err) return next(err);
      console.log('login done');
      
      // Check if this is an API call or form submission
      const isApiCall = req.headers.accept === 'application/json' || req.headers['content-type'] === 'application/json';
      
      if (isApiCall) {
        return res.status(200).json({ username: user.username });
      } else {
        return res.redirect('/dashboard');
      }
    });
  })(req, res, next);
}; 