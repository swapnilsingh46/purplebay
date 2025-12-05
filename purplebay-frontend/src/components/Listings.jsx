// Listings.jsx
import React from "react";
import ListingCard from "./ListingCard";

export default function Listings({ listings }) {
  if (!listings || listings.length === 0) {
    return <p className="empty-state">No products in this category.</p>;
  }

  return (
    <div className="listings-grid">
      {listings.map(l => (
        <ListingCard key={l._id || l.id} listing={l} />
      ))}
    </div>
  );
}

