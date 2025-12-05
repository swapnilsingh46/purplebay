// models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    description: { type: String, text: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Text index for search on title and description
ListingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', ListingSchema);

