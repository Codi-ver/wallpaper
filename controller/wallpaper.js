const wallpaperModel = require("../models/wallpaper");
const mongoose = require("mongoose");

// Shared creation logic used by both the JSON API and the web panel.
exports.createWallpaper = async (req) => {
  if (!req.file) {
    const err = new Error("Please choose a wallpaper image");
    err.status = 400;
    throw err;
  }

  const { title, description, category } = req.body;
  if (!title || !category) {
    const err = new Error("Title and category are required");
    err.status = 400;
    throw err;
  }

  return wallpaperModel.create({
    title: title.trim(),
    description: (description || "").trim(),
    category,
    image: req.file.filename,
    fileSize: req.file.size,
    uploadedBy: req.user && req.user._id,
  });
};

// Shared delete logic (also removes nothing on disk here; caller decides).
exports.deleteWallpaper = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }
  const wallpaper = await wallpaperModel.findById(id);
  if (!wallpaper) {
    const err = new Error("Wallpaper not found");
    err.status = 404;
    throw err;
  }
  await wallpaperModel.findByIdAndDelete(id);
  return wallpaper;
};

// ---- JSON API handlers ----

exports.upload = async (req, res) => {
  try {
    const wallpaper = await exports.createWallpaper(req);
    return res.status(201).json(wallpaper);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const wallpaper = await exports.deleteWallpaper(req.params.id);
    return res.json(wallpaper);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const items = await wallpaperModel
      .find(filter)
      .sort("-createdAt")
      .limit(50)
      .lean();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
