import mongoose from "mongoose";

// Function to connect to the database
export async function connectToDatabase(databaseURL) {
  try {
    await mongoose.connect(databaseURL, {
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
  mongoose.connection.close(() => {
    console.log("Database connection closed");
  });
}
