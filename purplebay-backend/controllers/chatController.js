/* const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.postMessage = async (req, res) => {
  try {
    const { participants, listingId, text } = req.body;
    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ msg: 'Participants required' });
    }

    // Ensure current user is included
    if (!participants.includes(String(req.user._id))) participants.push(String(req.user._id));

    // Find existing chat
    const query = { participants: { $all: participants } };
    if (listingId) query.listing = listingId;

    let chat = await Chat.findOne(query);
    if (!chat) {
      chat = new Chat({ participants, listing: listingId, messages: [] });
    }

    if (text) chat.messages.push({ sender: req.user._id, text });
    await chat.save();

    // Send notifications to all other participants
    const sender = await User.findById(req.user._id); // fetch sender name
    const otherParticipants = participants.filter(id => id !== String(req.user._id));

    for (let p of otherParticipants) {
      await Notification.create({
        user: p,
        type: 'message',
        message: `New message from ${sender.name}: '${text}'`
      });
    }

    res.status(201).json({ msg: 'Message sent', chat });
  } catch (err) {
    console.error('postMessage error:', err);
    res.status(500).json({ msg: 'Server error sending message' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { listing, withUser } = req.query;
    const filter = { participants: req.user._id };
    if (listing) filter.listing = listing;
    if (withUser) filter.participants = { $all: [req.user._id, withUser] };

    const chats = await Chat.find(filter)
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ msg: 'Server error fetching chat history' });
  }
};
*/
