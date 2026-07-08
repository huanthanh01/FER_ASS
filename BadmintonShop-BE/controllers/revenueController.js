const Order = require('../models/Order');

const revenueController = {
  getRevenue: async (req, res) => {
    try {
      const { day, month, year } = req.query;
      
      let matchStage = {};
      
      // If year is provided
      if (year) {
        const yearNum = parseInt(year);
        const monthNum = month ? parseInt(month) : null;
        const dayNum = day ? parseInt(day) : null;
        
        let startDate, endDate;
        
        if (dayNum && monthNum) {
          // Specific day
          startDate = new Date(yearNum, monthNum - 1, dayNum);
          endDate = new Date(yearNum, monthNum - 1, dayNum + 1);
        } else if (monthNum) {
          // Specific month
          startDate = new Date(yearNum, monthNum - 1, 1);
          endDate = new Date(yearNum, monthNum, 1);
        } else {
          // Specific year
          startDate = new Date(yearNum, 0, 1);
          endDate = new Date(yearNum + 1, 0, 1);
        }
        
        matchStage.createdAt = {
          $gte: startDate,
          $lt: endDate
        };
      }

      const orders = await Order.find(matchStage).populate('user', 'fullname email').sort({ createdAt: -1 });
      
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      res.json({ success: true, totalRevenue, orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch revenue data' });
    }
  }
};

module.exports = revenueController;
