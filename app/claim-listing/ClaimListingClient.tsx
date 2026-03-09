"use client";

import { useState } from "react";
import Image from "next/image";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import Link from "next/link";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Building2,
  Mail,
  MessageSquare,
} from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  address: string;
  postcode: string;
  category: string;
  claimed: boolean;
};

export default function ClaimListingClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchName, setSearchName] = useState("");
  const [searchPostcode, setSearchPostcode] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchError, setSearchError] = useState("");

  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setSearchError("");
    setResults(null);
    try {
      const res = await fetch("/api/hub/claim/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: searchName.trim(),
          postcode: searchPostcode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error?.message || "Search failed. Please try again.");
        setSearching(false);
        return;
      }
      setResults(data);
      if (Array.isArray(data) && data.length === 0) {
        setSearchError("No matches found. Try a different name or postcode.");
      } else {
        setSearchError("");
      }
    } catch {
      setSearchError("Network error. Please check your connection and try again.");
    } finally {
      setSearching(false);
    }
  }

  function selectBusiness(b: SearchResult) {
    if (b.claimed) return;
    setSelected(b);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/hub/claim/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: selected.id,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setStep(3);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4782A]/40 focus:border-[#C4782A] transition bg-[#FAF8F5]";
  const labelCls = "block text-xs font-semibold text-[#14231C] uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero — walks-style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE_URL} alt="" fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: "center 20%" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Claim Your Listing
          </h1>
          <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-xl">
            Update your details, manage your food hygiene display, and get more visibility.
          </p>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-bold text-[#14231C] mb-4">
                What you get
              </h2>
              <ul className="space-y-3">
                {[
                  "Update your name, address & contact details",
                  "Add or correct opening hours",
                  "Manage your food hygiene rating display",
                  "Respond to your listing",
                  "Upgrade to Featured for more visibility",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#14231C] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4782A]/10 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
              <div className="relative">
                <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">
                  Featured listing
                </p>
                <p className="font-display font-bold text-white mb-2">
                  More visibility from £29/mo
                </p>
                <p className="text-white/60 text-sm mb-4">
                  Appear at the top of your category and get a prominent featured
                  badge.
                </p>
                <Link
                  href="/pricing"
                  className="block text-center border border-[#C4782A]/40 text-[#C4782A] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#C4782A]/10 transition"
                >
                  View pricing →
                </Link>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-[#14231C] mb-1">Can&apos;t find your business?</p>
              <p className="text-xs text-gray-500 mb-3">If your business isn&apos;t listed yet, get in touch and we&apos;ll add it for you.</p>
              <Link
                href="/contact"
                className="inline-block bg-[#14231C] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#245E3F] transition"
              >
                Contact us →
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-7">
                <h2 className="font-display text-xl font-bold text-[#14231C] mb-4">
                  Find your business
                </h2>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#C4782A]" />{" "}
                        Business name <span className="text-[#C4782A]">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="e.g. The Old Dungeon Ghyll"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Postcode *</label>
                    <input
                      type="text"
                      required
                      minLength={3}
                      value={searchPostcode}
                      onChange={(e) =>
                        setSearchPostcode(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. LA22 9JX"
                      className={inputCls}
                    />
                  </div>
                  {searchError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-sm">{searchError}</p>
                      </div>
                      {results !== null && results.length === 0 && (
                        <div className="border-t border-amber-200 pt-3 flex items-center justify-between gap-3">
                          <p className="text-amber-700 text-xs">Can&apos;t find your business? We&apos;ll add it for you.</p>
                          <Link href="/contact" className="flex-shrink-0 text-xs font-bold text-amber-700 underline hover:text-amber-900">
                            Contact us →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={searching}
                    className="w-full flex items-center justify-center gap-2 bg-[#14231C] hover:bg-[#245E3F] disabled:opacity-60 text-white py-3.5 rounded-full font-bold text-sm transition-colors"
                  >
                    {searching ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching…
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search
                      </>
                    )}
                  </button>
                </form>

                {results && results.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Select your business
                    </p>
                    <ul className="space-y-2">
                      {results.map((b) => (
                        <li key={b.id}>
                          <button
                            type="button"
                            onClick={() => selectBusiness(b)}
                            disabled={b.claimed}
                            className={`w-full text-left p-4 rounded-xl border transition ${
                              b.claimed
                                ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-200 hover:border-[#C4782A]/40 hover:bg-[#C4782A]/5"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-[#14231C]">
                                  {b.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {b.address}, {b.postcode}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {b.category}
                                </p>
                              </div>
                              {b.claimed ? (
                                <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                                  Already claimed
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-[#C4782A]">
                                  This is my business →
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {step === 2 && selected && (
              <div className="bg-white rounded-2xl border border-gray-100 p-7">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSelected(null);
                    setForm({ name: "", email: "", message: "" });
                    setSubmitError("");
                  }}
                  className="text-sm text-gray-500 hover:text-[#C4782A] mb-4"
                >
                  ← Change business
                </button>
                <h2 className="font-display text-xl font-bold text-[#14231C] mb-2">
                  Your details
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Claiming <strong>{selected.name}</strong>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {submitError && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>
                      Your name <span className="text-[#C4782A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="John Smith"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C4782A]" /> Email
                        address <span className="text-[#C4782A]">*</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@business.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span className="inline-flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C4782A]" />{" "}
                        Message to reviewer{" "}
                        <span className="text-gray-400 font-normal normal-case">
                          (optional)
                        </span>
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="e.g. I'm the owner, my phone number has changed..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#14231C] hover:bg-[#245E3F] disabled:opacity-60 text-white py-3.5 rounded-full font-bold text-sm transition-colors"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit claim request →"
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    We&apos;ll review within 24 hours and email you at{" "}
                    {form.email || "your address"}.
                  </p>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl border border-green-100 p-10 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#14231C] mb-2">
                  Request submitted
                </h2>
                <p className="text-gray-500 mb-6">
                  We&apos;ll review your claim within 24 hours and email you at{" "}
                  <strong>{form.email}</strong> once it&apos;s approved. You&apos;ll
                  then receive a link to set your password and access your
                  dashboard.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-[#C4782A] text-white rounded-full text-sm font-bold hover:bg-[#B8972A] transition"
                >
                  Back to the guide →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
