// Creating the logger file using winston
const { createLogger, transports, format, exitOnError } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // file logs
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),

    // Mongodb logs
    new transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "logs",
      level: "error",
      tryReconnect: true,
    }),
  ],
  exitOnError: false,
});

// Handling uncaught exceptions
logger.exceptions.handle(
  new transports.File({ filename: "logs/exceptions.log" })
);

//  unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  throw reason;
});

// Stream form morgan
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
