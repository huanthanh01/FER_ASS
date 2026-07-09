import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export default function AdminLayout() {
  const { currentAdmin, isAdminLoggedIn } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow admin access based on the separate admin session
    if (!isAdminLoggedIn || !currentAdmin) {
      navigate('/admin/login');
    }
  }, [currentAdmin, isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn || !currentAdmin) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans selection:bg-orange-500/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
