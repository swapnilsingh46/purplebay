// routes/search.js
const express = require('express');
const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, category, min, max, sort, page = 1, limit = 20 } = req.query;

    const filters = [{ active: true }];

    // ✅ TEXT SEARCH
    let useTextSearch = false;
    if (q && q.trim().length > 0) {
      useTextSearch = true;
      filters.push({ $text: { $search: q } });
    }

    // CATEGORY
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ msg: "Invalid category ID" });
      }
      filters.push({ category });
    }

    // PRICE RANGE
    if (min || max) {
      const priceFilters = {};
      if (min) priceFilters.$gte = Number(min);
      if (max) priceFilters.$lte = Number(max);
      filters.push({ price: priceFilters });
    }

    // BUILD QUERY
    const finalFilter = { $and: filters };

    // SORTING LOGIC
    let sortObj = {};

    if (useTextSearch) {
      // ⭐ MOST IMPORTANT FIX: sort by textScore when searching text
      sortObj = { score: { $meta: "textScore" } };
    } else {
      // NORMAL SORTING
      if (sort === "price_asc") sortObj = { price: 1 };
      else if (sort === "price_desc") sortObj = { price: -1 };
      else sortObj = { createdAt: -1 }; // newest
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Listing.find(finalFilter)
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .select(useTextSearch ? { score: { $meta: "textScore" } } : {});

    const total = await Listing.countDocuments(finalFilter);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

