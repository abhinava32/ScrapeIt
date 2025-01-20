const mongoose = require("mongoose");

const websiteData = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const WebsiteData = mongoose.model("WebsiteData", websiteData);
module.exports = WebsiteData;
