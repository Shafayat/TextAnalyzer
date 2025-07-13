import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from './services/passport.service';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import textRoutes from './routes/text.routes';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET environment variable is required');
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(authRoutes);
app.use(userRoutes);
app.use('/api', textRoutes);

app.use((err: any, req: any, res: any, next: any  ) => {
  console.error('Express error:', err); // Add this line
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'test' ? err.stack : undefined, // Show stack in test
  });
});

export default app; 

