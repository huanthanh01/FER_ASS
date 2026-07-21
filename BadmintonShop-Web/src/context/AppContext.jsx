import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, updateUserProfile, changeUserPassword } from '../api/authApi';
import { fetchCart, addToCartAPI, updateCartQuantityAPI, removeFromCartAPI, checkoutCartAPI } from '../api/cartApi';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export function AppProvider({ children }) {
  const navigate = useNavigate();

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [productRefreshKey, setProductRefreshKey] = useState(0);

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  // Auto-login on mount
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const savedUsername = localStorage.getItem('saved_username');
        const savedPassword = localStorage.getItem('saved_password');
        const savedTimestamp = localStorage.getItem('saved_timestamp');

        if (savedUsername && savedPassword) {
          const currentTime = Date.now();
          const timestamp = savedTimestamp ? parseInt(savedTimestamp, 10) : 0;
          const tenMinutesInMs = 10 * 60 * 1000;

          if (currentTime - timestamp <= tenMinutesInMs) {
            const result = await loginUser(savedUsername, savedPassword);
            if (result.success && result.user) {
              setCurrentUser(result.user);
              setIsLoggedIn(true);

              const cartResult = await fetchCart(result.user.id);
              if (cartResult.success && cartResult.cart) {
                setCartItems(cartResult.cart.items);
              }
            }
          } else {
            localStorage.removeItem('saved_username');
            localStorage.removeItem('saved_password');
            localStorage.removeItem('saved_timestamp');
          }
        }
      } catch (err) {
        console.error('Auto-login failed:', err);
      }
    };
    
    const autoAdminLogin = () => {
      const adminData = localStorage.getItem('admin_session');
      if (adminData) {
        try {
          const parsed = JSON.parse(adminData);
          setCurrentAdmin(parsed);
          setIsAdminLoggedIn(true);
        } catch(e) {
          localStorage.removeItem('admin_session');
        }
      }
    };
    
    autoLogin();
    autoAdminLogin();
  }, []);

  const addNotification = useCallback((title, message, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now().toString(),
      title, message, type,
      timestamp: new Date(),
      read: false,
    }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const handleLoginSuccess = useCallback(async (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);

    const cartResult = await fetchCart(user.id);
    if (cartResult.success && cartResult.cart) {
      setCartItems(cartResult.cart.items);
    }

    navigate('/');

    if (!user.phoneNumber) {
      setTimeout(() => {
        addNotification(
          '📱 Phone Number Required',
          'Please add your phone number in the Profile section. You need a phone number to add items to your cart and place orders.',
          'warning'
        );
      }, 1000);
    }
  }, [navigate, addNotification]);

  const handleRegisterSuccess = useCallback((fullname) => {
    toast.success(`Welcome, ${fullname}! Please login to continue.`);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCartItems([]);
    setNotifications([]);
    localStorage.removeItem('saved_username');
    localStorage.removeItem('saved_password');
    localStorage.removeItem('saved_timestamp');
    navigate('/');
    toast.info('Logged out successfully');
  }, [navigate]);

  const handleAdminLoginSuccess = useCallback((user) => {
    setCurrentAdmin(user);
    setIsAdminLoggedIn(true);
    localStorage.setItem('admin_session', JSON.stringify(user));
    navigate('/admin');
  }, [navigate]);

  const handleAdminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    setCurrentAdmin(null);
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
    toast.info('Admin logged out successfully');
  }, [navigate]);

  // Cart actions
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!currentUser) {
      toast.warning('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    if (!currentUser.phoneNumber) {
      toast.warning('Please update your phone number in your profile first.');
      navigate('/profile');
      return;
    }
    const result = await addToCartAPI(currentUser.id, productId, quantity);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
      toast.success('Item added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  }, [currentUser, navigate]);

  const updateCartQuantity = useCallback(async (productId, delta) => {
    if (!currentUser) return;
    const result = await updateCartQuantityAPI(currentUser.id, productId, delta);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
    } else {
      toast.error(result.error || 'Failed to update cart');
    }
  }, [currentUser]);

  const removeFromCart = useCallback(async (productId) => {
    if (!currentUser) return;
    const result = await removeFromCartAPI(currentUser.id, productId);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
      toast.success('Item removed from cart');
    } else {
      toast.error(result.error || 'Failed to remove item');
    }
  }, [currentUser]);

  const checkoutCart = useCallback(async () => {
    if (!currentUser) return;
    setIsGlobalLoading(true);
    const result = await checkoutCartAPI(currentUser.id);
    if (result.success && result.cart) {
      setCartItems(result.cart.items);
      setProductRefreshKey(prev => prev + 1);
      toast.success('Checkout successful! Thank you for your order.');
    } else {
      toast.error(result.error || 'Failed to checkout');
    }
    setIsGlobalLoading(false);
  }, [currentUser]);

  const updateProfile = useCallback(async (fullname, email, phoneNumber) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    setIsGlobalLoading(true);
    try {
      const result = await updateUserProfile(currentUser.id, fullname, email, phoneNumber);
      if (result.success) {
        setCurrentUser(prev => ({ ...prev, fullname, email, phoneNumber }));
      }
      return result;
    } finally {
      setIsGlobalLoading(false);
    }
  }, [currentUser]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    setIsGlobalLoading(true);
    try {
      const result = await changeUserPassword(currentUser.id, currentPassword, newPassword);
      return result;
    } finally {
      setIsGlobalLoading(false);
    }
  }, [currentUser]);

  const value = {
    isLoggedIn, currentUser,
    isAdminLoggedIn, currentAdmin,
    cartItems, isGlobalLoading, productRefreshKey,
    notifications, addNotification, markNotificationRead, clearNotifications,
    theme, toggleTheme,
    handleLoginSuccess, handleRegisterSuccess, handleLogout,
    handleAdminLoginSuccess, handleAdminLogout,
    addToCart, updateCartQuantity, removeFromCart, checkoutCart,
    updateProfile, changePassword,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
