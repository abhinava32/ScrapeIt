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

    const getCookieConfig = () => {
      const isProduction = process.env.NODE_ENV === "production";

      return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 12 * 60 * 60 * 1000, //12 hours
        path: "/",
        ...(isProduction && { domain: process.env.DOMAIN }),
      };
    };

    // Set the cookie
    res.cookie("auth_token", token, getCookieConfig());
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

const signOut = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User not logged in",
    });
  }

  try {
    // Clear Redis data if exists
    const userKey = `user:${req.user}`;
    await redis.del(userKey);

    // Clear the cookie properly
    const getCookieConfig = () => {
      const isProduction = process.env.NODE_ENV === "production";
      return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        expires: new Date(0), // This ensures the cookie is immediately expired
        path: "/",
        ...(isProduction && { domain: process.env.DOMAIN }),
      };
    };

    // Clear the auth token
    res.clearCookie("auth_token", getCookieConfig());

    // Clear user from request
    req.user = null;

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  signIn,
  signOut,
};
