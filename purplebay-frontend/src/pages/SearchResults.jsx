import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ListingCard from "../components/ListingCard";

export default function SearchResults() {
  // State to store search results, loading state, pagination info
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Get search query parameters from URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "newest";

  // Reset page number to 1 whenever the query or filters change
  useEffect(() => {
    setPage(1);
  }, [query, category, min, max, sort]);

  // Fetch search results whenever query, filters, or page change
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/search", {
          params: { q: query, category, min, max, sort, page, limit: 20 },
        });

        console.log("🔥 Frontend received:", res.data); // Debug

        setResults(res.data.items || []); // Update results
        setTotalPages(res.data.pages || 1); // Update total pages
      } catch (err) {
        console.error("Search fetch failed:", err);
        setResults([]); // Clear results on error
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, min, max, sort, page]);

  // Handle pagination button click
  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div className="container py-4">
      {/* Search title */}
      <h2>
        Search Results {query && `for "${query}"`}
      </h2>

      {/* Loading or empty state */}
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        // Results grid
        <div
          className="results-grid"
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {results.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                backgroundColor: p === page ? "#4B0082" : "#fff",
                color: p === page ? "#fff" : "#000",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

