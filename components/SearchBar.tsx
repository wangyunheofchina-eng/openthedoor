"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apps } from "../lib/apps";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return apps.slice(0, 6);
    return apps
      .filter((a) => {
        const t = (a.title || "").toLowerCase();
        const s = (a.subtitle || "").toLowerCase();
        return t.includes(query) || s.includes(query);
      })
      .slice(0, 6);
  }, [q]);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  return (
    <div style={{ marginTop: "22px", display: "flex", justifyContent: "center" }}>
      <div ref={wrapRef} style={{ width: "min(560px, calc(100% - 48px))", position: "relative" }}>
        <div
          style={{
            height: "48px",
            borderRadius: "999px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "10px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="var(--muted)" strokeWidth="1.6" />
            <path d="M20 20L17 17" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>

          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search your station"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "15px",
              color: "var(--fg)",
            }}
          />
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "56px",
              left: 0,
              right: 0,
              borderRadius: "18px",
              background: "var(--surface-2)",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {results.length === 0 ? (
              <div style={{ padding: "14px 16px", color: "var(--muted)", fontSize: "13px" }}>
                No results
              </div>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(r.href);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--fg)" }}>{r.title}</div>
                  <div style={{ marginTop: "2px", fontSize: "12px", color: "var(--muted)" }}>{r.subtitle}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
