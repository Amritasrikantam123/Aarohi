import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to attach Authorization JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("aarohi_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle session expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("aarohi_token");
      localStorage.removeItem("aarohi_user");
    }
    return Promise.reject(error);
  }
);

export default api;
