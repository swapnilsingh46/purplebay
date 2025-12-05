const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // seller
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  order: { type: Schema.Types.ObjectId, ref: 'Order' } // optional tie to order
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
