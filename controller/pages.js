const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const wallpaperModel = require("../models/wallpaper");
const { getCategory } = require("../utils/categories");

const PER_PAGE = 18;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET / — landing page
exports.home = async (req, res, next) => {
  try {
    const [featured, recent, total] = await Promise.all([
      wallpaperModel.find().sort("-downloads").limit(8).lean(),
      wallpaperModel.find().sort("-createdAt").limit(11).lean(),
      wallpaperModel.countDocuments(),
    ]);
    res.render("home", { title: "Home", featured, recent, total });
  } catch (err) {
    next(err);
  }
};

// GET /explore
exports.explore = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * PER_PAGE;
    const [items, total] = await Promise.all([
      wallpaperModel.find().sort("-createdAt").skip(skip).limit(PER_PAGE).lean(),
      wallpaperModel.countDocuments(),
    ]);
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    res.render("explore", { title: "Explore", items, page, pages });
  } catch (err) {
    next(err);
  }
};

// GET /search?q=
exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    let items = [];
    if (q) {
      items = await wallpaperModel
        .find({ title: new RegExp(escapeRegExp(q), "i") })
        .sort("-createdAt")
        .limit(30)
        .lean();
    }
    res.render("search", { title: "Search", q, items });
  } catch (err) {
    next(err);
  }
};

// GET /category/:key
exports.category = async (req, res, next) => {
  try {
    const cat = getCategory(req.params.key);
    if (!cat) {
      return res.status(404).render("error", {
        title: "Not found",
        statusCode: 404,
        message: "That category does not exist.",
      });
    }
    const items = await wallpaperModel
      .find({ category: cat.key })
      .sort("-createdAt")
      .lean();
    res.render("category", { title: cat.label, cat, items });
  } catch (err) {
    next(err);
  }
};

// GET /wallpaper/:id
exports.detail = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next();
    const w = await wallpaperModel
      .findById(req.params.id)
      .populate("uploadedBy", "username name")
      .lean();
    if (!w) {
      return res.status(404).render("error", {
        title: "Not found",
        statusCode: 404,
        message: "That wallpaper could not be found.",
      });
    }
    const related = await wallpaperModel
      .find({ category: w.category, _id: { $ne: w._id } })
      .sort("-downloads")
      .limit(6)
      .lean();
    const cat = getCategory(w.category);
    res.render("detail", { title: w.title, w, related, cat });
  } catch (err) {
    next(err);
  }
};

// GET /wallpaper/:id/download
exports.download = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next();
    const w = await wallpaperModel.findById(req.params.id);
    if (!w) {
      return res.status(404).render("error", {
        title: "Not found",
        statusCode: 404,
        message: "That wallpaper could not be found.",
      });
    }
    const filePath = path.join(__dirname, "..", "uploads", w.image);
    if (!fs.existsSync(filePath)) {
      return res.status(404).render("error", {
        title: "File missing",
        statusCode: 404,
        message: "The image file is no longer available.",
      });
    }
    await wallpaperModel.updateOne({ _id: w._id }, { $inc: { downloads: 1 } });
    const downloadName =
      w.title.replace(/[^\w-]+/g, "_") + path.extname(w.image);
    return res.download(filePath, downloadName);
  } catch (err) {
    next(err);
  }
};

// GET /about
exports.about = (req, res) => {
  res.render("about", { title: "About" });
};
