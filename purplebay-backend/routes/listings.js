const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/listingController');

// --------------------
// USER-SPECIFIC ROUTES (PROTECTED)
// --------------------

// Get listings created by logged-in user
router.get('/user/me', auth, ctrl.getMyListings);

// Create a new listing
router.post('/', auth, ctrl.createListing);

// Update a listing
router.patch('/:id', auth, ctrl.updateListing);

// Delete a listing
router.delete('/:id', auth, ctrl.deleteListing);

// --------------------
// PUBLIC ROUTES
// --------------------

// Get all listings ever made (paginated, filterable)
router.get('/', ctrl.getAllListings);

// Get a single listing by ID
router.get('/:id', ctrl.getListingById);

module.exports = router;

