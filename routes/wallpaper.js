const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const wallpaperController = require("../controller/wallpaper");
const uploadWallpaper = require("../utils/uploads");

// JSON API for wallpapers.
router
  .route("/")
  .get(wallpaperController.list)
  .post(authMiddleware, uploadWallpaper.single("wallpaper"), wallpaperController.upload);

router.route("/:id").delete(authMiddleware, wallpaperController.remove);

module.exports = router;
