const Category = require("../models/category");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (error) {
    res.status(400).send("Create category failed");
  }
};
exports.read = async (req, res) => {
  const data = await Category.findOne({ slug: req.params.slug });
  res.json(data);
};
exports.remove = async (req, res) => {
  try {
    const data = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(data);
  } catch (error) {
    res.status(400).send("Delete category failed");
  }
};
exports.list = async (req, res) => {
  const data = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.json(data);
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const data = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(data);
  } catch (error) {
    res.status(400).send("Update category failed");
  }
};
