const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const fileTransport = new DailyRotateFile({
  dirname: path.join(__dirname, "..", "logs"),
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  zippedArchive: false,
  level: "info",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [fileTransport, new winston.transports.Console()],
});

module.exports = { logger };
