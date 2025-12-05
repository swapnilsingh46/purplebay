// routes/payments.js
const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();

// POST /api/payments/mock  { orderId, method }
router.post('/mock', auth, async (req, res) => {
  try {
    const { orderId, method } = req.body;
    if (!orderId) return res.status(400).json({ msg: 'orderId required' });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (String(order.buyer) !== String(req.user._id)) return res.status(403).json({ msg: 'Not buyer' });

    if (method === 'fail') {
      order.status = 'cancelled';
      await order.save();
      return res.json({ success: false, status: order.status });
    }

    order.status = 'paid';
    await order.save();
    res.json({ success: true, paymentId: `MOCKPAY_${Date.now()}`, status: order.status });
  } catch (err) {
    console.error('payments mock', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

