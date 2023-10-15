import mongoose from "mongoose";
import { Course } from "../models/courseSchema.js";
import { Professor } from "../models/profSchema.js";
/*
// Query String for searchCourses search index on courses collection
[
  {
    $search: {
      index: "searchCourses",
      text: {
        query: "CSCI2271",
        path: {"wildcard":"*"},
        fuzzy: {},
      },
    }
  }
]

// Autocomplete search
{
  $search: {
    "index": "searchCourses",
    "autocomplete": {
      "query": "",
      "path": "title",
      "tokenOrder": "sequential",
      "fuzzy": {"maxEdits": 1, "prefixLength": 1, "maxExpansions": 256},
    }
  }
}
*/

// Autocomplete search for courses
export async function autocompleteCourseSearch(query) {
  const agg = [
    {
      $search: {
        index: "searchCourses",
        autocomplete: {
          query: query,
          path: "title",
          tokenOrder: "any",
          fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
        },
      },
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1, title: 1, crs_code: 1 },
    },
  ];

  return await Course.aggregate(agg);
}

// Autocomplete search for professors
export async function autocompleteProfSearch(query) {
  const agg = [
    {
      $search: {
        index: "searchProfs",
        autocomplete: {
          query: query,
          path: "title",
          tokenOrder: "any",
          fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
        },
      },
    },
    {
      $limit: 10,
    },
    {
      $project: { _id: 1, title: 1 },
    },
  ];

  return await Professor.aggregate(agg);
}
