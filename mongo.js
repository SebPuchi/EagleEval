// mongo.js
import MongoClient from "mongodb";

const uri =
  "mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database_name>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export async function closeMongoDBConnection() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}
