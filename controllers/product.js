const Product = require("../models/product");
const User = require("../models/user");
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
    const { sort, order, page } = req.query;
    const currentPage = page || 1;
    const perPage = 3;
    let products = await Product.find({})
      .limit(parseInt(perPage))
      .skip((currentPage - 1) * perPage)
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

exports.productsCount = async (req, res) => {
  try {
    let count = await Product.find({}).estimatedDocumentCount().exec();
    res.json(count);
  } catch (error) {
    res.status(400).json({
      err: error.message,
    });
  }
};

exports.starRating = async (req, res) => {
  try {
    let productId = req.params.productId;
    const product = await Product.findById(productId).exec();
    const user = await User.findOne({ email: res.user.email }).exec();

    //Check if updating or new rating
    const { star } = req.body;
    let existingRatingObject = product.ratings.find(
      (item) => item.postedBy.toString() === user._id.toString()
    );
    if (existingRatingObject) {
      const productUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "rating.$.star": star } },
        { new: true }
      ).exec();
      res.json(productUpdated);
    } else {
      const ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star: star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      res.json(ratingAdded);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: error.message,
    });
  }
};
