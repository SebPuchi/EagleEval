// cache.js - finds data from cached reviews in mongodb
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { Review } from "../models/reviewSchema.js";
import { searchReviews } from "../utils/mongoUtils.js";
import { Drilldown } from "../models/drilldownSchema.js";

export const cache_router = express.Router();

// Search chached reviews
cache_router.post(
  "/search/reviews",
  body("search_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query string from body (Class code or professor name)
      let query = data.search_query;
      console.log("Searching review cache for query: " + query);

      const result = await searchReviews(Review, query);
      console.log("Successfully got cached results for: ", query);

      return res.json(result);
    }

    console.error(
      req.body.fetch_query
        ? "Error for query: " + req.body.fetch_query
        : "Error: empty fetch query"
    );
    res.send("Invalid body params: search_query must not be empty");
  }
);

// Search chached drilldown data
cache_router.post(
  "/search/drilldown",
  body("search_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query string from body (Class code or professor name)
      let query = data.search_query;
      console.log("Searching drilldown cache for query: " + query);

      const result = await searchReviews(Drilldown, query);
      console.log("Successfully got drilldown data results for: ", query);

      return res.json(result);
    }

    console.error(
      req.body.fetch_query
        ? "Error for query: " + req.body.fetch_query
        : "Error: empty search query"
    );
    res.send("Invalid body params: search_query must not be empty");
  }
);
