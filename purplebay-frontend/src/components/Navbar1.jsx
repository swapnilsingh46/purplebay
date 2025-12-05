import React from "react";
import AvatarDropdown from "./AvatarDropdown";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#4B0082", // Purple theme
        color: "#fff",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>Purplebay</div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* You can add search bar here if needed */}
        <AvatarDropdown user={user} onLogout={onLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
