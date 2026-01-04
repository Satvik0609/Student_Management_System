import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useCollaboration } from '../context/CollaborationContext';

const NotificationBell = () => {
  const { notifications, markNotificationRead } = useCollaboration();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }
    if (notif.url) {
      window.location.href = notif.url;
    }
    setOpen(false);
  };

  return (
    <div className="notification-bell">
      <button
        className="notification-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      {open && (
        <>
          <div className="notification-overlay" onClick={() => setOpen(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h5>Notifications</h5>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">No notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="notification-content">
                      <div className="notification-title">{notif.title}</div>
                      <div className="notification-message">{notif.message}</div>
                      <div className="notification-time">{formatTime(notif.timestamp)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;

