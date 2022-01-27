const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { create } = require("../controllers/product");

//route
router.post("/product", authCheck, adminCheck, create);

module.exports = router;
