import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/Post.css";
import apiClient from "../components/apiClient_axios";
import "../TailwindApp.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState("");
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const token = localStorage.getItem("token");

  const fetchUserInfo = async () => {
    try {
      const response = await apiClient.get("/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserId(response.data.current_user.id);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user info. Try to relog.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleBackToHome = () => {
    navigate("/");
  };

  const softDeletePost = async () => {
    const token = localStorage.getItem("token");

    if (!userId) {
      setResponseMessage("Please enter a user ID.");
      return;
    }

    try {
      const response = await apiClient.delete(
        `http://localhost:8000/penta-blog/api/posts/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseMessage(`Posts by user ID ${userId} have been soft deleted.`);
    } catch (error) {
      setResponseMessage("Failed to soft delete posts.");
    }
  };

  // Restore soft-deleted posts by userId
  const restorePost = async () => {
    const token = localStorage.getItem("token");

    if (!userId) {
      setResponseMessage("Please enter a user ID.");
      return;
    }

    try {
      // Send the PUT request with the Authorization header and no body
      const response = await apiClient.put(
        `http://localhost:8000/penta-blog/api/posts/${userId}/restore`,
        {}, // Empty object or no body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseMessage(`Posts by user ID ${userId} have been restored.`);
    } catch (error) {
      setResponseMessage("Failed to restore posts.");
    }
  };
  const fetchPost = async () => {
    setLoading(true);
    setError(""); // Reset error
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `http://localhost:8000/penta-blog/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost(response.data); // Set the post data if successful
    } catch (err) {
      setError("Post not found or is deleted.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCreatePost = async () => {
    if (!userId) {
      setResponseMessage("User ID is missing. Please log in again.");
      return;
    }

    if (!categoryId || isNaN(categoryId)) {
      setResponseMessage("Please enter a valid category ID.");
      return;
    }

    try {
      const response = await apiClient.post(
        "http://localhost:8000/penta-blog/api/posts",
        {
          title,
          content,
          category_id: parseInt(categoryId), // Convert to integer
          user_id: userId, // Pass the userId here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponseMessage("Post created successfully!");
      setTitle("");
      setContent("");
      setCategoryId("");
    } catch (err) {
      setResponseMessage("Failed to create post.");
    }
  };

  // Update post function
  const updatePost = async () => {
    if (!postId) {
      setResponseMessage("Please enter a valid post ID.");
      return;
    }

    try {
      const response = await apiClient.put(
        `http://localhost:8000/penta-blog/api/posts/${postId}/user/${userId}`,
        {
          ...(title && { title }), // Include title if provided
          ...(content && { content }), // Include content if provided
          ...(categoryId && { category_id: parseInt(categoryId) }), // Include category_id if provided
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseMessage(`Post with ID ${postId} successfully updated.`);
    } catch (err) {
      setResponseMessage(
        err.response?.data?.detail || "Failed to update the post."
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // -----------------------------------------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToHome}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            Back to Home
          </button>
          <h1 className="text-sm sm:text-sm md:text-xl lg:text-2xl font-bold text-white text-center w-full sm:w-auto sm:flex-grow">
            Blog Posts
          </h1>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto space-y-12 mt-24">
        {/* Create Post Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Create a New Post</h2>
          <div className="space-y-2">
            <label htmlFor="title" className="block font-semibold">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="block font-semibold">
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="space-y-2">
            {" "}
            <label htmlFor="categoryId" className="block font-semibold">
              {" "}
              Category:{" "}
            </label>{" "}
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            >
              {" "}
              <option value="">Select a category</option>{" "}
              <option value="1">Technology</option>{" "}
              <option value="2">Health</option>{" "}
              <option value="3">Travel</option>{" "}
              <option value="4">Medical</option>{" "}
            </select>{" "}
          </div>
          <button
            onClick={handleCreatePost}
            className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600"
          >
            Create Post
          </button>
          {responseMessage && (
            <p className="text-green-500">{responseMessage}</p>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md mx-auto mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Post
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              placeholder="Enter Post ID"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter New Title (optional)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter New Content (optional)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Enter New Category ID (optional)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={updatePost}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Update Post
            </button>
            {responseMessage && (
              <p
                className={`mt-4 text-center ${
                  responseMessage.includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {responseMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Posts;
