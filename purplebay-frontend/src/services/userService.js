// src/services/userService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to get a user profile by user ID
export const getUserProfile = async (id) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/users/:id with Authorization header
  const res = await api.get(`/users/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the user object
  return res.data;
};

// Function to update a user's profile
export const updateUserProfile = async (id, data) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a PATCH request to /api/users/:id with updated profile data
  const res = await api.patch(`/users/${id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the updated user object
  return res.data;
};

// ----------------------------
// Avatar Upload Request
// ----------------------------

// Function to upload/update a user's avatar
export const updateAvatar = async (id, file) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Prepare form data for file upload
  const formData = new FormData();
  formData.append("avatar", file);

  // Sends a PATCH request to /api/users/:id/avatar with multipart/form-data
  const res = await api.patch(`/users/${id}/avatar`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
    },
  });

  // Return the updated user object including avatar
  return res.data;
};

// ----------------------------
// Get currently logged-in user
// ----------------------------

// Function to get the profile of the currently logged-in user
export const getCurrentUserProfile = async () => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");
  if (!token) return null; // If no token, return null

  // Sends a GET request to /api/auth/me to get current user profile
  const res = await api.get("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the current user object
  return res.data;
};

