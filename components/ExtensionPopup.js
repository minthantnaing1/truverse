"use client";

export default function ExtensionPopup({
  open,
  protectionOn,
  setProtectionOn,
  scannedCount,
  verifiedCount,
  detectedCount,
  blockedCount,
  reportedCount,
  breakdown,
  onReset,
}) {
  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] w-[320px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
      <div className="bg-gradient-to-r from-[#4B2CE6] to-[#2E4BFF] px-5 py-3.5 text-white">
        <div className="flex items-center gap-1.5">
          <img src="/truverse.png" alt="TruVerse" className="h-6 w-6" />
          <div className="text-base font-black tracking-tight">TruVerse</div>

          <span
            className={[
              "ml-auto rounded-full px-2 py-1 text-[11px] font-extrabold",
              protectionOn
                ? "bg-emerald-400/20 text-emerald-100"
                : "bg-white/15 text-white/80",
            ].join(" ")}
          >
            {protectionOn ? "ACTIVE" : "OFF"}
          </span>
        </div>

        <div className="mt-1 text-xs text-white/85">
          Real-time protection {protectionOn ? "on" : "off"}
        </div>
      </div>

      <div className="max-h-[350px] overflow-y-auto p-4 text-slate-900">
        <div className="rounded-2xl bg-slate-50 p-3 transition hover:bg-slate-100/80">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold text-slate-800">
              Content scanned
            </div>
            <div className="text-xs font-black text-slate-800">
              {scannedCount}
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 text-[11px] text-slate-600">
            <span
              className={[
                "h-2 w-2 rounded-full",
                protectionOn ? "bg-emerald-500" : "bg-slate-400",
              ].join(" ")}
            />
            {protectionOn ? "Scanning in real time" : "Protection off"}
          </div>
        </div>

        {/* ✅ Main stats */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatCard title="Verified" value={verifiedCount} tone="good" />
          <StatCard title="Flagged" value={detectedCount} tone="bad" />
        </div>

        {/* ✅ New action stats */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatCard title="Blocked" value={blockedCount} tone="neutral" />
          <StatCard title="Reported" value={reportedCount} tone="neutral" />
        </div>

        <div className="mt-4">
          <div className="text-xs font-extrabold text-slate-900">
            Detection breakdown
          </div>
          <div className="mt-2 space-y-2 text-sm">
            <BreakRow label="Deepfakes" value={breakdown.deepfakes} />
            <BreakRow label="Fake News" value={breakdown.fakeNews} />
            <BreakRow label="Manipulated" value={breakdown.manipulated} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setProtectionOn((v) => !v)}
            className={[
              "w-full rounded-2xl px-4 py-3 text-xs font-extrabold transition active:scale-[0.98]",
              protectionOn
                ? "bg-emerald-600 text-white hover:opacity-95"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300",
            ].join(" ")}
          >
            {protectionOn ? "Protection ON" : "Protection OFF"}
          </button>

          <button
            onClick={onReset}
            className="rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-200 active:scale-[0.98]"
            title="Reset demo flags"
          >
            Reset
          </button>
        </div>

        <button className="mt-2 w-full rounded-2xl bg-slate-100 px-4 py-3 text-xs font-extrabold text-slate-800 transition hover:bg-slate-200 active:scale-[0.98]">
          Extension settings
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, tone }) {
  const map = {
    good: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      ring: "ring-emerald-200/60",
    },
    bad: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      ring: "ring-rose-200/60",
    },
    neutral: {
      bg: "bg-slate-50",
      text: "text-slate-800",
      ring: "ring-slate-200/70",
    },
  };

  const { bg, text, ring } = map[tone] || map.neutral;

  return (
    <div
      className={[
        "rounded-2xl p-3 ring-1 transition hover:-translate-y-0.5 hover:shadow-lg",
        bg,
        ring,
      ].join(" ")}
    >
      <div className={["text-[11px] font-bold", text].join(" ")}>{title}</div>
      <div
        className={["mt-1 text-2xl font-black leading-none", text].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function BreakRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2 text-sm transition hover:bg-slate-100/80">
      <div className="text-slate-700">{label}</div>
      <div className="font-black text-slate-900">{value}</div>
    </div>
  );
}
