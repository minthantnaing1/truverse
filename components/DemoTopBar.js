"use client";
import Link from "next/link";

export default function DemoTopBar({
  protectionOn,
  setProtectionOn,
  popupOpen,
  setPopupOpen,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#242526]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
        {/* Facebook logo + back button */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/85 transition
                 hover:bg-white/10 active:scale-[0.98]"
            title="Back to landing page"
            aria-label="Back to landing page"
          >
            ←
          </Link>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#1877F2] text-xl font-black">
            f
          </div>
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="flex w-full items-center gap-2 rounded-full bg-[#3A3B3C] px-4 py-2 text-sm text-white/70">
            🔍 Search Facebook
          </div>
        </div>

        {/* Center navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-6">
          <NavIcon active />
          <NavIcon />
          <NavIcon />
          <NavIcon />
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <CircleBtn>≡</CircleBtn>
          <CircleBtn>💬</CircleBtn>
          <CircleBtn>🔔</CircleBtn>

          {/* TruVerse extension icon */}
          <button
            onClick={() => setPopupOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/5 transition hover:bg-white/10"
            title="TruVerse Extension"
          >
            <img src="/truverse.png" alt="TruVerse" className="h-6.5 w-6.5" />

            <span
              className={[
                "absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#242526]",
                protectionOn ? "bg-emerald-400" : "bg-slate-500",
              ].join(" ")}
            />
          </button>

          <button
            onClick={() => setProtectionOn((v) => !v)}
            className={[
              "rounded-full px-4 py-2 text-xs font-extrabold",
              protectionOn
                ? "bg-emerald-600 text-white"
                : "bg-[#3A3B3C] text-white/80",
            ].join(" ")}
          >
            {protectionOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- small UI ---------- */

function NavIcon({ active }) {
  return (
    <div
      className={[
        "relative grid h-10 w-14 place-items-center rounded-xl",
        active ? "bg-white/5 text-[#7AA7FF]" : "text-white/60",
      ].join(" ")}
    >
      ⌂
      {active && (
        <div className="absolute -bottom-2 h-1 w-10 rounded-full bg-[#7AA7FF]" />
      )}
    </div>
  );
}

function CircleBtn({ children }) {
  return (
    <button className="grid h-10 w-10 place-items-center rounded-full bg-[#3A3B3C] hover:bg-[#444]">
      {children}
    </button>
  );
}
