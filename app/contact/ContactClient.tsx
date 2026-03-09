"use client";

import { useState } from "react";
import Image from "next/image";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import Link from "next/link";
import { Send, CheckCircle, AlertCircle, MapPin, Clock } from "lucide-react";

const SUBJECTS = [
  "Claim my listing",
  "Advertise / Featured listing",
  "Report an issue",
  "Media / press enquiry",
  "General enquiry",
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], businessName: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isBusiness = form.subject === "Claim my listing" || form.subject === "Advertise / Featured listing";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      {/* Hero — walks-style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE_URL} alt="" fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: "center 20%" }} priority />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">Get in Touch</h1>
          <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-xl">List your business, advertise, or just say hello.</p>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="grid md:grid-cols-5 gap-8">

          {/* ── Sidebar ── */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-bold text-[#14231C] mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C4782A]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#C4782A]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Based in</p>
                    <p className="text-[#14231C] text-sm font-medium">Churchtown Media, UK</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C4782A]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#C4782A]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Response time</p>
                    <p className="text-[#14231C] text-sm font-medium">1 to 2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#14231C] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4782A]/10 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
              <div className="relative">
                <p className="font-display font-bold text-white mb-2">Want to list your business?</p>
                <p className="text-white/60 text-sm mb-4">It&apos;s free to get started. Upgrade anytime for more visibility.</p>
                <Link href="/claim-listing" className="block text-center bg-[#C4782A] text-white px-4 py-2.5 rounded-full font-bold text-sm hover:bg-[#E8B87A] transition">
                  Claim Your Free Listing →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Built by</p>
              <a href="https://churchtownmedia.co.uk" target="_blank" rel="noopener noreferrer" className="text-[#14231C] font-bold hover:text-[#C4782A] transition-colors">
                Churchtown Media ↗
              </a>
              <p className="text-gray-400 text-xs mt-1">Web & digital for Lake District businesses</p>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="md:col-span-3">
            {status === "success" ? (
              <div className="bg-white rounded-2xl border border-green-100 p-10 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#14231C] mb-2">Message sent!</h2>
                <p className="text-gray-500 mb-6">We&apos;ll be in touch within 1 to 2 business days. Check your inbox for a confirmation.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setForm({ name: "", email: "", subject: SUBJECTS[0], businessName: "", message: "" }); setStatus("idle"); }}
                    className="px-6 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Send another message
                  </button>
                  <Link href="/" className="px-6 py-2.5 bg-[#C4782A] text-white rounded-full text-sm font-bold hover:bg-[#A86C2A] transition">
                    Back to the guide →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-7 space-y-5">
                <h2 className="font-display text-xl font-bold text-[#14231C]">Send a message</h2>

                {status === "error" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{errorMsg}</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#14231C] uppercase tracking-wider mb-1.5">
                      Your name <span className="text-[#C4782A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4782A]/40 focus:border-[#C4782A] transition bg-[#EAEDE8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#14231C] uppercase tracking-wider mb-1.5">
                      Email address <span className="text-[#C4782A]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4782A]/40 focus:border-[#C4782A] transition bg-[#EAEDE8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14231C] uppercase tracking-wider mb-1.5">
                    Enquiry type <span className="text-[#C4782A]">*</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4782A]/40 focus:border-[#C4782A] transition bg-[#EAEDE8]"
                  >
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {isBusiness && (
                  <div>
                    <label className="block text-xs font-semibold text-[#14231C] uppercase tracking-wider mb-1.5">
                      Business name
                    </label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      placeholder="e.g. The Grand Hotel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4782A]/40 focus:border-[#C4782A] transition bg-[#EAEDE8]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#14231C] uppercase tracking-wider mb-1.5">
                    Message <span className="text-[#C4782A]">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you need..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4782A]/40 focus:border-[#C4782A] transition bg-[#EAEDE8] resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length}/3000</p>
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-[#14231C] hover:bg-[#245E3F] disabled:opacity-60 text-white py-3.5 rounded-full font-bold text-sm transition-colors"
                >
                  {status === "sending" ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" />Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
