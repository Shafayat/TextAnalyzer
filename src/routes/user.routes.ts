import { Router } from 'express';
import path from 'path';

const router = Router();

// Dashboard route (protected)
router.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Get current user info
router.get('/api/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    res.json({ username: (req.user as any).username });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router; 