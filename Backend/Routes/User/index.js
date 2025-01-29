const Router = require("express").Router();
const {
  createProfile,
  signIn,
  signOut,
  getProfile,
} = require("../../Controllers/Users/profile");

Router.get("/", (req, res) => {
  res.send("Hello World!");
});

Router.post("/register", createProfile);
Router.get("/logout", signOut);
Router.post("/login", signIn);
Router.get("/profile", getProfile);

module.exports = Router;
