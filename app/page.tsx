"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 transition-colors">
      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        className="fixed right-6 top-6 rounded-full border border-[#D2D2D7]/60
                   px-3 py-1 text-[13px]
                   text-[#1D1D1F] dark:text-[#F5F5F7]
                   hover:bg-[#F5F5F7] dark:hover:bg-[#1D1D1F]"
        aria-label="Toggle dark mode"
      >
        {dark ? "☀︎" : "☾"}
      </button>

      <section className="text-center flex flex-col items-center">
        {/* Clickable logo */}
        <Link
          href="/door"
          aria-label="Enter the door"
          className="mb-10 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-lg"
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#1D1D1F] dark:text-[#F5F5F7] transition-transform hover:scale-[1.03]"
          >
            <rect
              x="14"
              y="8"
              width="28"
              height="56"
              rx="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M42 12 L60 18 V54 L42 60 Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <h1 className="text-[56px] md:text-[64px] font-semibold leading-[1.06] tracking-tight">
          尽有，将有
        </h1>

        <p className="mt-3 text-[13px] font-medium tracking-[0.14em] uppercase text-[#6E6E73] dark:text-[#A1A1A6]">
          All you need. What&apos;s next.
        </p>

        <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
          把你需要的一切，放在刚刚好的位置。
        </p>
      </section>
    </main>
  );
}
