import ReviewModel, { IReview } from '../models/review';
import { findAndUpdateDocument } from '../utils/mongoUtils';

/**
 * Caches review data by updating or creating a document in the ReviewModel.
 *
 * @param {IReview} reviewData - The review data to be cached.
 * @returns {Promise<IReview | null>} - A promise that resolves to the updated or created review document, or null if not found.
 */
export default function cacheReview(
  reviewData: IReview
): Promise<IReview | null> {
  // Assert that at least one of professor_id or course_id is a valid value
  if (!(reviewData.professor_id || reviewData.course_id)) {
    throw new Error(
      'At least one of professor_id or course_id must be provided.'
    );
  }
  /**
   * Constructs a Mongoose filter to find documents with specific criteria.
   *
   * @param {string} professorId - The value for the 'professor_id' field that documents must match.
   * @param {string} courseId - The value for the 'course_id' field that documents must match at least one of.
   * @param {string} semester - The value for the 'semester' field that documents must match at least one of.
   * @returns {Object} - Mongoose filter object.
   */
  const filter = {
    $and: [
      { professor_id: reviewData.professor_id },
      {
        $or: [
          { course_id: reviewData.course_id },
          { semester: reviewData.semester },
        ],
      },
    ],
  };

  // Call the findAndUpdateDocument function to perform the caching operation.
  return findAndUpdateDocument(ReviewModel, filter, reviewData);
}
