import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(""); // Optional field
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Send the request to the correct registration endpoint
      const response = await axios.post(
        "http://localhost:8000/penta-blog/api/users",
        {
          name,
          email,
          username,
          password,
          phone,
        }
      );

      // Show success message
      setMessage("Registration successful! Please log in.");
    } catch (err) {
      // Handle registration failure
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Account
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-purple-600 w-full"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
      <p className="text-gray-700 mt-4">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-purple-500 hover:underline cursor-pointer"
        >
          Login
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

export default Register;
