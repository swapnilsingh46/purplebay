const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('getNotifications', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user, title, body, meta } = req.body;
    if (!user || !title) return res.status(400).json({ msg: 'user and title required' });
    const n = await Notification.create({ user, title, body, meta });
    res.status(201).json(n);
  } catch (err) {
    console.error('createNotification', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const id = req.params.id;
    const n = await Notification.findOneAndUpdate({ _id: id, user: req.user._id }, { read: true }, { new: true });
    if (!n) return res.status(404).json({ msg: 'Notification not found' });
    res.json(n);
  } catch (err) {
    console.error('markRead', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const n = await Notification.findOneAndDelete({ _id: id, user: req.user._id });
    if (!n) return res.status(404).json({ msg: 'Notification not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('deleteNotification', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
