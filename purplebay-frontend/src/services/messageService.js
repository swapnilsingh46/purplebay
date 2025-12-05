// src/services/messageService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// ----------------------------
// GET messages between current user and another user
// Backend endpoint: GET /api/messages/:userId
// ----------------------------
export const getMessagesWithUser = async (userId) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/messages/:userId
  const res = await api.get(`/messages/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the array of messages
  return res.data;
};

// ----------------------------
// POST send a message to another user
// Backend endpoint: POST /api/messages
// ----------------------------
export const sendMessage = async (receiverId, text) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a POST request to /api/messages with receiver ID and message text
  const res = await api.post(
    "/messages",
    { receiverId, text },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Return the newly created message object
  return res.data;
};

