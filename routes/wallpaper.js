const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const wallpaperController = require('../controller/wallpaper');
const uploadWallpaper = require('../utils/uploads');

const categoryHandlers = {
  nature: wallpaperController.getNatureWallpaper,
  cars: wallpaperController.getCarsWallpaepr,
  anime: wallpaperController.getAnimeWallpaper,
  animals: wallpaperController.getAnimalsWallpaper,
  flowers: wallpaperController.getFlowersWallpaper,
  space: wallpaperController.getSpaceWallpaper,
  city: wallpaperController.getCityWallpaper,
  sports: wallpaperController.getSportsWallpaper,
  technology: wallpaperController.getTechnologyWallpaper,
  cute: wallpaperController.getCuteWallpaper
};
getCarsWallpaper
router.route('/:category')
  .get((req, res, next) => {
    const { category } = req.params;
    const handler = categoryHandlers[category];
    
    if (!handler) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    handler(req, res, next);
  });

router.route('/')
  .post(authMiddleware, uploadWallpaper.single('wallpaper'), wallpaperController.upload);

router.route('/:id')
  .delete(authMiddleware, wallpaperController.delete);




module.exports = router;