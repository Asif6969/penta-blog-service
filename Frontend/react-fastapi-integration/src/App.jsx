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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./components/apiClient_axios";
import axios from "axios";

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
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Track selected category
  const [postId, setPostId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // State to hold selected post
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await apiClient.get("/current-user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserInfo(response.data.current_user);
        } catch (err) {
          console.error("Failed to fetch user info.");
        }
      };

      fetchUserInfo();
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/penta-blog/api/posts"
      );
      setPosts(response.data);
      setFilteredPosts(response.data); // Initially show all posts
    } catch (error) {
      setError("Error fetching posts.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsByCategory = async (categoryId) => {
    setLoading(true);
    setError(""); // Reset the error message

    let url = "http://localhost:8000/penta-blog/api/posts"; // Default URL for all posts

    if (categoryId && categoryId.trim() !== "") {
      url = `http://localhost:8000/penta-blog/api/posts/category/${categoryId}`; // URL for category posts
    }

    try {
      const response = await axios.get(url);
      setPosts(response.data); // Set posts to the response data
      setFilteredPosts(response.data); // Update filtered posts
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Soft delete posts by user ID
  const softDeletePost = async () => {
    if (!userId) {
      setResponseMessage("Please enter a user ID.");
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:8000/penta-blog/api/posts/${userId}"
      );
      setResponseMessage(`Posts by user ID ${userId} have been soft deleted.`);
    } catch (error) {
      setResponseMessage("Failed to soft delete posts.");
    }
  };

  // Restore soft-deleted posts by userId
  const restorePost = async () => {
    if (!userId) {
      setResponseMessage("Please enter a user ID.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/penta-blog/api/posts/${userId}/restore",
        {}
      );
      setResponseMessage(`Posts by user ID ${userId} have been restored.`);
    } catch (error) {
      setResponseMessage("Failed to restore posts.");
    }
  };

  // Fetch a specific post by ID
  const fetchPost = async () => {
    setLoading(true);
    setError(""); // Reset error message
    try {
      const response = await axios.get(
        "http://localhost:8000/penta-blog/api/posts/${postId}"
      );
      setPosts([response.data]); // Display the specific post
    } catch (err) {
      setError("Post not found or is deleted.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
    navigate("/login");
  };

  const handlePostClick = (postId) => {
    // Fetch the post details by postId and open the modal
    const post = posts.find((post) => post.id === postId);
    setSelectedPost(post); // Set the selected post data
    setIsModalOpen(true); // Show the modal
  };
  const handleUpdateClick = () => {
    navigate("/posts");
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedPost(null); // Clear selected post
  };
  // Function to get user initials
  const getUserInitials = (sub) => {
    if (!sub) return "U"; // Fallback to "U" if no username
    return sub.slice(0, 2).toUpperCase(); // Get first two letters and convert to uppercase
  };
  const handleNavigateToDashboard = () => {
    navigate("/dashboard"); // Navigate to the dashboard page
  };

  // Apply filters (category and keyword search)
  const applyFilters = (categoryId, keyword) => {
    if (categoryId) {
      fetchPostsByCategory(categoryId); // Fetch posts by categoryId
    } else if (keyword) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword.toLowerCase()) || // Convert both to lowercase
          post.content.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts); // Reset to all posts if no filter
    }
  };

  useEffect(() => {
    fetchAllPosts(); // Fetch all posts when component mounts
  }, []);

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full border-b 00 bg-gray-800 border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <a className="flex ms-2 md:me-24">
                <span className="self-center text-l font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Penta Global Blog
                </span>
              </a>
            </div>
            <div className="relative">
              {!userInfo ? (
                <a href="/login" className="text-blue-600 hover:underline">
                  Login
                </a>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {/* Display the first two letters of the username */}
                    <div className="w-8 h-8 bg-gray-500 text-white flex items-center justify-center rounded-full">
                      {getUserInitials(userInfo?.sub)} {/* User initials */}
                    </div>
                    <span className="font-medium text-lime-500">
                      {userInfo?.sub || "Unknown User"}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg">
                      <button
                        onClick={handleNavigateToDashboard}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex-col items-center justify-center p-8 mt-16">
        <div className="container mx-auto p-4">
          {/* Response Message */}
          {responseMessage && (
            <div className="alert alert-success mb-4">{responseMessage}</div>
          )}

          {/* Filter Section */}
          <div className="justify-between mb-4 flex">
            <div>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value); // Update selected category ID
                  applyFilters(e.target.value, ""); // Apply category filter
                }}
                className="p-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {/* Replace with real category IDs */}
                <option value="1">Tech</option>
                <option value="2">Health</option>
                <option value="3">Travel</option>
                <option value="4">Medical</option>
                {/* Add more categories with their IDs */}
              </select>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Search by keyword"
                onChange={(e) => applyFilters("", e.target.value)}
                className="p-2 border rounded-md w-1/3 sm: w-100"
              />
            </div>{" "}
            <button
              onClick={handleUpdateClick}
              disabled={!isLoggedIn} // Button is disabled if not logged in
              className={`${
                isLoggedIn
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-bold py-2 px-4 rounded transition duration-200`}
            >
              {isLoggedIn
                ? "Create/Update Post"
                : "Login to Create/Update Post"}
            </button>
          </div>

          {/* Posts Section */}
          <div className="flex flex-col">
            {loading ? (
              <p className="text-center text-lg">Loading posts...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="border p-4 mb-4 rounded-md shadow-md bg-purple-100"
                >
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-700">{post.content}</p>
                  <button
                    onClick={() => handlePostClick(post.id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                  >
                    Show Details
                  </button>
                </div>
              ))
            )}
          </div>
          {/* Modal for showing full post details */}
          {isModalOpen && selectedPost && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800"
                >
                  &times;
                </button>
                <h2 className="text-3xl font-semibold">{selectedPost.title}</h2>
                <p className="text-lg text-gray-600 mt-4">
                  <strong>Post ID:</strong> {selectedPost.id}
                </p>
                <p className="text-lg text-gray-600">
                  <strong>User ID:</strong> {selectedPost.user_id}
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Category ID:</strong> {selectedPost.category_id}
                </p>
                <p className="text-lg text-gray-700 break-words">
                  {selectedPost.content}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedPost.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedPost.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
