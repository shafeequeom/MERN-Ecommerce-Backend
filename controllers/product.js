const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const product = await new Product(req.body).save();
    res.json(product);
  } catch (error) {
    console.log(error);
    // res.status(400).send("Create category failed");
    res.status(400).json({
      err: error.message,
    });
  }
};

exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subCategories")
      .sort([["created_at", "asc"]])
      .exec();
    res.json(products);
  } catch (error) {
    res.status(400).json({
      err: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    let deleted = await Product.findOneAndRemove({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).json({
      err: error.message,
    });
  }
};

exports.read = async (req, res) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subCategories")
      .exec();
    res.json(product);
  } catch (error) {
    res.status(400).json({
      err: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: error.message,
    });
  }
};

exports.list = async (req, res) => {
  try {
    const { sort, order, limit } = req.query;
    let products = await Product.find({})
      .limit(parseInt(limit))
      .populate("category")
      .populate("subCategories")
      .sort([[sort, order]])
      .exec();
    res.json(products);
  } catch (error) {
    res.status(400).json({
      err: error.message,
    });
  }
};
