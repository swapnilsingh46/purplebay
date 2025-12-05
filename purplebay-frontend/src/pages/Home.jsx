import React, { useEffect, useState, useRef } from "react";
import HeroSection from "../components/HeroSection";
import ListingCard from "../components/ListingCard";
import { getAllListings } from "../services/listingService";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["Electronics", "Collectibles", "Fashion", "Home & Garden"]; // hardcoded categories for now

  // Fetch listings from backend and update UI
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllListings();
      const arr = Array.isArray(data) ? data : data.items || [];
      setListings(arr);
    } catch (err) {
      console.error("fetchListings error:", err);
      setError("Failed to load listings. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load listings on mount and auto-refresh every 5 minutes
  useEffect(() => {
    fetchListings();
    pollRef.current = setInterval(fetchListings, 300000); // 5-minute refresh interval
    return () => clearInterval(pollRef.current);
  }, []);

  // Filter listings based on the selected category
  const filteredListings = listings.filter(
    (l) =>
      activeCategory === "All" ||
      (l.category?.name ? l.category.name === activeCategory : false)
  );

  // Handle Buy Now checkout process
  const handleBuyNow = async (listing) => {
    try {
      const shippingAddress = prompt("Enter shipping address:");
      if (!shippingAddress) return alert("Shipping address is required.");

      const res = await api.post("/orders", {
        listingId: listing._id,
        quantity: 1,
        shippingAddress,
      });

      const order = res.data.order;

      // Navigate to mock payment screen
      navigate("/payments/mock", {
        state: {
          orderId: order._id,
          listingTitle: listing.title,
          price: listing.price,
        },
      });

      // Mark listing as inactive locally
      setListings((prev) =>
        prev.map((l) => (l._id === listing._id ? { ...l, active: false } : l))
      );
    } catch (err) {
      console.error("BuyNow error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to start checkout.");
    }
  };

  return (
    <div className="container my-4">
      {/* Hero banner always visible even if listings are empty */}
      <HeroSection
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Category filter section */}
      <div className="category-row mt-3 mb-4 d-flex gap-2 flex-wrap">
        <div
          className={`category-pill ${activeCategory === "All" ? "active" : ""}`}
          onClick={() => setActiveCategory("All")}
        >
          All
        </div>

        {categories.map((cat) => (
          <div
            key={cat}
            className={`category-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Listing grid & loading states */}
      {loading ? (
        <div className="text-center mt-5">Loading listings...</div>
      ) : error ? (
        <div className="text-danger mt-4">{error}</div>
      ) : filteredListings.length === 0 ? (
        <div className="mt-4">No items in this category.</div>
      ) : (
        <div className="row">
          {filteredListings.map((item) => (
            <div key={item._id} className="col-md-4 mb-4">
              <ListingCard
                listing={item}
                onBuyNow={() => handleBuyNow(item)}
                hideQuickView={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

