import axios from "axios";

const API_URL = "http://localhost:5000/api/bids";
const getToken = () => localStorage.getItem("token");

export const getBidsForListing = async (listingId) => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/listing/${listingId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  // If your backend uses GET /api/bids/listing/:listingId change accordingly
  // Fallback: try both endpoints if needed.
  return res.data;
};

export const placeBid = async (listingId, amount) => {
  const token = getToken();
  const res = await axios.post(API_URL, { listingId, amount }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

