import { Review } from "../models/reviewSchema.js";
import { findOrCreateReviews } from "../utils/mongoUtils.js";

export async function cacheReviews(reviewData) {
  let promise = findOrCreateReviews(Review, reviewData);

  promise.then((reviews) => {
    return reviews;
  });
}
