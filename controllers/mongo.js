import mongoose from "mongoose";

// Digital Ocean mongodb url
const databaseURL =
  "mongodb+srv://eagle-eval-db-prod-3b6a0eee.mongo.ondigitalocean.com";

// Function to connect to the database
export async function connectToDatabase() {
  try {
    await mongoose.connect(databaseURL, {
      user: "dev-admin",
      pass: "b9pKv1sm865P0c42",
      dbName: "dev",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

// Function to close the database connection
export function closeDatabaseConnection() {
  // Close the Mongoose connection
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed.");
  });
}
