import {
  connectToDatabase,
  closeDatabaseConnection,
} from '../controllers/mongo';

// Create a middleware function to close the Mongoose connection
export const closeMongooseConnection = () => {
  // action after response
  const afterResponse = () => {
    // any other clean ups
    closeDatabaseConnection().then(() => {
      console.log('Closed mongodb connection.');
    });
  };

  // hooks to execute after response
  process.on('exit', afterResponse);
};

// Middleware to connect to the database
export const createMongooseConnection = async () => {
  // Establish a Mongoose connection
  await connectToDatabase();
};
