"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function Base64Tool() {
  const [text, setText] = useState("");

  const encoded = useMemo(() => {
    try {
      return typeof window === "undefined" ? "" : btoa(unescape(encodeURIComponent(text)));
    } catch {
      return "";
    }
  }, [text]);

  const decoded = useMemo(() => {
    try {
      return typeof window === "undefined" ? "" : decodeURIComponent(escape(atob(text)));
    } catch {
      return "";
    }
  }, [text]);

  return (
    <main style={{ minHeight: "100vh", padding: "40px 48px" }}>
      <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>← Back</Link>

      <h1 style={{ marginTop: "18px", fontSize: "28px", fontWeight: 500, color: "var(--fg)" }}>
        Base64 工具
      </h1>
      <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: "13px" }}>
        输入文本：你可以直接拿结果去用。
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入要编码的文本，或粘贴 Base64 用于解码"
        style={{
          marginTop: "18px",
          width: "min(860px, 100%)",
          height: "160px",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--fg)",
          padding: "14px 16px",
          outline: "none",
          fontSize: "14px",
        }}
      />

      <div style={{ marginTop: "20px", display: "grid", gap: "14px", width: "min(860px, 100%)" }}>
        <Box title="Encode (Base64)" value={encoded} />
        <Box title="Decode (Text)" value={decoded} />
      </div>
    </main>
  );
}

function Box({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ borderRadius: "16px", background: "var(--surface)", border: "1px solid var(--border)", padding: "14px 16px" }}>
      <div style={{ fontSize: "12px", letterSpacing: "0.18em", color: "var(--muted)" }}>{title}</div>
      <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--fg)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {value || "—"}
      </div>
    </div>
  );
}
