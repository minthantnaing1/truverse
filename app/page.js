"use client";

import { useEffect, useMemo, useState } from "react";

const FEED = [
  {
    id: "p1",
    author: "Sarah Johnson",
    handle: "@sarahj",
    time: "2h ago",
    avatar: "SJ",
    type: "verified", // verified | warn
    confidence: 84,
    label: "Verified Human Content",
    text: "Just finished an amazing workout session! Feeling energized 💪",
    likes: 234,
    comments: 12,
  },
  {
    id: "p2",
    author: "TechNews Daily",
    handle: "@technews",
    time: "3h ago",
    avatar: "TN",
    type: "warn",
    confidence: 94,
    label: "Potential Misinformation",
    text: "BREAKING: Major tech company announces revolutionary quantum breakthrough that will change everything we know about computing. SHARE before it gets deleted!",
    likes: 981,
    comments: 210,
    category: "Fake News",
  },
  {
    id: "p3",
    author: "ImageLab",
    handle: "@imagelab",
    time: "2d ago",
    avatar: "IL",
    type: "warn",
    confidence: 88,
    label: "Manipulated Image Suspected",
    text: "Look at this “unfiltered” photo from the event… the details are insane 👀",
    likes: 643,
    comments: 59,
    category: "Manipulated Images",
  },
];

export default function Page() {
  const [protectionOn, setProtectionOn] = useState(true);
  const [scanning, setScanning] = useState(true);

  // postStatus: normal | ignored | blocked | reported
  const [postStatus, setPostStatus] = useState(() => {
    const s = {};
    FEED.forEach((p) => (s[p.id] = "normal"));
    return s;
  });

  const visiblePosts = useMemo(
    () => FEED.filter((p) => postStatus[p.id] !== "blocked"),
    [postStatus],
  );

  const stats = useMemo(() => {
    let verified = 0;
    let detected = 0;
    let deepfakes = 0;
    let fakeNews = 0;
    let manipulated = 0;

    for (const p of FEED) {
      if (postStatus[p.id] === "blocked") continue;
      if (p.type === "verified") verified += 1;
      if (p.type === "warn") {
        detected += 1;
        if (p.category === "Deepfakes") deepfakes += 1;
        if (p.category === "Fake News") fakeNews += 1;
        if (p.category === "Manipulated Images") manipulated += 1;
      }
    }
    return { verified, detected, deepfakes, fakeNews, manipulated };
  }, [postStatus]);

  useEffect(() => {
    if (!protectionOn) {
      setScanning(false);
      return;
    }
    setScanning(true);
    const t = setTimeout(() => setScanning(false), 1200); // simple “real-time” feel
    return () => clearTimeout(t);
  }, [protectionOn]);

  function setStatus(id, status) {
    setPostStatus((prev) => ({ ...prev, [id]: status }));
  }

  function resetDemo() {
    const s = {};
    FEED.forEach((p) => (s[p.id] = "normal"));
    setPostStatus(s);
    setScanning(protectionOn);
  }

  return (
    <main className="min-h-screen bg-[#F4F7FF] text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-transparent shadow-sm">
              <img
                src="/truverse.png"
                alt="TruVerse logo"
                className="h-10 w-10 shadow-sm rounded-xl"
              />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none text-slate-700">
                TruVerse
              </div>
              <div className="text-xs text-slate-500">
                Restoring trust in the digital world
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="#how"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              How it works
            </a>
            <a
              href="/demo"
              className="rounded-xl bg-[#1B57F2] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Live Demo
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B57F2] to-[#0B2B7A]" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Prototype v1 (mock real-time scanning)
              </div>

              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Verify what's real online.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85">
                TruVerse works like an{" "}
                <span className="font-semibold">antivirus</span> for
                misinformation—scanning the content you browse in real time and
                warning you before you share or trust it.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/demo"
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-extrabold text-[#0B2B7A] shadow-sm hover:opacity-95"
                >
                  See Live Demo
                </a>
                <a
                  href="/pricing"
                  className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/15"
                >
                  TruVerse Pricing
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                  Real-time scanning
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                  Warning labels
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                  Trust-focused
                </span>
              </div>
            </div>

            {/* Right card */}
            <div className="rounded-3xl bg-white/10 p-5 shadow-sm ring-1 ring-white/15 backdrop-blur">
              <div className="rounded-2xl bg-white p-5">
                <div className="text-xs font-semibold text-slate-500">
                  What TruVerse does (prototype)
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Feature title="Always-on" desc="Scans while you browse" />
                  <Feature
                    title="Instant warnings"
                    desc="Flags suspicious posts"
                  />
                  <Feature
                    title="User control"
                    desc="Ignore • Block • Report"
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-extrabold text-slate-800">
                    “Stop AI-generated fake content before it spreads.”
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              How it works
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              TruVerse runs in the background like protection software: it
              monitors the content you view, analyzes it, then shows an on-post
              warning if needed.
            </p>
          </div>
          <a
            href="#preview"
            className="hidden rounded-xl bg-[#1B57F2] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 sm:inline-flex"
          >
            Jump to preview
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Step
            n="01"
            title="Monitor"
            desc="Detects posts as you scroll on social platforms."
          />
          <Step
            n="02"
            title="Analyze"
            desc="Checks signals for deepfakes, fake news, and manipulations."
          />
          <Step
            n="03"
            title="Protect"
            desc="Warns you and lets you ignore, block, or report."
          />
        </div>
      </section>

      {/* Live preview */}
      <section id="preview" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">
                Live preview
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Shows how TruVerse would automatically scan and label posts in
                real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setProtectionOn((v) => !v)}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-extrabold",
                  protectionOn
                    ? "bg-emerald-600 text-white hover:opacity-95"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300",
                ].join(" ")}
              >
                {protectionOn ? "Protection: ON" : "Protection: OFF"}
              </button>

              <button
                onClick={resetDemo}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Status strip */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3 text-sm">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  protectionOn ? "bg-emerald-500" : "bg-slate-400",
                ].join(" ")}
              />
              <span className="font-semibold text-slate-700">
                TruVerse Protection: {protectionOn ? "Active" : "Inactive"}
              </span>

              {protectionOn ? (
                <span className="text-slate-600">
                  • {scanning ? "Scanning in real-time..." : "Monitoring feed"}
                </span>
              ) : (
                <span className="text-slate-500">
                  • Turn on to enable automatic scanning
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-700">
                  <span className="font-extrabold">{stats.verified}</span>{" "}
                  Verified
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-700">
                  <span className="font-extrabold">{stats.detected}</span>{" "}
                  Flagged
                </span>
              </div>
            </div>
          </div>

          {/* Two-column: Feed + mini dashboard */}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* Feed */}
            <div className="space-y-4">
              {visiblePosts.map((p) => {
                const status = postStatus[p.id];
                const ignored = status === "ignored";
                const reported = status === "reported";

                return (
                  <div
                    key={p.id}
                    className={[
                      "rounded-3xl border bg-white shadow-sm",
                      p.type === "warn"
                        ? "border-rose-200"
                        : "border-slate-200",
                      ignored ? "opacity-75" : "",
                    ].join(" ")}
                  >
                    {/* Banner */}
                    {protectionOn ? (
                      p.type === "verified" ? (
                        <div className="flex items-center gap-3 rounded-t-3xl bg-emerald-50 px-4 py-3">
                          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-600 text-white">
                            ✓
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-emerald-800">
                              {p.label}
                            </div>
                            <div className="text-xs text-emerald-700/90">
                              TruVerse confidence: {p.confidence}%
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-3xl bg-rose-50 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-rose-600 text-white">
                              !
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-extrabold text-rose-800">
                                {p.label}
                              </div>
                              <div className="text-xs text-rose-700/90">
                                {p.confidence}% confidence • Ignore, block, or
                                report
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setStatus(p.id, "ignored")}
                              className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                            >
                              Ignore
                            </button>
                            <button
                              onClick={() => setStatus(p.id, "blocked")}
                              className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-extrabold text-white hover:opacity-95"
                            >
                              Block
                            </button>
                            <button
                              onClick={() => setStatus(p.id, "reported")}
                              className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                            >
                              Report
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="rounded-t-3xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                        TruVerse is OFF. Turn ON protection to scan this post.
                      </div>
                    )}

                    {/* Post content */}
                    <div className="px-5 py-5">
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-sm font-black text-slate-700">
                          {p.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <div className="text-base font-extrabold text-slate-900">
                              {p.author}
                            </div>
                            <div className="text-sm text-slate-500">
                              {p.handle}
                            </div>
                            <div className="text-sm text-slate-400">•</div>
                            <div className="text-sm text-slate-500">
                              {p.time}
                            </div>

                            {reported ? (
                              <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
                                Reported
                              </span>
                            ) : null}
                            {ignored ? (
                              <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                                Ignored
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-3 text-sm leading-relaxed text-slate-800">
                            {p.text}
                          </p>

                          <div className="mt-4 flex items-center gap-5 text-sm text-slate-500">
                            <div className="inline-flex items-center gap-2">
                              <span className="text-base">♡</span>
                              <span>{p.likes}</span>
                            </div>
                            <div className="inline-flex items-center gap-2">
                              <span className="text-base">💬</span>
                              <span>{p.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini dashboard */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-2xl bg-gradient-to-r from-[#1B57F2] to-[#3C2CE6] p-5 text-white">
                <div className="text-lg font-black">TruVerse Dashboard</div>
                <div className="mt-1 text-sm text-white/85">
                  Real-time protection {protectionOn ? "active" : "inactive"}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="text-xs font-bold text-emerald-800">
                    Verified Human
                  </div>
                  <div className="mt-2 text-3xl font-black text-emerald-800">
                    {stats.verified}
                  </div>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4">
                  <div className="text-xs font-bold text-rose-800">Flagged</div>
                  <div className="mt-2 text-3xl font-black text-rose-800">
                    {stats.detected}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-extrabold text-slate-900">
                  Detection Breakdown
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <BreakRow label="Deepfakes" value={stats.deepfakes} />
                  <BreakRow label="Fake News" value={stats.fakeNews} />
                  <BreakRow
                    label="Manipulated Images"
                    value={stats.manipulated}
                  />
                </div>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-200">
                Extension Settings (mock)
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          TruVerse Prototype
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-extrabold text-slate-900">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-600">{desc}</div>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black text-[#1B57F2]">{n}</div>
        <div className="h-2 w-2 rounded-full bg-[#1B57F2]" />
      </div>
      <div className="mt-3 text-base font-black text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</div>
    </div>
  );
}

function MiniMetric({ title, desc }) {
  return (
    <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
      <div className="text-sm font-extrabold text-white">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-white/85">{desc}</div>
    </div>
  );
}

function BreakRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <div className="text-slate-700">{label}</div>
      <div className="font-black text-slate-900">{value}</div>
    </div>
  );
}
