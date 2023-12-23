import DrilldownModel, { IDrilldown } from 'models/drilldown';
import { findAndUpdateDocument } from 'utils/mongoUtils';
import { Types } from 'mongoose';

/**
 * Caches drilldown data by updating or creating a document in the DrilldownModel.
 *
 * @param {any} ddData - The drilldown data to be cached.
 * @returns {Promise<IDrilldown | null>} - A promise that resolves to the updated or created drilldown document, or null if not found.
 */
export default function cacheDrilldown(
  ddData: IDrilldown
): Promise<IDrilldown | null> {
  if (!ddData.review_id) {
    throw new Error('review_id must be set for drilldown object');
  }
  /**
   * The filter object used to identify the document in the DrilldownModel.
   * @type {Record<string, Schema.Types.ObjectId>}
   */
  const filter: Record<string, Types.ObjectId> = {
    review_id: ddData.review_id,
  };

  // Call the findAndUpdateDocument function to perform the caching operation.
  return findAndUpdateDocument(DrilldownModel, filter, ddData);
}
