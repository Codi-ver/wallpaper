// Single source of truth for the wallpaper categories shown across the site.
// The `key` MUST match the enum in models/wallpaper.js.
const CATEGORIES = [
  { key: "nature", label: "Nature", emoji: "🌿", gradient: "linear-gradient(135deg,#10b981,#047857)", blurb: "Forests, mountains & sweeping landscapes" },
  { key: "cars", label: "Cars", emoji: "🏎️", gradient: "linear-gradient(135deg,#ef4444,#991b1b)", blurb: "Supercars & speed machines" },
  { key: "anime", label: "Anime", emoji: "🌸", gradient: "linear-gradient(135deg,#ec4899,#7c3aed)", blurb: "Anime art, characters & worlds" },
  { key: "animals", label: "Animals", emoji: "🦊", gradient: "linear-gradient(135deg,#f59e0b,#b45309)", blurb: "Wildlife, pets & creatures" },
  { key: "flowers", label: "Flowers", emoji: "🌺", gradient: "linear-gradient(135deg,#f472b6,#be185d)", blurb: "Blooms, petals & gardens" },
  { key: "space", label: "Space", emoji: "🪐", gradient: "linear-gradient(135deg,#6366f1,#1e1b4b)", blurb: "Galaxies, nebulae & the cosmos" },
  { key: "city", label: "City", emoji: "🏙️", gradient: "linear-gradient(135deg,#0ea5e9,#1e3a8a)", blurb: "Skylines, streets & night lights" },
  { key: "sports", label: "Sports", emoji: "⚽", gradient: "linear-gradient(135deg,#22c55e,#14532d)", blurb: "Action, athletes & arenas" },
  { key: "technology", label: "Technology", emoji: "🖥️", gradient: "linear-gradient(135deg,#14b8a6,#0f766e)", blurb: "Gadgets, gear & setups" },
  { key: "cute", label: "Cute", emoji: "🐱", gradient: "linear-gradient(135deg,#fb7185,#9f1239)", blurb: "Adorable, cozy & wholesome" },
];

const getCategory = (key) => CATEGORIES.find((c) => c.key === key);

module.exports = { CATEGORIES, getCategory };
