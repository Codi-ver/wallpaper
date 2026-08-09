const path = require("path");
const fs = require("fs");
const adminController = require("./admins");
const wallpaperModel = require("../models/wallpaper");
const { CATEGORIES } = require("../utils/categories");

const COOKIE_MAX_AGE = 10 * 24 * 60 * 60 * 1000; // 10 days

function cleanupFile(file) {
  if (!file) return;
  try {
    fs.unlinkSync(path.join(__dirname, "..", "uploads", file.filename));
  } catch {
    /* ignore */
  }
}

// GET /panel/login
exports.loginPage = (req, res) => {
  res.render("admin/login", { title: "Admin login", error: null });
};

// POST /panel/login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const admin = await adminController.authenticate(identifier, password);
    const token = adminController.signToken(admin._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return res.redirect("/panel");
  } catch (err) {
    return res.status(401).render("admin/login", {
      title: "Admin login",
      error: err.message || "Login failed",
    });
  }
};

// GET /panel/logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

// GET /panel
exports.dashboard = async (req, res, next) => {
  try {
    const [wallpapers, total, aggDownloads, byCat] = await Promise.all([
      wallpaperModel.find().sort("-createdAt").limit(60).lean(),
      wallpaperModel.countDocuments(),
      wallpaperModel.aggregate([
        { $group: { _id: null, sum: { $sum: "$downloads" } } },
      ]),
      wallpaperModel.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            downloads: { $sum: "$downloads" },
          },
        },
      ]),
    ]);

    const catStats = CATEGORIES.map((c) => {
      const found = byCat.find((b) => b._id === c.key);
      return { ...c, count: found ? found.count : 0, downloads: found ? found.downloads : 0 };
    });

    res.render("admin/dashboard", {
      title: "Dashboard",
      categories: CATEGORIES,
      catStats,
      wallpapers,
      admin: res.locals.admin,
      total,
      totalDownloads: (aggDownloads[0] && aggDownloads[0].sum) || 0,
      success: req.query.success,
      error: req.query.error,
    });
  } catch (err) {
    next(err);
  }
};

// POST /panel/wallpaper  (multipart upload)
exports.uploadWallpaper = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) {
      return res.redirect(
        "/panel?error=" + encodeURIComponent("Please choose an image file"),
      );
    }
    if (!title || !category) {
      cleanupFile(req.file);
      return res.redirect(
        "/panel?error=" + encodeURIComponent("Title and category are required"),
      );
    }

    await wallpaperModel.create({
      title: title.trim(),
      description: (description || "").trim(),
      category,
      image: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    });
    return res.redirect("/panel?success=uploaded");
  } catch (err) {
    cleanupFile(req.file);
    return res.redirect("/panel?error=" + encodeURIComponent(err.message));
  }
};

// POST /panel/wallpaper/:id/delete
exports.deleteWallpaper = async (req, res, next) => {
  try {
    const w = await wallpaperModel.findByIdAndDelete(req.params.id);
    if (w && w.image) {
      try {
        fs.unlinkSync(path.join(__dirname, "..", "uploads", w.image));
      } catch {
        /* ignore */
      }
    }
    return res.redirect("/panel?success=deleted");
  } catch (err) {
    return res.redirect("/panel?error=" + encodeURIComponent(err.message));
  }
};
