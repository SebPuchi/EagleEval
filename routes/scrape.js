// scrape.js - Scrapes review data from BC db
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { getReviews } from "../controllers/fetchReviews.js";
import { getDrillDown } from "../controllers/fetchDrillDown.js";
import { cacheReviews } from "../controllers/cacheReviews.js";
import { cacheDrilldown } from "../controllers/cacheDrilldown.js";

export const scrape_router = express.Router();

// Scrape review for professors
// Loops through all professor reviews
