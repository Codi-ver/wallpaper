require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const adminModel = require("./models/admins");
const wallpaperModel = require("./models/wallpaper");
const { CATEGORIES } = require("./utils/categories");

const DEFAULT_ADMIN = {
  name: "Site Admin",
  username: "admin",
  email: "admin@wallpaper.test",
  phone: "0000000000",
  password: "admin123",
};

const BLURBS = {
  nature: "Drift into calm valleys, misty peaks and quiet forests.",
  cars: "Sleek lines, raw power and the rush of the open road.",
  anime: "Vivid worlds and characters pulled straight from your favourite scenes.",
  animals: "Wild, wonderful and full of personality — straight from nature.",
  flowers: "Soft petals and saturated colour for a fresh, lively screen.",
  space: "Stars, nebulae and the endless depth of the cosmos.",
  city: "Glowing skylines and neon streets that never sleep.",
  sports: "Frozen moments of grit, speed and victory.",
  technology: "Crisp gear, glowing setups and the future rendered in pixels.",
  cute: "A little dose of adorable to brighten every unlock.",
};

async function ensureAdmin() {
  let admin = await adminModel.findOne({
    $or: [{ email: DEFAULT_ADMIN.email }, { username: DEFAULT_ADMIN.username }],
  });
  if (!admin) {
    admin = await adminModel.create({
      ...DEFAULT_ADMIN,
      password: await bcrypt.hash(DEFAULT_ADMIN.password, 10),
    });
    console.log(`✅ Created default admin → ${DEFAULT_ADMIN.username} / ${DEFAULT_ADMIN.password}`);
  } else {
    console.log("ℹ️  Admin already exists, skipping.");
  }
  return admin;
}

async function seedWallpapers(admin) {
  const count = await wallpaperModel.countDocuments();
  if (count > 0) {
    console.log(`ℹ️  Already have ${count} wallpapers, skipping seed.`);
    return;
  }

  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    console.log("⚠️  No uploads directory found, nothing to seed.");
    return;
  }

  // Grab the existing (junk-named) uploads and give them clean names.
  let files = fs
    .readdirSync(uploadsDir)
    .filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log("⚠️  No image files found in uploads/, nothing to seed.");
    return;
  }

  const renamed = [];
  files.forEach((file, i) => {
    const ext = path.extname(file);
    const clean = `seed-${String(i + 1).padStart(2, "0")}${ext}`;
    if (file !== clean) {
      fs.renameSync(path.join(uploadsDir, file), path.join(uploadsDir, clean));
    }
    renamed.push({ name: clean, idx: i });
  });

  const docs = renamed.map(({ name, idx }) => {
    const cat = CATEGORIES[idx % CATEGORIES.length];
    const n = idx + 1;
    let size = 0;
    try {
      size = fs.statSync(path.join(uploadsDir, name)).size;
    } catch {
      /* ignore */
    }
    return {
      title: `${cat.label} ${n}`,
      description: BLURBS[cat.key] || "A stunning wallpaper for your screen.",
      image: name,
      category: cat.key,
      fileSize: size,
      downloads: (idx * 37) % 600,
      uploadedBy: admin._id,
    };
  });

  await wallpaperModel.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} wallpapers across ${CATEGORIES.length} categories.`);
}

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set (check your .env / environment).");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🌱 Seed connected to MongoDB");

  const admin = await ensureAdmin();
  await seedWallpapers(admin);

  await mongoose.disconnect();
  console.log("🌱 Seed finished");
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
