// src/pages/Category.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Category.css";
import apiClient from '../components/apiClient_axios';

const Category = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null); // For displaying category details (Search by ID)
  const [softDeleteCategoryId, setSoftDeleteCategoryId] = useState("");
  const [searchCategoryId, setSearchCategoryId] = useState(""); // State for fetched category
  const [categories, setCategories] = useState([]); // State for categories
  const [message, setMessage] = useState(""); // State for success or failure message
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(""); // State for error message
  const [showCategories, setShowCategories] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Function to fetch categories from the API
  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        "http://localhost:8000/penta-blog/api/categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
          },
        }
      );
      setCategories(response.data); // Set categories to the fetched data
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the button click
  const handleToggleCategories = async () => {
    if (showCategories) {
      // If already showing, hide the table
      setShowCategories(false);
    } else {
      // If hidden, fetch data and show the table
      await fetchCategories();
      setShowCategories(true);
    }
  };

  // Function to fetch category by ID
  const fetchCategoryById = async () => {
    setLoading(true);
    setError("");
    setSearchCategoryId(null);

    try {
      const response = await apiClient.get(
        `http://localhost:8000/penta-blog/api/categories/${searchCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
          },
        }
      );
      setCategory(response.data); // Set the fetched category data
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to fetch category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to soft delete a category
  const handleSoftDelete = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiClient.delete(
        `http://localhost:8000/penta-blog/api/categories/${softDeleteCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization token
          },
        }
      );
      setMessage(
        `Category "${response.data.name}" has been soft deleted successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to soft delete category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to restore a soft-deleted category
  const handleRestore = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiClient.put(
        `http://localhost:8000/penta-blog/api/categories/${softDeleteCategoryId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization token
          },
        }
      );
      setMessage(
        `Category "${response.data.name}" has been restored successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to restore category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiClient.post(
        "http://localhost:8000/penta-blog/api/categories",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(`Category "${response.data.name}" created successfully!`);
      setName("");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token"); // Replace with your auth token retrieval logic
      const data = {};

      if (categoryName) data.name = categoryName;
      if (categoryDescription) data.description = categoryDescription;

      const response = await apiClient.put(
        `http://localhost:8000/penta-blog/api/categories/${categoryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Category updated successfully: ${response.data.name}`);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <h1>Welcome to the Category Page</h1>
      <button className="back-button" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>

      <div className="categories-page">
        <h1>Categories</h1>

        {/* Button to toggle categories */}
        <button
          className="fetch-categories-button"
          onClick={handleToggleCategories}
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>

        {/* Loading indicator */}
        {loading && <p>Loading categories...</p>}

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Categories list */}
        {showCategories && !loading && !error && (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="category-by-id-page">
        <h1>Fetch Category by ID</h1>

        {/* Input field for category ID */}
        <div className="input-container">
          <label htmlFor="categoryId">Category ID:</label>
          <input
            type="text"
            id="categoryId"
            value={searchCategoryId ?? ""}
            onChange={(e) => setSearchCategoryId(e.target.value)}
            placeholder="Enter Category ID"
          />
          <button
            onClick={fetchCategoryById}
            disabled={!searchCategoryId || loading} // Disable button when ID is empty or loading
          >
            {loading ? "Loading..." : "Fetch Category"}
          </button>
        </div>

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Category display */}
        {category && (
          <div className="category-details">
            <h2>Category Details</h2>
            <p>
              <strong>ID:</strong> {category.id}
            </p>
            <p>
              <strong>Name:</strong> {category.name}
            </p>
            <p>
              <strong>Description:</strong> {category.description}
            </p>
          </div>
        )}
      </div>
      <div className="category-actions">
        <h1>Filter Categories</h1>

        {/* Input field for category ID */}
        <div className="input-container">
          <label htmlFor="categoryId">Category ID:</label>
          <input
            type="text"
            id="categoryId"
            value={softDeleteCategoryId ?? ""}
            onChange={(e) => setSoftDeleteCategoryId(e.target.value)}
            placeholder="Enter Category ID"
          />
        </div>

        {/* Buttons for Soft Delete and Restore */}
        <div className="button-container">
          <button
            onClick={handleSoftDelete}
            disabled={!softDeleteCategoryId || loading}
          >
            {loading ? "Processing..." : "Soft Delete"}
          </button>
          <button
            onClick={handleRestore}
            disabled={!softDeleteCategoryId || loading}
            style={{ marginTop: "20px" }}
          >
            {loading ? "Processing..." : "Restore"}
          </button>
        </div>

        {/* Messages for success or failure */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="create-category">
        <h1>Create New Category</h1>
        <label htmlFor="categoryName">Category Name:</label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
        />
        <label htmlFor="categoryDescription">Category Description:</label>
        <textarea
          id="categoryDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter category description"
        />
        <button onClick={handleCreateCategory} disabled={loading || !name}>
          {loading ? "Creating..." : "Create Category"}
        </button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="UpdateContainer">
        <h2>Update Category</h2>
        <div>
          <label>
            Category ID:
            <input
              type="number"
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Enter Category ID"
            />
          </label>
        </div>
        <div>
          <label>
            Category Name (optional):
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter new name"
            />
          </label>
        </div>
        <div>
          <label>
            Description (optional):
            <input
              type="text"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter new description"
            />
          </label>
        </div>
        <button onClick={handleUpdate}>Update Category</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Category;
