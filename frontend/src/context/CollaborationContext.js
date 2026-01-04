import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const CollaborationContext = createContext();

export const CollaborationProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('srms-user');
    if (stored) return JSON.parse(stored);
    return {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      lastSeen: Date.now()
    };
  });
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Save user to localStorage
  useEffect(() => {
    localStorage.setItem('srms-user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Simulate real-time updates (in production, use WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate other users
      const mockUsers = [
        { id: 'user-1', name: 'Alice', color: '#3b82f6', lastSeen: Date.now() - 5000 },
        { id: 'user-2', name: 'Bob', color: '#10b981', lastSeen: Date.now() - 10000 }
      ].filter(u => u.id !== currentUser.id);
      
      setActiveUsers([currentUser, ...mockUsers]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const addActivity = useCallback((activity) => {
    const newActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: Date.now(),
      user: currentUser
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 50));
  }, [currentUser]);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: Date.now(),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotif.title || 'SRMS Pro', {
        body: newNotif.message,
        icon: '/logo192.png',
        badge: '/logo192.png'
      });
    }
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const updateCurrentUser = useCallback((updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates, lastSeen: Date.now() }));
  }, []);

  const value = {
    activeUsers,
    currentUser,
    activities,
    notifications,
    addActivity,
    addNotification,
    markNotificationRead,
    updateCurrentUser
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

CollaborationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};
