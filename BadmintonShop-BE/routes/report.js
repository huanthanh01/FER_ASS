const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// User routes
router.get('/my-report/:userId', reportController.getUserReport);

// Admin routes
router.get('/', reportController.getAllReports);
router.get('/:userId', reportController.getAdminReport);

module.exports = router;
