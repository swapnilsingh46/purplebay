// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { getMyNotifications } from "../services/notificationService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch current logged-in user
  const fetchUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u || null);
    } catch (err) {
      setUser(null);
    }
  };

  // Fetch notifications for user
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const n = await getMyNotifications();
      setNotifications(n || []);
      setUnreadCount((n || []).filter((x) => !x.read).length);
    } catch (err) {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Refresh notifications periodically if logged in
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    fetchNotifications();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        notifications,
        setNotifications,
        fetchNotifications,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

