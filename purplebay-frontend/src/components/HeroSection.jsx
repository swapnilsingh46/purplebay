// src/components/HeroSection.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * HeroSection component
 * Displays the main landing section with:
 * - Search bar
 * - Category pills
 * - CTA buttons
 * - Featured auction panel
 */
export default function HeroSection({ categories, activeCategory, onSelectCategory }) {
  const navigate = useNavigate();

  /**
   * Handle search form submission
   * Navigates to the search page with query param
   */
  const onSearch = (e) => {
    e.preventDefault();
    const q = e.target.query.value.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
  };

  return (
    <section className="hero">
      {/* Floating background graphics */}
      <div className="float-shape shape-1" aria-hidden="true"></div>
      <div className="float-shape shape-2" aria-hidden="true"></div>

      <div>
        {/* Main hero title and subtitle */}
        <h1 className="hero-title">Discover rare finds & best deals — Purplebay</h1>
        <p className="hero-sub">
          A modern marketplace inspired by eBay. Auctions, Buy-It-Now, secure checkout, and live notifications — all under a purple sky.
        </p>

        {/* Search form */}
        <form className="hero-search" onSubmit={onSearch}>
          <input
            name="query"
            className="form-control"
            placeholder="Search for vintage cameras, sneakers, collectibles..."
          />
          <button className="btn btn-primary">Search</button>
        </form>

        {/* Call-to-action buttons */}
        <div className="hero-cta">
          <Link to="/create-listing" className="btn btn-outline-primary">
            Sell an item
          </Link>
          <Link to="/listings" className="btn btn-link">
            Browse all products
          </Link>
        </div>

        {/* CATEGORY PILL ROW */}
        <div className="category-row">
          {/* 'All' category pill */}
          <div
            className={`category-pill ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => onSelectCategory("All")}
          >
            All
          </div>

          {/* Dynamic category pills */}
          {categories.map((cat) => (
            <div
              key={cat}
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Featured auction panel as a placeholder */}
      <aside className="featured-panel">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <h6 className="mb-1">Featured Auction</h6>
            <div className="fw-bold">Vintage Leica M3</div>
            <div className="text-muted small">Ends in 1d 3h</div>

            <div style={{ marginTop: 8 }} className="d-flex gap-2">
              <button className="btn btn-sm btn-primary">Place Bid</button>
              <button className="btn btn-sm btn-outline-primary">View</button>
            </div>
          </div>

          {/* Featured auction image */}
          <img
            src="/placeholder.png"
            alt="featured"
            style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 8 }}
          />
        </div>
      </aside>
    </section>
  );
}

