const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    console.log(req.body);
    const product = await new Product(req.body).save();
    res.json(product);
  } catch (error) {
    res.status(400).send("Create category failed");
  }
};
