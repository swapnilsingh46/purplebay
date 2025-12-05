// src/components/AvatarDropdown.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

/**
 * AvatarDropdown component
 * Shows the user's avatar and a dropdown menu for profile/logout actions
 */
const AvatarDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false); // Dropdown open state
  const dropdownRef = useRef(null); // Ref for detecting outside clicks
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Access theme (light/dark)

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adjust text color based on theme
  const profileTextColor = theme === "dark" ? "#FFD700" : "#000";

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Avatar image */}
      <img
        src={user?.avatar || "/default-avatar.png"}
        alt="avatar"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px solid #ccc",
        }}
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: 0,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            width: "150px",
            zIndex: 100,
          }}
        >
          {/* Profile button */}
          <button
            style={{
              width: "100%",
              padding: "10px",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: profileTextColor,
            }}
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          {/* Logout button */}
          <button
            style={{
              width: "100%",
              padding: "10px",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;

