import Image from "next/image";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import { Suspense } from "react";
import { Newspaper } from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/lakes-data";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog | The Lakes Guide",
  description:
    "Local guides, tips and Lake District stories — written by someone who knows the fells.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/blog" },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      {/* ── Hero — walks-style ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
            alt="Lake District landscape"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
            style={{ objectPosition: "center 55%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C4782A] mb-3">
            <Newspaper className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">The Lakes Guide Blog</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Local guides, tips &amp; Lake District stories.
          </h1>
          <p className="text-white/80 text-lg lg:text-xl max-w-md mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
            Written by someone who has walked the fells for decades. From the best restaurants to walks, villages, and practical local knowledge.
          </p>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
          </svg>
        </div>
      </section>

      {/* ── Interactive content (search + tabs + grid) ─────────────── */}
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C4782A] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <BlogClient
          posts={BLOG_POSTS}
          categories={BLOG_CATEGORIES}
        />
      </Suspense>

      {/* ── Footer CTA ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-16 text-center border-t border-gray-100 pt-12">
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-5">
          New guides added every week. Open 2026, local food, what&rsquo;s on, and everything in between.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/events"
            className="text-sm font-semibold text-[#1B2E4B] border border-[#1B2E4B]/20 px-5 py-2.5 rounded-full hover:bg-[#1B2E4B] hover:text-white transition-all"
          >
            Events calendar
          </a>
          <a
            href="/"
            className="text-sm font-semibold text-[#C4782A] border border-[#C4782A]/30 px-5 py-2.5 rounded-full hover:bg-[#C4782A] hover:text-white transition-all"
          >
            Explore the guide
          </a>
        </div>
      </div>
    </div>
  );
}
