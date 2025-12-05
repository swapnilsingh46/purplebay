import React from "react";

function NotificationItem({ notification, onMarkRead }) {
  return (
    <div
      className={`p-2 mb-2 border rounded ${
        notification.read ? "bg-light" : "bg-warning"
      }`}
    >
      <p>{notification.message}</p>
      {!notification.read && (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => onMarkRead(notification._id)}
        >
          Mark as read
        </button>
      )}
    </div>
  );
}

export default NotificationItem;
