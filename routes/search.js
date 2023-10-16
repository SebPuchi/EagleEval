// search.js - routes for searching mongodb
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import {
  autocompleteProfSearch,
  autocompleteCourseSearch,
} from "../controllers/search.js";

export const search_router = express.Router();

// Search across both courses and professors
search_router.post(
  "/",
  body("search_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // check input has no errors
    if (result.isEmpty()) {
      var results = [];
      let data = matchedData(req);

      // query string from body
      const query = data.search_query;
      console.log("General search for: ", query);

      // wait for responses from mongodb
      let course_results = await autocompleteCourseSearch(query);
      let prof_results = await autocompleteProfSearch(query);

      console.log("Successfully got results for search: ", query);

      results = course_results.concat(prof_results);
      results = results.sort((a, b) => b["score"] - a["score"]);

      return res.send(results.slice(0, 5));
    }
  }
);

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
      console.log("Searching for course: ", query);

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

// Search for professors - autocomplete (POST)
search_router.post(
  "/profs",
  body("search_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // check input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // query string from body (class title)
      const query = data.search_query;
      console.log("Searching for prof: ", query);

      // wait for response from mongodb
      let search_results = await autocompleteProfSearch(query);

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
