// Import necessary modules
import express, { Request, Response } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from 'middleware/authentication';

// Create an Express router
const router = express.Router();

// Define Google authentication route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Define Google authentication callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect home.
    res.redirect('/auth/profile');
  }
);

// Define a protected route
router.get('/profile', ensureAuthenticated, (req: Request, res: Response) => {
  res.send('User Profile Page');
});

// Logout route
router.get('/logout', (req: Request, res: Response, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});

export { router as auth_router };
