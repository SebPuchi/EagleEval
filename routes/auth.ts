// Import necessary modules
import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/googleConfig';
import session from 'express-session';
import UserModel from 'models/user';

// Create an Express router
const router = express.Router();

// Configure session middleware
router.use(
  session({
    secret: config.OAuthCreds.session, // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Configure Passport for Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: config.OAuthCreds.id,
      clientSecret: config.OAuthCreds.secret,
      callbackURL: 'http://localhost:80/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ googleId: profile.id });

      // If user doesn't exist creates a new user. (similar to sign up)
      if (!user) {
        const newUser = await UserModel.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
        });
        if (newUser) {
          done(null, newUser);
        }
      } else {
        done(null, user);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

// Initialize Passport and restore authentication state, if any, from the session
router.use(passport.initialize());
router.use(passport.session());

// Define login route
router.get('/login', (req, res) => {
  res.send('Login Page');
});

// Define Google authentication route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Define Google authentication callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// Define a protected route
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.send('User Profile Page');
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});

// Middleware to ensure authentication
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

export { router as auth_router };
