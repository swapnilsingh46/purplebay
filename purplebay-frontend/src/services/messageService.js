// src/services/messageService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";
const getToken = () => localStorage.getItem("token");

// GET messages between current user and another user (backend: GET /api/messages/:userId)
export const getMessagesWithUser = async (userId) => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// POST send a message (backend: POST /api/messages)
export const sendMessage = async (receiverId, text) => {
  const token = getToken();
  const res = await axios.post(
    API_URL,
    { receiverId, text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

