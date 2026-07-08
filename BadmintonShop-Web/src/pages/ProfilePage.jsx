import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed, HiOutlineLogout } from 'react-icons/hi';
import { toast } from 'react-toastify';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, updateProfile, changePassword, handleLogout, isGlobalLoading } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('personal'); // personal, security
  
  // Profile Form
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phoneNumber: ''
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (currentUser) {
      setProfileData({
        fullname: currentUser.fullname || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || ''
      });
    }
  }, [isLoggedIn, currentUser, navigate]);

  if (!currentUser) return null;

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullname || !profileData.email) {
      toast.error('Full name and email are required');
      return;
    }

    const result = await updateProfile(profileData.fullname, profileData.email, profileData.phoneNumber);
    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (result.success) {
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(result.error || 'Failed to change password');
    }
  };

  return (
    <div className="profile-page page-container">
      <div className="profile-header">
        <h1 className="profile-title">My Account</h1>
        <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
          <HiOutlineLogout /> Logout
        </button>
      </div>
      
      <div className="profile-layout">
        {/* Sidebar Tabs */}
        <aside className="profile-sidebar">
          <div className="user-profile-summary glass">
            <div className="profile-avatar-large">
              {currentUser.fullname?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3>{currentUser.fullname}</h3>
            <p className="role-badge">{currentUser.role === 'admin' ? 'Admin' : 'Member'}</p>
          </div>
          
          <nav className="profile-nav glass">
            <button 
              className={`profile-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <HiOutlineUser /> Personal Information
            </button>
            <button 
              className={`profile-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <HiOutlineLockClosed /> Security & Password
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="profile-content glass">
          {activeTab === 'personal' && (
            <div className="profile-section">
              <h2>Personal Information</h2>
              <p className="section-desc">Update your personal details and contact information.</p>
              
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <HiOutlineUser className="input-icon" />
                    <input 
                      type="text" 
                      className="form-control" 
                      name="fullname"
                      value={profileData.fullname}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-with-icon">
                    <HiOutlineMail className="input-icon" />
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Required for checkout)</label>
                  <div className="input-with-icon">
                    <HiOutlinePhone className="input-icon" />
                    <input 
                      type="text" 
                      className="form-control" 
                      name="phoneNumber"
                      placeholder="e.g. 0123456789"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isGlobalLoading}>
                  {isGlobalLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <h2>Security & Password</h2>
              <p className="section-desc">Manage your password and security settings.</p>
              
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div className="input-with-icon">
                    <HiOutlineLockClosed className="input-icon" />
                    <input 
                      type="password" 
                      className="form-control" 
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-with-icon">
                    <HiOutlineLockClosed className="input-icon" />
                    <input 
                      type="password" 
                      className="form-control" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-with-icon">
                    <HiOutlineLockClosed className="input-icon" />
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isGlobalLoading}>
                  {isGlobalLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
