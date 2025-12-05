// routes/categories.js
const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const slugify = require('slugify');

const router = express.Router();

// ===========================
// POST /api/categories  → Create Category (protected)
// ===========================
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate name
    if (!name) return res.status(400).json({ msg: 'Missing name' });

    // Auto-generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if category with same name or slug exists
    const cExists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (cExists) return res.status(400).json({ msg: 'Category exists' });

    // Save category
    const cat = new Category({ name, slug, description });
    await cat.save();

    res.status(201).json(cat);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ===========================
// GET /api/categories → Get All Categories
// ===========================
router.get('/', async (req, res) => {
  try {
    const cats = await Category.find().sort('name');
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

