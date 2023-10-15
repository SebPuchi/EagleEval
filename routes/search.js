// search.js - routes for searching mongodb
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import {
  autocompleteProfSearch,
  autocompleteCourseSearch,
} from "../controllers/search.js";

export const search_router = express.Router();

// Search for courses - autocomplete (POST)
search_router.post(
  "/courses",
  body("search_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // check input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // query string from body (class title)
      const query = data.search_query;
      console.log("Searching for: ", query);

      // wait for response from mongodb
      let search_results = await autocompleteCourseSearch(query);

      console.log("Successfully got results for search: ", query);
      return res.send(search_results);
    }

    console.error(
      req.body.search_query_query
        ? "Error for query: " + req.body.serch_query
        : "Error: empty search query"
    );
    res.send("Invalid body params: search_query must not be empty");
  }
);
