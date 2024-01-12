// fetch.js - Fetch routes module
import express, { Request, Response } from 'express';
import { Types } from 'mongoose';

import { getReviews } from '../controllers/fetchReviews';
import { getDrillDown } from '../controllers/fetchDrillDown';
import { IReview } from '../models/review';
import { IDrilldown } from '../models/drilldown';

export const fetch_router = express.Router();

fetch_router.get('/reviews', async (req: Request, res: Response) => {
  // Access query parameters using req.query
  const query = (req.query['search'] as string) || null;

  if (query) {
    console.log('Searching for', query);

    let fetch_response: IReview[] | null = await getReviews(query);

    if (fetch_response) {
      console.log('Successfully fetched reviews for', query);

      return res.json(fetch_response);
    } else {
      return res.send('No reviews found');
    }
  } else {
    return res.send('Query string must not be emptry');
  }
});

fetch_router.get('/drilldown', async (req: Request, res: Response) => {
  // Query paramters for prof and course code
  const review_id = (req.query['id'] as any) || null;

  if (review_id) {
    console.log('Searching for drilldown: ID - ' + review_id);

    let fetch_response: IDrilldown | null = await getDrillDown(
      <Types.ObjectId>review_id
    );

    if (fetch_response) {
      console.log('Successfully got data for drilldown: ID - ' + review_id);

      return res.json(fetch_response);
    } else {
      console.log('No data for for drilldown: ID - ' + review_id);

      return res.send('No data for for review id');
    }
  } else {
    return res.send('Query string must include parent review id');
  }
});
