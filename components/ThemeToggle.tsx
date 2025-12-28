"use client";

import { useEffect, useState } from "react";

function getCurrentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        height: "36px",
        padding: "0 12px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--fg)",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: "12px", letterSpacing: "0.12em", color: "var(--muted)" }}>
        {theme === "dark" ? "DARK" : "LIGHT"}
      </span>
      <span aria-hidden style={{ fontSize: "14px" }}>
        {theme === "dark" ? "☾" : "☼"}
      </span>
    </button>
  );
}
