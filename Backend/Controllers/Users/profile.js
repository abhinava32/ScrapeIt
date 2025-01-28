const User = require("../../Models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET;
const redis = require("../../Config/Redis");
const UAParser = require("ua-parser-js");

const createProfile = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      message: "User already logged in",
      user: req.user,
    });
  }

  let hashedPassword = "";
  try {
    const salt = await bcrypt.genSalt(10);
    // const salt = 10;
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  } catch (err) {
    return res.status(500).json({
      message: "Error in hashing password",
      details: err.message,
    });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    avatar: req.body.avatar,
  });

  try {
    await user.save();
    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in creating user",
      details: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User not logged in",
    });
  }

  const user = await User.findById(req.user);

  return res.status(200).json({
    message: "Processed info successfully",
    data: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      id: user._id,
    },
  });
};

const storeUserLoginInfo = async (user, req) => {
  try {
    const userKey = `user:${user._id}`;

    // Parse user agent
    const parser = new UAParser(req.headers["user-agent"]);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    const ip = req.ip || req.connection.remoteAddress;

    // Create a unique key for this login session
    const loginTimestamp = new Date().getTime();
    const sessionKey = `${ip}-${loginTimestamp}`;

    // Create login session object with detailed browser info
    const loginInfo = {
      ip: ip,
      browser: {
        name: browserInfo.name,
        version: browserInfo.version,
        os: `${osInfo.name} ${osInfo.version}`,
        device: deviceInfo.type || "desktop",
        vendor: deviceInfo.vendor || "unknown",
      },
      timestamp: loginTimestamp,
    };

    // Store using Redis
    await redis.set(userKey, JSON.stringify(loginInfo));

    // Set expiry (30 days)
    await redis.expire(userKey, 60 * 60 * 24 * 30);

    return true;
  } catch (error) {
    console.error("Redis storage error:", error);
    return false;
  }
};

const signIn = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      message: "User already logged in",
      user: req.user,
    });
  }
  try {
    // Assume user is validated here
    const user = await User.findOne({ email: req.body.email }).select(
      "name email password avatar"
    );
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(200).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    await storeUserLoginInfo(user, req);

    // Create token
    const token = jwt.sign({ id: user._id }, jwtKey);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // Prevents JavaScript access to cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Protection against CSRF
      maxAge: 12 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: "/", // Path for which the cookie is valid
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.DOMAIN
          : "localhost", // Domain for which the cookie is valid
    };

    // Set the cookie
    res.cookie("auth_token", token, cookieOptions);
    // Send response
    return res.status(200).json({
      success: true,
      message: "Successfully signed in",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Sign-in failed",
      error: error.message,
    });
  }
};

const getUserLoginHistory = async (userId) => {
  try {
    const userKey = `user:${userId}`;
    const loginHistory = await redis.hgetall(userKey);

    // Parse the stored JSON strings back to objects
    return Object.entries(loginHistory).map(([key, value]) => {
      return JSON.parse(value);
    });
  } catch (error) {
    console.error("Error fetching login history:", error);
    return [];
  }
};

const signOut = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User not logged in",
    });
  }
  req.user = null;
  const token = await jwt.sign({}, process.env.JWT_SECRET, { expiresIn: 1 });
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 1,
  });

  return res.status(200).json({
    message: "User logged out successfully",
  });
};

module.exports = {
  createProfile,
  getProfile,
  signIn,
  signOut,
};
