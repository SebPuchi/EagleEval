// scrape.js - Scrapes review data from BC db
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { scrapeProfessors } from "../controllers/scrapeAPI.js";

export const scrape_router = express.Router();

// Scrape review for professors
// Loops through all professor reviews
scrape_router.post("/reviews", async (req, res) => {
  let result = validationResult(req);

  if (result.isEmpty()) {
    await scrapeProfessors();

    return res("Scraped professor reviews");
  }

  res.send("Invalid body params");
});
