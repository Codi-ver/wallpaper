const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

const { CATEGORIES, getCategory } = require("./utils/categories");

// ---- View engine ----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---- Parsers ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---- Static ----
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- Global view locals ----
app.use((req, res, next) => {
  res.locals.categories = CATEGORIES;
  res.locals.catOf = (key) => getCategory(key) || { key, label: key, emoji: "", gradient: "#444" };
  res.locals.admin = null;
  res.locals.path = req.path;
  res.locals.q = req.query.q || "";
  res.locals.formatBytes = (b) => {
    if (!b) return "—";
    const u = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(1024));
    return (b / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + u[i];
  };
  res.locals.formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };
  next();
});

// ---- Routes ----
const pagesRoute = require("./routes/pages");
const panelRoute = require("./routes/panel");
const categoryRoute = require("./routes/category");
const adminRoute = require("./routes/admin");
const wallpaperRoute = require("./routes/wallpaper");

app.use("/", pagesRoute);
app.use("/panel", panelRoute);
app.use("/api/category", categoryRoute);
app.use("/api/admin", adminRoute);
app.use("/api/wallpaper", wallpaperRoute);

// ---- 404 ----
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not found",
    statusCode: 404,
    message: "The page you are looking for has drifted into deep space.",
  });
});

// ---- Error handler ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("error", {
    title: "Server error",
    statusCode: 500,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong on our side.",
  });
});

module.exports = app;
