import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller';
import passport from '../services/passport.service';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);

/**
 * GET /auth/google
 * Initiates Google OAuth authentication using Passport.js.
 * Redirects the user to Google's login/consent screen to begin the OAuth flow.
 * Used to allow users to sign in or sign up with their Google account.
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));


/**
 * GET /auth/google/callback
 * Handles the callback from Google OAuth after user authentication.
 * If authentication fails, redirects to the login page.
 * On success, establishes a session and redirects the user to the dashboard.
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

/**
 * GET /api/me
 * Returns the current authenticated user's username if logged in, or 401 if not authenticated.
 * Used by the frontend to determine login status and display the appropriate UI.
 */
router.get('/api/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    res.json({ username: (req.user as any).username });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

/**
 * POST /logout
 * Logs out the current user by destroying the session and clearing the session cookie.
 * Used by the frontend logout button to end the user's session and return to the login/signup UI.
 */
router.post('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

export default router; 