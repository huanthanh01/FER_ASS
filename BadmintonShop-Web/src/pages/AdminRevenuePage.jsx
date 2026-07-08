import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRevenue } from '../api/revenueApi';
import { useAppContext } from '../context/AppContext';
import { HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineCalendar, HiOutlineSearch } from 'react-icons/hi';
import { toast } from 'react-toastify';
import '../styles/AdminRevenuePage.css';
import '../styles/AdminProductsPage.css'; // Reuse some table styles

export default function AdminRevenuePage() {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    orders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Date filter state
  const [dateFilter, setDateFilter] = useState({
    day: '',
    month: '',
    year: new Date().getFullYear().toString()
  });

  useEffect(() => {
    // Check admin role
    if (currentUser?.role !== 'admin') {
      navigate('/');
      toast.error('Unauthorized access');
      return;
    }

    fetchRevenue();
  }, [currentUser, navigate]);

  const fetchRevenue = async () => {
    setIsLoading(true);
    try {
      const res = await getRevenue(
        dateFilter.day || undefined,
        dateFilter.month || undefined,
        dateFilter.year || undefined
      );
      
      if (res.success) {
        setRevenueData({
          totalRevenue: res.totalRevenue,
          orders: res.orders
        });
      }
    } catch (error) {
      console.error("Failed to fetch revenue", error);
      toast.error("Failed to load revenue data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRevenue();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  // Generate options for dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="admin-page page-container">
      <div className="admin-header">
        <h1 className="admin-title">Revenue Dashboard</h1>
      </div>

      {/* Revenue Overview Card */}
      <div className="revenue-overview-card">
        <div className="revenue-icon-wrapper">
          <HiOutlineCurrencyDollar className="revenue-icon" />
        </div>
        <div className="revenue-info">
          <h2 className="revenue-label">Total Revenue</h2>
          <div className="revenue-amount">${revenueData.totalRevenue.toFixed(2)}</div>
          <div className="revenue-trend">
            <HiOutlineTrendingUp /> 
            <span>Showing results for the selected period</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="admin-toolbar glass revenue-filter-bar">
        <div className="filter-title-wrapper">
          <HiOutlineCalendar size={20} className="text-primary" />
          <h3>Filter by Date</h3>
        </div>
        
        <form className="revenue-filter-form" onSubmit={handleFilterSubmit}>
          <div className="filter-select-group">
            <label>Year</label>
            <select name="year" className="form-control" value={dateFilter.year} onChange={handleChange}>
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          
          <div className="filter-select-group">
            <label>Month</label>
            <select name="month" className="form-control" value={dateFilter.month} onChange={handleChange}>
              <option value="">All Months</option>
              {months.map(m => <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'short' })}</option>)}
            </select>
          </div>
          
          <div className="filter-select-group">
            <label>Day</label>
            <select name="day" className="form-control" value={dateFilter.day} onChange={handleChange}>
              <option value="">All Days</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary filter-btn">
            <HiOutlineSearch /> Filter
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="admin-content glass">
        <div className="orders-header">
          <h3>Recent Orders ({revenueData.orders.length})</h3>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No orders found for this period</td>
                  </tr>
                ) : (
                  revenueData.orders.map(order => (
                    <tr key={order._id || order.id}>
                      <td className="font-medium text-primary">#{String(order._id || order.id).substring(0, 8).toUpperCase()}</td>
                      <td>{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                      <td>{order.user?.username || order.user?.fullname || 'Unknown User'}</td>
                      <td>
                        <span className="stock-badge medium">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td className="font-medium">${(order.totalAmount || order.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
