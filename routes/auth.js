const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck } = require("../middlewares/auth");

//Controllers
const { createOrUpdateUser } = require("../controllers/auth");

//route
router.post("/user", authCheck, createOrUpdateUser);

module.exports = router;
