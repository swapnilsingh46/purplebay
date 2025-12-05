import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";
const getToken = () => localStorage.getItem("token");

// Create a new order (listing NOT marked as sold yet)
export const createOrder = async ({ listingId, quantity, shippingAddress }) => {
  const token = getToken();
  const res = await axios.post(
    API_URL,
    { listingId, quantity, shippingAddress },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // Always return a clean order object
  return res.data.order;
};

// Get orders of current user
export const getMyOrders = async () => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Ensure array is returned
  return Array.isArray(res.data) ? res.data : res.data.orders || [];
};

// Update order status (for seller/admin)
export const updateOrderStatus = async (orderId, status) => {
  const token = getToken();
  const res = await axios.patch(
    `${API_URL}/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.order;
};

