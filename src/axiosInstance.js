import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically
api.interceptors.request.use((config) => {
  const token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("Authorization token is missing!");
  }
  return config;
});

export default api;
