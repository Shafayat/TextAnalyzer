import { Router } from 'express';
import path from 'path';

const router = Router();


/**
 * GET /dashboard
 * Serves the dashboard page if the user is authenticated.
 * Redirects to the home page if the user is not authenticated.
 */
router.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});


/**
 * GET /api/me
 * Returns the current authenticated user's information.
 * Responds with 401 if the user is not authenticated.
 */
router.get('/api/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    res.json({ username: (req.user as any).username });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});
export default router; 