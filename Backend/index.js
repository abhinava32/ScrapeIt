const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const cors = require("cors");
try {
  require("./Config/Mongoose")();
} catch (err) {
  console.log("Problem in connecting to the DB");
}

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/", require("./Middlewares/isAuthenticated"), require("./Routes"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
