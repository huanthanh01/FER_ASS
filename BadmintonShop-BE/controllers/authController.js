const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  // Register
  register: async (req, res) => {
    const { fullname, email, username, password, phoneNumber } = req.body;
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' });
      }

      // Check if user exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ success: false, error: 'Username already exists' });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullname,
        email,
        username,
        password: hashedPassword,
        phoneNumber
      });
      const savedUser = await newUser.save();

      res.json({
        success: true,
        user: {
          id: savedUser._id,
          fullname: savedUser.fullname,
          email: savedUser.email,
          username: savedUser.username,
          role: savedUser.role,
          phoneNumber: savedUser.phoneNumber
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
    }
  },

  // Login
  login: async (req, res) => {
    const { username, password } = req.body;
    console.log(`[LOGIN ATTEMPT] username: '${username}', password: '${password}'`);
    try {
      // Check if user exists by username OR email
      const user = await User.findOne({ 
        $or: [{ username: username }, { email: username }] 
      });
      if (!user) {
        console.log(`[LOGIN FAILED] User not found for: '${username}'`);
        return res.status(400).json({ success: false, error: 'Invalid username or password' });
      }

      if (user.isActive === false) {
        console.log(`[LOGIN FAILED] User is disabled: '${username}'`);
        return res.status(403).json({ success: false, error: 'Your account has been disabled. Please contact support.' });
      }

      if (user.role === 'admin') {
        console.log(`[LOGIN FAILED] Admin tried to login via shop portal: '${username}'`);
        return res.status(403).json({ success: false, error: 'Admin accounts must log in through the Admin Portal.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`[LOGIN FAILED] Password mismatch for: '${username}'`);
        return res.status(400).json({ success: false, error: 'Invalid username or password' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          username: user.username,
          role: user.role,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
    }
  },

  // Admin Login
  adminLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ 
        $or: [{ username: username }, { email: username }] 
      });
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid admin credentials' });
      }

      if (user.isActive === false) {
        return res.status(403).json({ success: false, error: 'Your account has been disabled.' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Unauthorized. Admin access required.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Invalid admin credentials' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          username: user.username,
          role: user.role,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Admin login failed.' });
    }
  },

  // Update Profile
  updateProfile: async (req, res) => {
    const { fullname, email, phoneNumber } = req.body;
    try {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingEmail) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { fullname, email, phoneNumber },
        { returnDocument: 'after' }
      );
      if (!updatedUser) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to change password' });
    }
  },

  // Verify Reset Password
  verifyResetPassword: async (req, res) => {
    const { username, phoneNumber } = req.body;
    try {
      const user = await User.findOne({ username, phoneNumber });
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid username or phone number' });
      }
      res.json({ success: true, userId: user._id, username: user.username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to verify information' });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    const { username, newPassword } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to reset password' });
    }
  },
  // Google Login
  googleLogin: async (req, res) => {
    const { access_token } = req.body;
    try {
      // Use the access_token to fetch user info from Google
      const axios = require('axios');
      const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      const payload = googleResponse.data;
      const { email, name } = payload; 

      let user = await User.findOne({ email });

      if (!user) {
        // Register new user
        const bcrypt = require('bcryptjs');
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        
        let username = email.split('@')[0];
        let existingUsername = await User.findOne({ username });
        while(existingUsername) {
            username = username + Math.floor(Math.random() * 1000);
            existingUsername = await User.findOne({ username });
        }

        user = new User({
          fullname: name,
          email,
          username,
          password: hashedPassword,
        });
        await user.save();
      } else {
        if (user.isActive === false) {
          return res.status(403).json({ success: false, error: 'Your account has been disabled. Please contact support.' });
        }
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          username: user.username,
          role: user.role,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (err) {
      console.error('Google login error:', err);
      res.status(500).json({ success: false, error: 'Google authentication failed' });
    }
  }
};

module.exports = authController;
