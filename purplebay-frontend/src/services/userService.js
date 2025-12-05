// src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";
const AUTH_URL = "http://localhost:5000/api/auth";
const getToken = () => localStorage.getItem("token");

export const getUserProfile = async (id) => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  const token = getToken();
  const res = await axios.patch(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// ----------------------------
// Avatar Upload Request
// ----------------------------
export const updateAvatar = async (id, file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.patch(`${API_URL}/${id}/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};

// ----------------------------
// Get currently logged in user
// ----------------------------
export const getCurrentUserProfile = async () => {
  const token = getToken();
  if (!token) return null;

  const res = await axios.get(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

