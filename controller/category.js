const { default: mongoose } = require("mongoose");
const categoryModel = require("../models/category");

exports.getAll = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, href } = req.body;

    const isExistCategory = await categoryModel.findOne({ title });
    if (isExistCategory) {
      return res.status(400).json({ message: "This category already exists!" });
    }

    const newCategory = await categoryModel.create({ title, href });
    return res.status(201).json(newCategory);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const isValidId = mongoose.isValidObjectId(req.params.id);
    if (!isValidId) {
      return res.status(400).json({ message: "Id is not valid!" });
    }

    const isExistCategory = await categoryModel.findById(req.params.id);
    if (!isExistCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
    return res.json(deletedCategory);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
