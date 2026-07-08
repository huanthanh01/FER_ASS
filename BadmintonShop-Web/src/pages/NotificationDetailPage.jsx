import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { HiOutlineBell, HiOutlineCheck, HiOutlineArrowLeft } from 'react-icons/hi';
import '../styles/NotificationsPage.css'; // We can reuse the styles or add new ones

export default function NotificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useAppContext();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const found = notifications.find(n => n.id === id);
    if (found) {
      setNotification(found);
      if (!found.read) {
        markNotificationRead(id);
      }
    }
  }, [id, notifications, markNotificationRead]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
  };

  if (!notification) {
    return (
      <div className="notifications-page page-container">
        <div className="notifications-content glass">
          <div className="empty-notifications">
            <h2>Notification Not Found</h2>
            <p>The notification you are looking for does not exist or has been deleted.</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/notifications')}>
              Back to Notifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page page-container">
      <div className="notifications-header">
        <div className="header-title">
          <button className="btn btn-icon" onClick={() => navigate('/notifications')}>
            <HiOutlineArrowLeft size={24} />
          </button>
          <h1>Notification Detail</h1>
        </div>
      </div>

      <div className="notifications-content glass p-6">
        <div className="notification-detail-container">
          <div className={`notification-icon-large ${notification.type} mb-4`}>
            {notification.type === 'info' && <HiOutlineBell size={48} />}
            {notification.type === 'success' && <HiOutlineCheck size={48} />}
            {notification.type === 'warning' && <HiOutlineBell size={48} />}
            {notification.type === 'error' && <HiOutlineBell size={48} />}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{notification.title}</h2>
          <span className="text-sm text-gray-400 mb-6 block">{formatDate(notification.timestamp)}</span>
          
          <div className="notification-body bg-gray-800 p-4 rounded-lg">
            <p className="text-lg leading-relaxed">{notification.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
