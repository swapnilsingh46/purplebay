import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center py-3 border-top mt-auto">
      <small>Copyright © {year}, Swapnil</small>
    </footer>
  );
}

