import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user data if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !user) {
        setToken(storedToken);
        // You might want to verify the token with the server here
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    // Persist token immediately to avoid losing it on navigation reloads
    if (userToken) {
      try {
        localStorage.setItem('token', userToken);
      } catch (e) {
        // ignore storage errors
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, setIsLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
