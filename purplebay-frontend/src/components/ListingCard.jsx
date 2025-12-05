import React from "react";
import { Link } from "react-router-dom";

const getImageUrl = (img) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
  return img;
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
        <h5 className="card-title text-truncate">{listing.title}</h5>

        <p className="card-text fw-bold mb-2">${listing.price}</p>

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

        <Link to={`/listings/${listing._id}`} className="btn btn-secondary w-100 mt-2">
          View Listing
        </Link>
      </div>
    </div>
  );
}

