const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/listingController');

// Get my listings (before :id route to avoid conflicts)
router.get('/user/me', auth, ctrl.getMyListings);

// CRUD routes
router.post('/', auth, ctrl.createListing); // JSON create
router.patch('/:id', auth, ctrl.updateListing); // JSON update
router.delete('/:id', auth, ctrl.deleteListing);
router.get('/', ctrl.getListings);
router.get('/:id', ctrl.getListingById);

module.exports = router;

