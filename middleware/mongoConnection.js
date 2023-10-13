import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../controllers/mongo.js";

// Create a middleware function to close the Mongoose connection
export const closeMongooseConnection = (req, res, next) => {
  // Close the Mongoose connection
  closeDatabaseConnection();

  // Continue to the next middleware or route handler
  next();
};

// Middleware to connect to the database
export const cerateMongooseConnection = async (req, res, next) => {
  // Establish a Mongoose connection
  await connectToDatabase();

  // Continue to next route
  next();
};
