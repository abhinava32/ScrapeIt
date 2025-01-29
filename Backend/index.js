const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const Redis = require("./Config/Redis");
const { securityMiddleware } = require("./Middlewares/security");

try {
  require("./Config/Mongoose")();
} catch (err) {
  console.log("Problem in connecting to the DB");
}

const app = express();
const PORT = 5000;

//for getting the ip address
app.set("trust proxy", true);
app.enable("trust proxy");
app.set("trust proxy", "loopback");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/", require("./Middlewares/isAuthenticated"));
app.use("/scrape", securityMiddleware);
app.use("/", require("./Routes"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
