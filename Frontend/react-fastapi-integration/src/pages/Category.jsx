// src/pages/Category.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/Category.css";
import apiClient from "../components/apiClient_axios";

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
    <div className="p-6">
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
        <h1 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-bold text-white text-center w-full sm:w-auto sm:flex-grow">
          Welcome to the Category Page
        </h1>
      </nav>

      <div className="categories-page max-w-4xl mx-auto p-6 mt-11">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Categories
        </h1>

        {/* Button to toggle categories */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleToggleCategories}
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>

        {/* Loading indicator */}
        {loading && <p className="text-gray-600 mt-4">Loading categories...</p>}

        {/* Error message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Categories list */}
        {showCategories && !loading && !error && (
          <table className="w-full  bg-white rounded mt-6 table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600 bg-gray-100">
                  ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 bg-gray-100">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 bg-gray-100">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">{category.id}</td>
                  <td className="px-4 py-2 text-gray-800">{category.name}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {category.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Fetch Category by ID
        </h1>

        {/* Input field for category ID */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <label
            htmlFor="categoryId"
            className="text-gray-700 font-medium sm:mb-0 sm:w-1/3"
          >
            Category ID:
          </label>
          <input
            type="text"
            id="categoryId"
            value={searchCategoryId ?? ""}
            onChange={(e) => setSearchCategoryId(e.target.value)}
            placeholder="Enter Category ID"
            className="flex-1 border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={fetchCategoryById}
            disabled={!searchCategoryId || loading} // Disable button when ID is empty or loading
            className={`py-2 px-6 rounded-md font-semibold transition duration-300 ${
              !searchCategoryId || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Loading..." : "Fetch Category"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 font-medium bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}

        {/* Category display */}
        {category && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Category Details
            </h2>
            <p className="text-gray-700 mb-2">
              <strong className="font-medium">ID:</strong> {category.id}
            </p>
            <p className="text-gray-700 mb-2">
              <strong className="font-medium">Name:</strong> {category.name}
            </p>
            <p className="text-gray-700">
              <strong className="font-medium">Description:</strong>{" "}
              {category.description}
            </p>
          </div>
        )}
      </div>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Filter Categories
        </h1>

        {/* Input field for category ID */}
        <div className="mb-6">
          <label
            htmlFor="categoryId"
            className="block text-gray-700 font-medium mb-2"
          >
            Category ID:
          </label>
          <input
            type="text"
            id="categoryId"
            value={softDeleteCategoryId ?? ""}
            onChange={(e) => setSoftDeleteCategoryId(e.target.value)}
            placeholder="Enter Category ID"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Buttons for Soft Delete and Restore */}
        <div className="flex flex-col sm:flex-row sm:gap-4 mb-6">
          <button
            onClick={handleSoftDelete}
            disabled={!softDeleteCategoryId || loading}
            className={`w-full sm:w-auto py-2 px-6 rounded-md font-semibold transition duration-300 mb-4 sm:mb-0 ${
              !softDeleteCategoryId || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loading ? "Processing..." : "Soft Delete"}
          </button>
          <button
            onClick={handleRestore}
            disabled={!softDeleteCategoryId || loading}
            className={`w-full sm:w-auto py-2 px-6 rounded-md font-semibold transition duration-300 ${
              !softDeleteCategoryId || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Processing..." : "Restore"}
          </button>
        </div>

        {/* Messages for success or failure */}
        {message && (
          <p className="text-green-600 font-medium bg-green-100 p-3 rounded-md">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 font-medium bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}
      </div>

      <div className="create-category max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Create New Category
        </h1>

        {/* Category Name Input */}
        <div className="mb-4">
          <label
            htmlFor="categoryName"
            className="block text-gray-700 font-medium mb-2"
          >
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Description Input */}
        <div className="mb-6">
          <label
            htmlFor="categoryDescription"
            className="block text-gray-700 font-medium mb-2"
          >
            Category Description:
          </label>
          <textarea
            id="categoryDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            className="w-full border border-gray-300 rounded-md py-2 px-4 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreateCategory}
          disabled={loading || !name}
          className={`w-full py-2 px-6 rounded-md font-semibold transition duration-300 ${
            loading || !name
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>

        {/* Success and Error Messages */}
        {message && (
          <p className="text-green-600 font-medium bg-green-100 p-3 rounded-md mt-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 font-medium bg-red-100 p-3 rounded-md mt-4">
            {error}
          </p>
        )}
      </div>

      <div className="update-container max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Update Category
        </h2>

        {/* Category ID Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="categoryId"
          >
            Category ID:
          </label>
          <input
            type="number"
            id="categoryId"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Enter Category ID"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Name Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="categoryName"
          >
            Category Name (optional):
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter new name"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Description Input */}
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="categoryDescription"
          >
            Description (optional):
          </label>
          <input
            type="text"
            id="categoryDescription"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter new description"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className={`w-full py-2 px-4 font-semibold rounded-md transition duration-300 ${
            categoryId
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!categoryId}
        >
          Update Category
        </button>

        {/* Success and Error Messages */}
        {message && (
          <p className="text-green-600 font-medium bg-green-100 p-3 rounded-md mt-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 font-medium bg-red-100 p-3 rounded-md mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
