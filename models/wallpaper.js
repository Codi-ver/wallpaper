const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      // filename stored under /uploads
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    category: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "nature",
        "cars",
        "anime",
        "animals",
        "flowers",
        "space",
        "city",
        "sports",
        "technology",
        "cute",
      ],
    },
  },
  { timestamps: true },
);

const model = mongoose.model("Wallpaper", schema);

module.exports = model;
