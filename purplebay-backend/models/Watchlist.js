const mongoose = require('mongoose');
const WatchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  addedAt: { type: Date, default: Date.now }
});
WatchlistSchema.index({ user: 1, listing: 1 }, { unique: true });
module.exports = mongoose.model('Watchlist', WatchlistSchema);

