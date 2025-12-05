import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function QuickViewModal({ show, onHide, listing }) {
  if (!listing) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{listing.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column flex-md-row gap-3">
          <img src={listing.image || "/placeholder.png"} alt={listing.title} style={{ maxWidth: "300px", borderRadius: 12 }} />
          <div>
            <p className="text-muted">{listing.category}</p>
            <p>{listing.description || "No description available."}</p>
            <div className="price fw-bold mb-2">${listing.price}</div>
            <div className="text-muted mb-1">Condition: {listing.condition || "N/A"}</div>
            <div className="text-muted mb-1">Seller: {listing.seller?.name || "Anonymous"}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary">Place Bid / Buy Now</Button>
      </Modal.Footer>
    </Modal>
  );
}
