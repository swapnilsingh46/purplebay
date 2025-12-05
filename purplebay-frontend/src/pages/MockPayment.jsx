import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function MockPayment() {
  // Access navigation state (order info passed from previous page)
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting order details from location state
  const { orderId, listingTitle, price } = location.state || {};

  // Tracking loading state and errors during payment process
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If page is accessed without order data, show message
  if (!orderId) {
    return (
      <div className="mt-5 text-center">
        No order found. Please start checkout again.
      </div>
    );
  }

  // Function that simulates a mock payment request
  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Sending mock payment request to backend
      await api.post("/payments/mock", { orderId, method: "mock" });

      // Redirecting to orders page with success state
      navigate("/orders", {
        state: { success: true, paidOrderId: orderId },
      });
    } catch (err) {
      console.error(err);
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      {/* Page Header */}
      <h2 className="mb-4">Mock Payment</h2>

      {/* Payment Card Layout */}
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        {/* Displaying basic order details */}
        <h5>Order Summary</h5>
        <p><strong>Product:</strong> {listingTitle || "N/A"}</p>
        <p><strong>Total Price:</strong> ${price || "N/A"}</p>

        <hr />

        {/* Fake card number input */}
        <div className="mb-3">
          <label className="form-label">Card Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        {/* Fake expiry + CVV inputs */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Expiry</label>
            <input type="text" className="form-control" placeholder="MM/YY" />
          </div>
          <div className="col">
            <label className="form-label">CVV</label>
            <input type="text" className="form-control" placeholder="123" />
          </div>
        </div>

        {/* Showing any payment error */}
        {error && <div className="text-danger mb-2">{error}</div>}

        {/* Mock payment button */}
        <button
          className="btn btn-success w-100"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
}

