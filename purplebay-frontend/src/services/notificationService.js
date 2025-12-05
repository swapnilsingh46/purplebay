import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";
const getToken = () => localStorage.getItem("token");

export const getMyNotifications = async () => {
  const token = getToken();
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markNotificationRead = async (id) => {
  const token = getToken();
  const res = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

