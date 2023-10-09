import { getReviews } from "./fetchReviews.js";
import { getDrillDown } from "./fetchDrillDown.js";
import { processNewData } from "./syncCourses.js";
import {
  getMcasProfData,
  getMcasDeps,
  getCsomProfData,
  getCsonProfData,
  getLynchProfData,
  getSswProfData,
  getStmProfData,
} from "./syncProfs.js";
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

app.post(
  "/api/update/profs",
  body("schools").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Dict of school to fetch function
    const schools = {
      MCAS: getMcasDeps,
      CSOM: getCsomProfData,
      CSON: getCsonProfData,
      SSW: getSswProfData,
      LS: getLynchProfData,
      STM: getStmProfData,
    };

    const Professor = new mongoose.model("Professor", profSchema);

    if (result.isEmpty()) {
      try {
        const promises = req.schools.map((school) => {
          const fetchFunc = schools[school];

          let newProfData = await fetchFunc();
        });

        const responses = Promise.all(promises);

        const sumResponses = responses.reduce(
          (partialSum, a) => partialSum + a,
          0
        );

        res.send(
          `Successfully updated profs for ${req.schools}. Added ${sumResponses} new professors`
        );
      } catch (error) {
        console.error("Error updating profs:", error);
        throw error;
      }
    }

    console.error(
      req.schools
        ? `Error for request: ${req.schools}`
        : "Error: empty body params"
    );

    console.log("Updating mongo with MCAS data");

    console.log("Getting prof data from BC website");
    let newProfData = await getMcasProfData();
    console.log("Completed fetching MCAS prof data");

    console.log("Starting updating professor data for MCAS");
    let newProfs = await updateCollection(
      newProfData,
      Professor,
      findOrCreateAndUpdateProf
    );
    console.log("Finished updating prof databse for MCAS");

    res.send(
      `Successfully updated MCAS professor databse. Added ${newProfs} new professors`
    );
  }
);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
