const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);

// Update Profile
router.put('/profile/:id', authController.updateProfile);

// Change Password
router.put('/password/:id', authController.changePassword);

// Verify Reset Password
router.post('/verify-reset-password', authController.verifyResetPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
