import "log-timestamp";
import express from "express";
import bodyParser from "body-parser";
import { ConsoleLogger } from "@angular/compiler-cli";

// ROUTES
import { fetch_router } from "./routes/fetch.js";
import { update_router } from "./routes/update.js";
import { search_router } from "./routes/search.js";
// MIDDLEWARE
import {
  cerateMongooseConnection,
  closeMongooseConnection,
} from "./middleware/mongoConnection.js";
import { handleCors } from "./middleware/cors.js";

const app = express();

// handling CORS
app.use(handleCors);

// handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to connect to MongoDB when the server starts
app.use(cerateMongooseConnection);

// Add routes for fetch
app.use("/api/fetch", fetch_router);

// Add routes for updating mongodb
app.use("/api/update", update_router);

// Add routes for searching database
app.use("/api/search", search_router);

// Use the middleware to automatically close the connection
app.use(closeMongooseConnection);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
