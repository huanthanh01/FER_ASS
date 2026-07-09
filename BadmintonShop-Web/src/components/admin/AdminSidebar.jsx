import React from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineChartSquareBar,
  HiOutlineCog,
} from "react-icons/hi";
import ShopLogo from "../../assets/ShopLogo.png";

export default function AdminSidebar() {
  const menuItems = [
    { to: "/admin/dashboard", icon: HiOutlineViewGrid, label: "Dashboard" },
    { to: "/admin/users", icon: HiOutlineUsers, label: "Users" },
    { to: "/admin/orders", icon: HiOutlineShoppingCart, label: "Orders" },
    { to: "/admin/products", icon: HiOutlineCube, label: "Products" },
    { to: "/admin/reports", icon: HiOutlineChartSquareBar, label: "Reports" },
    { to: "/admin/settings", icon: HiOutlineCog, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col hidden md:flex h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <img src={ShopLogo} alt="Logo" className="w-8 h-8 mr-3" />
        <span className="text-xl font-bold text-white tracking-wide">
          Admin Page
        </span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500/10 text-orange-500 font-medium"
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Return to Shop link */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm"
        >
          <span>&larr; Back to Shop</span>
        </NavLink>
      </div>
    </aside>
  );
}
