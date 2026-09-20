const CategoryModel = require("../../models/admins/category.model");
const { logError } = require("../../config/utill/logErr");

exports.getCategories = async (req, res) => {
  try {
    const data = await CategoryModel.getAll();
    res.json({ data });
  } catch (err) {
    logError("categories.controller", err, res);
  }
};

exports.addCategories = async (req, res) => {
  try {
    const data = await CategoryModel.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    logError("categories.controller", err, res);
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const data = await CategoryModel.update(req.body);
    res.json({ success: true, data });
  } catch (err) {
    logError("categories.controller", err, res);
  }
};

exports.deleteCategories = async (req, res) => {
  try {
    const data = await CategoryModel.remove(req.body.id);
    res.json({ success: true, data });
  } catch (err) {
    logError("categories.controller", err, res);
  }
};
