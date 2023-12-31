// fetch.js - Fetch routes module
import express, { Request, Response } from 'express';

import { getReviews } from '../controllers/fetchReviews';
import { getDrillDown } from '../controllers/fetchDrillDown';
import cacheReviews from '../controllers/cacheReviews';
import cacheDrilldown from '../controllers/cacheDrilldown';
import { IReview } from '../models/review';

export const fetch_router = express.Router();

fetch_router.get('/reviews', async (req: Request, res: Response) => {
  // Access query parameters using req.query
  const query = (req.query['search'] as string) || null;

  if (query) {
    console.log('Searching for ', query);

    let fetch_response: IReview[] | null = await getReviews(query);

    if (fetch_response) {
      console.log('Successfully fetched reviews for ', query);

      return res.json(fetch_response);
    } else {
      return res.send('No reviews found for ' + query);
    }
  } else {
    return res.send('Query string must not be emptry');
  }
});
