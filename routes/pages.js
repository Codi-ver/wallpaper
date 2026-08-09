const express = require("express");
const router = express.Router();
const pages = require("../controller/pages");

// Public site
router.get("/", pages.home);
router.get("/explore", pages.explore);
router.get("/search", pages.search);
router.get("/category/:key", pages.category);
router.get("/wallpaper/:id/download", pages.download);
router.get("/wallpaper/:id", pages.detail);
router.get("/about", pages.about);

module.exports = router;
