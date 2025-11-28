import mongoose from "mongoose";
import logger from "../utils/monitoring/logger.js";

export const connectDB = async () => {
  const maxRetries = 5;
  const retryDelay = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const uri = process.env.MONGODB_URI;

      if (!uri) {
        throw new Error("❌ MONGODB_URI not found in .env file");
      }

      logger.info(`📡 Attempt ${attempt}/${maxRetries}: Connecting to MongoDB Atlas...`);

      // Connect with proper options
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
      });

      // Verify connection
      if (mongoose.connection.readyState !== 1) {
        throw new Error(`Connection state is ${mongoose.connection.readyState}, expected 1`);
      }
      
      logger.info(`✅ MongoDB connected successfully to ${mongoose.connection.host}`);
      logger.info(`✅ Database: ${mongoose.connection.name}`);
      logger.info(`✅ ReadyState: ${mongoose.connection.readyState}`);

      return;
    } catch (error) {
      logger.error(`❌ Connection attempt ${attempt} failed: ${error.message}`);
      
      // Log more details for specific errors
      if (error.name === 'MongoServerSelectionError') {
        logger.error('💡 Server selection failed - check:');
        logger.error('1. MongoDB Atlas cluster is active (not paused)');
        logger.error('2. IP address is whitelisted in Network Access');
        logger.error('3. Database user credentials are correct');
      }

      if (attempt === maxRetries) {
        logger.error("❌ All connection attempts failed");
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${error.message}`);
        // attempt = 0;
      }

      logger.info(`⏳ Retrying in ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};
