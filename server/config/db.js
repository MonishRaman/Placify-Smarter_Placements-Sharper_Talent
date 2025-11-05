import mongoose from "mongoose";
// Importing the database URI from environment configuration
import { MONGO_URI } from "./env.js";
import logger from '../utils/logger.js';

// Exit early if the environment variable is missing
if (!MONGO_URI) {
  logger.error("❌ MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Asynchronous function to connect to the MongoDB database
const connectToDatabase = async () => {
  try {
    // Attempt to connect to the database using the provided URI
    await mongoose.connect(MONGO_URI);
    logger.debug("💽 Connected to DataBase");
  } catch (error) {
    // Log error message if connection fails
    logger.debug("Error connecting to Database");
    logger.debug(error);

    // Exit the process with a failure code
    process.exit(1);
  }
};

export default connectToDatabase;
