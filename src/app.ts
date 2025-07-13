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

mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/textanalyzer');

export default app; 

