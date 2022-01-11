const express = require("express");

const router = express.Router();

const { createOrUpdateUser } = require("../controllers/auth");

//route
router.get("/user", createOrUpdateUser);

module.exports = router;
