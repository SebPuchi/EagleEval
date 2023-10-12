import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../controllers/mongo";

// Create a middleware function to close the Mongoose connection
const closeMongooseConnection = (req, res, next) => {
  // Close the Mongoose connection
  closeMongooseConnection();

  // Continue to the next middleware or route handler
  next();
};

// Middleware to connect to the database
const connectToDatabase = (req, res, next) => {
  // Establish a Mongoose connection
  connectToDatabase();

  // Continue to next route
  next();
};
