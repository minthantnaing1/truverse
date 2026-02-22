"use client";
import Link from "next/link";
import { Menu, MessageCircle, Bell, Home, Users, Video, Store } from "lucide-react";

export default function DemoTopBar({
  protectionOn,
  setProtectionOn,
  popupOpen,
  setPopupOpen,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#242526]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">

        {/* Back + Facebook logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/10">
            ←
          </Link>

          <div className="h-10 w-10 rounded-full bg-[#1877F2] flex items-center justify-center">
            <span className="text-white text-xl font-bold">f</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="flex w-full items-center gap-2 rounded-full bg-[#3A3B3C] px-4 py-2 text-sm text-white/70">
            🔍 Search Facebook
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-6">
          <NavIcon active><Home /></NavIcon>
          <NavIcon><Video /></NavIcon>
          <NavIcon><Store /></NavIcon>
          <NavIcon><Users /></NavIcon>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <CircleBtn><Menu size={20} /></CircleBtn>
          <CircleBtn><MessageCircle size={20} /></CircleBtn>
          <CircleBtn><Bell size={20} /></CircleBtn>

          <button
            onClick={() => setPopupOpen(v => !v)}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-white/10"
          >
            <img src="/truverse.png" className="h-6 w-6" />
            <span className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#242526] ${protectionOn ? "bg-emerald-400" : "bg-slate-500"}`} />
          </button>

          <button
            onClick={() => setProtectionOn(v => !v)}
            className={`rounded-full px-4 py-2 text-xs font-extrabold ${protectionOn ? "bg-emerald-600" : "bg-[#3A3B3C]"}`}
          >
            {protectionOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </header>
  );
}

function NavIcon({ active, children }) {
  return (
    <div className={`relative grid h-10 w-14 place-items-center rounded-xl ${active ? "bg-white/5 text-[#7AA7FF]" : "text-white/60"}`}>
      {children}
      {active && <div className="absolute -bottom-2 h-1 w-10 bg-[#7AA7FF] rounded-full" />}
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