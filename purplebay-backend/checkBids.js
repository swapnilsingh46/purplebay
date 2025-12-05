require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✔ MongoDB connected');

    const listings = await Listing.find({});
    listings.forEach(listing => {
      console.log(`Listing: ${listing.title} (${listing._id})`);
      listing.bids.forEach(bid => {
        console.log('Bid user:', bid.user, 'Type:', typeof bid.user);
      });
    });

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
