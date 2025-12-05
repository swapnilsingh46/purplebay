import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import api from "../services/api";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "newest";

  // Reset page when filters change
  useEffect(() => setPage(1), [query, category, min, max, sort]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get("/listings", {
          params: {
            q: query || undefined,
            category: category || undefined,
            minPrice: min || undefined,
            maxPrice: max || undefined,
            page,
            limit: 20,
          },
        });

        setResults(res.data.items || []);
        setTotalPages(res.data.pages || 1);
      } catch (err) {
        console.error("Search fetch failed:", err);
        setResults([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, min, max, page]);

  return (
    <div className="container py-4">
      <h2>Search Results {query && `for "${query}"`}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
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

