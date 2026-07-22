import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineLockClosed } from 'react-icons/hi';
import { adminLogin } from '../../api/authApi';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import ShopLogo from '../../assets/ShopLogo.png';
import '../../styles/AdminLoginPage.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { handleAdminLoginSuccess } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Force dark theme for admin login page by overriding root data-theme attribute
    const originalTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
    
    return () => {
      // Restore user theme on unmount
      if (originalTheme) {
        document.documentElement.setAttribute('data-theme', originalTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    const result = await adminLogin(username, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Admin login successful');
      handleAdminLoginSuccess(result.user);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="admin-login-wrapper admin-theme-override">
      
      {/* Animated Background Shapes */}
      <div className="admin-bg-shape-1"></div>
      <div className="admin-bg-shape-2"></div>

      <div className="admin-login-content">
        
        {/* Logo & Header */}
        <div className="admin-header">
          <div className="admin-logo-box">
            <img src={ShopLogo} alt="Logo" />
          </div>
          <h1 className="admin-title">Admin Portal</h1>
          <p className="admin-subtitle">Control Center Authentication</p>
        </div>

        {/* Login Card (Glassmorphism) */}
        <div className="admin-card">
          <form onSubmit={handleLogin} className="admin-form">
            
            {/* Username Field */}
            <div className="admin-input-group">
              <label className="admin-label">Username / Email</label>
              <div className="admin-input-wrapper">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-input"
                  placeholder="admin@example.com"
                />
                <HiOutlineUser className="admin-icon" />
              </div>
            </div>

            {/* Password Field */}
            <div className="admin-input-group">
              <label className="admin-label">Password</label>
              <div className="admin-input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                  placeholder="••••••••"
                />
                <HiOutlineLockClosed className="admin-icon" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="admin-submit-btn"
            >
              {isLoading ? (
                <div className="admin-spinner"></div>
              ) : (
                'SECURE SIGN IN'
              )}
            </button>
          </form>
        </div>
        
        {/* Back Link */}
        <div className="admin-back-link">
          <button 
            onClick={() => navigate('/')} 
            className="admin-back-btn"
          >
            <span>&larr;</span> Return to Shop
          </button>
        </div>
      </div>
    </div>
  );
}
