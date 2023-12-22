import cacheDrilldown from './cacheDrilldown';
import cacheReview from './cacheReviews';
import { getReviews } from './fetchReviews';
import { getDrillDown } from './fetchDrillDown';
import DrilldownModel, { IDrilldown } from 'models/drilldown';
import ReviewModel, { IReview } from 'models/review';
import ProfessorModel from 'models/professor';
import CourseModel from 'models/course';

// define consts for batch processing
const BATCH_SIZE: number = 50;

export default async function scrapeProfReviews(): Promise<void> {
  try {
    console.log('Scraping professor reviews from BC API');

    const count: number = await ProfessorModel.count({});

    const batches: number = Math.ceil(count / BATCH_SIZE);

    for (let i = 0; i < batches; i++) {
      let promises: [Promise<IReview | null>];
    }
  } catch (error) {
    // Handle any errors that occur during the scraping process
    throw new Error('Error scraping professor reviews: ' + error);
  }
}
