// src/services/categoryService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to fetch all categories from the backend
export const getCategories = async () => {
  // Sends a GET request to /api/categories on the backend
  const res = await api.get("/categories");

  // Return the response data (array of categories)
  return res.data;
};

