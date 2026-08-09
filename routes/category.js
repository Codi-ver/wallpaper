const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const authMiddleware = require("../middleware/auth");

// Public read; admin-only writes.
router
  .route("/")
  .get(categoryController.getAll)
  .post(authMiddleware, categoryController.create);

router.route("/:id").delete(authMiddleware, categoryController.delete);

module.exports = router;
