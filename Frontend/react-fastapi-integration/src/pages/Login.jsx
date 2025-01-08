// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Updated API endpoint for login
      const response = await axios.post(
        "http://localhost:8000/penta-blog/api/login", // Correct FastAPI login endpoint
        new URLSearchParams({ username, password }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);  // Save token in localStorage

      navigate("/dashboard");  // Navigate to dashboard on success
    } catch (err) {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Register Link */}
      <p className="register-link">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")} className="register-now">
          Register now
        </span>
      </p>
    </div>
  );
};

export default Login;
