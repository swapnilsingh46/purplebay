// routes/messages.js
const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// GET /api/messages/:userId -> get conversation messages between req.user and userId
router.get('/:userId', auth, async (req, res) => {
  try {
    const otherId = req.params.userId;
    const me = req.user._id;

    // messages where (sender=me AND receiver=otherId) OR (sender=otherId AND receiver=me)
    const messages = await Message.find({
      $or: [
        { sender: me, receiver: otherId },
        { sender: otherId, receiver: me }
      ]
    }).sort({ createdAt: 1 }); // oldest-first
    res.json(messages);
  } catch (err) {
    console.error('messages GET error:', err);
    res.status(500).json({ msg: 'Server error fetching messages' });
  }
});

// POST /api/messages — send simple message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ msg: 'receiverId and text required' });
    }

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text
    });

    // Fetch sender name safely
    const sender = await User.findById(req.user._id);
    const senderName = sender ? sender.name : 'Someone';

    // Create notification for receiver
    await Notification.create({
      user: receiverId,
      type: 'message',
      message: `New message from ${senderName}: '${text}'`
    });

    res.status(201).json({ msg: 'Message sent', message });
  } catch (err) {
    console.error('messages POST error:', err);
    res.status(500).json({ msg: 'Server error sending message' });
  }
});

module.exports = router;

