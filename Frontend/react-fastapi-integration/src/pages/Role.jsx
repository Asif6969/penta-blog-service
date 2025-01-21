// src/pages/Role.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/Role.css";
import apiClient from "../components/apiClient_axios";

const Role = () => {
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]); // State to store roles data
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showRoles, setShowRoles] = useState(false); // State to toggle roles visibility
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roleName, setRoleName] = useState(""); // State for role name
  const [roleDescription, setRoleDescription] = useState("");
  const [name, setName] = useState(""); // State for role name input
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const fetchRoles = async () => {
    setLoading(true); // Set loading state to true when fetching data
    try {
      const response = await apiClient.get(
        "http://localhost:8000/penta-blog/api/roles",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
          },
        }
      );
      setRoles(response.data); // Set the roles data to state
    } catch (err) {
      setError("Failed to fetch roles."); // Set error message if request fails
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  const handleShowRoles = () => {
    setShowRoles(!showRoles); // Toggle roles visibility on button click
    if (!showRoles) {
      fetchRoles(); // Fetch roles only when showing them
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setLoading(true);
    setError(null); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages

    try {
      const response = await apiClient.post(
        "http://localhost:8000/penta-blog/api/roles",
        {
          name: roleName,
          description: roleDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
          },
        }
      );
      setSuccessMessage(`Role "${response.data.name}" created successfully!`);
      setRoleName(""); // Clear form fields after success
      setRoleDescription("");
    } catch (err) {
      setError(
        "Failed to create role. Role might already exist or there was an error."
      );
    } finally {
      setLoading(false);
    }
  };
  // Function to fetch role by ID
  const fetchRoleById = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRole(null);

    try {
      const response = await apiClient.get(
        `http://localhost:8000/penta-blog/api/roles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
          },
        }
      );
      setRole(response.data); // Save the role data in state
    } catch (err) {
      setError("Role not found or you don't have permission.");
    } finally {
      setLoading(false);
    }
  };
  // Function to update role
  const updateRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {};
      if (name) payload.name = name;
      if (description) payload.description = description;

      const response = await apiClient.put(
        `http://localhost:8000/penta-blog/api/roles/${roleId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage(`Role updated successfully!`);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || "Failed to update role. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  // Function to assign role to user
  const assignRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await apiClient.put(
        `http://localhost:8000/penta-blog/api/users/${userId}/assign-role/${roleId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authorization
          },
        }
      );
      setSuccessMessage(
        `Role successfully assigned to User ID: ${response.data.id}`
      );
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || "Failed to assign role. Please try again."
      );
    } finally {
      setLoading(false);
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
          Welcome to Role Management
        </h1>
      </nav>

      <div className="mb-6 mt-20 padding-top: 100px;">
        <h2 className="text-2xl font-semibold mb-4">Roles:</h2>
        <button
          onClick={handleShowRoles}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {showRoles ? "Hide Roles" : "Show Roles"}
        </button>

        {showRoles && (
          <div>
            {loading ? (
              <div className="text-gray-600">Loading...</div> // Display loading message when fetching data
            ) : error ? (
              <div className="text-red-500">{error}</div> // Display error message if fetch fails
            ) : (
              <table className="w-full bg-white rounded shadow-md text-xs sm:text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b">
                      <td className="py-2 px-4">{role.id}</td>
                      <td className="py-2 px-4">{role.name}</td>
                      <td className="py-2 px-4">{role.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <div className="bg-pastel-light p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Fetch Role by ID
        </h1>

        {/* Form to input role ID */}
        <form onSubmit={fetchRoleById} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="roleId" className="text-gray-700 font-medium">
              Role ID:
            </label>
            <input
              type="number"
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Fetching..." : "Fetch Role"}
          </button>
        </form>

        {/* Display role details */}
        {role && (
          <div className="role-details mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Role Details:</h2>
            <p className="text-gray-700 mt-2">
              <strong>ID:</strong> {role.id}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Name:</strong> {role.name}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Description:</strong> {role.description}
            </p>
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="error-message mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>

      <div className="create-role-page bg-pastel-light p-6 rounded-lg shadow-lg max-w-md mx-auto mt-3">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Role:
        </h2>

        {/* Form for creating a new role */}
        <form onSubmit={handleSubmit} className="create-role-form space-y-6">
          <div className="flex flex-col">
            <label htmlFor="roleName" className="text-gray-700 font-medium">
              Role Name:
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="roleDescription"
              className="text-gray-700 font-medium"
            >
              Role Description:
            </label>
            <textarea
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Creating..." : "Create Role"}
          </button>
        </form>

        {/* Display success or error messages */}
        {successMessage && (
          <div className="success-message mt-4 text-green-500 text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="error-message mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
      <div className="update-role-page bg-pastel-light p-6 rounded-lg shadow-lg max-w-4xl sm:max-w-2xl md:max-w-3xl mx-auto mt-3">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Role
        </h1>

        {/* Form to input role details */}
        <form onSubmit={updateRole} className="update-role-form space-y-6">
          <div className="flex flex-col">
            <label htmlFor="roleId" className="text-gray-700 font-medium">
              Role ID:
            </label>
            <input
              type="number"
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-medium">
              New Name (optional):
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new role name"
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-700 font-medium">
              New Description (optional):
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter new role description"
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </form>

        {/* Display success message */}
        {successMessage && (
          <div className="success-message mt-4 text-green-500 text-center">
            {successMessage}
          </div>
        )}

        {/* Display error message */}
        {errorMessage && (
          <div className="error-message mt-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="assign-role-page bg-pastel-light p-6 rounded-lg shadow-lg max-w-4xl sm:max-w-2xl md:max-w-3xl mx-auto mt-3">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Assign Role to User
        </h1>

        {/* Form for assigning role */}
        <form onSubmit={assignRole} className="assign-role-form space-y-6">
          <div className="flex flex-col">
            <label htmlFor="userId" className="text-gray-700 font-medium">
              User ID:
            </label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="roleId" className="text-gray-700 font-medium">
              Role ID:
            </label>
            <input
              type="number"
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Assigning Role..." : "Assign Role"}
          </button>
        </form>

        {/* Success message */}
        {successMessage && (
          <div className="success-message mt-4 text-green-500 text-center">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="error-message mt-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Role;
