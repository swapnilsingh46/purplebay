import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../services/listingService";
import api from "../services/api";

// Helper to build correct image URL
const getImageUrl = (img) => {
  if (!img) return "/placeholder.png"; // Use placeholder when no image exists
  if (img.startsWith("/uploads")) return `${import.meta.env.VITE_API_URL}${img}`; // Local server images
  return img; // External URLs
};

export default function ListingDetails() {
  const { id } = useParams(); // Get listing ID from the URL
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);

  // Loads listing + watchlist status
  const fetchListing = async () => {
    try {
      setLoading(true);

      // Fetch listing data
      const data = await getListingById(id);
      setListing(data);

      // Check if it's already in watchlist
      const res = await api.get(`/watchlist/check/${id}`);
      setWatching(res.data.watching);
      if (res.data.watching) setWatchlistId(res.data._id);
    } catch (err) {
      console.error(err);
      setError("Failed to load listing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  // Handles creating an order (Buy Now)
  const handleBuyNow = async () => {
    try {
      const quantity = 1;
      const shippingAddress = prompt("Enter shipping address:");
      if (!shippingAddress) return alert("Shipping address is required.");

      // Create new order
      const orderRes = await api.post("/orders", {
        listingId: id,
        quantity,
        shippingAddress,
      });

      alert("Order created! Redirecting to mock payment...");

      // Redirect to payment mock page
      navigate("/payments/mock", {
        state: {
          orderId: orderRes.data.order._id,
          listingTitle: listing.title,
          price: listing.price,
        },
      });

      await fetchListing();
    } catch (err) {
      console.error("BuyNow error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to create order.");
    }
  };

  const handleAddWatchlist = async () => {
    try {
      const res = await api.post("/watchlist", { listingId: id });
      setWatching(true);
      setWatchlistId(res.data._id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to add to watchlist.");
    }
  };

  const handleRemoveWatchlist = async () => {
    if (!watchlistId) return alert("Watchlist ID missing.");

    try {
      await api.delete(`/watchlist/${watchlistId}`);
      setWatching(false);
      setWatchlistId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to remove from watchlist.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger mt-4">{error}</div>;
  if (!listing) return <div className="mt-4">Listing not found.</div>;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left: Image */}
        <div className="col-md-6 mb-3">
          <img
            src={getImageUrl(listing.images?.[0])}
            alt={listing.title}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
          />
        </div>

        {/* Right: Listing Info */}
        <div className="col-md-6">
          <h2>{listing.title}</h2>
          <p className="text-muted">Category: {listing.category?.name || "N/A"}</p>
          <p className="fw-bold fs-4">${listing.price}</p>
          <p>{listing.description}</p>
          <p>Seller: {listing.createdBy?.name || "Unknown"}</p>
          <p>Status: {listing.active ? "Available" : "Sold/Inactive"}</p>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button
              className={`btn ${listing.active ? "btn-primary" : "btn-secondary"} flex-fill`}
              onClick={handleBuyNow}
              disabled={!listing.active}
            >
              {listing.active ? "Buy Now" : "Sold"}
            </button>

            {watching ? (
              <button
                className="btn btn-outline-danger flex-fill"
                onClick={handleRemoveWatchlist}
              >
                Remove from Watchlist
              </button>
            ) : (
              <button
                className="btn btn-outline-secondary flex-fill"
                onClick={handleAddWatchlist}
              >
                Add to Watchlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

