const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // Auth middleware
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get current user profile (example protected route)
// @access  Private
router.get("/me", protect, getCurrentUser);

module.exports = router;
