import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { HiOutlineBell, HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi';
import '../styles/NotificationsPage.css';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearNotifications } = useAppContext();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page page-container">
      <div className="notifications-header">
        <div className="header-title">
          <HiOutlineBell size={32} className="text-primary" />
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="badge">{unreadCount} New</span>
          )}
        </div>
        
        {notifications.length > 0 && (
          <button className="btn btn-secondary" onClick={clearNotifications}>
            <HiOutlineTrash /> Clear All
          </button>
        )}
      </div>

      <div className="notifications-content glass">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <HiOutlineBell size={64} className="empty-icon" />
            <h2>No Notifications</h2>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <ul className="notifications-list">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''} cursor-pointer`}
                onClick={() => {
                  if (!notification.read) {
                    markNotificationRead(notification.id);
                  }
                  navigate(`/notifications/${notification.id}`);
                }}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {notification.type === 'info' && <HiOutlineBell />}
                  {notification.type === 'success' && <HiOutlineCheck />}
                  {notification.type === 'warning' && <HiOutlineBell />}
                  {notification.type === 'error' && <HiOutlineBell />}
                </div>
                
                <div className="notification-details">
                  <div className="notification-meta">
                    <h3 className="notification-title">{notification.title}</h3>
                    <span className="notification-time">{formatDate(notification.timestamp)}</span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                </div>
                
                {!notification.read && (
                  <div className="unread-dot"></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
