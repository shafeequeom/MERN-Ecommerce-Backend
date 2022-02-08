const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { create, listAll } = require("../controllers/product");

//route
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);

module.exports = router;
