const router = require("express").Router();
const { ask } = require("../Controllers/AI/aiapi");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

router.post(
  "/scrape",

  ask
);

module.exports = router;
