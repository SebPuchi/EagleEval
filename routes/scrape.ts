import express, { Request, Response } from 'express';
import {
  scrapeDrilldown,
  scrapeCourseReviews,
  scrapeProfReviews,
} from '../controllers/scrapeAPI';

const scrape_router = express.Router();

scrape_router.post('/reviews/prof', async (req: Request, res: Response) => {
  console.log('Scraping reviews by professor');

  scrapeProfReviews()
    .then(() => {
      console.log('Successfully scraped review data');
      return res.send('Success');
    })
    .catch(() => {
      console.log('Error scraping reivews by professor');
      return res.send('Failure');
    });
});

scrape_router.post('/reviews/course', async (req: Request, res: Response) => {
  console.log('Scraping reviews by course');

  scrapeCourseReviews()
    .then(() => {
      console.log('Successfully scraped review data');
      return res.send('Success');
    })
    .catch(() => {
      console.log('Error scraping reivews by course');
      return res.send('Failure');
    });
});

scrape_router.post('/reviews', async (req: Request, res: Response) => {
  console.log('Scraping reviews');

  scrapeProfReviews()
    .then(() => {
      console.log('Successfully scraped review data for professors');
    })
    .catch(() => {
      console.log('Error scraping reivews');
      return res.send('Failure');
    });

  scrapeCourseReviews()
    .then(() => {
      console.log('Successfully scraped review data for courses');
    })
    .catch(() => {
      console.log('Error scraping reivews');
      return res.send('Failure');
    });

  return res.send('Success');
});

scrape_router.post('/drilldown', async (req: Request, res: Response) => {
  console.log('Scraping drilldown data');

  scrapeDrilldown()
    .then(() => {
      console.log('Successfully scraped drilldown data');
      return res.send('success');
    })
    .catch(() => {
      return res.send('Failure');
    });
});

export { scrape_router };
