const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// --------------------
// CREATE LISTING (PROTECTED)
// --------------------
exports.createListing = async (req, res) => {
  try {
    const { title, description, price, category, images } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ msg: 'Title, price, and category are required' });
    }

    const listing = await Listing.create({
      title,
      description: description || '',
      price,
      category,
      images: images || [],
      createdBy: req.user._id,
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error('createListing', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// --------------------
// UPDATE LISTING (PROTECTED)
// --------------------
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    if (listing.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, description, price, category, images } = req.body;
    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (price !== undefined) listing.price = price;
    if (category !== undefined) listing.category = category;
    if (images !== undefined) listing.images = images;

    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error('updateListing', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// --------------------
// DELETE LISTING (PROTECTED)
// --------------------
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    if (listing.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Delete images from uploads folder
    if (listing.images?.length) {
      listing.images.forEach((img) => {
        const filePath = path.join(uploadsDir, img.split('/').pop());
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { console.error(e); }
        }
      });
    }

    await listing.deleteOne();
    res.json({ msg: 'Listing deleted' });
  } catch (err) {
    console.error('deleteListing', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// --------------------
// GET ALL LISTINGS (PUBLIC)
// --------------------
exports.getAllListings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };

    const [items, total] = await Promise.all([
      Listing.find(filter)
        .populate('category')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(filter),
    ]);

    res.json({ items, page, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('getAllListings', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// --------------------
// GET SINGLE LISTING BY ID (PUBLIC)
// --------------------
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('category')
      .populate('createdBy', 'name email');

    if (!listing) return res.status(404).json({ msg: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    console.error('getListingById', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// --------------------
// GET LISTINGS CREATED BY LOGGED-IN USER (PROTECTED)
// --------------------
exports.getMyListings = async (req, res) => {
  try {
    const items = await Listing.find({ createdBy: req.user._id })
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('getMyListings', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

