import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Post.css";

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
      const response = await axios.get(
        "http://localhost:8000/penta-blog/api/current-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await axios.get(
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
      const response = await axios.delete(
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
      const response = await axios.put(
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
      const response = await axios.get(
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
      const response = await axios.post(
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
      const response = await axios.put(
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
      const response = await axios.get(
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
    <div>
      <div>
        <h1>Blog Posts</h1>
        <button className="back-button" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>

        {/* Button to load all posts */}
        <button onClick={fetchAllPosts}>Show All Posts</button>

        {/* Display all posts if showAllPosts is true */}
        <div className="posts-container">
          {showAllPosts && posts.length > 0 ? (
            posts.map((post) => (
              <div className="post-box" key={post.id}>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-author">User ID: {post.user_id}</p>
                <p className="post-category">Category ID: {post.category_id}</p>
                <p className="post-content">{post.content}</p>
                <p className="post-dates">
                  <strong>Created At:</strong>{" "}
                  {new Date(post.created_at).toLocaleString()} <br />
                  <strong>Updated At:</strong>{" "}
                  {new Date(post.updated_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No posts available or click the button to load posts.</p>
          )}
        </div>
        <div>
          <h1>Fetch Post by ID</h1>

          {/* Input field to enter Post ID */}
          <input
            type="number"
            placeholder="Enter Post ID"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />
          <button onClick={fetchPost} disabled={loading}>
            {loading ? "Loading..." : "Get Post"}
          </button>

          {/* Display Post data if available */}
          {post && !error && (
            <div className="post-details">
              <h2>{post.title}</h2>
              <p>
                <strong>Author:</strong> {post.user_id}
              </p>
              <p>
                <strong>Category:</strong> {post.category_id}
              </p>
              <p>
                <strong>Content:</strong> {post.content}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(post.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(post.updated_at).toLocaleString()}
              </p>
            </div>
          )}

          {/* Display error message */}
          {error && <p className="error">{error}</p>}
        </div>
        {/* Manage Posts by User */}
        <h2>Manage Posts by User</h2>

        {/* Form Section for Input and Buttons */}
        <div className="form-section">
          {/* Input for User ID */}
          <input
            type="text"
            className="input-user-id"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          {/* Soft Delete Button */}
          <button className="soft-delete-btn" onClick={softDeletePost}>
            Soft Delete Posts
          </button>

          {/* Restore Button */}
          <button className="restore-btn" onClick={restorePost}>
            Restore Posts
          </button>

          {/* Display Response Message */}
          {responseMessage && (
            <p className="response-message">{responseMessage}</p>
          )}
        </div>
        <div className="create-post-container">
          <h1>Create a New Post</h1>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">
              Category ID: 1 = Technology, 2 = Health
            </label>
            <input
              type="number"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Enter category ID"
            />
          </div>

          <button className="submit-button" onClick={handleCreatePost}>
            Create Post
          </button>

          {responseMessage && (
            <p className="response-message">{responseMessage}</p>
          )}
        </div>
        <div className="update-post-container">
          <h1>Update Post</h1>
          <p>Your User ID: {userId}</p>
          <div>
            <label htmlFor="postId">Post ID:</label>
            <input
              type="text"
              id="postId"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              placeholder="Enter the post ID to update"
            />
          </div>
          <div>
            <label htmlFor="title">New Title (optional):</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the new title"
            />
          </div>
          <div>
            <label htmlFor="content">New Content (optional):</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the new content"
            />
          </div>
          <div>
            <label htmlFor="categoryId">New Category ID (optional):</label>
            <input
              type="text"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Enter the new category ID"
            />
          </div>
          <button onClick={updatePost}>Update Post</button>
          {responseMessage && (
            <p className="response-message">{responseMessage}</p>
          )}
          {error && <p className="error-message">{error}</p>}
          {loading && <p className="loading-message">Loading user info...</p>}
        </div>
        <div className="category-posts-container">
          <h1>Posts by Category</h1>

          {/* Category input */}
          <div>
            <label htmlFor="categoryId">Enter Category ID:</label>
            <input
              type="number"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Enter category ID"
            />
          </div>

          <button onClick={fetchPostsByCategory} disabled={loading}>
            {loading ? "Loading..." : "Fetch Posts"}
          </button>

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Display posts */}
          <div className="posts-container">
            {posts.length === 0 ? (
              <p>No posts found for this category.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-box">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>
                    <strong>Category ID:</strong> {post.category_id}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Posts;
