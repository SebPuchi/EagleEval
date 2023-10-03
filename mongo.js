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

// Get the default connection
const db = mongoose.connection;

// Event listeners for successful and failed connection
db.on("connected", () => {
  console.log(`Connected to MongoDB at ${databaseURL}`);
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Close the Mongoose connection when the Node.js process exits
process.on("SIGINT", () => {
  db.close(() => {
    console.log("Mongoose connection closed due to application termination");
    process.exit(0);
  });
});
