import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();


/**
 * Passport.js LocalStrategy:
 * Authenticates users using a username and password.
 * 
 * - Looks up the user by username in the database.
 * - Compares the provided password with the stored hashed password.
 * - If authentication succeeds, calls done with the user object.
 * - If authentication fails, calls done with false and an error message.
 */
passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user: IUser | null = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);


/**
 * Passport.js GoogleStrategy:
 * Enables users to authenticate using their Google account.
 * 
 * - Uses OAuth 2.0 credentials and endpoints from environment variables.
 * - On successful authentication, looks up the user by Google profile ID in the MongoDB database.
 * - If the user does not exist, creates a new user with the Google profile ID as the username.
 * - Returns the user object to Passport for session management.
 * 
 * In this application's context, this strategy allows seamless login/signup with Google,
 * automatically provisioning accounts for new users and supporting federated identity.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      authorizationURL: process.env.GOOGLE_AUTH_URL,
      tokenURL: process.env.GOOGLE_TOKEN_URL,
      userProfileURL: process.env.GOOGLE_USERINFO_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({ username: profile.id });
        if (!user) {
          user = await User.create({ username: profile.id, password: '' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


/**
 * Returns the Passport instance configured with local and Google OAuth strategies,
 * as well as session serialization and deserialization logic.
 * 
 * In this application's context, exporting the configured Passport instance allows
 * it to be imported and used in route files (such as `auth.routes.ts`) to provide
 * authentication middleware for login, signup, and OAuth flows. This ensures that
 * all authentication logic is centralized and consistent across the app.
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});


/**
 * Deserializes the user from the session by retrieving the user document from MongoDB using the stored user ID.
 * This enables persistent login sessions by attaching the full user object to each request, allowing route handlers
 * to access authenticated user details throughout the app.
 */
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});



export default passport; 