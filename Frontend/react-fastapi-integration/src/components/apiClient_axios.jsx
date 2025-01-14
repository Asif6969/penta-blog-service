import axios from "axios";
import { refreshAccessToken } from "./authUtils";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/penta-blog/api",
  withCredentials: true, // Include cookies in requests
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 (Unauthorized) and this is the first retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh token failed
        console.error("Failed to refresh token:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
