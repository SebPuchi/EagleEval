import consoleStamp from "console-stamp";
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../controllers/mongo.js";

// Create a middleware function to close the Mongoose connection
export const closeMongooseConnection = () => {
  // action after response
  var afterResponse = function () {
    // any other clean ups
    closeDatabaseConnection().then(() => {
      console.log("Closed mongodb connection.");
    });
  };

  // hooks to execute after response
  process.on("exit", afterResponse);
};

// Middleware to connect to the database
export const createMongooseConnection = async () => {
  // Establish a Mongoose connection
  await connectToDatabase();
};
