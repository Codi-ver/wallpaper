const jwt = require("jsonwebtoken");
const adminModel = require("../models/admins");

module.exports = async (req, res, next) => {
  try {

    const authHeader = req.header("Authorization")?.split(" ");


    if (authHeader.length != 2) {
      return res.status(403).json({
        message: "This route is protected and you can't access to it !",
      });
    }

    const token = authHeader[1];

    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminModel.findById(jwtPayload.id );

    req.user = admin;

    return next();
  } catch (err) {
    return res.status(403).json(err);
  }
};
