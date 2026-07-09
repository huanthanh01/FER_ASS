import React, { useState, useEffect } from 'react';
import { HiOutlineCurrencyDollar, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineTrendingUp, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineStar } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../../api/revenueApi';

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State for Recent Orders
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await getDashboardStats();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = dashboardData.recentOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(dashboardData.recentOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue (Month)" 
          value={`$${dashboardData.currentMonthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<HiOutlineCurrencyDollar className="w-6 h-6" />}
          trend={`${dashboardData.growthRate > 0 ? '+' : ''}${dashboardData.growthRate}%`} 
          isPositive={dashboardData.growthRate >= 0}
          color="from-emerald-600 to-emerald-400"
        />
        <MetricCard 
          title="Orders (Month)" 
          value={dashboardData.currentMonthOrderCount.toString()} 
          icon={<HiOutlineShoppingCart className="w-6 h-6" />}
          trend="vs last month" 
          isPositive={true}
          color="from-blue-600 to-blue-400"
          hideTrendColor
        />
        <MetricCard 
          title="Total Users" 
          value={dashboardData.totalUsers.toString()}
          icon={<HiOutlineUsers className="w-6 h-6" />}
          trend={`+${dashboardData.newUsersThisMonth} this month`} 
          isPositive={true}
          color="from-purple-600 to-purple-400"
        />
        <MetricCard 
          title="Growth Rate" 
          value={`${dashboardData.growthRate > 0 ? '+' : ''}${dashboardData.growthRate}%`} 
          icon={<HiOutlineTrendingUp className="w-6 h-6" />}
          trend="Revenue vs last month" 
          isPositive={dashboardData.growthRate >= 0}
          color="from-orange-600 to-orange-400"
          hideTrendColor
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Revenue Overview ({new Date().getFullYear()})</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Section */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Top Selling Products</h2>
          <div className="flex-1 flex flex-col gap-4">
            {dashboardData.topProducts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center my-auto">No sales data yet.</p>
            ) : (
              dashboardData.topProducts.map((item, index) => (
                <div key={item._id} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.productDetails.image} alt={item.productDetails.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate" title={item.productDetails.name}>{item.productDetails.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-orange-400 font-semibold">{item.totalSold} sold</span>
                      <span className="text-xs text-slate-500">&bull;</span>
                      <span className="text-xs text-emerald-400 font-medium">${item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                  {index === 0 && <HiOutlineStar className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-semibold tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right rounded-tr-lg">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {dashboardData.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map(order => (
                    <tr key={order._id || order.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        #{String(order._id || order.id).substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {new Date(order.createdAt || order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {order.user?.username || order.user?.fullname || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400 whitespace-nowrap text-right">
                        ${(order.totalAmount || order.totalPrice || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {dashboardData.recentOrders.length > 0 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-b-xl">
              <span className="text-xs text-slate-500">
                Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, dashboardData.recentOrders.length)} of {dashboardData.recentOrders.length}
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, isPositive, color, hideTrendColor }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-tr ${color} shadow-lg text-white`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span className={`font-medium ${hideTrendColor ? 'text-slate-400' : (isPositive ? 'text-emerald-400' : 'text-rose-400')}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
