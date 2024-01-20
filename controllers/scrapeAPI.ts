import cacheDrilldown from './cacheDrilldown';
import cacheReview from './cacheReviews';
import { getReviews } from './fetchReviews';
import { getDrillDown } from './fetchDrillDown';
import { IDrilldown } from '../models/drilldown';
import ReviewModel, { IReview } from '../models/review';
import ProfessorModel, { IProfessor } from '../models/professor';
import CourseModel, { ICourse } from '../models/course';
import { Types, Model, Document } from 'mongoose';

// define consts for batch processing
const BATCH_SIZE: number = 50;

/**
 * Scrapes reviews for a given model from BC API in batches.
 *
 * @param model - The Mongoose model for which reviews are being scraped.
 * @param getKey - A function to extract a key from an item of the model.
 * @param setId - A function to set an ID in the review data.
 * @returns A Promise<void> indicating the completion of the scraping process.
 */
async function scrapeReviews<T extends Document>(
  model: Model<T>,
  getKey: (item: T) => string,
  setId: (reviewData: any, id: Types.ObjectId) => void
): Promise<void> {
  try {
    console.log(`Scraping ${model.modelName} reviews from BC API`);

    // Get the total count of items in the model
    const count: number = await model.count({});

    // Calculate the number of batches needed
    const batches: number = Math.ceil(count / BATCH_SIZE);

    // Loop through each batch
    for (let i = 0; i < batches; i++) {
      console.log(`Scraping data for batch ${i} of ${batches}`);

      let promises: Promise<any>[] = [];

      // Fetch the current batch of items from the model
      const curr_batch: T[] = await model
        .find({}, null, {
          limit: BATCH_SIZE,
          skip: BATCH_SIZE * i,
        })
        .exec();

      // Loop through each item in the batch
      for (const item of curr_batch) {
        // Extract the item's ID and key
        const id: Types.ObjectId = item.id;
        const name: string = getKey(item);

        console.log('Getting reviews for ', name);
        // Fetch reviews for the current item
        let reviewData: IReview[] | null = await getReviews(name);

        if (reviewData != null) {
          for (const review of reviewData) {
            // Set the ID in the review data
            setId(review, id);

            // Cache the reviews
            promises.push(cacheReview(review));
          }
        }
      }

      // Wait for all reviews to be cached before starting the next batch
      console.log(`Caching batch ${i} of ${batches}`);
      await Promise.all(promises);
    }
  } catch (error) {
    // Handle any errors that occur during the scraping process
    throw new Error(`Error scraping ${model.modelName} reviews: ${error}`);
  }
}

/**
 * Scrapes reviews for professors.
 *
 * @returns A Promise<void> indicating the completion of the scraping process.
 */
export async function scrapeProfReviews(): Promise<void> {
  await scrapeReviews<IProfessor>(
    ProfessorModel,
    (prof) => prof.name,
    (reviewData, id) => (reviewData.professor_id = id)
  );
}

/**
 * Scrapes reviews for courses.
 *
 * @returns A Promise<void> indicating the completion of the scraping process.
 */
export async function scrapeCourseReviews(): Promise<void> {
  await scrapeReviews<ICourse>(
    CourseModel,
    (course) => course.code,
    (reviewData, id) => (reviewData.course_id = id)
  );
}

/**
 * Scrapes drilldown data from BC API in batches.
 *
 * @returns A Promise<void> indicating the completion of the scraping process.
 */
export async function scrapeDrilldown(): Promise<void> {
  try {
    console.log(`Scraping drilldown data from BC API`);

    // Get the total count of items in the model
    const count: number = await ReviewModel.count({});

    // Calculate the number of batches needed
    const batches: number = Math.ceil(count / BATCH_SIZE);

    // Loop through each batch
    for (let i = 0; i < batches; i++) {
      let promises: Promise<any>[] = [];

      // Fetch the current batch of items from the model
      const curr_batch = await ReviewModel.find({}, null, {
        limit: BATCH_SIZE,
        skip: BATCH_SIZE * i,
      }).exec();

      // Loop through each item in the batch
      for (const item of curr_batch) {
        // Extract the item's ID and key
        const id: Types.ObjectId = item._id;

        console.log('Getting drilldown for ', id);
        // Fetch reviews for the current item
        const drilldownData: Promise<IDrilldown | null> = getDrillDown(id);

        // Add the reviews
        promises.push(drilldownData);
      }

      const reviews = await Promise.all(promises);

      // Wait for all reviews to be cached before starting the next batch
      console.log(`Caching batch ${i} of ${batches}`);

      for (const review of reviews) {
        if (review) {
          await cacheDrilldown(review);
        }
      }
    }
  } catch (error) {
    // Handle any errors that occur during the scraping process
    throw new Error(`Error scraping drilldown: ${error}`);
  }
}
