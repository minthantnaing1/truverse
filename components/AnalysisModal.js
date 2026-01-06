"use client";

import { useEffect } from "react";

export default function AnalysisModal({ open, post, onClose }) {
  useEffect(() => {
    if (!open) return;

    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  if (!open || !post) return null;

  const a = post.analysis || {};
  const confidence = post.confidence ?? 90;
  const aiProb = a.aiWritingProbability ?? Math.max(70, confidence - 1);
  const cred = a.credibilityScore ?? 25;
  const verified = a.verifiedSource ?? false;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-6 w-[95%] max-w-3xl -translate-x-1/2 overflow-hidden rounded-2xl bg-[#1E1F21] shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-600/15 text-rose-300">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-extrabold text-white">
                Full AI Detection Analysis
              </div>
              <div className="text-xs text-white/60">
                Detailed breakdown of detection results
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 active:scale-[0.98]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ✅ scroll inside modal, not behind */}
        <div className="max-h-[78vh] overflow-y-auto overscroll-contain p-5 pr-4">
          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-5 py-4 transition hover:border-rose-500/35">
            <div className="flex items-center gap-2 text-rose-200">
              <WarningIcon className="h-5 w-5" />
              <div className="text-sm font-extrabold">
                {post.label || "AI-Generated Content Detected"}
              </div>
            </div>
            <div className="mt-1 text-sm text-white/70">
              TruVerse indicates this content was likely generated or
              manipulated by AI systems.
            </div>
          </div>

          <Section title="Confidence Score" right={`${confidence}%`}>
            <div className="text-xs text-white/60">Detection Confidence</div>
            <div className="mt-3 h-3 w-full rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-rose-500 transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </Section>

          <Section title="Text Analysis" right={`${aiProb}%`}>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-white/70">
              {(
                a.patterns || ["Viral framing", "Low verifiability claims"]
              ).map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </Section>

          <Section title="Detection Flags">
            <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
              {(a.flags || ["Manipulative CTA", "Overclaim language"]).map(
                (x, i) => (
                  <li key={i}>{x}</li>
                )
              )}
            </ul>
          </Section>

          <Section title="Source Credibility" right={`${cred}%`}>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10">
              <div className="text-white/75">Verified Source</div>
              <div
                className={
                  verified
                    ? "font-extrabold text-emerald-300"
                    : "font-extrabold text-rose-300"
                }
              >
                {verified ? "Yes" : "No"}
              </div>
            </div>
          </Section>

          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white/85 transition hover:bg-white/15 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <div className="mt-5 rounded-2xl bg-[#171819] p-5 ring-1 ring-white/10 transition hover:ring-white/15">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-white">{title}</div>
        {right ? (
          <div className="text-sm font-black text-white/80">{right}</div>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l10 18H2L12 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
