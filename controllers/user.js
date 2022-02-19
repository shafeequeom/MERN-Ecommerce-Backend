const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  let products = [];
  const user = await User.findOne({ email: res.user.email }).exec();

  let cartExist = await Cart.findOne({ orderedBy: user._id }).exec();
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
    orderedBy: user._id,
  }).save();

  res.json({ ok: true, cart: newCart });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: res.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;

  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: res.user.email }).exec();

  let cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();

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
    if (validCoupon == null) {
      return res.json({
        err: "Invalid coupon",
      });
    }

    const user = await User.findOne({ email: res.user.email }).exec();

    let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    const cart = await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ).exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body.stripeResponse;

    const user = await User.findOne({ email: res.user.email }).exec();

    let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

    let newOrder = await new Order({
      products,
      paymentIntent,
      orderedBy: user._id,
    }).save();

    //Increment sold and decrement quantity
    let bulkOptions = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    await Product.bulkWrite(bulkOptions, {});

    res.json({ ok: true, order: newOrder });
  } catch (error) {
    console.log(error);
  }
};
