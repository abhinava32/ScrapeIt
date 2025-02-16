const mongoose = require("mongoose");

const websiteData = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
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
