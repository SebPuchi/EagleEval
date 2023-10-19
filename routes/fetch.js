// fetch.js - Fetch routes module
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { getReviews } from "../controllers/fetchReviews.js";
import { getDrillDown } from "../controllers/fetchDrillDown.js";
import { cacheReviews } from "../controllers/cacheReviews.js";
import { cacheDrilldown } from "../controllers/cacheDrilldown.js";

export const fetch_router = express.Router();

// Fetch reviews route (POST)
// route to fetching review data from api for a certain query
fetch_router.post(
  "/reviews",
  body("fetch_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query string from body (Class code or professor name)
      let query = data.fetch_query;
      console.log("Processing response for query: " + query);

      // Wait for response from bc reviews
      let fetch_response = await getReviews(query);

      console.log("Successfully fetched reviews for: " + data.fetch_query);

      console.log("Caching data in mongodb");
      let cached_reviews = await cacheReviews(fetch_response);

      // Cache results in mongodb
      return res.json(cached_reviews);
    }

    console.error(
      req.body.fetch_query
        ? "Error for query: " + req.body.fetch_query
        : "Error: empty fetch query"
    );
    res.send("Invalid body params: fetch_query must not be empty");
  }
);

// Fetch review drilldown data (POST)
// Gets more detailed data for a professor and course pair
fetch_router.post(
  "/drilldown",
  body("code").trim().notEmpty().escape(),
  body("prof").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query params from body (Class code or professor name)
      let code = data.code;
      let prof = data.prof;
      console.log(`Processing response for query: ${code}, ${prof}`);

      // Wait for response from bc reviews
      let fetch_response = await getDrillDown(code, prof);

      console.log(`Successfully fetched drilldown data for: ${code}, ${prof}`);

      console.log("Caching drilldown data in mongodb");
      let cached_dd = await cacheDrilldown(fetch_response);

      return res.json(cached_dd);
    }

    console.error(
      req.body.code && req.body.prof
        ? `Error for query: ${req.body.code}, ${req.body.prof}`
        : "Error: empty body params"
    );
    res.send("Invalid body params: code and prof must not be empty");
  }
);

// Fetch course data (GET)
// Gets data for all courses from BC database
fetch_router.get("/courseData", async (req, res) => {
  console.log("Fetching course data from BC database");

  // wait for response from BC Course Database
  let newData = await processNewData();

  console.log("Successfully fetched course data from BC");

  res.send(newData);
});
