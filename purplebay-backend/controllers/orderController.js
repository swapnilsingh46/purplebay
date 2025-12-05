const Order = require('../models/Order');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const Watchlist = require('../models/Watchlist');

/**
 * CREATE ORDER (Buy Now)
 * Marks listing as sold immediately and sends notifications
 */
exports.createOrder = async (req, res) => {
  try {
    const { listingId, quantity, shippingAddress } = req.body;

    // Validate input
    if (!listingId || !quantity || !shippingAddress) {
      return res.status(400).json({ msg: 'listingId, quantity, and shippingAddress are required' });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ msg: 'Quantity must be a positive number' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Fetch listing
    const listing = await Listing.findById(listingId).populate('createdBy', 'name');
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    if (String(listing.createdBy?._id) === String(req.user._id)) {
      return res.status(400).json({ msg: 'Cannot order your own listing' });
    }

    if (!listing.active) return res.status(400).json({ msg: 'Listing is no longer available' });

    const amount = Number(listing.price) * qty;

    // Create order
    const order = await Order.create({
      buyer: req.user._id,
      listing: listingId,
      quantity: qty,
      amount,
      shippingAddress,
      status: 'created',
    });

    // Mark listing as sold immediately
    listing.active = false;
    await listing.save();

    // ------------------------
    // NOTIFICATIONS
    // ------------------------

    // Notify seller
    if (listing.createdBy?._id) {
      await Notification.create({
        user: listing.createdBy._id,
        type: 'order',
        message: `Your listing '${listing.title}' has been sold.`,
      });
    }

    // Notify buyer
    await Notification.create({
      user: req.user._id,
      type: 'order',
      message: `You successfully created an order for '${listing.title}'.`,
    });

    // Notify watchers (excluding buyer and seller)
    const watchers = await Watchlist.find({
      listing: listing._id,
      user: { $nin: [req.user._id, listing.createdBy._id] },
    }).populate('user', '_id name');

    for (const w of watchers) {
      await Notification.create({
        user: w.user._id,
        type: 'watchlist',
        message: `A listing you were watching ('${listing.title}') has been sold.`,
      });
    }

    return res.status(201).json({ order });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ msg: 'Server error creating order', error: err.message });
  }
};

/**
 * GET MY ORDERS
 */
exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ msg: 'Unauthorized' });

    const orders = await Order.find({ buyer: req.user._id })
      .populate('listing', 'title price images createdBy active status')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error('getMyOrders error:', err);
    return res.status(500).json({ msg: 'Server error fetching orders', error: err.message });
  }
};

/**
 * UPDATE ORDER STATUS (seller/admin)
 * Allows seller or admin to update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['created', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const order = await Order.findById(id).populate({
      path: 'listing',
      populate: { path: 'createdBy', select: '_id name' },
    });

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    // Only seller of listing or admin can update
    if (String(order.listing.createdBy._id) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized to update this order' });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Notify buyer about status change
    await Notification.create({
      user: order.buyer,
      type: 'order',
      message: `Your order for '${order.listing.title}' status changed from '${previousStatus}' to '${status}'.`,
    });

    // If order is paid, notify seller
    if (status === 'paid') {
      await Notification.create({
        user: order.listing.createdBy._id,
        type: 'order',
        message: `Your listing '${order.listing.title}' has been paid for.`,
      });
    }

    return res.json({ msg: 'Order status updated', order });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ msg: 'Server error updating order status', error: err.message });
  }
};

