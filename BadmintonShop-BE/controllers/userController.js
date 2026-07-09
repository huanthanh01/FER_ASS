const User = require('../models/User');

const userController = {
  // Get all users with optional search
  getAllUsers: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};
      
      if (search) {
        query = {
          $or: [
            { fullname: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const users = await User.find(query).select('-password').sort({ createdAt: -1 });
      res.json({ success: true, users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  },

  // Update user role
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['customer', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, error: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to update user role' });
    }
  },

  // Toggle user status (Enable/Disable)
  toggleUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      user.isActive = !user.isActive;
      await user.save();

      res.json({ success: true, user: { _id: user._id, isActive: user.isActive } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to toggle user status' });
    }
  }
};

module.exports = userController;
