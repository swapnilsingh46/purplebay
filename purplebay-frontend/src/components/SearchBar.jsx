import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim() !== "") params.append("q", searchTerm);
    if (selectedCategory) params.append("category", selectedCategory);
    if (minPrice) params.append("min", minPrice);
    if (maxPrice) params.append("max", maxPrice);
    if (sort) params.append("sort", sort);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          flex: 2,
          padding: "10px 15px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        style={{ width: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        style={{ width: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
      </select>

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#4B0082",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;

