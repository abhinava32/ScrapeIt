const express = require("express");

require("dotenv").config();

const cors = require("cors");
try {
  require("./Config/Mongoose")();
} catch (err) {
  console.log("Problem in connecting to the DB");
}

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/", require("./Routes"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
