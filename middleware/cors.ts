import { Request, Response, NextFunction } from 'express';

// function to handle cors
export const handleCors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.header('Access-Control-Allow-Origin', [
    'https://www.eagleeval.com',
    'https://eagleeval.com',
    'https://bc.edu',

  ]);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};
