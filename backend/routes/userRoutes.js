const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  updateUserRole,
  getEditorContent,
  getViewerContent,
} = require("../controllers/userController");

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", protect, authorize("admin"), getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put("/:id/role", protect, authorize("admin"), updateUserRole);

// Example of a route accessible by Admin or Editor
router.get(
  "/editor-content",
  protect,
  authorize("admin", "editor"),
  getEditorContent
);

// Example of a route accessible by all authenticated users
router.get(
  "/viewer-content",
  protect,
  authorize("admin", "editor", "viewer"),
  getViewerContent
);

module.exports = router;
