"use client";

import { useState } from "react";

/* ---------- PRICING DATA (THB) ---------- */

const B2C_PLANS = [
  {
    key: "starter",
    name: "Starter",
    badge: "7-day free trial",
    priceMonthly: 0,
    priceYearly: 0,
    desc: "Try TruVerse protection before committing.",
    features: [
      "Real-time browser scanning",
      "Verification & warning labels",
      "Basic deepfake & misinformation detection",
      "Community reporting (mock)",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    key: "plus",
    name: "Plus",
    badge: "Most popular",
    priceMonthly: 199,
    priceYearly: 1990,
    desc: "Stronger protection for everyday browsing.",
    features: [
      "Everything in Starter",
      "Higher-confidence detection",
      "Explanation for each warning",
      "Scan history (30 days)",
      "Priority support",
    ],
    cta: "Choose Plus",
    highlight: true,
  },
  {
    key: "pro",
    name: "Pro",
    badge: "Advanced",
    priceMonthly: 399,
    priceYearly: 3990,
    desc: "For creators, journalists, and heavy users.",
    features: [
      "Everything in Plus",
      "Bulk verification (up to 25/day)",
      "Export results (CSV)",
      "Advanced manipulation signals",
      "Early access to new features",
    ],
    cta: "Choose Pro",
    highlight: false,
  },
];

const B2B_PLANS = [
  {
    key: "api",
    name: "API",
    badge: "Pay-as-you-go",
    price: "From ฿0.08 / verification",
    desc: "Integrate TruVerse verification into your product.",
    features: [
      "REST API verification endpoint",
      "Confidence score & labels",
      "Webhook callbacks (optional)",
      "Basic rate limits",
      "Standard support",
    ],
  },
  {
    key: "growth",
    name: "Growth",
    badge: "Scaling teams",
    price: "Custom pricing",
    desc: "Higher volume, analytics, and SLA support.",
    features: [
      "Everything in API",
      "Higher throughput & burst limits",
      "Usage & accuracy analytics",
      "Team keys + access control",
      "Priority SLA support",
    ],
    highlight: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    badge: "Platform-ready",
    price: "Custom contract",
    desc: "For large platforms & high-risk environments.",
    features: [
      "Everything in Growth",
      "Dedicated environment (optional)",
      "Custom detectors & policies",
      "Security & compliance support",
      "Dedicated success manager",
    ],
  },
];

/* ---------- HELPERS ---------- */

function fmtTHB(n) {
  // keep simple, no decimals
  return `฿${Number(n).toLocaleString("th-TH")}`;
}

/* ---------- PAGE ---------- */

export default function Page() {
  const [billing, setBilling] = useState("monthly"); // monthly | yearly

  return (
    <main className="min-h-screen bg-[#F4F7FF] text-slate-900">
      {/* TruVerse-style gradient header band */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B57F2] to-[#0B2B7A]" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute left-1/2 top-[-120px] h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        {/* Top bar on gradient */}
        <header className="relative z-10 border-b border-white/15 bg-white/5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/15"
            >
              ← Back to Home
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
                  <div className="text-xs text-white/70">
                    Restoring trust in the digital world
                  </div>
                </div>
              </div>

              <a
                href="/demo"
                className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#0B2B7A] hover:opacity-95"
              >
                Live Demo
              </a>
            </div>
          </div>
        </header>

        {/* Compact header copy (NOT landing hero, just pricing context) */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Pricing
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Choose your TruVerse plan.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/85">
              Start with a 7-day trial for personal protection, or scale trust
              with verification APIs for your platform.
            </p>

            {/* Billing toggle (styled like TruVerse buttons) */}
            <div className="mt-6 inline-flex rounded-2xl bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur">
              <button
                onClick={() => setBilling("monthly")}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-extrabold",
                  billing === "monthly"
                    ? "bg-white text-[#0B2B7A]"
                    : "text-white/90 hover:bg-white/10",
                ].join(" ")}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-extrabold",
                  billing === "yearly"
                    ? "bg-white text-[#0B2B7A]"
                    : "text-white/90 hover:bg-white/10",
                ].join(" ")}
              >
                Yearly{" "}
                <span className="ml-1 rounded-full bg-emerald-200/20 px-2 py-0.5 text-xs font-black text-emerald-100">
                  Save
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Consumer (B2C) section — glass container */}
      <section className="mx-auto max-w-6xl px-4 -mt-10 pb-12">
        <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-slate-200/70 backdrop-blur sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Personal plans
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Protection for individuals and professionals.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              7-day trial included • Cancel anytime
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {B2C_PLANS.map((p) => {
              const price =
                billing === "monthly" ? p.priceMonthly : p.priceYearly;

              return (
                <div
                  key={p.key}
                  className={[
                    "relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm",
                    p.highlight ? "border-[#1B57F2]/35" : "border-slate-200",
                  ].join(" ")}
                >
                  {/* subtle TruVerse glow */}
                  {p.highlight ? (
                    <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#1B57F2]/15 blur-2xl" />
                  ) : null}

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-black text-slate-900">
                        {p.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {p.desc}
                      </div>
                    </div>

                    <span
                      className={[
                        "shrink-0 rounded-full px-3 py-1 text-xs font-black",
                        p.highlight
                          ? "bg-[#1B57F2]/10 text-[#1B57F2]"
                          : "bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <div className="relative mt-5 rounded-2xl bg-slate-50 p-4">
                    <div className="text-3xl font-black text-slate-900">
                      {fmtTHB(price)}
                      <span className="ml-1 text-sm font-bold text-slate-600">
                        / {billing}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {p.key === "starter"
                        ? "Trial activates instantly."
                        : "Includes trial, then billed on renewal."}
                    </div>
                  </div>

                  <ul className="relative mt-5 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          ✓
                        </span>
                        <span className="text-slate-700">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/demo"
                    className={[
                      "relative mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-extrabold",
                      p.highlight
                        ? "bg-[#1B57F2] text-white hover:opacity-95"
                        : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {p.cta}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business (B2B) section — TruVerse-like blue strip + cards */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2B7A] to-[#071F57]" />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-24 -top-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Business & API pricing
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-white/80">
                Built for startups, platforms, and enterprises that need trust
                at scale.
              </p>
            </div>

            <a
              href="mailto:sales@truverse.ai"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-[#0B2B7A] hover:opacity-95"
            >
              Contact Sales
            </a>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {B2B_PLANS.map((p) => (
              <div
                key={p.key}
                className={[
                  "rounded-3xl bg-white/10 p-6 shadow-sm ring-1 backdrop-blur",
                  p.highlight ? "ring-white/25" : "ring-white/15",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-black text-white">
                      {p.name}
                    </div>
                    <div className="mt-1 text-sm text-white/75">{p.desc}</div>
                  </div>

                  {p.badge ? (
                    <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/90 ring-1 ring-white/15">
                      {p.badge}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="text-lg font-black text-white">{p.price}</div>
                  <div className="mt-1 text-xs text-white/70">
                    Usage-based verification pricing.
                  </div>
                </div>

                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
                        ✓
                      </span>
                      <span className="text-white/85">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:sales@truverse.ai"
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-extrabold",
                    p.highlight
                      ? "bg-white text-[#0B2B7A] hover:opacity-95"
                      : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15",
                  ].join(" ")}
                >
                  {p.key === "api" ? "Request API Access" : "Talk to Sales"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          TruVerse • Pricing
        </div>
      </footer>
    </main>
  );
}
