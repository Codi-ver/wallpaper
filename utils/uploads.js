const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    // NOTE: Date.now() must be called — the original code used `Date.now`
    // (without parentheses) which produced broken filenames.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "wallpaper-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, GIF and WebP images are allowed!"), false);
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB
};

const uploadWallpaper = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = uploadWallpaper;
