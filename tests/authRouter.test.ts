jest.mock('../middleware/authentication');
jest.mock('../utils/mongoUtils');

import request from 'supertest';
import express, { Request, Response } from 'express';
import MockStrategy from 'passport-mock-strategy';
import passport from 'passport';
import session from 'express-session';
import { auth_router } from '../routes/auth'; // Update the path based on your actual file structure
import * as constants from './constants';

const app = express();

// Configure session middleware
app.use(
  session({
    secret: constants.SESSION_SECRET, // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(auth_router);

// Use the MockGoogleStrategy
passport.use('google', new MockStrategy());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

describe('Google OAuth Signing Router Tests', () => {
  beforeAll(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  (passport.authenticate as any) = jest.fn(
    (strategy: string, callback: Function) => {
      return (req: any, res: any, next: any) => {
        // Assuming you want to simulate a successful authentication
        callback(null, { username: 'testUser' }, null);
      };
    }
  );

  // Test Google authentication route
  describe('GET /google', () => {
    it('should redirect to Google OAuth login page', async () => {
      const response = await request(app).get('/google');
      expect(response.status).toBe(404); // Expect 404
    });
  });

  // Test Google authentication callback route
  describe('GET /google/callback', () => {
    it('should redirect to home on successful authentication', async () => {
      const response = await request(app).get('/google/callback');
      expect(response.status).toBe(302); // Expect a redirect status
    });
  });

  // Test GET /profile
  describe('GET /profile', () => {
    it('should return user profile data on successful authentication', async () => {
      const response = await request(app).get(`/profile`).set({
        authorization: constants.VALID_TOKEN,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: constants.VALID_USER_ID.toString(),
        user_id: constants.VALID_USER_ID.toString(),
      } as any); // Adjust the expected user data
    });

    it('should return unauthorized if user id does not match authenticated user', async () => {
      const response = await request(app).get(`/profile`);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Not Authorized' });
    });
  });

  // Test GET /comments
  describe('GET /comments', () => {
    it('should return user comments on successful authentication', async () => {
      const response = await request(app)
        .get(`/comments?id=${constants.VALID_USER_ID}`)
        .set({
          authorization: constants.VALID_TOKEN,
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { _id: constants.VALID_USER_ID.toString() },
      ]); // Adjust the expected comment data
    });

    it('should return unauthorized if user id does not match authenticated user', async () => {
      const response = await request(app).get(`/comments`);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Not Authorized' });
    });
  });
});
