const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redis = require("./Redis");
const { getBrowserFingerprint } = require("../Middlewares/security");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// We don't need traditional session serialization since we're using JWT
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ googleId: profile.id });

        let user;
        if (existingUser) {
          user = existingUser;
        } else {
          // If user doesn't exist, create a new user
          user = await new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            // Add other fields as needed
          }).save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: "24h",
        });

        // Get browser fingerprint
        const fingerprint = getBrowserFingerprint(req);

        // Store session in Redis
        const sessionInfo = {
          token,
          browser: {
            name: fingerprint.browserName,
            version: fingerprint.browserVersion,
            os: fingerprint.os,
            device: fingerprint.device,
          },
          ip: fingerprint.ip,
          timestamp: Date.now(),
        };

        // Store in Redis with 24h expiry
        await redis.set(
          `user:${user._id}`,
          JSON.stringify(sessionInfo),
          "EX",
          60 * 60 * 24
        );

        // Pass both user and token to the callback
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
