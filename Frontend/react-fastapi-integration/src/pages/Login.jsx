// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "../styles/Role_Register.css";

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
          withCredentials: true,
        }
      );
      const { access_token } = response.data;
      localStorage.setItem("token", access_token); // Save token in localStorage

      navigate("/dashboard"); // Navigate to dashboard on success
    } catch (err) {
      setError("Incorrect username or password.");
    }
  };
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-semibold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-purple-600 w-full"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="text-gray-700 mt-4">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-purple-500 hover:underline cursor-pointer"
        >
          Register now
        </span>
      </p>

      <button
        className="relative inline-flex items-center justify-center p-0.5 mt-3 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        onClick={handleBackToHome}
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Go Back
        </span>
      </button>
    </div>
  );
};

export default Login;
