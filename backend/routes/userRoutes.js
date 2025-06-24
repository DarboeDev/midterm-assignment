const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put("/:id/role", protect, authorize("admin"), async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!role || !["admin", "editor", "viewer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Example of a route accessible by Admin or Editor
router.get(
  "/editor-content",
  protect,
  authorize("admin", "editor"),
  (req, res) => {
    res.json({ message: "This is content for Editors and Admins." });
  }
);

// Example of a route accessible by all authenticated users
router.get(
  "/viewer-content",
  protect,
  authorize("admin", "editor", "viewer"),
  (req, res) => {
    res.json({ message: "This is content for all authenticated users." });
  }
);

module.exports = router;
