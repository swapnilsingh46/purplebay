/* const express = require('express');
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// POST /api/chat/messages — send chat message
router.post('/messages', auth, async (req, res) => {
  try {
    const { participants, listingId, text } = req.body;
    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ msg: 'Participants required' });
    }

    // Ensure sender included
    if (!participants.includes(String(req.user._id))) participants.push(String(req.user._id));

    // Find existing chat
    const query = { participants: { $all: participants } };
    if (listingId) query.listing = listingId;

    let chat = await Chat.findOne(query);
    if (!chat) chat = new Chat({ participants, listing: listingId, messages: [] });

    // Add new message
    if (text) chat.messages.push({ sender: req.user._id, text });
    await chat.save();

    // Notify all other participants
    const sender = await User.findById(req.user._id);
    const senderName = sender ? sender.name : 'Someone';

    for (let participantId of participants) {
      if (participantId !== String(req.user._id)) {
        await Notification.create({
          user: participantId,
          type: 'message',
          message: `New message from ${senderName}: '${text}'`
        });
      }
    }

    res.status(201).json({ msg: 'Message sent', chat });
  } catch (err) {
    console.error('chat POST message error:', err);
    res.status(500).json({ msg: 'Server error sending message' });
  }
});

module.exports = router;
*/
