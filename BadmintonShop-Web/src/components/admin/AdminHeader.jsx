import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiOutlineBell, HiOutlineLogout, HiOutlineShoppingBag, HiOutlineDatabase, HiOutlineCheck } from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getOrders } from '../../api/orderApi';

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAdmin, handleAdminLogout } = useAppContext();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { 
      id: 'sys1', 
      type: 'system', 
      title: 'System Operational', 
      message: 'All backend systems are running optimally.', 
      time: '1h ago', 
      read: true 
    },
    { 
      id: 'sys2', 
      type: 'system', 
      title: 'Database Backup', 
      message: 'Daily automated backup completed successfully.', 
      time: '3h ago', 
      read: true 
    },
  ]);

  // Sync Search input with URL if already on a search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    if (
      location.pathname.startsWith('/admin/products') ||
      location.pathname.startsWith('/admin/orders') ||
      location.pathname.startsWith('/admin/users')
    ) {
      setSearchVal(searchParam);
    } else {
      setSearchVal('');
    }
  }, [location]);

  // Fetch recent orders as live notifications
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await getOrders();
        if (res.success && res.orders) {
          // Get the 3 most recent orders
          const recentOrders = res.orders.slice(0, 3);
          const orderNotifications = recentOrders.map(order => ({
            id: `order_${order._id || order.id}`,
            type: 'order',
            title: 'New Order Placed',
            message: `Order #${String(order._id || order.id).substring(0, 8).toUpperCase()} received from ${order.user?.fullname || order.user?.username || 'Customer'} - $${(order.totalAmount || 0).toFixed(2)}`,
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            link: `/admin/orders?search=${order._id || order.id}`
          }));

          setNotifications(prev => {
            // Keep the system notifications but prepend the actual order notifications
            const sysNotifs = prev.filter(n => n.type === 'system');
            
            // Avoid duplicate additions
            const uniqueOrderNotifs = orderNotifications.filter(
              newN => !prev.some(existingN => existingN.id === newN.id)
            );
            
            return [...uniqueOrderNotifs, ...prev];
          });
        }
      } catch (err) {
        console.error('Failed to fetch recent orders for notifications:', err);
      }
    };

    fetchRecentOrders();
    // Poll every 30 seconds to fetch new orders
    const interval = setInterval(fetchRecentOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    const query = searchVal.trim();
    
    // If already on one of the search-capable pages, update search query param
    if (location.pathname.startsWith('/admin/orders')) {
      navigate(`/admin/orders?search=${encodeURIComponent(query)}`);
    } else if (location.pathname.startsWith('/admin/users')) {
      navigate(`/admin/users?search=${encodeURIComponent(query)}`);
    } else if (location.pathname.startsWith('/admin/products')) {
      navigate(`/admin/products?search=${encodeURIComponent(query)}`);
    } else {
      // Intelligent routing from other pages
      if (query.startsWith('#') || /^[0-9a-fA-F]{4,24}$/.test(query)) {
        navigate(`/admin/orders?search=${encodeURIComponent(query.replace('#', ''))}`);
      } else if (query.includes('@') || query.startsWith('@')) {
        navigate(`/admin/users?search=${encodeURIComponent(query.replace('@', ''))}`);
      } else {
        navigate(`/admin/products?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setShowNotifDropdown(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between px-6">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products, orders or users..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-500"
          />
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-all"
          >
            <HiOutlineBell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1 transition-colors"
                  >
                    <HiOutlineCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-slate-800/50 ${!notif.read ? 'bg-slate-800/20' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'order' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {notif.type === 'order' ? <HiOutlineShoppingBag className="w-4 h-4" /> : <HiOutlineDatabase className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200 truncate">{notif.title}</span>
                          <span className="text-[10px] text-slate-500 flex-shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-normal break-words">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 self-center flex-shrink-0"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-800 px-4 py-2 bg-slate-950 text-center">
                <button 
                  onClick={() => { setShowNotifDropdown(false); navigate('/admin/orders'); }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  View all orders
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-800 mx-2"></div>
        
        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{currentAdmin?.fullname || 'Admin User'}</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20 group-hover:opacity-90 transition-opacity">
              {currentAdmin?.fullname?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={handleAdminLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <HiOutlineLogout className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
