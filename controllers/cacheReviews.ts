import ReviewModel, { IReview } from 'models/review';
import { findAndUpdateDocument } from 'utils/mongoUtils';
import { Types } from 'mongoose';

/**
 * Caches review data by updating or creating a document in the ReviewModel.
 *
 * @param {any} reviewData - The review data to be cached.
 * @returns {Promise<IReview | null>} - A promise that resolves to the updated or created review document, or null if not found.
 */
export default function cacheReview(
  reviewData: IReview
): Promise<IReview | null> {
  /**
   * The filter object used to identify the document in the ReviewModel.
   * @type {{ [key: string]: Schema.Types.ObjectId | string }}
   */
  const filter: { [key: string]: Types.ObjectId | string | undefined } = {
    professor_id: reviewData.professor_id,
    course_id: reviewData.course_id,
    semester: reviewData.semester,
  };

  // Call the findAndUpdateDocument function to perform the caching operation.
  return findAndUpdateDocument(ReviewModel, filter, reviewData);
}
