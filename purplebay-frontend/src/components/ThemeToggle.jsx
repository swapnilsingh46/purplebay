import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="themeToggle"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <label className="form-check-label" htmlFor="themeToggle">
        {theme === "dark" ? "Dark" : "Light"}
      </label>
    </div>
  );
}

