const Report = require('../models/Report');
const User = require('../models/User');

const reportController = {
  // GET /api/reports/my-report
  getUserReport: async (req, res) => {
    try {
      let report = await Report.findOne({ user: req.user.id }).populate('messages.sender', 'fullname username');
      if (!report) {
        // Create an empty report if none exists
        report = new Report({ user: req.user.id, messages: [] });
        await report.save();
      } else if (report.hasUnreadUser) {
        // Mark as read for user
        report.hasUnreadUser = false;
        await report.save();
      }
      res.json({ success: true, report });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch report' });
    }
  },

  // GET /api/reports
  getAllReports: async (req, res) => {
    try {
      const reports = await Report.find()
        .populate('user', 'fullname username email')
        .sort({ lastUpdatedAt: -1 });
      res.json({ success: true, reports });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch reports' });
    }
  },

  // GET /api/reports/:userId
  getAdminReport: async (req, res) => {
    try {
      let report = await Report.findOne({ user: req.params.userId }).populate('messages.sender', 'fullname username');
      if (!report) {
        return res.status(404).json({ success: false, error: 'Report not found' });
      }
      if (report.hasUnreadAdmin) {
        report.hasUnreadAdmin = false;
        await report.save();
      }
      res.json({ success: true, report });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch user report' });
    }
  },

  // Note: Message sending logic will be handled directly in index.js via Socket.io 
  // but we can also provide HTTP fallback endpoints if needed.
};

module.exports = reportController;
