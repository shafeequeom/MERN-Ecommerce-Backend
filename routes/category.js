const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  create,
  read,
  update,
  remove,
  list,
} = require("../controllers/category");

//route
router.post("/category", authCheck, adminCheck, create);
router.get("/category/:slug", read);
router.get("/categories", list);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);

module.exports = router;
