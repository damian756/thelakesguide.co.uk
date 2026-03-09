"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu, X, ChevronDown,
  Utensils, Hotel, Beer, Coffee, MapPin, ShoppingBag, Flag,
  Waves, Dumbbell, Car, Sparkles, LayoutDashboard,
  Flower2, Wind, BookOpen, ListFilter,
} from "lucide-react";
import { GUIDES, GUIDE_CATEGORIES, type GuideCategory } from "@/lib/guides-config";

const CATEGORIES = [
  { slug: "walks",         label: "Walks",          icon: MapPin,      color: "text-green-600" },
  { slug: "villages",     label: "Villages",       icon: MapPin,     color: "text-teal-600" },
  { slug: "restaurants",  label: "Restaurants",    icon: Utensils,   color: "text-red-500" },
  { slug: "cafes",        label: "Cafes",          icon: Coffee,     color: "text-amber-600" },
  { slug: "pubs",         label: "Pubs & Inns",    icon: Beer,       color: "text-purple-500" },
  { slug: "activities",   label: "Activities",     icon: Dumbbell,   color: "text-orange-500" },
  { slug: "accommodation", label: "Places to Stay", icon: Hotel,      color: "text-blue-600" },
  { slug: "shopping",     label: "Shopping",       icon: ShoppingBag, color: "text-rose-500" },
];

const FEATURED_COLLECTIONS = [
  { href: "/collections/dog-friendly-restaurants-lake-district", label: "Dog-friendly", emoji: "🐾" },
  { href: "/collections/lakeside-restaurants-lake-district",     label: "Lakeside",     emoji: "🍽️" },
  { href: "/collections/accommodation-with-parking-lake-district", label: "With parking", emoji: "🏨" },
  { href: "/collections/free-things-to-do-lake-district",       label: "Free to do",   emoji: "🎟️" },
];

// Shared nav link style — uppercase editorial feel
const NAV_LINK = "text-[11px] font-bold tracking-[0.12em] uppercase text-[#14231C] hover:text-[#C4782A] px-3 py-2 transition-colors flex items-center gap-1";

export default function NavMenu() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [guidesOpen,  setGuidesOpen]  = useState(false);

  const publishedGuides = GUIDES.filter((g) => g.status === "published");

  return (
    <>
      {/* ── Desktop ──────────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-0">

        {/* EXPLORE dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setExploreOpen(true)}
          onMouseLeave={() => setExploreOpen(false)}
        >
          <Link href="/things-to-do" className={NAV_LINK}>
            Explore
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`} />
          </Link>

          <div className="absolute top-full left-0 right-0 h-3 z-40" />

          <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[380px] z-50 transition-all duration-200 ${exploreOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>

            {/* Key pages */}
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              <Link href="/things-to-do" onClick={() => setExploreOpen(false)}
                className="col-span-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#14231C] text-white text-sm hover:bg-[#245E3F] transition-colors">
                <span className="font-semibold">Things to Do: Full Guide</span>
              </Link>
              <Link href="/events" onClick={() => setExploreOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAEDE8] text-[#14231C] text-xs font-semibold hover:bg-gray-100 transition-colors">
                📅 Events
              </Link>
              <Link href="/blog" onClick={() => setExploreOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAEDE8] text-[#14231C] text-xs font-semibold hover:bg-gray-100 transition-colors">
                ✍️ Blog
              </Link>
            </div>

            {/* Categories */}
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 px-1">Browse by category</p>
            <div className="grid grid-cols-2 gap-0.5 mb-4">
              {CATEGORIES.map(({ slug, label, icon: Icon, color }) => (
                <Link key={slug} href={`/${slug}`}
                  onClick={() => setExploreOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#EAEDE8] text-[#14231C] text-xs font-medium transition-colors group">
                  <Icon className={`w-3.5 h-3.5 flex-none ${color}`} />
                  <span className="group-hover:text-[#C4782A] transition-colors truncate">{label}</span>
                </Link>
              ))}
            </div>

            {/* Curated lists */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">Curated Lists</p>
                <Link href="/collections" onClick={() => setExploreOpen(false)}
                  className="text-[#C4782A] text-[10px] font-bold hover:text-[#14231C] transition-colors">All collections →</Link>
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                {FEATURED_COLLECTIONS.map(({ href, label, emoji }) => (
                  <Link key={href} href={href}
                    onClick={() => setExploreOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#EAEDE8] text-[#14231C] text-xs font-medium transition-colors group">
                    <span className="text-sm leading-none flex-none">{emoji}</span>
                    <span className="group-hover:text-[#C4782A] transition-colors truncate">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GUIDES dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setGuidesOpen(true)}
          onMouseLeave={() => setGuidesOpen(false)}
        >
          <Link href="/guides" className={NAV_LINK}>
            Guides
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${guidesOpen ? "rotate-180" : ""}`} />
          </Link>

          <div className="absolute top-full left-0 right-0 h-3 z-40" />

          <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-72 z-50 transition-all duration-200 ${guidesOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            {(["beaches-coast", "areas", "events", "food-drink", "practical"] as GuideCategory[]).map((cat) => {
              const catGuides = publishedGuides
                .filter((g) => g.category === cat)
                .sort((a, b) => b.seoPriority - a.seoPriority);
              if (catGuides.length === 0) return null;
              const { label, emoji } = GUIDE_CATEGORIES[cat];
              return (
                <div key={cat} className="px-2 mb-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 px-2 pt-1 pb-0.5">
                    {emoji} {label}
                  </p>
                  {catGuides.map((g) => (
                    <Link key={g.slug} href={`/guides/${g.slug}`}
                      onClick={() => setGuidesOpen(false)}
                      className="flex items-center px-2 py-1.5 rounded-lg text-sm text-[#14231C] hover:bg-[#EAEDE8] hover:text-[#C4782A] transition-colors truncate">
                      {g.shortTitle ?? g.title}
                    </Link>
                  ))}
                </div>
              );
            })}
            <div className="border-t border-gray-100 mt-1 pt-1 px-2">
              <Link href="/guides"
                onClick={() => setGuidesOpen(false)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-bold text-[#C4782A] hover:text-[#14231C] transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> All guides →
              </Link>
            </div>
          </div>
        </div>

        {/* Hub — icon only */}
        <Link href="/dashboard" title="Business Hub Login"
          className="p-2 text-[#14231C]/35 hover:text-[#14231C] transition-colors">
          <LayoutDashboard className="w-4 h-4" />
        </Link>

        {/* CTA */}
        <Link href="/claim-listing"
          className="ml-1 bg-[#C4782A] hover:bg-[#A86C2A] text-white px-4 py-2 rounded-full text-[11px] font-bold tracking-wide uppercase transition-colors shadow-sm shadow-[#C4782A]/30">
          List Your Business
        </Link>
      </div>

      {/* ── Mobile hamburger ─────────────────────────────────────────────── */}
      <button
        className="md:hidden text-[#14231C] p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50 overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="overflow-y-auto max-h-[90vh] px-4 py-5 space-y-5">

          {/* Hero links */}
          <div className="space-y-1.5">
            <Link href="/things-to-do" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#14231C] text-white text-sm font-semibold">
              Things to Do in the Lake District
            </Link>
            <div className="grid grid-cols-2 gap-1.5">
              <Link href="/events" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#EAEDE8] text-[#14231C] text-xs font-semibold">
                📅 Events
              </Link>
              <Link href="/blog" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#EAEDE8] text-[#14231C] text-xs font-semibold">
                ✍️ Blog
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 px-1">Browse by category</p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map(({ slug, label, icon: Icon, color }) => (
                <Link key={slug} href={`/${slug}`} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-[#EAEDE8] text-[#14231C] text-sm transition-colors">
                  <Icon className={`w-4 h-4 flex-none ${color}`} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">Guides</p>
              <Link href="/guides" onClick={() => setMobileOpen(false)}
                className="text-[#C4782A] text-[10px] font-bold">All guides →</Link>
            </div>
            {(["beaches-coast", "areas", "events", "food-drink", "practical"] as GuideCategory[]).map((cat) => {
              const catGuides = publishedGuides
                .filter((g) => g.category === cat)
                .sort((a, b) => b.seoPriority - a.seoPriority);
              if (catGuides.length === 0) return null;
              const { label, emoji } = GUIDE_CATEGORIES[cat];
              return (
                <div key={cat} className="mb-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 px-1 mb-1">
                    {emoji} {label}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {catGuides.map((g) => (
                      <Link key={g.slug} href={`/guides/${g.slug}`} onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-2.5 rounded-xl bg-[#EAEDE8] text-[#14231C] text-xs font-medium truncate">
                        {g.shortTitle ?? g.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collections */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">Curated Lists</p>
              <Link href="/collections" onClick={() => setMobileOpen(false)}
                className="text-[#C4782A] text-[10px] font-bold">All →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {FEATURED_COLLECTIONS.map(({ href, label, emoji }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#EAEDE8] text-[#14231C] text-xs font-medium">
                  <span className="text-base leading-none">{emoji}</span> {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Business */}
          <div className="border-t border-gray-100 pt-4 space-y-1.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2 px-1">For Business</p>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-[#EAEDE8] text-[#14231C] text-sm font-medium">
              <LayoutDashboard className="w-4 h-4 text-[#C4782A]" /> Business Hub Login
            </Link>
            <Link href="/claim-listing" onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-[#C4782A] text-white px-4 py-3.5 rounded-xl font-bold text-sm hover:bg-[#A86C2A] transition-colors tracking-wide">
              List Your Business →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
