"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ToolLike = {
  slug?: string;
  href?: string;
  title?: string;
  name?: string;
  description?: string;
  desc?: string;
  keywords?: string[];
};

function getRegistry(): ToolLike[] {
  // Make this resilient to different export styles in lib/apps.ts
  // e.g. export default [...], export const apps = [...], export const TOOLS = [...]
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("@/lib/apps");
  const list =
    mod?.apps ||
    mod?.TOOLS ||
    mod?.tools ||
    mod?.default ||
    mod?.APPS ||
    [];
  return Array.isArray(list) ? list : [];
}

function normTool(t: ToolLike) {
  const title = (t.title || t.name || "").toString();
  const description = (t.description || t.desc || "").toString();
  const href =
    (t.href && t.href.toString()) ||
    (t.slug ? `/tools/${t.slug}` : "");
  const keywords = Array.isArray(t.keywords) ? t.keywords : [];
  return { title, description, href, keywords };
}

export default function Spotlight() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const tools = useMemo(() => getRegistry().map(normTool).filter(t => t.href && t.title), []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tools.slice(0, 8);
    const scored = tools
      .map(t => {
        const hay = `${t.title} ${t.description} ${t.keywords.join(" ")}`.toLowerCase();
        let score = 0;
        if (t.title.toLowerCase().includes(query)) score += 4;
        if (t.description.toLowerCase().includes(query)) score += 2;
        if (hay.includes(query)) score += 1;
        return { t, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(x => x.t);
    return scored;
  }, [q, tools]);

  function close() {
    setOpen(false);
    setQ("");
    setActive(0);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === "k";
      const meta = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + K
      if (meta && isK) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(v => Math.min(v + 1, Math.max(0, results.length - 1)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(v => Math.max(v - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const pick = results[active];
        if (pick?.href) {
          close();
          router.push(pick.href);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, active, router]);

  return (
    <>
      {/* Inline search field on page (Apple-like) */}
      <div className="relative w-full max-w-[640px]">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="group w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] px-5 py-3 text-left text-[15px] text-[color:var(--muted)] shadow-[var(--shadow)] transition hover:border-[color:var(--border-strong)]"
          aria-label="Open search"
        >
          <span className="inline-flex items-center gap-2">
            <span className="select-none text-[13px] opacity-80">⌘K</span>
            <span className="select-none">搜索功能、内容或服务</span>
          </span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-24 backdrop-blur-[6px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-full max-w-[720px] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="h-9 w-9 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-2)]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder="搜索工具…"
                className="w-full bg-transparent text-[15px] text-[color:var(--fg)] placeholder:text-[color:var(--muted)] outline-none"
                autoFocus
              />
              <button
                className="rounded-xl px-3 py-2 text-[12px] text-[color:var(--muted)] hover:bg-[color:var(--panel-2)]"
                onClick={close}
              >
                Esc
              </button>
            </div>

            <div className="h-px bg-[color:var(--border)]" />

            <div className="max-h-[360px] overflow-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-[14px] text-[color:var(--muted)]">
                  没找到匹配结果
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map((t, idx) => (
                    <li key={`${t.href}-${idx}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => {
                          close();
                          router.push(t.href);
                        }}
                        className={[
                          "w-full rounded-2xl px-4 py-3 text-left transition",
                          idx === active
                            ? "bg-[color:var(--panel-2)]"
                            : "hover:bg-[color:var(--panel-2)]",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[15px] font-medium text-[color:var(--fg)]">
                              {t.title}
                            </div>
                            {t.description ? (
                              <div className="mt-1 text-[13px] leading-relaxed text-[color:var(--muted)]">
                                {t.description}
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-0.5 text-[12px] text-[color:var(--muted)]">
                            ↵
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="h-px bg-[color:var(--border)]" />

            <div className="flex items-center justify-between px-5 py-3 text-[12px] text-[color:var(--muted)]">
              <span>↑↓ 选择 · ↵ 打开</span>
              <span>⌘K 召唤</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
