// src/services/paymentService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";
const getToken = () => localStorage.getItem("token");

export const mockPayment = async (paymentData) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/mock`, paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
