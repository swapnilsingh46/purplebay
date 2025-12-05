// src/services/ordersService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to create a new order (listing NOT marked as sold yet)
export const createOrder = async ({ listingId, quantity, shippingAddress }) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a POST request to /api/orders with order details
  const res = await api.post(
    "/orders",
    { listingId, quantity, shippingAddress },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Always return a clean order object
  return res.data.order;
};

// Function to get orders of the current logged-in user
export const getMyOrders = async () => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a GET request to /api/orders/me
  const res = await api.get("/orders/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Ensure an array is returned, fallback to res.data.orders if needed
  return Array.isArray(res.data) ? res.data : res.data.orders || [];
};

// Function to update the status of an order (for seller/admin)
export const updateOrderStatus = async (orderId, status) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a PATCH request to /api/orders/:orderId/status with new status
  const res = await api.patch(
    `/orders/${orderId}/status`,
    { status },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Return the updated order object
  return res.data.order;
};

