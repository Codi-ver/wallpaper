const adminModel = require("../models/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TOKEN_TTL = "10d";

exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });

exports.hashPassword = (password) => bcrypt.hash(password, 10);

// Verify credentials and return the admin document (throws on failure).
exports.authenticate = async (identifier, password) => {
  const admin = await adminModel
    .findOne({
      $or: [{ email: identifier }, { phone: identifier }, { username: identifier }],
    })
    .select("+password");

  if (!admin) {
    const err = new Error("No admin found with that email, phone or username");
    err.status = 404;
    throw err;
  }

  // NOTE: argument order matters — bcrypt.compare(plaintext, hash)
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    const err = new Error("Incorrect password");
    err.status = 400;
    throw err;
  }

  return admin;
};

exports.addAdmin = async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;

    const hashedPassword = await exports.hashPassword(password);

    const newAdmin = await adminModel.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    const accessToken = exports.signToken(newAdmin._id);
    return res.status(201).json({ admin: newAdmin, accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const admin = await exports.authenticate(identifier, password);
    return res.json(exports.signToken(admin._id));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;
    const update = { name, username, email, phone };

    if (password) {
      update.password = await exports.hashPassword(password);
    }

    const updatedAdmin = await adminModel
      .findByIdAndUpdate(req.user._id, update, { new: true })
      .select("-password");

    return res.json(updatedAdmin);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
