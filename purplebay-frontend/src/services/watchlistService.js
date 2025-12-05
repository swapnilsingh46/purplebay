// src/services/watchlistService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// ----------------------------
// GET all watchlist items of the current user
// Backend endpoint: GET /api/watchlist
// ----------------------------
export const getWatchlist = async () => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/watchlist
  const res = await api.get("/watchlist", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the array of watchlist items
  return res.data;
};

// ----------------------------
// POST add a listing to the current user's watchlist
// Backend endpoint: POST /api/watchlist/:listingId
// ----------------------------
export const addToWatchlist = async (listingId) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a POST request to /api/watchlist/:listingId
  const res = await api.post(
    `/watchlist/${listingId}`,
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Return the newly added watchlist entry
  return res.data;
};

// ----------------------------
// DELETE remove a listing from the current user's watchlist
// Backend endpoint: DELETE /api/watchlist/:watchlistId
// ----------------------------
export const removeFromWatchlist = async (watchlistId) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a DELETE request to /api/watchlist/:watchlistId
  const res = await api.delete(`/watchlist/${watchlistId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the removed watchlist entry (or confirmation)
  return res.data;
};

