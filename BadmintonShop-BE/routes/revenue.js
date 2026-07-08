const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

router.get('/', revenueController.getRevenue);

module.exports = router;
