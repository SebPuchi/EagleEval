// update.js - Update routes module
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { processNewData } from "../controllers/syncCourses.js";
import {
  getMcasProfData,
  getCSOMProfData,
  getSSWProfData,
  getProfData,
} from "../controllers/syncProfs.js";
import { updateCollection } from "../controllers/updateMongo.js";

import {
  findOrCreateAndUpdateCourse,
  findOrCreateAndUpdateProf,
} from "../utils/mongoUtils.js";

import { Course } from "../models/courseSchema.js";
import { Professor } from "../models/profSchema.js";

const schoolUrls = {
  MCAS: "https://www.bc.edu/bc-web/schools/morrissey/department-list.html",
  CSOM: "https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-directory.2.json",
  CSON: "https://www.bc.edu/content/bc-web/schools/cson/faculty-research/faculty-directory.3.json",
  SSW: "https://www.bc.edu/content/bc-web/schools/ssw/faculty/faculty-directory.2.json",
  LS: "https://www.bc.edu/content/bc-web/schools/lynch-school/faculty-research/faculty-directory.3.json",
  STM: "https://www.bc.edu/content/bc-web/schools/stm/faculty/faculty-directory.3.json",
};

export const update_router = express.Router();

// Define the POST route for updating courses
update_router.post("/courses", async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // If there are validation errors, respond with a 400 Bad Request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Fetch new data to update the course database
    const newData = await processNewData();

    // Update the MongoDB collection with new course data
    const newCourses = await updateCollection(
      newData,
      Course,
      findOrCreateAndUpdateCourse
    );

    // Wait for all update operations to complete
    await Promise.all(newCourses);

    // Respond with a success message if everything is successful
    res.send("Successfully updated course database.");
  } catch (error) {
    console.log(error);
    // If an error occurs during the update process, respond with a 500 Internal Server Error
    res.status(500).send("Failed to update course database.");
  }
});

// This route handles POST requests to update professor data for specific schools.
update_router.post(
  "/profs",
  // Validation middleware for request body to ensure "schools" is not empty and escape any special characters.
  [body("schools").trim().notEmpty().escape()],
  async (req, res) => {
    // Validate the request using the validation middleware and check for errors.
    const errors = validationResult(req);

    // If there are validation errors, log an error message and send a 400 Bad Request response.
    if (!errors.isEmpty()) {
      console.error('Invalid body params. "schools" must not be empty');
      return res
        .status(400)
        .send('Invalid body params. "schools" must not be empty');
    }

    try {
      // Extract validated data from the request body.
      const data = matchedData(req);
      const schools = data.schools;

      // Initialize an array of promises for updating professor data for each school.
      let promises = schools.map(async (school) => {
        // Determine the URL to fetch data based on the school.
        const fetchUrl = schoolUrls[school];

        const profData = (() => {
          switch (school) {
            case "MCAS":
              return getMcasProfData(fetchUrl);
            case "CSOM":
              return getCSOMProfData(fetchUrl);
            case "SSW":
              return getSSWProfData(fetchUrl);
            default:
              return getProfData(fetchUrl);
          }
        })();

        // Wait for the data to be fetched and log progress.
        const result = await profData;
        console.log(`Updating professors for ${school}`);

        if (school === "MCAS") {
          // For MCAS, create an array of promises to update departments and professors.
          const depPromises = result.map((dep) => {
            //console.log("Department data: ", dep);
            return updateCollection(dep, Professor, findOrCreateAndUpdateProf);
          });

          // Wait for all department updates to complete.
          return Promise.all(depPromises);
        } else {
          // For general schools, update professors directly.
          return updateCollection(result, Professor, findOrCreateAndUpdateProf);
        }
      });

      // Wait for all school updates to complete.
      await Promise.all(promises);

      // Log a success message and send a response.
      console.log(`Successfully updated profs for ${data.schools}`);
      return res.send(`Successfully updated profs for ${data.schools}`);
    } catch (error) {
      // If an error occurs during the update process, log an error and send a 500 Internal Server Error response.
      console.error("Error updating profs:", error);
      return res.status(500).send("Error updating profs");
    }
  }
);
