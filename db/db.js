// Creating the database connection using winston
const mongoose = require("mongoose");
const logger = require("../services/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("✅ MongoDB connected successfully.");
  } catch (error) {
    logger.error("❌ MongoDB connection error.", error);
    process.exit(1);
  }

  // Extra even for debugging
  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDb reconnected.");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB runtime error: ", err);
  });
};

module.exports = connectDB;
