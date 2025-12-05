// src/services/notificationsService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to get notifications for the current user
export const getMyNotifications = async () => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/notifications with Authorization header
  const res = await api.get("/notifications", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the array of notifications
  return res.data;
};

// Function to mark a notification as read by ID
export const markNotificationRead = async (id) => {
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

