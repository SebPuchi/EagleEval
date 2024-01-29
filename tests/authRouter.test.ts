import request from 'supertest';
import express from 'express';
import { auth_router } from '../routes/auth';

const app = express();
app.use('/auth', auth_router);

describe('Authentication Router', () => {
  // Mock passport.authenticate to avoid real authentication during tests
  jest.mock('passport', () => ({
    authenticate: jest.fn(),
  }));

  it('should redirect to Google authentication page', async () => {
    const response = await request(app).get('/auth/google');
    expect(response.status).toBe(302); // 302 is the status code for redirection
    expect(response.header['location']).toContain('google.com'); // Adjust this based on the actual Google authentication URL
  });

  it('should handle Google authentication callback successfully', async () => {
    const response = await request(app).get('/auth/google/callback');
    expect(response.status).toBe(302); // 302 is the status code for redirection
    expect(response.header['location']).toContain('google.com');
  });

  it('should protect the profile route and redirect to login if not authenticated', async () => {
    const response = await request(app).get('/auth/profile');
    expect(response.status).toBe(302); // 302 is the status code for redirection
    expect(response.header['location']).toBe('/api/auth/google'); // Adjust this based on your redirect logic
  });

  it('should logout and redirect to the home page', async () => {
    const response = await request(app).get('/auth/logout');
    expect(response.status).toBe(302); // 302 is the status code for redirection
    expect(response.header['location']).toBe('/');
  });
});
