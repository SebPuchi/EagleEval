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
      return res.send('No reviews found for ' + query);
    }
  } else {
    return res.send('Query string must not be emptry');
  }
});

fetch_router.get('/drilldown', async (req: Request, res: Response) => {
  // Query paramters for prof and course code
  const prof = (req.query['prof'] as string) || null;
  const course = (req.query['course'] as string) || null;
  const semester = (req.query['semster'] as string) || null;
  const review_id = (req.query['id'] as any) || null;

  if (prof && course && semester && review_id) {
    console.log('Searching for ' + prof + ' ' + course + ' drilldown');

    let fetch_response: IDrilldown | null = await getDrillDown(
      course,
      prof,
      semester,
      <Types.ObjectId>review_id
    );

    if (fetch_response) {
      console.log('Successfully fetched drilldown for ' + prof + ' ' + course);

      return res.json(fetch_response);
    } else {
      return res.send('No drilldown found for ' + prof + ' ' + course);
    }
  } else {
    return res.send('Query string must include prof and course');
  }
});
