const User = require("../models/Users");

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
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
};

// @desc    Get editor content (Admin or Editor only)
// @route   GET /api/users/editor-content
// @access  Private/Admin/Editor
const getEditorContent = (req, res) => {
  res.json({ message: "This is content for Editors and Admins." });
};

// @desc    Get viewer content (All authenticated users)
// @route   GET /api/users/viewer-content
// @access  Private/Admin/Editor/Viewer
const getViewerContent = (req, res) => {
  res.json({ message: "This is content for all authenticated users." });
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getEditorContent,
  getViewerContent,
};
