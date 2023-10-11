import { getReviews } from "./controllers/fetchReviews.js";
import { getDrillDown } from "./controllers/fetchDrillDown.js";
import { processNewData } from "./controllers/syncCourses.js";
import { getMcasProfData, getProfData } from "./controllers/syncProfs.js";
import { updateCollection } from "./controllers/updateMongo.js";
import { courseSchema } from "./models/courseSchema.js";
import { profSchema } from "./models/profSchema.js";
import {
  findOrCreateAndUpdateCourse,
  findOrCreateAndUpdateProf,
} from "./utils/mongoUtils.js";
import { connectToDatabase } from "./controllers/mongo.js";
import "log-timestamp";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { body, matchedData, validationResult } from "express-validator";
import { ConsoleLogger } from "@angular/compiler-cli";

const schoolUrls = {
  MCAS: "https://www.bc.edu/bc-web/schools/morrissey/department-list.html",
  CSOM: "https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-directory.2.json",
  CSON: "https://www.bc.edu/content/bc-web/schools/cson/faculty-research/faculty-directory.3.json",
  SSW: "https://www.bc.edu/content/bc-web/schools/ssw/faculty/faculty-directory.3.json",
  LS: "https://www.bc.edu/content/bc-web/schools/lynch-school/faculty-research/faculty-directory.3.json",
  STM: "https://www.bc.edu/content/bc-web/schools/stm/faculty/faculty-directory.3.json",
};

const app = express();

// handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Middleware to connect to MongoDB when the server starts
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// route to fetching review data from api for a certain query
app.post(
  "/api/fetch/reviews",
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
      return res.send(fetch_response);
    }

    console.error(
      req.body.fetch_query
        ? "Error for query: " + req.body.fetch_query
        : "Error: empty fetch query"
    );
    res.send("Invalid body params: fetch_query must not be empty");
  }
);

app.post(
  "/api/fetch/drilldown",
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
      return res.send(fetch_response);
    }

    console.error(
      req.body.code && req.body.prof
        ? `Error for query: ${req.body.code}, ${req.body.prof}`
        : "Error: empty body params"
    );
    res.send("Invalid body params: code and prof must not be empty");
  }
);

app.get("/api/fetch/courseData", async (req, res) => {
  console.log("Fetching course data from BC database");

  // wait for response from BC Course Database
  let newData = await processNewData();

  console.log("Successfully fetched course data from BC");

  res.send(newData);
});

// Define the POST route for updating courses
app.post("/api/update/courses", async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // If there are validation errors, respond with a 400 Bad Request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create the Course model using Mongoose
  const Course = mongoose.model("Course", courseSchema);

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
    // If an error occurs during the update process, respond with a 500 Internal Server Error
    res.status(500).send("Failed to update course database.");
  }
});

// This route handles POST requests to update professor data for specific schools.
app.post(
  "/api/update/profs",
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

      // Create a Professor model using Mongoose and the "profSchema".
      const Professor = mongoose.model("Professor", profSchema);

      // Initialize an array of promises for updating professor data for each school.
      let promises = schools.map(async (school) => {
        // Determine the URL to fetch data based on the school.
        const fetchUrl = schoolUrls[school];

        // Fetch professor data from the appropriate source (MCAS or general).
        const profData =
          school === "MCAS" ? getMcasProfData(fetchUrl) : getProfData(fetchUrl);

        // Wait for the data to be fetched and log progress.
        const result = await profData;
        console.log(`Updating professors for ${school}`);

        if (school === "MCAS") {
          // For MCAS, create an array of promises to update departments and professors.
          const depPromises = result.map((dep) =>
            updateCollection(dep, Professor, findOrCreateAndUpdateProf)
          );

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

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
