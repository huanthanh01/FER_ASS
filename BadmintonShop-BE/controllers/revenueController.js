const Order = require('../models/Order');
const User = require('../models/User');

const revenueController = {
  getDashboardStats: async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth(); // 0-11
      const currentMonthStart = new Date(currentYear, currentMonth, 1);
      const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
      const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear + 1, 0, 1);

      // 1. Users
      const totalUsers = await User.countDocuments();
      const newUsersThisMonth = await User.countDocuments({
        createdAt: { $gte: currentMonthStart, $lt: nextMonthStart }
      });

      // 2. Revenue & Orders (Current Month)
      const currentMonthOrders = await Order.find({
        createdAt: { $gte: currentMonthStart, $lt: nextMonthStart }
      });
      const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const currentMonthOrderCount = currentMonthOrders.length;

      // 3. Revenue & Orders (Last Month)
      const lastMonthOrders = await Order.find({
        createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }
      });
      const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Growth Rate
      let growthRate = 0;
      if (lastMonthRevenue > 0) {
        growthRate = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
      } else if (currentMonthRevenue > 0) {
        growthRate = 100;
      }

      // 4. Monthly Chart Data
      const monthlyData = await Order.aggregate([
        { $match: { createdAt: { $gte: yearStart, $lt: yearEnd } } },
        { $group: { _id: { $month: "$createdAt" }, revenue: { $sum: "$totalAmount" } } }
      ]);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const chartData = monthNames.map((name, index) => {
        const found = monthlyData.find(item => item._id === index + 1);
        return { name, revenue: found ? found.revenue : 0 };
      });

      // Weekly Chart Data (Current Month)
      const weeklyData = [
        { name: 'Week 1', revenue: 0 },
        { name: 'Week 2', revenue: 0 },
        { name: 'Week 3', revenue: 0 },
        { name: 'Week 4', revenue: 0 }
      ];
      currentMonthOrders.forEach(order => {
        const day = order.createdAt.getDate();
        if (day <= 7) weeklyData[0].revenue += order.totalAmount;
        else if (day <= 14) weeklyData[1].revenue += order.totalAmount;
        else if (day <= 21) weeklyData[2].revenue += order.totalAmount;
        else weeklyData[3].revenue += order.totalAmount;
      });

      // Order Status Stats
      const orderStatsAgg = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      const orderStats = [
        { name: 'Completed', value: 0, color: '#10b981' }, // emerald-500
        { name: 'Pending', value: 0, color: '#f59e0b' },   // amber-500
        { name: 'Cancelled', value: 0, color: '#f43f5e' }  // rose-500
      ];
      orderStatsAgg.forEach(stat => {
        const statusName = stat._id || 'Completed'; // fallback for old orders without status
        const statusItem = orderStats.find(s => s.name === statusName);
        if (statusItem) statusItem.value = stat.count;
      });

      // 5. Recent Orders
      const recentOrders = await Order.find()
        .populate('user', 'fullname username')
        .sort({ createdAt: -1 })
        .limit(10);

      // 6. Top Selling Products
      const topProducts = await Order.aggregate([
        { $unwind: "$items" },
        { 
          $group: { 
            _id: "$items.product", 
            totalSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] } }
          } 
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: "$productDetails" }
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          newUsersThisMonth,
          currentMonthRevenue,
          currentMonthOrderCount,
          growthRate: parseFloat(growthRate.toFixed(1)),
          chartData,
          weeklyData,
          orderStats,
          recentOrders,
          topProducts
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
    }
  },
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
