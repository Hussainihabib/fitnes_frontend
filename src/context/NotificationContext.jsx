import { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

export const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/notifications/${user._id}`);
      if (Array.isArray(res.data)) {
        const sorted = res.data.sort((a, b) => {
          if (a.read !== b.read) return a.read ? 1 : -1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setNotifications(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [user]);

const notifyReminder = async (reminder, action = "added") => {
  if (!user?._id) return;
  try {
    const message = reminder.title || "Reminder Notification";
    const type = "reminder";

    const res = await api.post("/notifications", {
      userId: user._id,
      message,
      type,
    });

    setNotifications(prev => [res.data, ...prev]);

  } catch (err) {
    console.error("Failed to create reminder notification:", err);
  }
};


  const markNotificationAsRead = async (id) => {
    const originalNotifications = notifications;
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await api.put(`/notifications/read/${id}`);
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read:`, err);
      setNotifications(originalNotifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        markNotificationAsRead,
        notifyReminder
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
