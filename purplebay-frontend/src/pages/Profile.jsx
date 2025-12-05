// src/pages/Profile.jsx
// ------------------------------------------------------------
// Profile Page - fully implemented and commented
// - Edit profile info
// - Change password
// - Upload avatar
// - View watchlist
// - View orders
// ------------------------------------------------------------

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfile, updateAvatar } from "../services/userService";
import { getWatchlist } from "../services/watchlistService";
import { getMyOrders } from "../services/orderService";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({ name: "", email: "", location: "", bio: "" });
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Populate form when user object is available
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Fetch watchlist and orders once
  const fetchWatchlistAndOrders = async () => {
    try {
      const w = await getWatchlist();
      setWatchlist(w || []);
    } catch (err) {
      console.error("Watchlist fetch failed:", err);
    }

    try {
      const o = await getMyOrders();
      setOrders(o || []);
    } catch (err) {
      console.error("Orders fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchWatchlistAndOrders();
  }, []);

  // If user is not logged in, prompt to login
  if (!user) {
    return <div className="text-center mt-5">Please login to view your profile.</div>;
  }

  // ---------------------
  // Save profile changes
  // ---------------------
  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // send updated profile to backend
      const updated = await updateUserProfile(user._id || user.id, form);

      // update auth context with returned user
      if (updated) login(updated);

      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------
  // Change password
  // ---------------------
  const handlePasswordChange = async () => {
    if (!password) return alert("Enter a new password");

    try {
      await updateUserProfile(user._id || user.id, { password });
      alert("Password changed. Please login again.");
      // clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("Password change failed:", err);
      alert("Password change failed");
    }
  };

  // ---------------------
  // Upload avatar file
  // ---------------------
  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert("Choose an image");

    setLoading(true);
    try {
      const updated = await updateAvatar(user._id || user.id, avatarFile);
      if (updated) login(updated);
      alert("Avatar updated.");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Profile</h2>

      {/* TAB NAVIGATION */}
      <ul className="nav nav-pills mb-4 gap-2">
        {["profile", "password", "avatar", "watchlist", "orders"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "profile"
                ? "Profile Info"
                : tab === "password"
                ? "Change Password"
                : tab === "avatar"
                ? "Change Avatar"
                : tab === "watchlist"
                ? "My Watchlist"
                : "My Orders"}
            </button>
          </li>
        ))}
      </ul>

      <div className="card p-4 shadow-sm">
        {/* ---------------- PROFILE INFO ---------------- */}
        {activeTab === "profile" && (
          <div>
            <h4>Profile Information</h4>
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="col-md-6 mt-3">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="col-md-12 mt-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>

            <button
              className="btn btn-primary mt-3"
              onClick={handleProfileSave}
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        )}

        {/* ---------------- CHANGE PASSWORD ---------------- */}
        {activeTab === "password" && (
          <div>
            <h4>Change Password</h4>
            <input
              className="form-control mt-3"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-warning mt-3" onClick={handlePasswordChange}>
              Update Password
            </button>
          </div>
        )}

        {/* ---------------- CHANGE AVATAR ---------------- */}
        {activeTab === "avatar" && (
          <div>
            <h4>Avatar</h4>
            <img
              src={user.avatar || "/placeholder.png"}
              alt="avatar"
              className="img-fluid rounded mt-2 mb-3"
              style={{ width: 150 }}
            />
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
            <button className="btn btn-primary mt-3" onClick={handleAvatarUpload} disabled={loading}>
              Upload Avatar
            </button>
          </div>
        )}

        {/* ---------------- WATCHLIST ---------------- */}
        {activeTab === "watchlist" && (
          <div>
            <h4>My Watchlist</h4>
            {watchlist.length === 0 ? (
              <p className="mt-3">No items in your watchlist.</p>
            ) : (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((w) => (
                    <tr key={w._id}>
                      <td>{w.listing?.title || "-"}</td>
                      <td>${w.listing?.price || "-"}</td>
                      <td>{w.listing?.active ? "Available" : "Sold"}</td>
                      <td>
                        {w.listing?._id ? (
                          <button className="btn btn-link p-0" onClick={() => navigate(`/listings/${w.listing._id}`)}>
                            View
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ---------------- ORDERS ---------------- */}
        {activeTab === "orders" && (
          <div>
            <h4>My Orders</h4>
            {orders.length === 0 ? (
              <p className="mt-3">You have no orders.</p>
            ) : (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Listing</th>
                    <th>Listing ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o._id}</td>
                      <td>{o.listing?.title}</td>
                      <td>
                        {o.listing?._id ? (
                          <button className="btn btn-link p-0" onClick={() => navigate(`/listings/${o.listing._id}`)}>
                            {o.listing._id}
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>${o.amount}</td>
                      <td>{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

