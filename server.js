import { getReviews } from "./fetchReviews.js";
import "log-timestamp";
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

// handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// route for handling requests from the Angular client
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the Express server!" });
});

// route to fetching review data from api for a certain query
app.post(
  "/api/fetch/reviews",
  body("fetch_query").trim().notEmpty().escape(),
  async (req, res) => {
    const result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      const data = matchedData(req);

      // Query string from body (Class code or professor name)
      let query = data.fetch_query;
      console.log("Processing response for query: " + query);

      // Wait for response from bc reviews
      let [fetch_response, row_ids] = await getReviews(query);

      console.log("Successfully fetched reviews for: " + data.fetch_query);
      return res.send({ fetch_response, row_ids });
    }

    console.error(
      req.body.fetch_query
        ? "Error for query: " + req.body.fetch_query
        : "Error: empty fetch query"
    );
    res.send("Invalid body params: fetch_query must not be empty");
  }
);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
