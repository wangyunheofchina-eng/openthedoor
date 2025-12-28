"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function TimeTool() {
  const [unix, setUnix] = useState(String(Math.floor(Date.now() / 1000)));

  const dt = useMemo(() => {
    const n = Number(unix);
    if (!Number.isFinite(n)) return "";
    const ms = unix.length > 10 ? n : n * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return "";
    return d.toISOString();
  }, [unix]);

  return (
    <main style={{ minHeight: "100vh", padding: "40px 48px" }}>
      <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>← Back</Link>

      <h1 style={{ marginTop: "18px", fontSize: "28px", fontWeight: 500, color: "var(--fg)" }}>
        时间戳转换
      </h1>
      <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: "13px" }}>
        支持秒 / 毫秒，自动识别。
      </p>

      <div style={{ marginTop: "18px", width: "min(640px, 100%)" }}>
        <input
          value={unix}
          onChange={(e) => setUnix(e.target.value)}
          placeholder="Unix timestamp"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "999px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "0 16px",
            outline: "none",
            fontSize: "14px",
            color: "var(--fg)",
          }}
        />

        <div style={{ marginTop: "14px", borderRadius: "16px", background: "var(--surface)", border: "1px solid var(--border)", padding: "14px 16px" }}>
          <div style={{ fontSize: "12px", letterSpacing: "0.18em", color: "var(--muted)" }}>ISO</div>
          <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--fg)" }}>{dt || "—"}</div>
        </div>
      </div>
    </main>
  );
}
