import React, { useEffect, useRef } from "react";
import { Toast } from "bootstrap";

export default function ToastOutbid({ message, onClose }) {
  const ref = useRef();

  useEffect(() => {
    if (!message) return;
    const t = new Toast(ref.current);
    t.show();
    const handler = () => {
      onClose && onClose();
    };
    ref.current.addEventListener("hidden.bs.toast", handler);
    return () => ref.current && ref.current.removeEventListener("hidden.bs.toast", handler);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1200 }}>
      <div ref={ref} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto text-danger">Outbid</strong>
          <small>now</small>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
}

