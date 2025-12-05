import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown";
import SearchBar from "./SearchBar";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

import { BsBell, BsChat } from "react-icons/bs";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#4B0082",
        color: "#fff",
      }}
    >
      {/* Logo */}
      <div
        className="navbar-brand"
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          cursor: "pointer",
          color: "#fff",
        }}
        onClick={() => navigate("/")}
      >
        Purplebay
      </div>

      {/* Search Bar */}
      <div style={{ flex: 1, margin: "0 20px" }}>
        <SearchBar />
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            color: "#4B0082",
          }}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        {user ? (
          <>
            {/* Notifications & Messages */}
            <BsBell
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => navigate("/notifications")}
            />
            <BsChat
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => navigate("/messages")}
            />

            {/* List Item Button */}
            <button
              onClick={() => navigate("/create-listing")}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#FFD700",
                fontWeight: "bold",
              }}
            >
              List an Item
            </button>

            {/* Avatar Dropdown */}
            <AvatarDropdown user={user} onLogout={logout} />
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                backgroundColor: "#fff",
                color: "#4B0082",
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                backgroundColor: "#FFD700",
              }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

