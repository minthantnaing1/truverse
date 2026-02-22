"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * TruVerse Trust Dashboard (Light TruVerse theme)
 * - No external chart libs (pure SVG)
 * - Reads latest metrics from localStorage (optional):
 *   localStorage.setItem("truverse_dashboard_snapshot", JSON.stringify({
 *     range: "24h",
 *     scanned, verified, flagged, blocked, reported,
 *     breakdown: { fakeNews, deepfakes, manipulated },
 *     series: [{ label, value }],
 *     events: [{ type, label, confidence, time }]
 *   }))
 */

// ---------- helpers ----------
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10; // 1 decimal
}
function formatNum(n) {
  return Number(n || 0).toLocaleString();
}
function formatCompact(n) {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `${Math.round(x / 100_000) / 10}M`;
  if (x >= 1_000) return `${Math.round(x / 100) / 10}K`;
  return `${x}`;
}
function computeTrustScore({ scanned, flagged, blocked, reported }) {
  // Simple: trust decreases with flagged rate, slightly improves with blocks (protection working)
  const s = Math.max(1, scanned || 1);
  const flaggedRate = (flagged || 0) / s; // 0..1
  const blockBonus = clamp((blocked || 0) / s, 0, 0.15);
  const reportPenalty = clamp((reported || 0) / s, 0, 0.12);

  let score = 100;
  score -= flaggedRate * 85;
  score += blockBonus * 20;
  score -= reportPenalty * 15;

  score = clamp(Math.round(score), 0, 100);
  return score;
}

// ---------- default mock snapshot ----------
const DEFAULT_SNAPSHOT = {
  range: "24h",
  scanned: 12431,
  verified: 11147,
  flagged: 1284,
  blocked: 312,
  reported: 98,
  breakdown: { fakeNews: 520, deepfakes: 410, manipulated: 354 },
  series: [
    { label: "00:00", value: 120 },
    { label: "04:00", value: 180 },
    { label: "08:00", value: 240 },
    { label: "12:00", value: 310 },
    { label: "16:00", value: 210 },
    { label: "20:00", value: 350 },
  ],
  events: [
    {
      type: "blocked",
      label: "Blocked post • Fake News",
      confidence: 92,
      time: "12m ago",
    },
    {
      type: "reported",
      label: "Reported post • Manipulated image",
      confidence: 88,
      time: "41m ago",
    },
    {
      type: "ack",
      label: "User acknowledged warning",
      confidence: 84,
      time: "1h ago",
    },
    {
      type: "flagged",
      label: "Flagged post • Deepfake risk",
      confidence: 90,
      time: "2h ago",
    },
  ],
};

// ---------- page ----------
export default function Page() {
  const [range, setRange] = useState("24h"); // 24h | 7d | 30d
  const [snapshot, setSnapshot] = useState(DEFAULT_SNAPSHOT);

  // Load snapshot if demo stored it
  useEffect(() => {
    try {
      const raw = localStorage.getItem("truverse_dashboard_snapshot");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setSnapshot((prev) => ({
          ...prev,
          ...parsed,
          breakdown: { ...prev.breakdown, ...(parsed.breakdown || {}) },
          series:
            Array.isArray(parsed.series) && parsed.series.length
              ? parsed.series
              : prev.series,
          events:
            Array.isArray(parsed.events) && parsed.events.length
              ? parsed.events
              : prev.events,
        }));
        if (parsed.range) setRange(parsed.range);
      }
    } catch {
      // ignore
    }
  }, []);

  // When range changes, we can adjust series shape slightly (mock)
  useEffect(() => {
    setSnapshot((prev) => {
      const base = { ...prev, range };
      // If user is feeding data from demo, keep it as-is.
      // If still default, lightly change series to match range.
      const isDefault = prev.scanned === DEFAULT_SNAPSHOT.scanned;
      if (!isDefault) return base;

      if (range === "7d") {
        return {
          ...base,
          series: [
            { label: "Mon", value: 260 },
            { label: "Tue", value: 310 },
            { label: "Wed", value: 280 },
            { label: "Thu", value: 360 },
            { label: "Fri", value: 420 },
            { label: "Sat", value: 330 },
            { label: "Sun", value: 390 },
          ],
        };
      }
      if (range === "30d") {
        return {
          ...base,
          series: Array.from({ length: 10 }).map((_, i) => ({
            label: `W${i + 1}`,
            value: 240 + i * 18 + (i % 2 ? 30 : 0),
          })),
        };
      }
      // 24h
      return { ...base, series: DEFAULT_SNAPSHOT.series };
    });
  }, [range]);

  const stats = useMemo(() => {
    const scanned = snapshot.scanned || 0;
    const verified = snapshot.verified || 0;
    const flagged = snapshot.flagged || 0;
    const blocked = snapshot.blocked || 0;
    const reported = snapshot.reported || 0;

    const flaggedRate = pct(flagged, scanned);
    const blockRate = pct(blocked, scanned);
    const reportRate = pct(reported, scanned);
    const trustScore = computeTrustScore({
      scanned,
      flagged,
      blocked,
      reported,
    });

    const breakdown = snapshot.breakdown || {
      fakeNews: 0,
      deepfakes: 0,
      manipulated: 0,
    };
    const totalDetected =
      (breakdown.fakeNews || 0) +
      (breakdown.deepfakes || 0) +
      (breakdown.manipulated || 0);

    return {
      scanned,
      verified,
      flagged,
      blocked,
      reported,
      flaggedRate,
      blockRate,
      reportRate,
      trustScore,
      breakdown,
      totalDetected,
      series: Array.isArray(snapshot.series) ? snapshot.series : [],
      events: Array.isArray(snapshot.events) ? snapshot.events : [],
    };
  }, [snapshot]);

  return (
    <main className="min-h-screen bg-[#F4F7FF] text-slate-900">
      {/* Compact TruVerse header (dashboard style, not marketing) */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E4BFF] via-[#1B57F2] to-[#0B2B7A]" />
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-28 top-6 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

        {/* top bar */}
        <header className="relative z-10 border-b border-white/15 bg-white/5 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/15"
            >
              ← Back to Demo
            </a>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <img
                  src="/truverse.png"
                  alt="TruVerse"
                  className="h-9 w-9 rounded-xl shadow-sm"
                />
                <div className="leading-tight">
                  <div className="text-sm font-extrabold text-white">
                    TruVerse
                  </div>
                  <div className="text-xs text-white/70">Trust Dashboard</div>
                </div>
              </div>

              <RangeSelect value={range} onChange={setRange} />
            </div>
          </div>
        </header>

        {/* compact header content */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Analytics
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Trust health overview
              </h1>

              <p className="mt-1 text-sm text-white/80">
                A quick view of scans, detections, blocks, and reports.
              </p>
            </div>

            <TrustScoreCard
              score={stats.trustScore}
              flaggedRate={stats.flaggedRate}
              scanned={stats.scanned}
              flagged={stats.flagged}
            />
          </div>
        </section>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 pb-12 mt-6 space-y-6">
        {/* KPI row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="Scanned"
            value={formatNum(stats.scanned)}
            pill="All scans"
            tone="blue"
          />
          <KpiCard
            title="Verified"
            value={formatNum(stats.verified)}
            pill="Safe"
            tone="green"
          />
          <KpiCard
            title="Flagged"
            value={formatNum(stats.flagged)}
            pill="Detected"
            tone="rose"
            sub={`${stats.flaggedRate}% flagged rate`}
          />
          <KpiCard
            title="Blocked"
            value={formatNum(stats.blocked)}
            pill="Auto blocked"
            tone="amber"
            sub={`${stats.blockRate}% of scans`}
          />
          <KpiCard
            title="Reported"
            value={formatNum(stats.reported)}
            pill="User reported"
            tone="sky"
            sub={`${stats.reportRate}% of scans`}
          />
        </div>

        {/* Charts row (balanced, not too many) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* line chart */}
          <Panel className="lg:col-span-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  Flagged content over time
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Trend of suspicious detections (range: {rangeLabel(range)}).
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Avg:{" "}
                <span className="font-black text-slate-900">
                  {avg(stats.series)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <LineChart
                points={stats.series}
                height={220}
                stroke="#1B57F2"
                fill="rgba(27,87,242,0.08)"
              />
            </div>

            {/* ✅ ADDED ONLY: small insight text in the whitespace below the line chart */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
              <div className="text-xs font-bold text-slate-700">Insight</div>
              <div className="mt-1 text-sm text-slate-700">
                {(() => {
                  const s = stats.series || [];
                  if (s.length < 2)
                    return "Not enough data to summarize trends.";

                  const first = Number(s[0]?.value || 0);
                  const last = Number(s[s.length - 1]?.value || 0);

                  let peak = s[0];
                  for (const p of s) {
                    if (Number(p?.value || 0) > Number(peak?.value || 0))
                      peak = p;
                  }

                  const delta = last - first;
                  const dir =
                    delta > 0
                      ? "increased"
                      : delta < 0
                        ? "decreased"
                        : "stayed flat";

                  const abs = Math.abs(delta);
                  const pctChange = first ? Math.round((abs / first) * 100) : 0;

                  return (
                    <>
                      Flagged activity{" "}
                      <span className="font-extrabold">{dir}</span> by{" "}
                      <span className="font-extrabold">
                        {formatCompact(abs)}
                      </span>{" "}
                      {first ? (
                        <>
                          (<span className="font-extrabold">{pctChange}%</span>)
                        </>
                      ) : null}{" "}
                      from {s[0]?.label} → {s[s.length - 1]?.label}. Peak
                      occurred at{" "}
                      <span className="font-extrabold">{peak?.label}</span> with{" "}
                      <span className="font-extrabold">
                        {formatCompact(peak?.value)}
                      </span>{" "}
                      flags.
                    </>
                  );
                })()}
              </div>
            </div>
          </Panel>

          {/* breakdown */}
          <Panel className="lg:col-span-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  Detection breakdown
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  What TruVerse is catching most.
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Total:{" "}
                <span className="font-black text-slate-900">
                  {formatCompact(stats.totalDetected)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <BreakBar
                label="Fake News"
                value={stats.breakdown.fakeNews}
                total={stats.totalDetected}
              />
              <BreakBar
                label="Deepfakes"
                value={stats.breakdown.deepfakes}
                total={stats.totalDetected}
              />
              <BreakBar
                label="Manipulated Media"
                value={stats.breakdown.manipulated}
                total={stats.totalDetected}
              />
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
              <div className="text-xs font-bold text-slate-700">
                Insight (mock)
              </div>
              <div className="mt-1 text-sm text-slate-700">
                Flagged spikes usually come from viral posts. Consider stronger
                blocking rules when flagged rate exceeds{" "}
                <span className="font-extrabold">12%</span>.
              </div>
            </div>
          </Panel>
        </div>

        {/* ✅ NEW SECTION ONLY: More charts (visuals) */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  Detection mix (donut)
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Visual split of detection categories.
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Total:{" "}
                <span className="font-black text-slate-900">
                  {formatCompact(stats.totalDetected)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <DonutChart
                size={180}
                thickness={18}
                data={[
                  {
                    label: "Fake News",
                    value: stats.breakdown.fakeNews,
                    color: "#1B57F2",
                  },
                  {
                    label: "Deepfakes",
                    value: stats.breakdown.deepfakes,
                    color: "#7C3AED",
                  },
                  {
                    label: "Manipulated",
                    value: stats.breakdown.manipulated,
                    color: "#06B6D4",
                  },
                ]}
                centerTop="Total"
                centerBottom={formatCompact(stats.totalDetected)}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <LegendDot label="Fake News" color="#1B57F2" />
              <LegendDot label="Deepfakes" color="#7C3AED" />
              <LegendDot label="Manipulated" color="#06B6D4" />
            </div>
          </Panel>

          <Panel className="lg:col-span-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  Social sources (bar)
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Where risk is coming from on social media.
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Flags:{" "}
                <span className="font-black text-slate-900">
                  {formatCompact(410 + 352 + 278 + 244)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <BarChart
                height={160}
                data={[
                  { label: "Public Groups", value: 410 },
                  { label: "News Pages", value: 352 },
                  { label: "Reposts", value: 278 },
                  { label: "Links", value: 244 },
                ]}
              />
            </div>
          </Panel>
        </div>

        {/* Bottom row: events + table */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  Recent trust events
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Latest actions taken by TruVerse and users.
                </div>
              </div>
              <button
                onClick={() => {
                  // optional UX: refresh mock events a bit
                  setSnapshot((prev) => ({
                    ...prev,
                    events: shuffle(prev.events || []).slice(0, 6),
                  }));
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {stats.events.slice(0, 6).map((e, idx) => (
                <EventRow key={idx} event={e} />
              ))}
            </div>
          </Panel>

          <Panel className="lg:col-span-5">
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                Risk drivers (mock)
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Where detections are coming from.
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-xs text-slate-600">
                    <th className="px-4 py-3 font-bold">Source</th>
                    <th className="px-4 py-3 font-bold">Flags</th>
                    <th className="px-4 py-3 font-bold">Avg conf.</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <RiskRow source="Public Groups" flags={410} conf={91} />
                  <RiskRow source="Breaking News Pages" flags={352} conf={88} />
                  <RiskRow source="Reposts / Shares" flags={278} conf={86} />
                  <RiskRow source="Unknown Links" flags={244} conf={90} />
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniStat label="Avg confidence" value="89%" />
              <MiniStat label="Top category" value="Fake News" />
            </div>
          </Panel>
        </div>

        {/* Footer */}
        <footer className="pt-2 text-xs text-slate-500">
          TruVerse • Trust Dashboard (prototype)
        </footer>
      </div>
    </main>
  );
}

// ---------- components ----------
function RangeSelect({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl bg-white/10 px-4 py-2 pr-10 text-sm font-semibold text-white/90 ring-1 ring-white/15 hover:bg-white/15 focus:outline-none"
      >
        <option value="24h" className="text-slate-900 bg-white">
          Last 24 hours
        </option>
        <option value="7d" className="text-slate-900 bg-white">
          Last 7 days
        </option>
        <option value="30d" className="text-slate-900 bg-white">
          Last 30 days
        </option>
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
        ▾
      </div>
    </div>
  );
}

function TrustScoreCard({ score, flaggedRate, scanned, flagged }) {
  return (
    <div className="w-full max-w-xl rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-white">Trust Health</div>
          <div className="mt-0.5 text-xs text-white/75">
            Flagged rate: <span className="font-black">{flaggedRate}%</span> •{" "}
            {formatNum(flagged)} / {formatNum(scanned)}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-4xl font-black text-white leading-none">
            {score}
            <span className="text-base font-bold text-white/70"> / 100</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={score} />
        <div className="mt-2 text-[11px] text-white/70">
          Higher score = fewer risky detections relative to scans.
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  const v = clamp(value || 0, 0, 100);
  return (
    <div className="h-3 w-full rounded-full bg-white/15 overflow-hidden">
      <div
        className="h-3 rounded-full"
        style={{
          width: `${v}%`,
          background:
            "linear-gradient(90deg, rgba(52,211,153,1) 0%, rgba(59,130,246,1) 45%, rgba(167,139,250,1) 100%)",
        }}
      />
    </div>
  );
}

function Panel({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function KpiCard({ title, value, pill, tone, sub }) {
  const map = {
    blue: { num: "text-[#1B57F2]", pill: "bg-[#1B57F2]/10 text-[#1B57F2]" },
    green: { num: "text-emerald-700", pill: "bg-emerald-50 text-emerald-700" },
    rose: { num: "text-rose-700", pill: "bg-rose-50 text-rose-700" },
    amber: { num: "text-amber-700", pill: "bg-amber-50 text-amber-700" },
    sky: { num: "text-sky-700", pill: "bg-sky-50 text-sky-700" },
  };
  const t = map[tone] || map.blue;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold text-slate-600">{title}</div>
      <div
        className={["mt-2 text-4xl font-black tracking-tight", t.num].join(" ")}
      >
        {value}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={["rounded-full px-3 py-1 text-xs font-black", t.pill].join(
            " ",
          )}
        >
          {pill}
        </span>
        {sub ? <span className="text-xs text-slate-500">{sub}</span> : null}
      </div>
    </div>
  );
}

function LineChart({
  points,
  height = 220,
  stroke = "#1B57F2",
  fill = "rgba(27,87,242,0.08)",
}) {
  const w = 680; // internal viewBox width
  const h = height; // internal viewBox height
  const padX = 26;
  const padY = 18;

  const safe = Array.isArray(points) ? points : [];
  const values = safe.map((p) => Number(p.value || 0));
  const maxV = Math.max(1, ...values);
  const minV = Math.min(...values, 0);

  const xStep = safe.length > 1 ? (w - padX * 2) / (safe.length - 1) : 0;

  const pts = safe.map((p, i) => {
    const x = padX + i * xStep;
    const v = Number(p.value || 0);
    const y = padY + (h - padY * 2) * (1 - (v - minV) / (maxV - minV || 1));
    return { x, y, v, label: p.label };
  });

  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const area =
    `${path} L ${(padX + (safe.length - 1) * xStep).toFixed(1)} ${(h - padY).toFixed(1)} ` +
    `L ${padX.toFixed(1)} ${(h - padY).toFixed(1)} Z`;

  // grid lines (simple)
  const grid = [0.25, 0.5, 0.75].map((t, i) => ({
    y: padY + (h - padY * 2) * t,
    key: i,
  }));

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200/70">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        {/* grid */}
        {grid.map((g) => (
          <line
            key={g.key}
            x1={padX}
            y1={g.y}
            x2={w - padX}
            y2={g.y}
            stroke="rgba(15,23,42,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* area */}
        <path d={area} fill={fill} />
        {/* line */}
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* points */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill={stroke} opacity="0.95" />
            <circle cx={p.x} cy={p.y} r="10" fill={stroke} opacity="0.12" />
          </g>
        ))}
      </svg>

      {/* x labels */}
      <div className="grid grid-cols-6 gap-1 px-4 pb-3 pt-2 text-[11px] text-slate-500">
        {(safe.length <= 6 ? safe : pickLabels(safe, 6)).map((p, i) => (
          <div key={i} className="truncate">
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakBar({ label, value, total }) {
  const v = Number(value || 0);
  const t = Math.max(1, Number(total || 1));
  const percent = clamp((v / t) * 100, 0, 100);

  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-slate-800">{label}</div>
        <div className="text-sm font-black text-slate-900">{formatNum(v)}</div>
      </div>

      <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-[#1B57F2]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-slate-500">
        {percent.toFixed(1)}% of detections
      </div>
    </div>
  );
}

function EventRow({ event }) {
  const type = event?.type || "flagged";
  const map = {
    blocked: {
      dot: "bg-rose-500",
      pill: "bg-rose-50 text-rose-700",
      label: "Blocked",
    },
    reported: {
      dot: "bg-sky-500",
      pill: "bg-sky-50 text-sky-700",
      label: "Reported",
    },
    ack: {
      dot: "bg-emerald-500",
      pill: "bg-emerald-50 text-emerald-700",
      label: "Acknowledged",
    },
    flagged: {
      dot: "bg-amber-500",
      pill: "bg-amber-50 text-amber-700",
      label: "Flagged",
    },
  };
  const t = map[type] || map.flagged;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70">
      <div className="flex min-w-0 items-center gap-3">
        <span className={["h-2.5 w-2.5 rounded-full", t.dot].join(" ")} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-800">
            {event?.label || "Trust event"}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            Confidence:{" "}
            <span className="font-bold text-slate-700">
              {event?.confidence ?? 90}%
            </span>{" "}
            • {event?.time || "Just now"}
          </div>
        </div>
      </div>

      <span
        className={[
          "shrink-0 rounded-full px-3 py-1 text-xs font-black",
          t.pill,
        ].join(" ")}
      >
        {t.label}
      </span>
    </div>
  );
}

function RiskRow({ source, flags, conf }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 font-semibold text-slate-800">{source}</td>
      <td className="px-4 py-3 font-black text-slate-900">
        {formatNum(flags)}
      </td>
      <td className="px-4 py-3 font-black text-slate-900">{conf}%</td>
    </tr>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
      <div className="text-xs font-bold text-slate-600">{label}</div>
      <div className="mt-1 text-lg font-black text-slate-900">{value}</div>
    </div>
  );
}

/* ✅ NEW CHART COMPONENTS (used only in the NEW section) */
function DonutChart({
  data,
  size = 180,
  thickness = 18,
  centerTop,
  centerBottom,
}) {
  const safe = Array.isArray(data) ? data : [];
  const total = safe.reduce((s, d) => s + Number(d.value || 0), 0) || 1;

  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;

  let acc = 0;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth={thickness}
        />

        {safe.map((d) => {
          const v = Number(d.value || 0);
          const frac = v / total;
          const dash = frac * circ;
          const gap = circ - dash;
          const offset = acc * circ;
          acc += frac;

          return (
            <circle
              key={d.label}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={d.color || "#1B57F2"}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${c} ${c})`}
            />
          );
        })}

        <text
          x={c}
          y={c - 6}
          textAnchor="middle"
          fontSize="11"
          fill="rgba(15,23,42,0.65)"
          fontWeight="700"
        >
          {centerTop || ""}
        </text>
        <text
          x={c}
          y={c + 16}
          textAnchor="middle"
          fontSize="18"
          fill="rgba(15,23,42,0.92)"
          fontWeight="900"
        >
          {centerBottom || ""}
        </text>
      </svg>
    </div>
  );
}

function BarChart({ data, height = 160 }) {
  const safe = Array.isArray(data) ? data : [];
  const w = 680;
  const h = height;
  const padX = 26;
  const padY = 14;

  const maxV = Math.max(1, ...safe.map((d) => Number(d.value || 0)));
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const bars = safe.length || 1;
  const gap = 14;
  const barW = Math.max(18, (innerW - gap * (bars - 1)) / bars);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200/70">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <line
          x1={padX}
          y1={h - padY}
          x2={w - padX}
          y2={h - padY}
          stroke="rgba(15,23,42,0.10)"
          strokeWidth="1"
        />

        {safe.map((d, i) => {
          const v = Number(d.value || 0);
          const frac = clamp(v / maxV, 0, 1);
          const bh = frac * innerH;
          const x = padX + i * (barW + gap);
          const y = padY + (innerH - bh);

          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={bh}
                rx="10"
                fill="#1B57F2"
                opacity="0.92"
              />
              <rect
                x={x}
                y={y}
                width={barW}
                height={bh}
                rx="10"
                fill="#1B57F2"
                opacity="0.12"
              />
            </g>
          );
        })}
      </svg>

      <div className="grid grid-cols-4 gap-2 px-4 pb-3 pt-2 text-[11px] text-slate-600">
        {safe.map((d) => (
          <div key={d.label} className="truncate">
            <span className="font-bold text-slate-800">{d.label}</span>{" "}
            <span className="text-slate-500">({formatCompact(d.value)})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendDot({ label, color }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-semibold text-slate-700">{label}</span>
    </div>
  );
}

// ---------- small utils ----------
function rangeLabel(r) {
  if (r === "7d") return "last 7 days";
  if (r === "30d") return "last 30 days";
  return "last 24 hours";
}
function avg(series) {
  const arr = (series || []).map((x) => Number(x.value || 0));
  if (!arr.length) return "0";
  const a = Math.round(arr.reduce((s, n) => s + n, 0) / arr.length);
  return formatCompact(a);
}
function pickLabels(arr, n) {
  if (!arr.length) return [];
  if (arr.length <= n) return arr;
  const step = (arr.length - 1) / (n - 1);
  return Array.from({ length: n }).map((_, i) => arr[Math.round(i * step)]);
}
function shuffle(a) {
  const arr = [...(a || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
