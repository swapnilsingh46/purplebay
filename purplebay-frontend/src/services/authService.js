// src/services/authService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Login user
export const login = async (email, password) => {
  // Sends a POST request to /api/auth/login on the backend
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// Register a new user
export const register = async (userData) => {
  // Sends a POST request to /api/auth/register on the backend
  const res = await api.post("/auth/register", userData);
  return res.data;
};

// Get currently logged in user
export const getCurrentUser = async () => {
  // If no token in localStorage, return null
  const token = localStorage.getItem("token");
  if (!token) return null;

  // Sends a GET request to /api/auth/me using the token
  const res = await api.get("/auth/me");
  return res.data;
};

