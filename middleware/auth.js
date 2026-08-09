const jwt = require("jsonwebtoken");
const adminModel = require("../models/admins");

// API auth middleware. Accepts the token from an httpOnly cookie (web panel)
// or an `Authorization: Bearer <token>` header (REST clients).
function extractToken(req) {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const header = req.header("Authorization");
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

module.exports = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(payload.id);

    if (!admin) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = admin;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
