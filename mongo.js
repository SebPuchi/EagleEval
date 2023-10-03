import mongoose from "mongoose";

// Replace 'your_database_url' with your MongoDB database URL
const databaseURL = "mongodb://localhost:27017/your_database_name";

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
