const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getUserOrders);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
