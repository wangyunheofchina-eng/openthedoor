"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function JsonTool() {
  const [text, setText] = useState('{"openthedoor":true}');

  const pretty = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return "";
    }
  }, [text]);

  return (
    <main style={{ minHeight: "100vh", padding: "40px 48px" }}>
      <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>← Back</Link>

      <h1 style={{ marginTop: "18px", fontSize: "28px", fontWeight: 500, color: "var(--fg)" }}>
        JSON 格式化
      </h1>
      <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: "13px" }}>
        粘贴 JSON，自动美化。错误会显示为空。
      </p>

      <div style={{ marginTop: "18px", display: "grid", gap: "14px", gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            height: "360px",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--fg)",
            padding: "14px 16px",
            outline: "none",
            fontSize: "13px",
          }}
        />
        <pre
          style={{
            margin: 0,
            width: "100%",
            height: "360px",
            borderRadius: "16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "14px 16px",
            overflow: "auto",
            fontSize: "13px",
            color: "var(--fg)",
          }}
        >
          {pretty || "—"}
        </pre>
      </div>
    </main>
  );
}
