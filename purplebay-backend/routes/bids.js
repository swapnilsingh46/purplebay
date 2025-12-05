// routes/bids.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/bidController');

// place a bid
router.post('/', auth, ctrl.placeBid);

// get my bids
router.get('/me', auth, ctrl.getMyBids);

// get bids for a listing
router.get('/listing/:listingId', ctrl.getBidsForListing);

// get highest bid for a listing
router.get('/listing/:listingId/highest', ctrl.getHighestBid);

module.exports = router;

