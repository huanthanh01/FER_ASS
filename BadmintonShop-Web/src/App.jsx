import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
const ShopPage = React.lazy(() => import('./pages/ShopPage'));
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/auth/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import ReportPage from './pages/ReportPage';
import SupportPage from './pages/SupportPage';
import RacketFinderPage from './pages/RacketFinderPage';

// Admin Pages & Layout
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminRevenuePage from './pages/admin/AdminRevenuePage';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<AuthPage view="login" />} />
        <Route path="/register" element={<AuthPage view="register" />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={
            <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Shop...</div>}>
              <ShopPage />
            </Suspense>
          } />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notifications/:id" element={<NotificationDetailPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="racket-finder" element={<RacketFinderPage />} />
        </Route>

        {/* Admin Login (Isolated from Layout) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Dedicated Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="revenue" element={<AdminRevenuePage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AppProvider>
  );
}

export default App;
