const express = require("express");

const router = express.Router();

//route
router.get("/test", (req, res) => {
  res.json({
    data: "hey you hit api test",
  });
});

module.exports = router;
