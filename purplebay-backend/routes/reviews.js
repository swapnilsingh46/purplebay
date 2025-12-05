const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const User = require('../models/User');

/**
 * POST /api/reviews/:userId
 * Body: { rating, comment, orderId? }
 */
router.post('/:userId', auth, async (req, res) => {
  try {
    const revieweeId = req.params.userId;
    const { rating, comment, orderId } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ msg: 'Invalid rating' });

    const review = new Review({
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment,
      order: orderId
    });
    await review.save();

    // update user's avg rating & count
    const user = await User.findById(revieweeId);
    const reviews = await Review.find({ reviewee: revieweeId });
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    user.ratingCount = reviews.length;
    user.ratingAvg = sum / reviews.length;
    await user.save();

    res.json(review);
  } catch (err) {
    console.error('POST /api/reviews error', err);
    res.status(500).send('Server error');
  }
});

/**
 * GET /api/reviews/:userId
 */
router.get('/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId }).populate('reviewer', 'name email');
    res.json(reviews);
  } catch (err) {
    console.error('GET /api/reviews error', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
