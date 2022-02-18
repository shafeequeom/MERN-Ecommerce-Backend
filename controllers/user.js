const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");

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
