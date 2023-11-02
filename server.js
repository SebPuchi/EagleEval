import "log-timestamp";
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ROUTES
import { fetch_router } from "./routes/fetch.js";
import { update_router } from "./routes/update.js";
import { search_router } from "./routes/search.js";
import { cache_router } from "./routes/cache.js";
import { scrape_router } from "./routes/scrape.js";

// MIDDLEWARE
import {
  createMongooseConnection,
  closeMongooseConnection,
} from "./middleware/mongoConnection.js";
import { handleCors } from "./middleware/cors.js";

const app = express();
const private_api = express();

// Compress responses
app.use(compression());

// Block ddos attempts
const limiter = rateLimit({
  windowMs: 1 * 60 * 100,
  max: 100,
});
app.use(limiter);

// Block bad requests
//app.use(helmet());

// handling CORS
app.use(handleCors);

// handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create link to Angular build directory
const distDir = __dirname + "/dist/eagle-eval";
app.use(express.static(distDir));

// Add routes for fetch
app.use("/api/fetch", fetch_router);

// Add routes for updating mongodb
private_api.use("/api/update", update_router);

// Add routes for searching database
app.use("/api/search", search_router);

// Add routes for cached reviews
app.use("/api/cache", cache_router);

// Add routes for scraping review
private_api.use("/api/scrape", scrape_router);

app.listen(process.env.PORT || 3000, () => {
  createMongooseConnection();
  console.log("Server listening on port ", process.env.PORT || "3000");
  // create process listener to close connection on exit
  closeMongooseConnection();
});

// Private routes only accessible locally
private_api.listen(8080, () => {
  createMongooseConnection();
  console.log("Private API listening on port 8080");
  // create process listener to close connection on exit
  closeMongooseConnection();
});
