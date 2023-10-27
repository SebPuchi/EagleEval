// Import necessary modules and functions
import { cacheReviews } from "./cacheReviews.js";
import { Course } from "../models/courseSchema.js";
import { getReviews } from "./fetchReviews.js";

// Define constants for batch processing
const BATCH_SIZE = 50; // The size of each batch
const MAX_BATCHES = 1; // Maximum number of batches to process

// Function to scrape professor data
// This function retrieves professor data and their reviews in batches.
export async function scrapeProfessors() {
  try {
    console.log("Scraping reviews from BC API");
    // Get the total number of professors in the database
    const count = await Course.count({});

    // Calculate the number of batches needed (limited by MAX_BATCHES)
    const batches = Math.min(MAX_BATCHES, Math.ceil(count / BATCH_SIZE));

    // Loop through each batch
    for (let i = 0; i < batches; i++) {
      let promises = [];

      // Retrieve a batch of professors from the database
      const curr_batch = await Course.find({}, null, {
        limit: BATCH_SIZE,
        skip: BATCH_SIZE * i,
      }).exec();

      // Fetch reviews for each professor in the current batch
      for (const prof of curr_batch) {
        const title = prof.crs_code;
        console.log("Getting review data for: ", title);
        promises.push(getReviews(title));
      }

      // Wait for all review fetching promises to complete
      const review_data = await Promise.all(promises);

      // Cache the retrieved reviews in the MongoDB database
      console.log("Caching reviews in MongoDB");
      for (const review of review_data) {
        if (review) {
          console.log("Caching review for ", review[0].course_code);
          await cacheReviews(review);
        }
      }
    }
  } catch (error) {
    // Handle any errors that occur during the scraping process
    throw new Error("Error scraping professor reviews");
  }
}
