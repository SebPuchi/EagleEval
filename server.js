import { getReviews } from "./fetchReviews.js";
import { getDrillDown } from "./fetchDrillDown.js";
import { processNewData } from "./syncCourses.js";
import { getMcasProfData, getProfData } from "./syncProfs.js";
import { updateCollection } from "./updateMongo.js";
import { courseSchema } from "./courseSchema.js";
import { profSchema } from "./profSchema.js";
import {
  findOrCreateAndUpdateCourse,
  findOrCreateAndUpdateProf,
} from "./mongoUtils.js";
import { connectToDatabase } from "./mongo.js";
import "log-timestamp";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { body, matchedData, validationResult } from "express-validator";
import { ConsoleLogger } from "@angular/compiler-cli";

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

app.post("/api/update/courses", async (req, res) => {
  const Course = new mongoose.model("Course", courseSchema);

  console.log("Updating mongo with new course data");

  // Fetch data from BC Course database
  let newData = await processNewData();

  // Update mongodb with new course data
  console.log("Starting updating of course database");
  let newCourses = await updateCollection(
    newData,
    Course,
    findOrCreateAndUpdateCourse
  );
  console.log("Finished updating course database");

  res.send(
    `Successfully updated course database. Added ${newCourses} new courses`
  );
});

// Define a route for handling POST requests to update professors
app.post(
  "/api/update/profs",
  // Validate the 'schools' field in the request body: trim, check if not empty, and escape special characters
  body("schools").trim().notEmpty().escape(),
  async (req, res) => {
    // Validate the request body against defined validation rules
    let result = validationResult(req);

    // Dictionary of school URLs to fetch professor data
    const schoolUrls = {
      MCAS: "https://www.bc.edu/bc-web/schools/morrissey/department-list.html",
      CSOM: "https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-directory.2.json",
      CSON: "https://www.bc.edu/content/bc-web/schools/cson/faculty-research/faculty-directory.3.json",
      SSW: "https://www.bc.edu/content/bc-web/schools/ssw/faculty/faculty-directory.3.json",
      LS: "https://www.bc.edu/content/bc-web/schools/lynch-school/faculty-research/faculty-directory.3.json",
      STM: "https://www.bc.edu/content/bc-web/schools/stm/faculty/faculty-directory.3.json",
    };

    // Create a new Professor model instance using Mongoose
    const Professor = new mongoose.model("Professor", profSchema);

    // Check if the request body validation passed
    if (result.isEmpty()) {
      try {
        // Extract validated data from the request
        let data = matchedData(req);

        // Extract the 'schools' field from the data
        const schools = data.schools;

        // Create an array of promises for fetching professor data for each school
        const promises = schools.map((school) => {
          const fetchUrl = schoolUrls[school];
          var profData;

          // Decide which function to use based on the school
          if (school == "MCAS") {
            profData = getMcasProfData(fetchUrl);

            // Fetch professor data and update the collection
            profData.then((result) => {
              console.log(`Updating professors for ${school}`);
              var depPromises = [];
              for (const dep of result) {
                let newProfs = updateCollection(
                  dep,
                  Professor,
                  findOrCreateAndUpdateProf
                );

                depPromises.push(newProfs);
              }
              return depPromises;
            });
          } else {
            profData = getProfData(fetchUrl);

            // Fetch professor data and update the collection
            profData.then((result) => {
              console.log(`Updating professors for ${school}`);

              let newProfs = updateCollection(
                result,
                Professor,
                findOrCreateAndUpdateProf
              );

              return newProfs;
            });
          }
        });
        // Wait for all promises to resolve
        await Promise.all(promises);

        // Send a success response
        return res.send(`Successfully updated profs for ${req.body.schools}`);
      } catch (error) {
        // Handle and log any errors during the update process
        console.error("Error updating profs:", error);
        throw error;
      }
    }

    // Handle invalid request body parameters
    console.error(
      req.schools
        ? `Error for request: ${req.schools}`
        : "Error: empty body params"
    );
    res.send("Invalid body params schools must not be empty");
  }
);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
