import React from "react";
import { Link } from "react-router-dom";

// Helper to build correct image URL
const getImageUrl = (img) => {
  if (!img) return "/placeholder.png"; // fallback placeholder
  if (img.startsWith("/uploads")) return `${import.meta.env.VITE_API_URL}${img}`; // backend URL
  return img; // external URLs
};

export default function ListingCard({ listing, onBuyNow }) {
  if (!listing) return null;

  const img = listing.images?.[0] || listing.image;

  return (
    <div className="card shadow-sm h-100" style={{ width: "100%" }}>
      {/* Product Image */}
      <img
        src={getImageUrl(img)}
        alt={listing.title}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover", backgroundColor: "#f2f2f2" }}
      />

      <div className="card-body d-flex flex-column">
        {/* Title */}
        <h5 className="card-title text-truncate">{listing.title}</h5>

        {/* Price */}
        <p className="card-text fw-bold mb-2">${listing.price}</p>

        {/* Creator & Category */}
        <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>
          By: {listing.createdBy?.name || "Unknown"} | Category: {listing.category?.name || "None"}
        </p>

        {/* Status */}
        <p className={`fw-bold mb-2 ${listing.active ? "text-success" : "text-danger"}`}>
          {listing.active ? "Available" : "Sold"}
        </p>

        {/* Buy Now button */}
        {listing.active && onBuyNow && (
          <button className="btn btn-primary w-100 mt-auto" onClick={onBuyNow}>
            Buy Now
          </button>
        )}

        {/* View Listing button */}
        <Link to={`/listings/${listing._id}`} className="btn btn-secondary w-100 mt-2">
          View Listing
        </Link>
      </div>
    </div>
  );
}

