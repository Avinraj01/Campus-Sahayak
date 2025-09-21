import axios from "axios";

// Use the environment variable or fallback to localhost for development
// For Vercel deployment, we use the proxy path /api which will be rewritten to the actual backend
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "";

console.log("API Base URL:", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 30000, // Increased timeout to 30 seconds for better reliability
});

// Add a request interceptor to automatically add the Authorization header
api.interceptors.request.use(
  (config) => {
    console.log("Making API request to:", config.url);
    console.log("Request config:", config);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For local development with no backend URL set, or when using localhost backend,
    // we need to add /api prefix to the URL
    // For Vercel deployment with proxy, the URL should not have /api prefix as it's handled by the proxy
    if ((!process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL.includes('localhost')) 
        && config.url && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("API response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error.message);
    // Handle network errors
    if (!error.response) {
      console.error("Network Error: Please check your internet connection and backend server status");
      // Provide more specific error message
      if (error.code === 'ECONNABORTED') {
        console.error("Request timeout - the server is taking too long to respond");
      } else if (error.message.includes('Network Error')) {
        console.error("Network connectivity issue - please check if the backend server is running");
      }
    } else {
      console.error("Server responded with error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    return Promise.reject(error);
  }
);