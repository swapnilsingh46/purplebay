const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    quantity: { type: Number, required: true, default: 1 },
    amount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: { type: String, enum: ['created', 'paid', 'shipped', 'completed', 'cancelled'], default: 'created' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

