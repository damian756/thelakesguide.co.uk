"use client";

import { useState } from "react";
import { CheckCircle2, Minus, ChevronDown } from "lucide-react";

const FEATURES = [
  { label: "Claim & manage listing", free: true, pro: true },
  { label: "Analytics dashboard", free: true, pro: true },
  { label: "Monday morning email", free: true, pro: true },
  { label: "Visibility score", free: true, pro: true },
  { label: "Google review alerts", free: true, pro: true },
  { label: "Milestone notifications", free: true, pro: true },
  { label: "Category benchmarks", free: false, pro: true },
  { label: "Compare vs competitors", free: false, pro: true },
  { label: "Event intelligence", free: false, pro: true },
  { label: "Featured listing placement", free: false, pro: true },
  { label: "1 boost credit per month", free: false, pro: true },
] as const;

const FAQ = [
  {
    q: "What is featured placement?",
    a: "Your listing appears above standard listings in your category on the public site, with a \"Featured\" badge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Your Pro benefits continue until the end of the billing period.",
  },
  {
    q: "What is a boost credit?",
    a: "One free category boost per month (worth £15), included with Pro.",
  },
] as const;

export default function UpgradePageClient() {
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleUpgrade(billingPeriod: "monthly" | "annual") {
    setLoading(billingPeriod);
    try {
      const res = await fetch("/api/hub/create-pro-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="relative bg-[#1B2E4B] -mx-6 md:-mx-8 -mt-6 md:-mt-8 px-6 md:px-8 py-12 md:py-16 overflow-hidden">
        {/* Hero image behind header */}
        <img
          src="/images/dashboard/upgrade-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
          aria-hidden="true"
        />
        <div className="relative z-10">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Upgrade to Pro
        </h1>
        <p className="text-white/80 text-lg max-w-xl">
          Get featured placement, benchmarks, event intel, and one free boost
          credit every month.
        </p>
        </div>
      </div>

      {/* Feature comparison */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-4 pr-6 text-gray-600 font-semibold">
                Feature
              </th>
              <th className="text-center py-4 px-6 text-gray-600 font-semibold">
                Free
              </th>
              <th className="text-center py-4 px-6 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl font-semibold text-[#1B2E4B]">
                Pro
              </th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f, i) => (
              <tr
                key={f.label}
                className={i % 2 === 1 ? "bg-gray-50/50" : ""}
              >
                <td className="py-4 pr-6 text-gray-700">{f.label}</td>
                <td className="py-4 px-6 text-center">
                  {f.free ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-300 inline" />
                  )}
                </td>
                <td className="py-4 px-6 text-center bg-[#C9A84C]/5">
                  {f.pro ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-300 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="font-display text-2xl font-bold text-[#1B2E4B] mb-1">
            £39/month
          </div>
          <p className="text-gray-500 text-sm mb-6">Cancel anytime</p>
          <button
            onClick={() => handleUpgrade("monthly")}
            disabled={!!loading}
            className="w-full bg-[#1B2E4B] hover:bg-[#2A4A73] text-white py-3 rounded-full font-bold text-sm transition-colors disabled:opacity-60"
          >
            {loading === "monthly" ? "Redirecting…" : "Upgrade Monthly"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#C9A84C] shadow-sm p-6 ring-2 ring-[#C9A84C]/30 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] mb-1">
            Best value
          </div>
          <div className="font-display text-2xl font-bold text-[#1B2E4B] mb-1">
            £390/year
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Save £78 — 2 months free
          </p>
          <button
            onClick={() => handleUpgrade("annual")}
            disabled={!!loading}
            className="w-full bg-[#C9A84C] hover:bg-[#B8972A] text-white py-3 rounded-full font-bold text-sm transition-colors disabled:opacity-60"
          >
            {loading === "annual" ? "Redirecting…" : "Upgrade Annually →"}
          </button>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="space-y-3">
        {FAQ.map((item, i) => (
          <div
            key={item.q}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-[#1B2E4B] hover:bg-gray-50/50 transition-colors"
            >
              {item.q}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openFaq === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4 pt-0 text-gray-600 text-sm border-t border-gray-50">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
