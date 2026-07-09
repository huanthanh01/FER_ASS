import React, { useState } from 'react';
import { HiOutlineSearch, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';
import { useAppContext } from '../../context/AppContext';

export default function AdminHeader() {
  const { currentAdmin, handleAdminLogout } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <HiOutlineBell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-slate-900"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-800 mx-2"></div>
        
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{currentAdmin?.fullname || 'Admin User'}</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              {currentAdmin?.fullname?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
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
