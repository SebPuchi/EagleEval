// Import necessary modules
import express, { Request, Response } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from '../middleware/authentication';
import { searchById, searchForId } from '../utils/mongoUtils';
import UserModel from '../models/user';
import CommentModel from '../models/comment';

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
    res.redirect('/');
  }
);

// Get users profile data
router.get(
  '/profile',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const id = (req.query['id'] as any) || null;

    if (id) {
      if ((req.user as any)._id != id) {
        return res.status(401).json({ message: 'Not Authorized' });
      }

      const user_data = await searchById(UserModel, id);

      return res.json(user_data);
    } else {
      return res.send('Query string must include id');
    }
  }
);

// Logout route
router.get('/logout', (req: Request, res: Response, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});

// Get users comments
router.get(
  '/comments',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const id = (req.query['id'] as any) || null;

    if (id) {
      if ((req.user as any)._id != id) {
        return res.status(401).json({ message: 'Not Authorized' });
      }

      const user_data = await searchForId(id, CommentModel, 'user_id');

      return res.json(user_data);
    } else {
      return res.send('Query string must include id');
    }
  }
);

export { router as auth_router };
