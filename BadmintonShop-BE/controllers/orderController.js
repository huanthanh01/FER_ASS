const Order = require('../models/Order');
const mongoose = require('mongoose');

const orderController = {
  // Get all orders (Admin)
  getAllOrders: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};
      
      // If there's a search term, we might search by order ID (last 6-8 chars) or try to populate and filter.
      // But Mongoose doesn't support populate text search easily without aggregation.
      // We'll just fetch and sort for now. If ID is provided, match exactly.
      if (search && search.trim() !== '') {
        if (search.length === 24) {
          query._id = search;
        }
      }

      const orders = await Order.find(query)
        .populate('user', 'fullname email username')
        .populate('items.product', 'name imageUrl images price')
        .sort({ createdAt: -1 });

      // If search exists but wasn't an exact ObjectId, filter in JS by user name or email
      let finalOrders = orders;
      if (search && search.trim() !== '' && search.length !== 24) {
        const lowerSearch = search.toLowerCase();
        finalOrders = orders.filter(o => 
          (o.user && o.user.fullname && o.user.fullname.toLowerCase().includes(lowerSearch)) ||
          (o.user && o.user.email && o.user.email.toLowerCase().includes(lowerSearch)) ||
          String(o._id).toLowerCase().includes(lowerSearch)
        );
      }

      res.json({ success: true, orders: finalOrders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
  },

  // Update order status (Admin)
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      ).populate('user', 'fullname email username').populate('items.product', 'name imageUrl images price');

      if (!updatedOrder) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      res.json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
  },

  // Get orders by user (User)
  getUserOrders: async (req, res) => {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.json({ success: true, orders: [] });
      }

      const orders = await Order.find({ user: userId })
        .populate('items.product', 'name imageUrl images price')
        .sort({ createdAt: -1 });

      res.json({ success: true, orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch user orders' });
    }
  }
};

module.exports = orderController;
