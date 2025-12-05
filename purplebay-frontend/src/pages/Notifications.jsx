// Notifications.jsx - Shows user notifications and allows marking them as read

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { markNotificationRead } from "../services/notificationService";

export default function Notifications() {
  // Getting notifications and state updater from global auth context
  const { notifications, setNotifications } = useContext(AuthContext);

  // Marks a specific notification as read
  const markRead = async (id) => {
    try {
      await markNotificationRead(id); // tells backend it's read

      // Updating UI so it instantly shows as read
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Notifications</h3>

      {/* If no notifications exist, show message */}
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div className="list-group">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`list-group-item ${n.read ? "" : "list-group-item-warning"}`}
            >
              <div className="d-flex justify-content-between">
                <div>
                  {/* Notification title */}
                  <h6>{n.title || "Notification"}</h6>

                  {/* Notification message (pre-wrap keeps formatting) */}
                  <div style={{ whiteSpace: "pre-wrap" }}>{n.message}</div>

                  {/* Timestamp */}
                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>

                {/* Button only appears if the notification is unread */}
                {!n.read && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => markRead(n._id)}
                  >
                    Mark
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

