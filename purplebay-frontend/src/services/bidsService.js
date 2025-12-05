import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to get all bids for a specific listing
export const getBidsForListing = async (listingId) => {
  // Fetch the token from localStorage (if user is logged in)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/bids/listing/:listingId on the backend
  // If your backend uses GET /api/bids/listing/:listingId change accordingly
  // Fallback: try both endpoints if needed.
  const res = await api.get(`/bids/listing/${listingId}`, {
    // Only send Authorization header if token exists
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Return the response data (array of bids)
  return res.data;
};

// Function to place a new bid on a listing
export const placeBid = async (listingId, amount) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a POST request to /api/bids with listingId and bid amount
  // Authorization header is automatically included if token exists
  const res = await api.post(
    "/bids",
    { listingId, amount },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Return the newly created bid object
  return res.data;
};

