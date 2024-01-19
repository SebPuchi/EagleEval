import 'log-timestamp';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Import routes and middleware
import { fetch_router } from './routes/fetch';
import { update_router } from './routes/update';
import { search_router } from './routes/search';
/*
import { cache_router } from './routes/cache';
import { scrape_router } from './routes/scrape';
*/
import {
  createMongooseConnection,
  closeMongooseConnection,
} from './middleware/mongoConnection';
import { handleCors } from './middleware/cors';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express application
const app = express();
const private_api = express();

// Helmet to protect from expolits
app.use(helmet());

// Block ddos attempts
const limiter = rateLimit({
  windowMs: 1 * 60 * 100,
  max: 100,
});
app.use(limiter);

// Handling CORS
app.use(handleCors);

// Handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create link to Angular build directory
const distDir = path.join(__dirname, '/dist/eagle-eval');
app.use(express.static(distDir));

// Add routes for fetch
app.use('/api/fetch', fetch_router);

// Add routes for updating mongodb
private_api.use('/api/update', update_router);

// Add routes for searching database
app.use('/api/search', search_router);
/*
// Add routes for cached reviews
app.use('/api/cache', cache_router);

// Add routes for scraping review
private_api.use('/api/scrape', scrape_router);
*/
const port = process.env['PORT'] || 80;
const privatePort = 8080;

app.listen(port, () => {
  createMongooseConnection();
  console.log(`Server listening on port ${port}`);
  // Create process listener to close connection on exit
  closeMongooseConnection();
});

// Private routes only accessible locally
private_api.listen(privatePort, () => {
  createMongooseConnection();
  console.log(`Private API listening on port ${privatePort}`);
  // Create process listener to close connection on exit
  closeMongooseConnection();
});
