// src/pages/WatchlistPage.jsx
import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { useNavigate } from "react-router-dom";

export default function WatchlistPage() {
  // State to store watchlist items
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch watchlist from API
  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWatchlist();
      setWatchlist(data || []); // Set data or empty array
    } catch (err) {
      console.error("fetchWatchlist error:", err);
      setError("Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch watchlist on component mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Remove an item from watchlist
  const handleRemove = async (watchlistId) => {
    if (!window.confirm("Remove this item from your watchlist?")) return;

    try {
      await removeFromWatchlist(watchlistId);
      // Update local state to remove the item
      setWatchlist((prev) => prev.filter((w) => w._id !== watchlistId));
    } catch (err) {
      console.error("removeFromWatchlist error:", err);
      alert("Failed to remove item from watchlist.");
    }
  };

  // ------------------- Render -------------------

  if (loading) return <div className="text-center mt-5">Loading watchlist...</div>;
  if (error) return <div className="text-danger mt-4">{error}</div>;
  if (!watchlist.length) return <div className="mt-4">Your watchlist is empty.</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">My Watchlist</h2>

      {/* Watchlist Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {watchlist.map((w) => (
            <tr key={w._id}>
              {/* Image */}
              <td>
                <img
                  src={w.listing?.images?.[0] || "/placeholder.png"}
                  alt={w.listing?.title}
                  style={{ width: 80, height: 80, objectFit: "cover", cursor: "pointer" }}
                  onClick={() => navigate(`/listings/${w.listing?._id}`)}
                />
              </td>

              {/* Title */}
              <td
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/listings/${w.listing?._id}`)}
              >
                {w.listing?.title}
              </td>

              {/* Status */}
              <td>{w.listing?.active ? "Available" : "Sold"}</td>

              {/* Remove Button */}
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemove(w._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

