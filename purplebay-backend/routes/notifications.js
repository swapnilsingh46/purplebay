const express = require('express');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const router = express.Router();

// GET /api/notifications
// Get all notifications for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/notifications
// Create a notification (usually done internally)
router.post('/', auth, async (req, res) => {
  try {
    const { type, message, userId } = req.body;
    if (!type || !message || !userId) return res.status(400).json({ msg: 'Missing fields' });

    const notification = new Notification({ type, message, user: userId });
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error('Create notification error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH /api/notifications/:id/read
// Mark a notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error('Mark read error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

