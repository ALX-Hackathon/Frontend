// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user: { name: string, role: 'guest' | 'staff' | 'admin' } | null
  const [isLoading, setIsLoading] = useState(true); // Check initial auth state

  // Simulate checking auth status on initial load (e.g., from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('habeshaUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user", e);
        localStorage.removeItem('habeshaUser'); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []);

  // Simulated login function
  const login = (userData) => {
     // In real app, call API, get JWT, verify, then setUser
    if (!userData || !userData.role) { // Basic check
        console.error("Invalid user data for login");
        return;
    }
    setUser(userData);
    localStorage.setItem('habeshaUser', JSON.stringify(userData));
    console.log("User logged in:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('habeshaUser');
    console.log("User logged out");
    // In real app, also invalidate session/token on server side if possible
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  // Don't render children until loading is complete to avoid flicker
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};