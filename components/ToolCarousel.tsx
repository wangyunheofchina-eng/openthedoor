"use client";

import { useRef } from "react";
import Link from "next/link";
import { apps } from "../lib/apps";

export default function ToolCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function scrollByCard(dir: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const w = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  }

  return (
    <section style={{ marginTop: "26px" }}>
      <div
        style={{
          width: "min(860px, calc(100% - 48px))",
          margin: "0 auto",
        }}
      >
        {/* 顶部标题行 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "var(--muted)",
            }}
          >
            FEATURED TOOLS
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => scrollByCard("left")}
              aria-label="Previous"
              style={navBtnStyle()}
            >
              ←
            </button>
            <button
              onClick={() => scrollByCard("right")}
              aria-label="Next"
              style={navBtnStyle()}
            >
              →
            </button>
          </div>
        </div>

        {/* 横向轮播 */}
        <div
          ref={scrollerRef}
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "6px",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {apps.map((a) => (
            <Link
              key={a.id}
              href={a.href}
              data-card
              style={{
                scrollSnapAlign: "start",
                textDecoration: "none",
                color: "inherit",
                flex: "0 0 auto",
                width: "min(360px, 78vw)",
              }}
            >
              <div
                style={{
                  borderRadius: "22px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  padding: "18px 18px 16px",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                }}
              >
                {/* 顶部：标题 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--fg)" }}>
                    {a.title}
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      color: "var(--muted)",
                    }}
                  >
                    OPEN
                  </span>
                </div>

                <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--muted)" }}>
                  {a.subtitle}
                </div>

                {/* 预览区：极简“屏幕” */}
                <div
                  style={{
                    marginTop: "14px",
                    borderRadius: "18px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    height: "120px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* 模拟 UI 行（不花哨，不上色） */}
                  <div style={{ padding: "14px 14px 0" }}>
                    <div style={{ height: "10px", width: "52%", borderRadius: "999px", background: "rgba(255,255,255,0.0)" }} />
                    <div style={{ marginTop: "10px", height: "10px", width: "76%", borderRadius: "999px", background: "rgba(255,255,255,0.0)" }} />
                    <div style={{ marginTop: "10px", height: "10px", width: "64%", borderRadius: "999px", background: "rgba(255,255,255,0.0)" }} />
                  </div>

                  {/* 用细线+块来模拟内容（跟随主题） */}
                  <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
                    <div style={{ height: 1, background: "var(--border)" }} />
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <div style={{ height: 10, width: 10, borderRadius: 3, background: "var(--border)" }} />
                      <div style={{ height: 10, width: "52%", borderRadius: 999, background: "var(--border)" }} />
                    </div>
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <div style={{ height: 10, width: 10, borderRadius: 3, background: "var(--border)" }} />
                      <div style={{ height: 10, width: "38%", borderRadius: 999, background: "var(--border)" }} />
                    </div>
                  </div>
                </div>

                {/* 宣传句 */}
                <div style={{ marginTop: "12px", fontSize: "13px", lineHeight: 1.45, color: "var(--muted)" }}>
                  {a.blurb}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 轻提示 */}
        <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>
          Scroll to explore • Click to open
        </div>
      </div>
    </section>
  );
}

function navBtnStyle() {
  return {
    height: "30px",
    minWidth: "30px",
    padding: "0 10px",
    borderRadius: "999px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--fg)",
    cursor: "pointer",
  } as const;
}
