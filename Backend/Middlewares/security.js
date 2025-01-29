const UAParser = require("ua-parser-js");
const rateLimit = require("express-rate-limit");
const redis = require("../Config/Redis");

// Function to get browser fingerprint
const getBrowserFingerprint = (req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const browserInfo = parser.getBrowser();
  const osInfo = parser.getOS();
  const deviceInfo = parser.getDevice();

  return {
    browserName: browserInfo.name,
    browserVersion: browserInfo.version,
    os: `${osInfo.name} ${osInfo.version}`,
    device: deviceInfo.type || "desktop",
    ip:
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress,
  };
};

// Middleware to verify browser fingerprint
const verifyBrowserFingerprint = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const currentFingerprint = getBrowserFingerprint(req);
    const userKey = `user:${req.user}`;

    // Get stored session from Redis
    const storedSession = await redis.get(userKey);

    if (!storedSession) {
      return res.status(401).json({
        success: false,
        message: "No authorized session found",
      });
    }

    const sessionInfo = JSON.parse(storedSession);

    // Check if current fingerprint matches stored session
    const isSameBrowser =
      sessionInfo.browser.name === currentFingerprint.browserName &&
      sessionInfo.browser.version.split(".")[0] ===
        currentFingerprint.browserVersion.split(".")[0] &&
      sessionInfo.ip === currentFingerprint.ip;

    if (!isSameBrowser) {
      return res.status(401).json({
        success: false,
        message: `Unauthorized access: Session already active in ${sessionInfo.browser.name} on ${sessionInfo.browser.os}, ${sessionInfo.vendor} ${sessionInfo.browser.device}`,
      });
    }

    // Update last active timestamp
    sessionInfo.timestamp = Date.now();
    await redis.set(userKey, JSON.stringify(sessionInfo), "EX", 60 * 60 * 24); // 1 day expiry

    // console.log("Session verified:", {
    //   user: req.user,
    //   browser: currentFingerprint.browserName,
    //   ip: currentFingerprint.ip,
    // });

    next();
  } catch (error) {
    console.error("Session verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying session",
    });
  }
};

// Custom rate limiter using Redis
const createRateLimiter = () => {
  const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 8; // 8 requests per minute

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(501).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const key = `ratelimit:${req.user}`;
      const currentTime = Math.floor(Date.now() / 1000);

      // Create sliding window in Redis
      const pipeline = redis.pipeline();

      // Remove requests older than window size
      pipeline.zremrangebyscore(key, 0, currentTime - WINDOW_SIZE_IN_SECONDS);
      // Add current request
      pipeline.zadd(key, currentTime, `${currentTime}-${Math.random()}`);
      // Count requests in current window
      pipeline.zcard(key);
      // Set expiry on the set
      pipeline.expire(key, WINDOW_SIZE_IN_SECONDS);

      const results = await pipeline.exec();
      const requestCount = results[2][1];
      //   console.log("Request count:", requestCount);

      if (requestCount > MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later after a minute.",
          retryAfter: WINDOW_SIZE_IN_SECONDS,
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiting error:", error);
      next();
    }
  };
};

// Combine both middlewares
const securityMiddleware = [createRateLimiter(), verifyBrowserFingerprint];

// Function to clear rate limit for testing
const clearRateLimit = async (userId) => {
  try {
    await redis.del(`ratelimit:${userId}`);
    return true;
  } catch (error) {
    console.error("Error clearing rate limit:", error);
    return false;
  }
};

module.exports = {
  securityMiddleware,
  clearRateLimit,
  verifyBrowserFingerprint,
  createRateLimiter,
};
