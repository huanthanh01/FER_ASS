const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, adminAuthMiddleware } = require('../middleware/auth');

// User routes
router.get('/my-report', authMiddleware, reportController.getUserReport);

// Admin routes
router.get('/', adminAuthMiddleware, reportController.getAllReports);
router.get('/:userId', adminAuthMiddleware, reportController.getAdminReport);

module.exports = router;
