const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck } = require("../middlewares/auth");

//Controllers
const { createOrUpdateUser, currentUser } = require("../controllers/auth");

//route
router.post("/user", authCheck, createOrUpdateUser);
router.post("/user/current", authCheck, currentUser);

module.exports = router;
