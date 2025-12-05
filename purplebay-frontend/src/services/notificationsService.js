// src/services/notificationsService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to get all notifications for the current user
export const getNotifications = async () => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/notifications with Authorization header
  const res = await api.get("/notifications", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the array of notifications
  return res.data;
};

// Function to mark a specific notification as read
export const markAsRead = async (id) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a PATCH request to /api/notifications/:id/read
  const res = await api.patch(
    `/notifications/${id}/read`,
    {}, // No body data required
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Return the updated notification object
  return res.data;
};

