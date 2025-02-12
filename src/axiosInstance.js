import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    // Fetch token dynamically from localStorage (or sessionStorage)
    const token = process.env.REACT_APP_AUTHORIZATION_TOKEN;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Authorization token is missing!");
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);
// Response Interceptor (Handle Errors)
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("authToken"); // Clear token
        window.location.href = "/login"; // Redirect to login page
      } else if (error.response.status === 403) {
        console.warn("Forbidden! You don’t have permission.");
      } else if (error.response.status === 500) {
        console.error("Server error! Please try again later.");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
    
    return Promise.reject(error);
  }
);


export default api;
