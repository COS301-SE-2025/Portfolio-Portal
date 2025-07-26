// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      if (token && storedUserId) {
        try {
          const response = await api.get('/users/me');
          if (response.status === 200) {
            setIsAuthenticated(true);
            setUserId(storedUserId);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setIsAuthenticated(false);
            setUserId(null);
          }
        } catch (err) {
          console.error('Auth check error:', err.response?.status, err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
          setUserId(null);
        }
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, isLoadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};