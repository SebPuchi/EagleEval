import { Course } from "../models/courseSchema.js";
import { Professor } from "../models/profSchema.js";

// Autocomplete search for courses
export async function autocompleteCourseSearch(query) {
  const agg = [
    {
      $search: {
        index: "searchCourses",
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "title",
                tokenOrder: "any",
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
            {
              text: {
                query: query,
                path: ["title", "crs_code"],
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        crs_code: 1,
        score: { $meta: "searchScore" },
      },
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
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "title",
                tokenOrder: "any",
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
            {
              text: {
                query: query,
                path: "title",
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: { _id: 1, title: 1, score: { $meta: "searchScore" } },
    },
  ];

  return await Professor.aggregate(agg);
}
