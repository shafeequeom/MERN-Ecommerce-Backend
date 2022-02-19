const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const Coupon = require("../models/coupon");

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  let products = [];
  const user = await User.findOne({ email: res.user.email }).exec();

  let cartExist = await Cart.findOne({ orderBy: user._id }).exec();
  if (cartExist) {
    cartExist.remove();
  }
  let total = 0;
  for (let p of cart) {
    let object = { count: p.count, product: p._id, color: p.color };
    const { price } = await Product.findById(p._id);
    object.price = price;
    products.push(object);
    total += price * p.count;
  }

  let newCart = await new Cart({
    products: products,
    cartTotal: total,
    orderBy: user._id,
  }).save();

  res.json({ ok: true, cart: newCart });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: res.user.email }).exec();

  let cart = await Cart.findOne({ orderBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;

  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: res.user.email }).exec();

  let cart = await Cart.findOneAndRemove({ orderBy: user._id }).exec();

  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: res.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.applyCoupon = async (req, res) => {
  try {
    const { coupon } = req.body;

    const validCoupon = await Coupon.findOne({ name: coupon }).exec();
    console.log(validCoupon);
    if (validCoupon == null) {
      return res.json({
        err: "Invalid coupon",
      });
    }

    const user = await User.findOne({ email: res.user.email }).exec();
    console.log(user);

    let { products, cartTotal } = await Cart.findOne({ orderBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

    console.log(cartTotal);

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    console.log(totalAfterDiscount);

    const cart = await Cart.findOneAndUpdate(
      { orderBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ).exec();

    console.log(cart);

    res.json(cart);
  } catch (error) {
    console.log(error);
  }
};
