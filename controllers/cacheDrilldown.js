import { Drilldown } from "../models/drilldownSchema.js";
import { findOrCreateDrilldown } from "../utils/mongoUtils.js";

export async function cacheDrilldown(ddData) {
  let promise = findOrCreateDrilldown(Drilldown, ddData);

  return promise.then(async (reviews) => {
    return reviews;
  });
}
