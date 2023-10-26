// Import necessary modules and functions
import { mapToCanMatch } from "@angular/router";
import { cacheReviews } from "./cacheReviews";
import { Professor } from "../models/profSchema";
import { getReviews } from "./fetchReviews";

// Define constants for batch processing
const BATCH_SIZE = 50; // The size of each batch
const MAX_BATCHES = 1; // Maximum number of batches to process

// Function to scrape professor data
// This function retrieves professor data and their reviews in batches.
export async function scrapeProfessors() {
  try {
    // Get the total number of professors in the database
    const count = await Professor.count({});

    // Calculate the number of batches needed (limited by MAX_BATCHES)
    const batches = Math.min(MAX_BATCHES, Math.ceil(count / BATCH_SIZE));

    // Loop through each batch
    for (i = 0; i < batches; i++) {
      let promises = [];

      // Retrieve a batch of professors from the database
      const curr_batch = await Professor.find(
        {},
        { limit: BATCH_SIZE, skip: BATCH_SIZE * i }
      );

      // Fetch reviews for each professor in the current batch
      for (const prof of curr_batch) {
        const title = prof.title;
        console.log("Getting review data for: ", title);
        promises.push(getReviews(title));
      }

      // Wait for all review fetching promises to complete
      const review_data = await Promise.all(promises);

      // Cache the retrieved reviews in the MongoDB database
      console.log("Caching reviews in MongoDB");
      for (const review of review_data) {
        await cacheReviews(review);
      }
    }
  } catch (error) {
    // Handle any errors that occur during the scraping process
    throw new Error("Error scraping professor reviews");
  }
}
