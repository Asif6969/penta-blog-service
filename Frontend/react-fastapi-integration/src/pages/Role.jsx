// src/pages/Role.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Role.css";

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
      const response = await axios.get(
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
      const response = await axios.post(
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
      const response = await axios.get(
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

      const response = await axios.put(
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
      const response = await axios.put(
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
    <div>
      <h1>Welcome to Role Management</h1>
      <button className="back-button" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
      <div className="roles-page">
        <h2>Roles:</h2>
        <button onClick={handleShowRoles} className="show-roles-button">
          {showRoles ? "Hide Roles" : "Show Roles"}
        </button>

        {showRoles && (
          <div>
            {loading ? (
              <div>Loading...</div> // Display loading message when fetching data
            ) : error ? (
              <div>{error}</div> // Display error message if fetch fails
            ) : (
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>{role.name}</td>
                      <td>{role.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <div className="fetch-role-page">
        <h1>Fetch Role by ID</h1>

        {/* Form to input role ID */}
        <form onSubmit={fetchRoleById} className="fetch-role-form">
          <div>
            <label htmlFor="roleId">Role ID:</label>
            <input
              type="number"
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Fetching..." : "Fetch Role"}
          </button>
        </form>

        {/* Display role details */}
        {role && (
          <div className="role-details">
            <h2>Role Details:</h2>
            <p>
              <strong>ID:</strong> {role.id}
            </p>
            <p>
              <strong>Name:</strong> {role.name}
            </p>
            <p>
              <strong>Description:</strong> {role.description}
            </p>
          </div>
        )}

        {/* Display error message */}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="create-role-page">
        <h2>Create New Role:</h2>

        {/* Form for creating a new role */}
        <form onSubmit={handleSubmit} className="create-role-form">
          <div>
            <label htmlFor="roleName">Role Name:</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="roleDescription">Role Description:</label>
            <textarea
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Role"}
          </button>
        </form>

        {/* Display success or error messages */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="update-role-page">
        <h1>Update Role</h1>

        {/* Form to input role details */}
        <form onSubmit={updateRole} className="update-role-form">
          <div>
            <label htmlFor="roleId">Role ID:</label>
            <input
              type="number"
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="name">New Name (optional):</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new role name"
            />
          </div>

          <div>
            <label htmlFor="description">New Description (optional):</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter new role description"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Role"}
          </button>
        </form>

        {/* Display success message */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Display error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
      <div className="assign-role-page">
        <h1>Assign Role to User</h1>

        {/* Form for assigning role */}
        <form onSubmit={assignRole} className="assign-role-form">
          <div>
            <label htmlFor="userId">User ID:</label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="roleId">Role ID:</label>
            <input
              type="number"
              id="roleId"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Assigning Role..." : "Assign Role"}
          </button>
        </form>

        {/* Success message */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Role;
