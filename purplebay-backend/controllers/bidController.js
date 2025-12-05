const Bid = require('../models/Bid');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const User = require('../models/User');

// PLACE BID
exports.placeBid = async (req, res) => {
  try {
    const { listingId, amount } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Create bid
    const bid = await Bid.create({
      listing: listingId,
      bidder: req.user._id,
      amount
    });

    // Create notification for the seller
    await Notification.create({
      user: listing.createdBy,
      type: 'bid',
      message: `New bid of $${amount} on your listing '${listing.title}'.`
    });

    return res.json({ msg: 'Bid placed successfully', bid });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error placing bid' });
  }
};

// GET MY BIDS
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id }).populate('listing');
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error getting user bids' });
  }
};

// GET BIDS FOR A LISTING
exports.getBidsForListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const bids = await Bid.find({ listing: listingId }).populate('bidder');
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error getting listing bids' });
  }
};

// GET HIGHEST BID FOR A LISTING
exports.getHighestBid = async (req, res) => {
  try {
    const { listingId } = req.params;

    const bid = await Bid.findOne({ listing: listingId })
      .sort({ amount: -1 })
      .populate('bidder');

    res.json(bid || { msg: 'No bids yet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error getting highest bid' });
  }
};

