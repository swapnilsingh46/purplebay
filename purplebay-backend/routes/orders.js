const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

// Create a new order
router.post('/', auth, ctrl.createOrder);

// Get my orders (buyer)
router.get('/me', auth, ctrl.getMyOrders);

// Update order status (seller/admin)
router.patch('/:id/status', auth, ctrl.updateOrderStatus);

module.exports = router;

