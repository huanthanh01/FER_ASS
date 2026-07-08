const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get cart for user
router.get('/:userId', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update item quantity in cart
router.post('/update', cartController.updateCart);

// Remove item from cart
router.post('/remove', cartController.removeFromCart);

// Checkout cart
router.post('/checkout', cartController.checkout);

module.exports = router;
