import mongoose from "mongoose";

// app.js
import { config } from "../config/mongoConfig.js";

// Access MongoDB username and password
const username = config.mongodb.username;
const password = config.mongodb.password;

// Digital Ocean mongodb url
const databaseURL =
  "mongodb+srv://eagleevaldata.gxxyol0.mongodb.net/?retryWrites=true&w=majority";

// Function to connect to the database
export async function connectToDatabase() {
  try {
    await mongoose.connect(databaseURL, {
      user: username,
      pass: password,
      dbName: "prod",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

// Function to close the database connection
export async function closeDatabaseConnection() {
  console.log("Mongoose connection closing.");
  // Close the Mongoose connection
  await mongoose.connection.close();
}
