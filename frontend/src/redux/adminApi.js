import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const adminRequest = async (config) => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await axios({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
    url: `${API_URL}${config.url}`,
  });
  return response.data;
};

export const adminError = (error) =>
  error.response?.data || { message: error.message || "The request failed" };
