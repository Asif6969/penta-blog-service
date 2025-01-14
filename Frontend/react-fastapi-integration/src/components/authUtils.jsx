import * as jwtDecode from "jwt-decode";
import axios from "axios";

export const isTokenExpired = (token) => {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000; // Current time in seconds
  return decoded.exp < now + 30; // Consider expired if less than 30 seconds remain
};

export const refreshAccessToken = async () => {
  const token = localStorage.getItem("token");
  if (token && !isTokenExpired(token)) {
    return token; // Return current token if it's still valid
  }

  try {
    const response = await axios.post(
      "http://localhost:8000/penta-blog/api/refresh-token",
      {},
      { withCredentials: true }
    );

    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    return access_token;
  } catch (err) {
    console.error("Error refreshing token:", err);
    throw new Error("Failed to refresh access token");
  }
};
