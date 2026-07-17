const { default: mongoose } = require("mongoose");
const categoryModel = require("../models/category");
//const f_validator = require("fastest-validator");
//const validator = new f_validator();

exports.getAll = async (req, res) => {
  const categories = await categoryModel.find({});
  return res.json(categories);
};

exports.create = async (req, res) => {
  try {
    const { title, href } = req.body;

    const isExistCategory = await categoryModel.findOne({ title });

    if (isExistCategory) {
      return res.status(400).json({ message: "This category exist !" });
    }

    const newCategory = await categoryModel.create({ title, href });

    return res.json(newCategory);
  }
  catch(err) {
    res.status(500).json({"Error ": err.message})
  }

};

exports.delete = async (req, res) => {
  try {
    const isExistCategory = await categoryModel.findById(req.params.id);

    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidId) {
      return res.status(400).json({ message: "Id is not valid !" });
    }

    if (!isExistCategory) {
      return res.status(404).json({ message: "Category not found !" });
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(
      req.params.id,
    );

    return res.json(deletedCategory);
  } catch (err) {
    return res.status(500).json(err);
  }
};