// src/services/paymentService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to simulate a mock payment
export const mockPayment = async (paymentData) => {
  // Fetch the token from localStorage (required for authentication)
  const token = localStorage.getItem("token");

  // Sends a POST request to /api/payments/mock with payment details
  const res = await api.post(
    "/payments/mock",
    paymentData,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  // Return the payment response data
  return res.data;
};

