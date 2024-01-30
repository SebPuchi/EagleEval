// Import necessary modules
import express, { Request, Response, NextFunction } from 'express';

// Middleware to ensure authentication
export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
}
