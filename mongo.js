// mongo.js
import MongoClient from "mongodb";

const uri =
  "mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database_name>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create connection to mongodb
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Close connection
export async function closeMongoDBConnection() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

// Function to create a MongoDB document from a JSON object.
async function createDocumentFromJSON(jsonData) {
  try {
    // Create a new MongoDB client with specified options for connection.
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the MongoDB database.
    await client.connect();

    // Get a reference to the MongoDB collection.
    const collection = client.db().collection(collectionName);

    // Insert the JSON data into the collection.
    const result = await collection.insertOne(jsonData);

    console.log("Document inserted with ID:", result.insertedId);
  } catch (error) {
    console.error("Error creating MongoDB document:", error);
  } finally {
    // Close the MongoDB client connection.
    client.close();
  }
}
