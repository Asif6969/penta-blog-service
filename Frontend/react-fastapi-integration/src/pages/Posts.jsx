import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/Post.css";
import apiClient from "../components/apiClient_axios";

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

  // Function to fetch all posts
  const fetchAllPosts = async () => {
    //const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    if (!token) {
      console.error("User is not authenticated. Token not found.");
      return;
    }

    try {
      const response = await apiClient.get(
        "http://localhost:8000/penta-blog/api/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the request header
          },
        }
      );
      setPosts(response.data);
      setShowAllPosts(true); // Show all posts after fetching
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
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
  const fetchPostsByCategory = async () => {
    setLoading(true);
    setError(""); // Reset the error message
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await apiClient.get(
        `http://localhost:8000/penta-blog/api/posts/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data); // Set posts to the response data
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
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
            onClick={handleBackToDashboard}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            Back to Dashboard
          </button>
          <h1 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-bold text-white text-center w-full sm:w-auto sm:flex-grow">
            Blog Posts
          </h1>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Posts Container */}
        <div className="pt-24 max-h-96 overflow-y-scroll border border-gray-300 p-4 rounded-lg mt-10 space-y-6">
          {/* Button to load all posts */}
          <button
            onClick={fetchAllPosts}
            className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 ml-4"
          >
            Show All Posts
          </button>
          {showAllPosts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>User ID:</strong> {post.user_id}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Category ID:</strong> {post.category_id}
                </p>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <p className="text-xs text-gray-500">
                  <strong>Created At:</strong>{" "}
                  {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Updated At:</strong>{" "}
                  {new Date(post.updated_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No posts available or click the button to load posts.
            </p>
          )}
        </div>

        {/* Fetch Post by ID Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Fetch Post by ID</h2>
          <input
            type="number"
            placeholder="Enter Post ID"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button
            onClick={fetchPost}
            disabled={loading}
            className={`py-2 px-4 rounded shadow ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {loading ? "Loading..." : "Get Post"}
          </button>

          <div className="mt-4">
            {/* Display Error Message */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {post && !error && (
              <div className="bg-gray-50 p-4 rounded shadow-sm">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-sm">
                  <strong>Author:</strong> {post.user_id}
                </p>
                <p className="text-sm">
                  <strong>Category:</strong> {post.category_id}
                </p>
                <p className="text-sm">
                  <strong>Content:</strong> {post.content}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Manage Posts by User */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Manage Posts by User
          </h2>
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <div className="flex gap-4">
            <button
              onClick={softDeletePost}
              className="bg-yellow-500 text-white py-2 px-4 rounded shadow hover:bg-yellow-600"
            >
              Soft Delete Posts
            </button>
            <button
              onClick={restorePost}
              className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600"
            >
              Restore Posts
            </button>
          </div>
          {responseMessage && (
            <p className="text-green-500">{responseMessage}</p>
          )}
        </div>

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
      </div>
    </div>
  );
};
export default Posts;
