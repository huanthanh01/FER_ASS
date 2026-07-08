import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/Auth/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminRevenuePage from './pages/AdminRevenuePage';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<AuthPage view="login" />} />
        <Route path="/register" element={<AuthPage view="register" />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notifications/:id" element={<NotificationDetailPage />} />
          
          {/* Admin Routes */}
          <Route path="admin/products" element={<AdminProductsPage />} />
          <Route path="admin/revenue" element={<AdminRevenuePage />} />
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
