const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck } = require("../middlewares/auth");

//Controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCoupon,
  createOrder,
  getOrders,
} = require("../controllers/user");

//route
router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

//Coupon
router.post("/user/coupon", authCheck, applyCoupon);

//Coupon
router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, getOrders);

module.exports = router;
