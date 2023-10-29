// cache.js - finds data from cached reviews in mongodb
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { Review } from "../models/reviewSchema.js";
import { Professor } from "../models/profSchema.js";
import { Course } from "../models/courseSchema.js";
import { searchReviews, searchById } from "../utils/mongoUtils.js";
import { Drilldown } from "../models/drilldownSchema.js";

export const cache_router = express.Router();

// Search from profs
cache_router.post(
  "/search/profs",
  body("id").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Id of prof data
      let id = data.id;
      console.log("Searching prof collection for: " + id);

      const result = await searchById(Professor, id);
      console.log("Successfully got prof data for: ", id);

      return res.json(result);
    }

    console.error(
      req.body.id ? "Error for id: " + req.body.id : "Error: empty id param"
    );
    res.send("Invalid body params: id must not be empty");
  }
);

// Search from courses
cache_router.post(
  "/search/courses",
  body("id").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Id of course data
      let id = data.id;
      console.log("Searching course collection for: " + id);

      const result = await searchById(Course, id);
      console.log("Successfully got course data for: ", id);

      return res.json(result);
    }

    console.error(
      req.body.id ? "Error for id: " + req.body.id : "Error: empty id param"
    );
    res.send("Invalid body params: id must not be empty");
  }
);

// Search chached reviews
cache_router.post(
  "/search/reviews",
  body("search_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query string from body (Class code or course name)
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
