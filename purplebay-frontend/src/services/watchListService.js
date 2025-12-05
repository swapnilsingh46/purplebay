// src/services/watchlistService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/watchlist";
const getToken = () => localStorage.getItem("token");

export const getWatchlist = async () => {
  const token = getToken();
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addToWatchlist = async (listingId) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/${listingId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeFromWatchlist = async (listingId) => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
