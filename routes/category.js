const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const authMiddleware = require("../middleware/auth");

router
  .route("/")
  .post(authMiddleware, categoryController.create)
  .get(authMiddleware, categoryController.getAll);

router.route("/:id").delete(authMiddleware, categoryController.delete);

module.exports = router;
