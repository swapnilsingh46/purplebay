// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const path = require('path');
const uploadMiddleware = require('../middleware/upload'); // Multer
const router = express.Router();

/* ------------------------------------
   GET /api/users/:id → fetch profile
------------------------------------- */
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET user", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* --------------------------------------
   PATCH /api/users/:id → Update profile
--------------------------------------- */
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id)
      return res.status(403).json({ msg: "Unauthorized" });

    const updates = {};
    const allowedFields = ["name", "location", "bio", "email", "password"];

    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "password") {
          const salt = await bcrypt.genSalt(10);
          updates.password = await bcrypt.hash(req.body.password, salt);
        } else if (field === "email") {
          const existing = await User.findOne({ email: req.body.email });
          if (existing && existing._id.toString() !== id) {
            return res.status(400).json({ msg: "Email already in use" });
          }
          updates.email = req.body.email;
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    console.error("PATCH user", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* -----------------------------------------------------
   PATCH /api/users/:id/avatar → Update avatar image
------------------------------------------------------ */
router.patch('/:id/avatar', auth, uploadMiddleware.single("avatar"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ msg: "No file uploaded" });

    const filePath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: filePath },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    console.error("Avatar upload", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

