const jwt = require("jsonwebtoken");
const adminModel = require("../models/admins");

// Web (panel) auth middleware. Reads the JWT from the cookie and redirects
// to the login page when there is no valid session.
module.exports = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.redirect("/panel/login");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(payload.id);

    if (!admin) {
      res.clearCookie("token");
      return res.redirect("/panel/login");
    }

    res.locals.admin = admin;
    req.user = admin;
    return next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/panel/login");
  }
};
