require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { nextError, nextMissed } = require("./routes/error/controller");
const { logger } = require("./functions/logger");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use(require("./routes/main"));

// error handler
app.use(nextError);
app.use(nextMissed);

// start server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
