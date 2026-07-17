const wallpaperModel = require("../models/wallpaper");
const mongoose = require("mongoose");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please enter one wallpaper !" });
    }

    const { title, description, category } = req.body;

    const newWallpaper = await wallpaperModel.create({
      title,
      description,
      fileSize: req.file.size,
      category,
      uploadedBy: req.user._id,
    });

    return res.status(201).json(newWallpaper);
  } catch (err) {
    return res.status(500).json({ "❌ Error ": err.message });
  }
};

exports.delete = async (req, res) => {
  const wallpaperId = req.params.id;

  const isValidId = mongoose.Types.ObjectId.isValid(wallpaperId);

  if (!isValidId) {
    return res.status(400).json({ message: "Id is not valid !" });
  }

  const isExistWallpaper = await wallpaperModel.findById(req.params.id);

  if (!isExistWallpaper) {
    return res.status(404).json({ message: "Wallpaper not found !" });
  }

  const deletedWallpaper = await wallpaperModel.findByIdAndDelete(wallpaperId);

  return res.json(deletedWallpaper);
};

exports.getNatureWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "nature"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('nature', {wallpapers});
};


exports.getCarsWallpaepr = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "cars"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('cars', {wallpapers});
};

exports.getAnimeWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "anime"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('anime', {wallpapers});
};

exports.getAnimalsWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "animals"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('animals', {wallpapers});
};

exports.getFlowersWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "flowers"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('flowers', {wallpapers});
};

exports.getSpaceWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "space"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('space', {wallpapers});
};

exports.getCityWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "city"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('city', {wallpapers});
};

exports.getSportsWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "sports"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('sports', {wallpapers});
};

exports.getTechnologyWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "technology"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('technology', {wallpapers});
};

exports.getCuteWallpaper = async (res) => {
  const wallpapers = await wallpaperModel.find({category: "cute"});

  if (!wallpapers) {
    return res.status(404).json({message: "Not found any wallpaper !"})
  }

  res.render('cute', {wallpapers});
};