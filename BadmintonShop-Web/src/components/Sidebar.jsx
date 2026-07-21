import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ShopLogo from "../assets/ShopLogo.png";
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import ClassStateSummary from "./ClassStateSummary";

export default function Sidebar() {
  const { isLoggedIn, currentUser, cartItems, notifications, handleLogout } =
    useAppContext();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = [
    { to: "/", icon: HiOutlineHome, label: "Home" },
    { to: "/shop", icon: HiOutlineShoppingBag, label: "Shop" },
    {
      to: "/cart",
      icon: HiOutlineShoppingCart,
      label: "Cart",
      badge: cartCount,
    },
    {
      to: "/notifications",
      icon: HiOutlineBell,
      label: "Notifications",
      badge: unreadCount,
    },
    { to: "/profile", icon: HiOutlineUser, label: "Profile" },
  ];

  return (
    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => window.location.href = "/"}>
          <img src={ShopLogo} alt="BWF Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', minWidth: '32px' }} />
          {!sidebarCollapsed && <span className="logo-text">BWF-Store</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <HiOutlineMenu size={20} />
          ) : (
            <HiOutlineX size={20} />
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!sidebarCollapsed && <span className="nav-section-label">Menu</span>}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={22} />
              {!sidebarCollapsed && (
                <span className="nav-label">{item.label}</span>
              )}
              {item.badge > 0 && (
                <span className="nav-badge">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

      </nav>

      <ClassStateSummary 
        cartCount={cartCount} 
        unreadCount={unreadCount} 
        sidebarCollapsed={sidebarCollapsed} 
      />

      <div className="sidebar-footer">
        {isLoggedIn ? (
          <div className="user-card">
            <div className="user-avatar">
              {currentUser?.fullname?.charAt(0).toUpperCase() || "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <span className="user-name">{currentUser?.fullname}</span>
                <span className="user-role">
                  Customer
                </span>
              </div>
            )}
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <HiOutlineLogout size={18} />
            </button>
          </div>
        ) : (
          <button
            className="login-sidebar-btn"
            onClick={() => navigate("/login")}
          >
            <HiOutlineUser size={20} />
            {!sidebarCollapsed && <span>Login / Register</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
