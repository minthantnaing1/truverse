"use client";

import { useEffect, useMemo, useState } from "react";
import DemoTopBar from "@/components/DemoTopBar";
import ExtensionPopup from "@/components/ExtensionPopup";
import AnalysisModal from "@/components/AnalysisModal";

export default function DemoPage() {
  const [posts, setPosts] = useState([]);
  const [protectionOn, setProtectionOn] = useState(true);
  const [popupOpen, setPopupOpen] = useState(true);

  const [reported, setReported] = useState({});

  // ✅ state
  const [blocked, setBlocked] = useState({});
  const [acknowledged, setAcknowledged] = useState({});
  const [viewAnyway, setViewAnyway] = useState({});

  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    fetch("/mock/facebookFeed.json")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  const visiblePosts = useMemo(() => posts, [posts]);

  // ✅ Counts (fixed logic)
  const scannedCount = useMemo(() => {
    return protectionOn ? posts.length : 0;
  }, [posts.length, protectionOn]);

  const blockedCount = useMemo(() => {
    if (!protectionOn) return 0;
    // count only ids that exist in current feed (avoid weird stale state)
    const ids = new Set(posts.map((p) => p.id));
    return Object.keys(blocked).filter((id) => blocked[id] && ids.has(id))
      .length;
  }, [blocked, posts, protectionOn]);

  const reportedCount = useMemo(() => {
    if (!protectionOn) return 0;
    const ids = new Set(posts.map((p) => p.id));
    return Object.keys(reported).filter((id) => reported[id] && ids.has(id))
      .length;
  }, [reported, posts, protectionOn]);

  const detectedCount = useMemo(() => {
    if (!protectionOn) return 0;
    // ✅ Flagged = detected AND not blocked
    return posts.filter((p) => p.detected && !blocked[p.id]).length;
  }, [posts, protectionOn, blocked]);

  const verifiedCount = useMemo(() => {
    if (!protectionOn) return 0;
    // ✅ Verified = not detected (regardless of blocked/reported)
    return posts.filter((p) => !p.detected).length;
  }, [posts, protectionOn]);

  const breakdown = useMemo(
    () => ({
      deepfakes: 0,
      fakeNews: detectedCount, // use the real flagged count
      manipulated: 0,
    }),
    [detectedCount]
  );

  function openAnalysis(p) {
    setActivePost(p);
    setAnalysisOpen(true);
  }

  function resetDemo() {
    setReported({});
    setBlocked({});
    setAcknowledged({});
    setViewAnyway({});
  }

  function handleBlock(id) {
    setBlocked((prev) => ({ ...prev, [id]: true }));
    // block implies not viewing yet
    setViewAnyway((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function handleAcknowledge(id) {
    setAcknowledged((prev) => ({ ...prev, [id]: true }));
  }

  function handleViewAnyway(id) {
    setViewAnyway((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <div className="min-h-screen bg-[#18191A] text-white">
      <DemoTopBar
        protectionOn={protectionOn}
        setProtectionOn={setProtectionOn}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
      />

      {/* Status strip */}
      <div className="border-b border-white/10 bg-[#1F2A3A]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
          <div className="flex items-center gap-1.5">
            <img src="/truverse.png" alt="TruVerse" className="h-5 w-5" />
            <span className="font-semibold text-white/90">
              TruVerse Protection: {protectionOn ? "Active" : "Inactive"}
            </span>
            <span className="hidden sm:inline text-white/60">
              {protectionOn ? "Scanning in real-time" : "Scanning paused"}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <BadgeDot
              color="bg-emerald-400"
              text={`${verifiedCount} Verified`}
            />
            <BadgeDot color="bg-rose-400" text={`${detectedCount} Flagged`} />
            <BadgeDot color="bg-amber-300" text={`${blockedCount} Blocked`} />
            <BadgeDot color="bg-sky-300" text={`${reportedCount} Reported`} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-12">
        {/* Left sidebar */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="rounded-2xl bg-[#242526] p-4 ring-1 ring-white/5 transition hover:ring-white/10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#3A3B3C] text-sm font-black">
                YN
              </div>
              <div>
                <div className="text-sm font-semibold text-white/90">
                  Your Name
                </div>
                <div className="text-xs text-white/60">Home</div>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-white/80">
              <SideItem icon="👥" label="Friends" />
              <SideItem icon="▶" label="Watch" />
              <SideItem icon="🛒" label="Marketplace" />
              <SideItem icon="👤" label="Groups" />
              <SideItem icon="⏱️" label="Memories" />
              <SideItem icon="🔖" label="Saved" />
            </div>

            <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/45">
              Privacy · Terms · Advertising · Cookies · Meta © 2026
            </div>
          </div>
        </aside>

        {/* Feed */}
        <main className="lg:col-span-6">
          {/* Stories */}
          <div className="rounded-2xl bg-[#242526] p-3 ring-1 ring-white/5 transition hover:ring-white/10">
            <div className="flex gap-3 overflow-x-auto pb-1">
              <StoryCard title="Create story" me />
              <StoryCard title="Nina" />
              <StoryCard title="Abel" />
              <StoryCard title="Min" />
              <StoryCard title="Jess" />
            </div>
          </div>

          {/* Composer */}
          <div className="mt-4 rounded-2xl bg-[#242526] p-4 ring-1 ring-white/5 transition hover:ring-white/10">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#3A3B3C] text-sm font-black">
                YN
              </div>

              <div className="flex-1 rounded-full bg-[#3A3B3C] px-4 py-2.5 text-sm text-white/60 transition hover:bg-[#454647]">
                What&apos;s on your mind?
              </div>
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              <div className="grid grid-cols-3 gap-2">
                <ComposerBtn icon="📹" label="Live video" />
                <ComposerBtn icon="🖼️" label="Photo/video" />
                <ComposerBtn icon="😊" label="Feeling/activity" />
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="mt-4 space-y-4">
            {visiblePosts.map((p) => {
              const isDetected = protectionOn && p.detected;
              const isBlocked = isDetected && !!blocked[p.id];
              const allowView = !!viewAnyway[p.id];
              const isAck = !!acknowledged[p.id];

              return (
                <div
                  key={p.id}
                  className="relative overflow-hidden rounded-2xl bg-[#242526] ring-1 ring-white/5 transition
                             hover:-translate-y-0.5 hover:ring-white/10 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                >
                  {isDetected ? (
                    <div className="border-b border-white/10 bg-[#2A1B1B] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-600/15 text-rose-300">
                            ⚠
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-sm font-extrabold text-rose-200">
                                {p.label || "Suspicious Content Detected"}
                              </div>

                              {isAck ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/75">
                                  ✓ Acknowledged
                                </span>
                              ) : null}

                              {isBlocked ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/20 px-2 py-0.5 text-[11px] font-bold text-rose-200">
                                  ⛔ Blocked
                                </span>
                              ) : null}

                              {reported[p.id] ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/75">
                                  Reported
                                </span>
                              ) : null}
                            </div>

                            <div className="text-xs text-white/65">
                              TruVerse flagged this post. Review before trusting
                              or sharing.
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openAnalysis(p)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/90 transition
                                       hover:bg-white/15 active:scale-[0.98]"
                          >
                            <span className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-black text-black">
                              {p.confidence || 90}%
                            </span>
                            View analysis
                          </button>

                          <button
                            onClick={() => handleBlock(p.id)}
                            className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/85 transition
                                       hover:bg-white/15 active:scale-[0.98]"
                          >
                            {isBlocked ? "Blocked" : "Block"}
                          </button>

                          <button
                            onClick={() => handleAcknowledge(p.id)}
                            className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/85 transition
                                       hover:bg-white/15 active:scale-[0.98]"
                          >
                            {isAck ? "Acknowledged" : "I understand"}
                          </button>

                          <button
                            onClick={() =>
                              setReported((prev) => ({ ...prev, [p.id]: true }))
                            }
                            className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-extrabold text-white transition
                                       hover:opacity-95 active:scale-[0.98]"
                          >
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Block overlay */}
                  {isBlocked && !allowView ? (
                    <div className="absolute inset-0 z-20">
                      <div className="absolute inset-0 backdrop-blur-md bg-black/35" />
                      <div className="absolute inset-0 grid place-items-center p-6">
                        <div className="w-full max-w-md rounded-2xl bg-[#1E1F21] ring-1 ring-white/10 shadow-2xl p-5">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-600/15 text-rose-300">
                              ⛔
                            </div>
                            <div>
                              <div className="text-sm font-extrabold text-white">
                                Content blocked by TruVerse
                              </div>
                              <div className="text-xs text-white/60">
                                This post was flagged as likely AI-generated or
                                misleading.
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 justify-end">
                            <button
                              onClick={() => openAnalysis(p)}
                              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white/85 transition hover:bg-white/15 active:scale-[0.98]"
                            >
                              View analysis
                            </button>

                            <button
                              onClick={() => handleViewAnyway(p.id)}
                              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white/85 transition hover:bg-white/15 active:scale-[0.98]"
                            >
                              View anyway
                            </button>

                            <button
                              onClick={() =>
                                setReported((prev) => ({
                                  ...prev,
                                  [p.id]: true,
                                }))
                              }
                              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white transition hover:opacity-95 active:scale-[0.98]"
                            >
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Post content */}
                  <div
                    className={[
                      "p-4",
                      isBlocked && !allowView
                        ? "select-none blur-[3px] pointer-events-none"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-[#3A3B3C] text-sm font-black">
                          {getInitials(p.author)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{p.author}</div>
                            {p.verified ? (
                              <span className="text-[#7AA7FF]">✔</span>
                            ) : null}
                          </div>

                          <div className="text-xs text-white/60">
                            {p.time || "Just now"} • 🌐
                          </div>
                        </div>
                      </div>

                      <button className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10 active:scale-[0.98]">
                        ⋯
                      </button>
                    </div>

                    <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/90">
                      {p.text}
                    </div>

                    {p.media ? (
                      <div className="mt-4 overflow-hidden rounded-2xl bg-white/5">
                        <div className="h-52 w-full bg-gradient-to-br from-white/10 to-white/5" />
                        <div className="px-4 py-3 text-xs text-white/60">
                          (Mock) Image/Video content
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-3 text-sm text-white/70">
                      <div className="inline-flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877F2] text-xs">
                          👍
                        </span>
                        <span>{p.likes ?? 0}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span>{p.comments ?? 0} comments</span>
                        <span>{p.shares ?? 0} shares</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 text-sm font-semibold text-white/75">
                      <ActionBtn icon="👍" label="Like" />
                      <ActionBtn icon="💬" label="Comment" />
                      <ActionBtn icon="↗" label="Share" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Right column */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="rounded-2xl bg-[#242526] p-4 text-white/80 ring-1 ring-white/5 transition hover:ring-white/10">
            <div className="text-sm font-semibold">Sponsored</div>

            <div className="mt-3 space-y-3">
              <AdCard
                title="Laptop Cleaning Service"
                desc="Book a tech to your dorm."
              />
              <AdCard
                title="TruVerse"
                desc="Stop AI fake content before it spreads."
              />
            </div>
          </div>

          <ExtensionPopup
            open={popupOpen}
            protectionOn={protectionOn}
            setProtectionOn={setProtectionOn}
            scannedCount={scannedCount}
            verifiedCount={verifiedCount}
            detectedCount={detectedCount}
            blockedCount={blockedCount}
            reportedCount={reportedCount}
            breakdown={breakdown}
            onReset={resetDemo}
          />
        </aside>
      </div>

      <AnalysisModal
        open={analysisOpen}
        post={activePost}
        onClose={() => setAnalysisOpen(false)}
      />
    </div>
  );
}

/* helpers */

function BadgeDot({ color, text }) {
  return (
    <div className="inline-flex items-center gap-2 text-white/85">
      <span className={["h-2 w-2 rounded-full", color].join(" ")} />
      <span>{text}</span>
    </div>
  );
}

function SideItem({ icon, label }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5 active:scale-[0.99]">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StoryCard({ title, me }) {
  return (
    <button
      className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl transition
                 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] active:scale-[0.99]"
      title={title}
    >
      <div
        className={[
          "absolute inset-0",
          me ? "bg-[#3A3B3C]" : "bg-gradient-to-br from-[#2E4BFF] to-[#4B2CE6]",
        ].join(" ")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      {me ? (
        <div className="absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white text-black text-lg font-black">
          +
        </div>
      ) : (
        <div className="absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white text-xs font-black ring-2 ring-[#1877F2]">
          {getInitials(title)}
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 text-left text-xs font-bold text-white">
        {title}
      </div>
    </button>
  );
}

function ComposerBtn({ icon, label }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white/75 transition hover:bg-white/5 active:scale-[0.99]">
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ActionBtn({ icon, label }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-xl py-2 transition hover:bg-white/10 active:scale-[0.98]">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function AdCard({ title, desc }) {
  return (
    <button className="w-full rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10 active:scale-[0.99]">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-1 text-xs text-white/65">{desc}</div>
    </button>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}
