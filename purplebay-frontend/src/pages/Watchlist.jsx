import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../services/watchlistService";
import ListingCard from "../components/ListingCard";

export default function Watchlist() {
  // State to store watchlist items
  const [items, setItems] = useState([]);

  // Fetch the watchlist items when component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await getWatchlist();
        setItems(res || []); // Set items or empty array
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
      }
    })();
  }, []);

  // Remove an item from watchlist
  const remove = async (id) => {
    try {
      await removeFromWatchlist(id);
      // Update local state to remove the deleted item
      setItems(items.filter(i => (i._id || i.id) !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <div className="container py-4">
      <h3>My Watchlist</h3>

      {/* Display message if watchlist is empty */}
      {items.length === 0 ? (
        <p className="mt-3">No items in your watchlist.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {items.map(i => (
            <div key={i._id || i.id} className="position-relative">
              {/* Listing card */}
              <ListingCard listing={i} />

              {/* Remove button */}
              <button
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                onClick={() => remove(i._id || i.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

