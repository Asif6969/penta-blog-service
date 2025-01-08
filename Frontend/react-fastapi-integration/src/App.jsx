// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import Role from "./pages/Role";
import Category from "./pages/Category";
import "./App.css";

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
    <div className="home-container">
      <h1>Welcome to the Penta Blog</h1>
      <p>Choose an option:</p>
      <button onClick={() => (window.location.href = "/login")}>Login</button>
      <button onClick={() => (window.location.href = "/register")}>
        Create New Account
      </button>
    </div>
  );
};

export default App;
