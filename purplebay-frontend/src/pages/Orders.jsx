// Orders.jsx - Displays all orders made by the logged‑in user

import React, { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";

export default function MyOrders() {
  // List of user's orders
  const [orders, setOrders] = useState([]);

  // Loading state to show spinner or message
  const [loading, setLoading] = useState(true);

  // Fetch user's orders on page load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/me"); // call backend
        setOrders(res.data || []); // update state
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchOrders();
  }, []);

  // Loading indicator
  if (loading) return <div className="mt-5 text-center">Loading orders...</div>;

  // If user has no orders
  if (!orders.length) return <div className="mt-4">No orders yet.</div>;

  return (
    <div className="container my-4">
      <h3>My Orders</h3>

      {/* Display each order as a grid of cards */}
      <div className="row mt-3">
        {orders.map((o) => (
          <div key={o._id} className="col-md-4 mb-4">
            {/* Use existing ListingCard component */}
            <ListingCard
              listing={{
                ...o.listing,
                quantity: o.quantity, // show order quantity
                amount: o.amount, // show total amount
                status: o.status, // show order status
              }}
              onBuyNow={null} // disable Buy Now button on the orders page
            />

            {/* Order details below the card */}
            <div className="mt-2">
              <p className="mb-1">
                <strong>Quantity:</strong> {o.quantity}
              </p>

              <p className="mb-1">
                <strong>Total Amount:</strong> ${o.amount}
              </p>

              <p
                className={`fw-bold mb-0 ${
                  o.status === "completed" ? "text-success" : "text-primary"
                }`}
              >
                Status: {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

