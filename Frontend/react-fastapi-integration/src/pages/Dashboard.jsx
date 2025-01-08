import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css"; // Importing CSS for styling

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("welcome");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [updateUserId, setUpdateUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null); // State for current user info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

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
        setUserInfo(response.data.current_user);
        setUserId(response.data.current_user.id);
        setUserRole(response.data.current_user.role);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user info. Try to relog.");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Get all users
  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8000/penta-blog/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      setResponseMessage("Failed to fetch users.");
    }
  };

  // Get user by ID
  const getUserById = async () => {
    const token = localStorage.getItem("token");
    if (!userId) {
      setResponseMessage("Please enter a user ID.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/penta-blog/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(response.data);
      setResponseMessage("");
    } catch (error) {
      setUserDetails(null);
      setResponseMessage("No user exists with the given ID.");
    }
  };

  // Update user (only send updated fields)
  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");

    // Prepare the data for update, sending only the fields that have changed
    const fieldsToUpdate = {};
    if (updateData.name) fieldsToUpdate.name = updateData.name;
    if (updateData.email) fieldsToUpdate.email = updateData.email;
    if (updateData.phone) fieldsToUpdate.phone = updateData.phone;
    if (updateData.username) fieldsToUpdate.username = updateData.username;
    const updateUserId = userInfo?.id;
    if (!updateUserId) {
      setResponseMessage("Please provide a user ID.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/penta-blog/api/users/${updateUserId}`,
        fieldsToUpdate, // Send only the updated fields
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseMessage("User updated successfully!");
      setUserDetails(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setResponseMessage("No user exists with the given ID.");
      } else {
        setResponseMessage("Failed to update user. Please try again.");
      }
    }
  };
  const handleDeleteCurrentUser = async () => {
    const token = localStorage.getItem("token");

    try {
      // Send a delete request to the server
      await axios.delete(
        `http://localhost:8000/penta-blog/api/users/${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("An error occurred while deleting your account. Please try again.");
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/penta-blog/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        if (id === userInfo.id) {
          // If the user deleted themselves, redirect to login
          alert("You have deleted your account. Redirecting to login.");
          localStorage.removeItem("token"); // Remove the token
          navigate("/login");
        } else {
          // Update the users list without the deleted user
          setUsers(users.filter((user) => user.id !== id));
          alert("User deleted successfully.");
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigateToPosts = () => {
    navigate("/posts"); // Navigate to the /posts page
  };

  const goToRolePage = () => {
    navigate("/role"); // Navigate to the Role page
  };

  const goToCategoryPage = () => {
    navigate("/category"); // Navigate to the Category page
  };

  const renderContent = () => {
    switch (currentTab) {
      case "welcome":
        return (
          <div>
            <h2>Welcome!</h2>
            {userInfo ? (
              <div>
                <p>
                  <strong>Username:</strong> {userInfo.sub}
                </p>
                <p>
                  <strong>ID:</strong> {userInfo.id}
                </p>
                <p>
                  <strong>Role:</strong> {userInfo.role}
                </p>
              </div>
            ) : (
              <p>Loading user information...</p>
            )}
            <button
              onClick={handleDeleteCurrentUser}
              style={{ color: "white" }}
            >
              Delete My Account
            </button>
            {/* Button to switch to "Posts" */}
            <button
              onClick={handleNavigateToPosts}
              style={{ marginTop: "20px" }}
            >
              Go to Posts
            </button>
            <button onClick={goToRolePage} style={{ marginTop: "20px" }}>
              Go to Role Page
            </button>
            {/* Button to navigate */}
            <button onClick={goToCategoryPage} style={{ marginTop: "20px" }}>
              Check Categories
            </button>
          </div>
        );
      case "getAllUsers":
        return (
          <div>
            <h2>All Users</h2>
            <button onClick={getAllUsers}>Fetch All Users</button>
            {users && users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    {user.name} - {user.username}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        );
      case "getUserById":
        return (
          <div>
            <h2>Get User By ID</h2>
            <input
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={getUserById}>Fetch User by ID</button>
            {userDetails && (
              <div>
                <h3>User Details</h3>
                <p>Name: {userDetails.name}</p>
                <p>Username: {userDetails.username}</p>
                <p>Email: {userDetails.email}</p>
                <p>Phone: {userDetails.phone}</p>
                <p>Role ID: {userDetails.role}</p>
              </div>
            )}
            {responseMessage && <p>{responseMessage}</p>}
          </div>
        );
      case "updateUser":
        return (
          <div>
            <h2>Update User</h2>
            <p>
              <strong>User ID:</strong> {userInfo.id}
            </p>
            <p>
              <input
                type="text"
                placeholder="Username"
                value={updateData.username}
                onChange={(e) =>
                  setUpdateData({ ...updateData, username: e.target.value })
                }
              />
            </p>
            <p>
              <input
                type="text"
                placeholder="Name"
                value={updateData.name}
                onChange={(e) =>
                  setUpdateData({ ...updateData, name: e.target.value })
                }
              />
            </p>
            <p>
              <input
                type="email"
                placeholder="Email"
                value={updateData.email}
                onChange={(e) =>
                  setUpdateData({ ...updateData, email: e.target.value })
                }
              />
            </p>
            <p>
              <input
                type="text"
                placeholder="Phone"
                value={updateData.phone}
                onChange={(e) =>
                  setUpdateData({ ...updateData, phone: e.target.value })
                }
              />
            </p>
            <button onClick={handleUpdateUser}>Update User</button>
            {responseMessage && <p>{responseMessage}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="nav-bar">
        <button onClick={() => setCurrentTab("welcome")}>Welcome</button>
        <button onClick={() => setCurrentTab("getAllUsers")}>
          Get All Users
        </button>
        <button onClick={() => setCurrentTab("getUserById")}>
          Get User By ID
        </button>
        <button onClick={() => setCurrentTab("updateUser")}>Update User</button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
