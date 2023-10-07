import { getReviews } from "./fetchReviews.js";
import { getDrillDown } from "./fetchDrillDown.js";
import { processNewData } from "./syncData.js";
import { getMcasDeps } from "./syncMCAS.js";
import { updateCourses } from "./updateMongo.js";
import { courseSchema } from "./courseSchema.js";
import { connectToDatabase, closeDatabaseConnection } from "./mongo.js";
import "log-timestamp";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { body, matchedData, validationResult } from "express-validator";

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

app.get("/api/fetch/mcasDeps", async (req, res) => {
  console.log("Fetching MCAS Department URLs");

  // wait for response form bc website
  let urls = await getMcasDeps();

  console.log("Successfully fetched MCAS departments");

  res.send(urls);
});

app.post("/api/update/courses", async (req, res) => {
  const Course = new mongoose.model("Course", courseSchema);

  console.log("Updating mongo with new data");

  // Fetch data from BC Course database
  console.log("Fetching new course data from BC");
  let newData = await processNewData();
  console.log("Completed fetching course data");

  // Update mongodb with new course data
  console.log("Starting updating of course database");
  let newCourses = await updateCourses(newData, Course);
  console.log("Finished updating course database");

  res.send(
    `Successfully updated course database. Added ${newCourses} new courses`
  );
});

// Middleware to close the MongoDB connection when the server stops
app.use(async (req, res, next) => {
  try {
    await closeDatabaseConnection();
    next();
  } catch (error) {
    next(error);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
