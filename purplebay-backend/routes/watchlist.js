// routes/watchlist.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

// Add to watchlist
router.post('/', auth, async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ msg: 'listingId required' });

    const doc = new Watchlist({ user: req.user._id, listing: listingId });
    await doc.save();

    res.status(201).json(doc);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ msg: 'Already in watchlist' });
    console.error('watchlist post', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get current user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.user._id })
      .populate('listing')
      .sort({ addedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('watchlist get', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Check if a listing is in watchlist and return _id if exists
router.get('/check/:listingId', auth, async (req, res) => {
  try {
    const watchItem = await Watchlist.findOne({
      user: req.user._id,
      listing: req.params.listingId,
    });

    res.json({
      watching: !!watchItem,
      _id: watchItem?._id || null,
    });
  } catch (err) {
    console.error('watchlist check', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Remove from watchlist using watchlist _id
router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await Watchlist.findOneAndDelete({
      user: req.user._id,
      _id: req.params.id,
    });
    if (!removed) return res.status(404).json({ msg: 'Not found' });

    res.json({ msg: 'Removed from watchlist' });
  } catch (err) {
    console.error('watchlist delete', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

