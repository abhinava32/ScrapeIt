const mongoose = require("mongoose");

// Get connection string from environment variable

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 10,
    retryWrites: true,
    dbName: "S2Ddb1",
  };
  const DB_URI = process.env.DB_URI;

  if (!DB_URI) {
    console.error("MONGODB_URI environment variable is not defined");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(DB_URI, options);

    console.log(`MongoDB Connected: ${connection.connection.host}`);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    // Handle application termination
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("Mongoose connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error closing Mongoose connection:", err);
        process.exit(1);
      }
    });

    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
