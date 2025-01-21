import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../styles/Dashboard.css"; // Importing CSS for styling
import apiClient from "../components/apiClient_axios";

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("welcome");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [updateUserId, setUpdateUserId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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
        const response = await apiClient.get("/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      const response = await apiClient.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await apiClient.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await apiClient.put(
        `/users/${updateUserId}`,
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
      await apiClient.delete(`/users/${userInfo.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            {userInfo ? (
              <div>
                <p className="mb-2">
                  <strong>Username:</strong> {userInfo.sub}
                </p>
                <p className="mb-2">
                  <strong>ID:</strong> {userInfo.id}
                </p>
                <p className="mb-2">
                  <strong>Role:</strong> {userInfo.role}
                </p>
              </div>
            ) : (
              <p>Loading user information...</p>
            )}
            <div className="space-x-4 > *">
              <button
                onClick={handleDeleteCurrentUser}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-red-600 "
              >
                Delete My Account
              </button>
              <button
                onClick={handleNavigateToPosts}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-blue-600 "
              >
                Go to Posts
              </button>
              <button
                onClick={goToRolePage}
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-green-600"
              >
                Go to Role Page
              </button>
              <button
                onClick={goToCategoryPage}
                className="bg-purple-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-purple-600"
              >
                Check Categories
              </button>
            </div>
          </div>
        );
      case "getAllUsers":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Users</h2>
            <button
              onClick={getAllUsers}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4 hover:bg-blue-600"
            >
              Fetch All Users
            </button>
            {users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">ID</th>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2 hidden sm:table-cell">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="text-sm lg:text-base">
                        <td className="border border-gray-300 px-4 py-2">
                          {user.id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 hidden sm:table-cell truncate max-w-[150px]">
                          {user.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        );

      case "getUserById":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Get User By ID</h2>
            <input
              type="text"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={getUserById}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4 hover:bg-blue-600"
            >
              Fetch User by ID
            </button>
            {userDetails && (
              <div>
                <h3 className="text-xl font-bold mb-2">User Details</h3>
                <p className="mb-2">Name: {userDetails.name}</p>
                <p className="mb-2">Username: {userDetails.username}</p>
                <p className="mb-2">Email: {userDetails.email}</p>
                <p className="mb-2">Phone: {userDetails.phone}</p>
                <p className="mb-2">Role ID: {userDetails.role}</p>
              </div>
            )}
            {responseMessage && <p>{responseMessage}</p>}
          </div>
        );
      case "updateUser":
        return (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Update User</h2>
            <p className="mb-2">
              <strong>User ID:</strong> {userInfo.id}
            </p>
            <input
              type="text"
              placeholder="Username"
              value={updateData.username}
              onChange={(e) =>
                setUpdateData({ ...updateData, username: e.target.value })
              }
              className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name"
              value={updateData.name}
              onChange={(e) =>
                setUpdateData({ ...updateData, name: e.target.value })
              }
              className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={updateData.email}
              onChange={(e) =>
                setUpdateData({ ...updateData, email: e.target.value })
              }
              className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone"
              value={updateData.phone}
              onChange={(e) =>
                setUpdateData({ ...updateData, phone: e.target.value })
              }
              className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpdateUser}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 w-full"
            >
              Update User
            </button>
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="navbar bg-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          {/* Hamburger Menu (visible on small screens) */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4`}
          >
            <button
              onClick={() => setCurrentTab("welcome")}
              className={`py-3 px-4 text-left font-semibold w-full md:w-auto ${
                currentTab === "welcome"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-600`}
            >
              Welcome
            </button>
            <button
              onClick={() => setCurrentTab("getAllUsers")}
              className={`py-3 px-4 text-left font-semibold w-full md:w-auto ${
                currentTab === "getAllUsers"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-600`}
            >
              Get All Users
            </button>
            <button
              onClick={() => setCurrentTab("getUserById")}
              className={`py-3 px-4 text-left font-semibold w-full md:w-auto ${
                currentTab === "getUserById"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-600`}
            >
              Get User By ID
            </button>
            <button
              onClick={() => setCurrentTab("updateUser")}
              className={`py-3 px-4 text-left font-semibold w-full md:w-auto ${
                currentTab === "updateUser"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-600`}
            >
              Update User
            </button>
            <button
              onClick={handleLogout}
              className="py-3 px-4 text-left font-semibold w-full md:w-auto bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="content container mx-auto bg-white p-6 mt-4 rounded-lg shadow-lg">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
