const { createClient } = require("redis");
const { logger } = require("./logger");

const redis = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

(async () => {
  try {
    await redis.connect();
    logger.info("Redis connected.");
  } catch (err) {
    logger.error(`Error connecting to the cache: ${err.message}`);
  }
})();

redis.on("error", (err) => {
  logger.error(`Error connecting to the cache: ${err.message}`);
});

module.exports = { redis };
