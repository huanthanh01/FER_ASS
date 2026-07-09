const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

router.get('/', revenueController.getRevenue);
router.get('/dashboard-stats', revenueController.getDashboardStats);

module.exports = router;
