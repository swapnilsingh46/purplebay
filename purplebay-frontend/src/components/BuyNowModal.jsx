import React, { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export default function BuyNowModal({ listing, onConfirm }) {
  const ref = useRef();
  const modalRef = useRef();

  useEffect(() => {
    if (ref.current) modalRef.current = new Modal(ref.current);
  }, []);

  const show = () => modalRef.current && modalRef.current.show();
  const hide = () => modalRef.current && modalRef.current.hide();

  return {
    UI: (
      <div className="modal fade" id={`buyModal-${listing._id}`} tabIndex="-1" ref={ref}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Purchase</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Buy <strong>{listing.title}</strong> for <strong>${listing.buyNowPrice || listing.price}</strong>?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => { onConfirm(); hide(); }}>Yes, Buy</button>
            </div>
          </div>
        </div>
      </div>
    ),
    show,
    hide
  };
}
