import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";
import { markNotificationRead } from "../services/notificationService";
import ToastOutbid from "./ToastOutbid";

export default function Header() {
  const { user, logout, notifications, setNotifications, fetchNotifications, unreadCount, setUnreadCount } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const prevUnreadRef = useRef(0);
  const pollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // start polling only when logged in
    if (user && !pollRef.current) {
      pollRef.current = setInterval(async () => {
        await fetchNotifications();
      }, 10000);
    }
    if (!user && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [user]);

  // watch notifications -> detect new OUTBID
  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    if (!prevUnreadRef.current && unread.length) {
      // first time fetch
      prevUnreadRef.current = unread.length;
    } else if (unread.length > prevUnreadRef.current) {
      // new unread arrived - find outbid
      const diff = notifications.filter(n => !n.read).slice(0, unread.length - prevUnreadRef.current);
      const outbid = diff.find(n => (n.type && n.type.toUpperCase().includes("OUTBID")) || (n.message && n.message.toLowerCase().includes("outbid")));
      if (outbid) setToastMsg(outbid.message || "You were outbid");
      prevUnreadRef.current = unread.length;
    } else {
      prevUnreadRef.current = unread.length;
    }
  }, [notifications]);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim() === "") return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleMark = async (id) => {
    try {
      await markNotificationRead(id);
      const updated = notifications.map(n => n._id === id ? { ...n, read: true } : n);
      setNotifications(updated);
      setUnreadCount(updated.filter(n => !n.read).length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <div><Link to="/" className="h4 text-decoration-none">Purplebay</Link></div>

        <form className="d-flex flex-grow-1 mx-3" onSubmit={handleSearch}>
          <input className="form-control me-2" placeholder="Search listings..." value={query} onChange={e => setQuery(e.target.value)} />
          <button className="btn btn-outline-primary">Search</button>
        </form>

        <div className="d-flex align-items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <div className="position-relative">
                <button className="btn btn-light position-relative" onClick={() => setShowDrop(s => !s)}>
                  
                  {unreadCount > 0 && <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">{unreadCount}</span>}
                </button>

                {showDrop && (
                  <div className="card position-absolute end-0 mt-2" style={{ width: 320, zIndex: 2000 }}>
                    <div className="card-body">
                      <h6>Notifications</h6>
                      {notifications.length === 0 && <div className="text-muted">No notifications</div>}
                      {notifications.map(n => (
                        <div key={n._id} className={`list-group-item d-flex justify-content-between ${n.read ? "" : "bg-light"}`}>
                          <div>
                            <div className="fw-bold">{n.title || "Notification"}</div>
                            <div style={{ whiteSpace: "pre-wrap" }}>{n.message}</div>
                            <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                          </div>
                          {!n.read && <button className="btn btn-sm btn-outline-primary" onClick={() => handleMark(n._id)}>Mark</button>}
                        </div>
                      ))}
                      <div className="d-flex justify-content-end mt-2">
                        <a className="btn btn-link" href="/notifications">See all</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link className="btn btn-outline-secondary btn-sm" to="/watchlist">Watchlist</Link>
              <Link className="btn btn-outline-secondary btn-sm" to="/orders">Orders</Link>
              <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary btn-sm" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <ToastOutbid message={toastMsg} onClose={() => setToastMsg("")} />
    </>
  );
}

