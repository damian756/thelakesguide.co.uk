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
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative h-64 md:h-80 bg-[#1B2E4B] overflow-hidden">
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2E4B]/50 via-[#1B2E4B]/30 to-[#1B2E4B]/80" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-2 text-[#C9A84C] mb-3">
            <Newspaper className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">The Lakes Guide Blog</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
            Local guides, tips &amp;&nbsp;
            <br className="hidden sm:block" />
            Lake District stories.
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-md">
            Written by someone who has walked the fells for decades. From the best restaurants to walks, villages, and practical local knowledge.
          </p>
        </div>
      </section>

      {/* ── Interactive content (search + tabs + grid) ─────────────── */}
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
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
            className="text-sm font-semibold text-[#C9A84C] border border-[#C9A84C]/30 px-5 py-2.5 rounded-full hover:bg-[#C9A84C] hover:text-white transition-all"
          >
            Explore the guide
          </a>
        </div>
      </div>
    </div>
  );
}
