const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cheerio = require("cheerio");
const cors = require("cors");
const { getExampleNumber, getMetadata } = require("libphonenumber-js");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const getAddress = async (link) => {
  const addresses = [];

  // Search for common address-related elements
  console.log("passed this function");
  const potentialAddressElements = $("p, address, div, span");

  // Iterate through these elements to find address-like content
  potentialAddressElements.each((i, elem) => {
    const text = $(elem).text().trim();

    // Check if the text contains address-like patterns or keywords
    if (
      text.match(/\d{1,4}\s[A-Za-z0-9\s.,-]+(?:[A-Za-z]{2,})?[-\s]*\d+/) ||
      text.toLowerCase().includes("address") ||
      text.toLowerCase().includes("contact") ||
      text.toLowerCase().includes("headquaters") ||
      text.toLowerCase().includes("location")
    ) {
      // If it looks like an address, add it to the list
      fs.appendFile("addresses.txt", text, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
      });
    }
  });
};

app.use("/", require("./Routes"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
