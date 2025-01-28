const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET;
const User = require("../Models/users");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.auth_token;
  // const ip =
  //   req.ip ||
  //   req.headers["x-forwarded-for"]?.split(",")[0] ||
  //   req.socket.remoteAddress ||
  //   "Unknown";
  // console.log("IP: ", ip);
  if (!token) {
    return next();
  }
  let decoded;
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata", hour12: false };
    const istDateTime = now.toLocaleString("en-IN", options);
    console.log(istDateTime, ": invalid cookie from ", ip);
  }

  const user = await User.findById(decoded.id);

  if (user) {
    req.user = decoded.id;
    req.userDetails = user;
    return next();
  }
};

module.exports = isAuthenticated;
