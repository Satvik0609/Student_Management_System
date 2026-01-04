import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  registerLocalUser,
  loginLocalUser,
  storeActiveLocalUser,
  getActiveLocalUser,
  clearActiveLocalUser
} from '../utils/localAuth';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user from token on mount
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            timeout: 5000 // 5 second timeout
          });
          if (isMounted) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          // Clear invalid token - backend might be down or token is invalid
          if (isMounted) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } else {
        const localUser = getActiveLocalUser();
        if (isMounted) {
          setUser(localUser);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      clearActiveLocalUser();
      return { success: true, message: response.data.message };
    } catch (error) {
      if (!error.response) {
        try {
          const userData = loginLocalUser(email, password);
          setUser(userData);
          storeActiveLocalUser(userData);
          return { success: true, mode: 'local' };
        } catch (localError) {
          return {
            success: false,
            message: localError.message
          };
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token: newToken, user: newUser, message } = response.data;
      setToken(newToken);
      setUser(newUser);
      clearActiveLocalUser();
      return { success: true, message: message || 'Registration successful!' };
    } catch (error) {
      if (!error.response) {
        try {
          const localUser = registerLocalUser(userData);
          setUser(localUser);
          storeActiveLocalUser(localUser);
          setToken(null);
          return { success: true, mode: 'local' };
        } catch (localError) {
          return {
            success: false,
            message: localError.message
          };
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    clearActiveLocalUser();
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      return updated;
    });
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  }, [user]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

