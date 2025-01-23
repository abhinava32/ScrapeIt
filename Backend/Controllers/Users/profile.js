const User = require("../../Models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET;

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
    user,
  });
};

const signIn = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      message: "User already logged in",
      user: req.user,
    });
  }
  console.log("signing in initiated...");
  try {
    // Assume user is validated here
    const user = await User.findOne({ email: req.body.email }).select(
      "name email password avatar"
    );
    console.log("user found", user);
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    console.log("password matched");
    // Create token
    const token = jwt.sign({ id: user._id }, jwtKey);
    console.log("token created", token);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // Prevents JavaScript access to cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Protection against CSRF
      maxAge: 12 * 60 * 60 * 1000, // 24 hours in milliseconds
    };

    // Set the cookie
    res.cookie("auth_token", token, cookieOptions);
    console.log("Cookie set successfully");
    // Send response
    return res.status(200).json({
      success: true,
      message: "Successfully signed in",
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
