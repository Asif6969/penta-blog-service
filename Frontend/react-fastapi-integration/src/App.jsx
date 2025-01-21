// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import Role from "./pages/Role";
import Category from "./pages/Category";
//import "./App.css";
import "./TailwindApp.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/role" element={<Role />} />
        <Route path="/category" element={<Category />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="container mx-auto text-center p-8 bg-opacity-75 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to Penta Global Blog
        </h1>
        <p className="text-lg text-gray-300 mb-4">Choose an option:</p>
        <div className="flex flex-col space-y-4 lg:flex-col lg:space-y-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:bg-blue-700 hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => (window.location.href = "/register")}
            className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:bg-green-700 hover:scale-105"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
