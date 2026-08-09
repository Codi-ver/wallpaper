const express = require("express");
const router = express.Router();
const panel = require("../controller/panel");
const authWeb = require("../middleware/authWeb");
const upload = require("../utils/uploads");

// Public panel routes (login + logout)
router.get("/login", panel.loginPage);
router.post("/login", panel.login);
router.get("/logout", panel.logout);

// Everything below requires an authenticated admin (cookie-based).
router.use(authWeb);

router.get("/", panel.dashboard);
router.post("/wallpaper", upload.single("wallpaper"), panel.uploadWallpaper);
router.post("/wallpaper/:id/delete", panel.deleteWallpaper);

module.exports = router;
