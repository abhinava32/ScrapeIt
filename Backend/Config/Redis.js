const Redis = require("ioredis");

const redis = new Redis({
  port: 17359, // Redis port
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_SECRET,
});

redis
  .ping()
  .then(() => {
    console.log("Successfully connected to Redis");
  })
  .catch((error) => {
    console.error("Redis connection error:", error);
  });

module.exports = redis;
