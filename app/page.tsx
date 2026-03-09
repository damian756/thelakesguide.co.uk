import Link from "next/link";
import Image from "next/image";
import { Star, Utensils, Hotel, Beer, Coffee, MapPin, ShoppingBag, Dumbbell, ArrowRight, Music, CalendarDays, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import { BLOG_POSTS, getBlogPostCategory, getUpcomingEvents } from "@/lib/lakes-data";
import type { Metadata } from "next";

export const revalidate = 3600; // Regenerate at most once per hour so events stay current

export const metadata: Metadata = {
  title: "Lake District Visitor Guide | Restaurants, Walks & Things to Do | The Lakes Guide",
  description: "The independent guide to the Lake District. Restaurants, pubs, walks, villages and things to do. Written by locals who know the Lakes.",
  alternates: { canonical: "https://www.thelakesguide.co.uk" },
  openGraph: {
    title: "Lake District Visitor Guide | The Lakes Guide",
    description: "The independent guide to the Lake District. Restaurants, pubs, walks, villages and things to do.",
    url: "https://www.thelakesguide.co.uk",
    images: [{ url: "https://www.thelakesguide.co.uk/og-default.png" }],
  },
};

// ── Category configuration ────────────────────────────────────────────────
const CATEGORIES = [
  { slug: "walks",         label: "Walks & Hiking",   icon: MapPin,      emoji: "🥾", gradient: "from-[#1A5C5B] to-[#2E8B7A]",  light: "#E8F5F3" },
  { slug: "villages",      label: "Villages",         icon: MapPin,      emoji: "🏘️", gradient: "from-[#1A5C7A] to-[#1E8AB0]",  light: "#E8F4FA" },
  { slug: "restaurants",   label: "Restaurants",      icon: Utensils,    emoji: "🍽️", gradient: "from-[#8B2635] to-[#C94B3B]",  light: "#FDF0EE" },
  { slug: "cafes",         label: "Cafes",           icon: Coffee,      emoji: "☕", gradient: "from-[#6B3A1F] to-[#A06040]",  light: "#FAF0E8" },
  { slug: "pubs",          label: "Pubs & Inns",     icon: Beer,        emoji: "🍺", gradient: "from-[#3D1A5C] to-[#6B3AA0]",  light: "#F3EEF9" },
  { slug: "activities",    label: "Activities",      icon: Dumbbell,    emoji: "🏄", gradient: "from-[#0D6E6E] to-[#0F9B8E]",  light: "#E6F5F5" },
  { slug: "accommodation", label: "Places to Stay",   icon: Hotel,       emoji: "🏨", gradient: "from-[#14231C] to-[#245E3F]",  light: "#E8EDE8" },
  { slug: "shopping",      label: "Shopping",         icon: ShoppingBag, emoji: "🛍️", gradient: "from-[#8B2847] to-[#C45C6A]",  light: "#FAE8EC" },
];

function getArea(address: string): string {
  const areas = ["Windermere", "Ambleside", "Keswick", "Grasmere", "Coniston", "Bowness", "Glenridding"];
  for (const a of areas) { if (address.includes(a)) return a; }
  return "Lake District";
}

export default async function Home() {
  let categoryCounts: Record<string, number> = {};
  let featured: {
    slug: string; name: string; shortDescription: string | null;
    rating: number | null; reviewCount: number | null;
    address: string; category: { slug: string };
  }[] = [];
  let totalBusinesses = 0;

  try {
    const cats = await prisma.category.findMany({
      select: { slug: true, _count: { select: { businesses: true } } },
    });
    categoryCounts = Object.fromEntries(cats.map((c) => [c.slug, c._count.businesses]));
    totalBusinesses = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

    featured = await prisma.$queryRaw<typeof featured>`
      SELECT b.slug, b.name, b."shortDescription", b.rating, b."reviewCount", b.address,
             json_build_object('slug', c.slug) as category
      FROM "Business" b
      JOIN "Category" c ON c.id = b."categoryId"
      WHERE b.rating IS NOT NULL
        AND b."reviewCount" > 100
      ORDER BY (b.rating * LOG(b."reviewCount" + 1)) DESC
      LIMIT 7
    `;
  } catch { /* DB unavailable */ }

  const catMeta: Record<string, { gradient: string; light: string; emoji: string }> =
    Object.fromEntries(CATEGORIES.map((c) => [c.slug, { gradient: c.gradient, light: c.light, emoji: c.emoji }]));

  const upcomingEvents = getUpcomingEvents(12);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const todayLabel = `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;
  const todayISO = today.toISOString().slice(0, 10);

  function formatPostDate(dateStr: string) {
    return dateStr === todayLabel ? "Today" : dateStr;
  }
  function formatEventLabel(event: { isoDate: string; dayLabel: string }) {
    return event.isoDate === todayISO ? "Today" : event.dayLabel;
  }
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.thelakesguide.co.uk/#website",
        url: "https://www.thelakesguide.co.uk",
        name: "The Lakes Guide",
        description: "The independent guide to the Lake District. Restaurants, pubs, walks, villages and things to do.",
        publisher: { "@id": "https://www.thelakesguide.co.uk/#organization" },
        inLanguage: "en-GB",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.thelakesguide.co.uk/restaurants",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.thelakesguide.co.uk/#organization",
        name: "The Lakes Guide",
        url: "https://www.thelakesguide.co.uk",
        logo: {
          "@type": "ImageObject",
          url: "https://www.thelakesguide.co.uk/og-default.png",
          width: 1200,
          height: 630,
        },
        sameAs: [
          "https://www.thelakeswildlife.co.uk",
          "https://www.hikethelakes.com",
          "https://thelakes.network",
          "https://www.linkedin.com/company/churchtownmedia",
          "https://churchtownmedia.co.uk",
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
    <div className="min-h-screen flex flex-col">

      {/* ══════════════════════════════════════════════════════
          HERO — Walks-style full-bleed
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
            alt="Lake District landscape"
            fill
            sizes="100vw"
            quality={80}
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>

        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-400/25 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Updated Daily
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Your Local Guide <span className="text-[#C4782A]">to the Lake District.</span>
          </h1>
          <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-xl mb-7">
            Events, restaurants, <Link href="/things-to-do" className="text-white hover:text-[#C4782A] underline underline-offset-2 transition-colors">things to do</Link>, updated regularly by people who live here.
          </p>

          {/* Next 2 upcoming events */}
          <div className="mb-6 w-full max-w-xs">
            <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2">Coming up</p>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 2).map((event, i) => (
                <a
                  key={i}
                  href={event.link}
                  target={event.link.startsWith("http") ? "_blank" : undefined}
                  rel={event.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 transition-colors group"
                >
                  <span className="text-lg flex-none">{event.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-[#C4782A] transition-colors">{event.title}</p>
                    <p className="text-white/40 text-xs">{formatEventLabel(event)} · {event.venue}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/25 group-hover:text-[#C4782A] flex-none transition-colors" />
                </a>
              ))}
            </div>
            <Link href="/events" className="text-xs text-white/50 hover:text-[#C4782A] transition-colors mt-2 inline-block">
              View full 2026 calendar →
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs px-3 py-1.5 rounded-full transition-all"
              >
                <span>{cat.emoji}</span> {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT'S ON — EVENTS STRIP
      ══════════════════════════════════════════════════════ */}
      {upcomingEvents.length > 0 && (
        <section className="py-12 bg-[#EAEDE8]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-1">Updated weekly</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#14231C] flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-[#C4782A]" />
                  What&apos;s On in the Lake District
                </h2>
              </div>
              <Link href="/events" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#14231C] hover:text-[#C4782A] font-semibold transition-colors">
                Full calendar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Horizontally scrollable event cards */}
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {upcomingEvents.map((event, i) => (
                <a
                  key={i}
                  href={event.link}
                  target={event.link.startsWith("http") ? "_blank" : undefined}
                  rel={event.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex-none w-44 snap-start bg-white rounded-2xl p-4 border border-gray-100 hover:border-[#C4782A]/40 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="text-[10px] font-bold text-[#C4782A] uppercase tracking-widest mb-2">{formatEventLabel(event)}</div>
                  <div className="text-2xl mb-2">{event.emoji}</div>
                  <h3 className="font-bold text-[#14231C] text-sm leading-tight mb-1 group-hover:text-[#C4782A] transition-colors line-clamp-2">{event.title}</h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-1">{event.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">{event.category}</span>
                    {event.free
                      ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Free</span>
                      : <span className="text-[10px] font-semibold text-[#14231C]/50 bg-gray-100 px-2 py-0.5 rounded-full">Tickets</span>
                    }
                  </div>
                </a>
              ))}

              {/* View all card */}
              <Link
                href="/events"
                className="flex-none w-44 snap-start bg-[#14231C] rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-[#C4782A] transition-colors"
              >
                <CalendarDays className="w-8 h-8 text-[#C4782A] group-hover:text-white mb-3 transition-colors" />
                <span className="font-bold text-white text-sm">Full 2026 Calendar</span>
                <span className="text-white/50 group-hover:text-white/80 text-xs mt-1 transition-colors">All events →</span>
              </Link>
            </div>

            <Link href="/events" className="mt-4 text-sm text-[#C4782A] font-semibold sm:hidden block text-center">
              View full 2026 calendar →
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          LATEST FROM THE BLOG
      ══════════════════════════════════════════════════════ */}
      {(() => {
        const featured = BLOG_POSTS.filter((p) => p.featured);
        const latestPosts = (() => {
          if (featured.length >= 3) return featured.slice(0, 3);
          const usedSlugs = new Set(featured.map((p) => p.slug));
          const rest = [...BLOG_POSTS].reverse().filter((p) => !usedSlugs.has(p.slug));
          return [...featured, ...rest].slice(0, 3);
        })();
        const featPost = latestPosts[0];
        const featCat = featPost ? getBlogPostCategory(featPost) : null;
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-1">Lakes Guide Blog</p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-[#14231C] flex items-center gap-2">
                    <Newspaper className="w-6 h-6 text-[#C4782A]" />
                    Latest from the Guide
                  </h2>
                </div>
                <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#14231C] hover:text-[#C4782A] font-semibold transition-colors">
                  All posts <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Featured post + sidebar */}
              <div className="grid md:grid-cols-3 gap-5">
                {/* Featured — spans 2 columns */}
                {featPost && (
                  <Link
                    href={`/blog/${featPost.slug}`}
                    className="group md:col-span-2 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C4782A]/40 hover:shadow-xl transition-all flex flex-col"
                  >
                    <div className="relative h-52 md:h-64 overflow-hidden flex-none">
                      <Image
                        src={featPost.image}
                        alt={featPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        quality={85}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-[#14231C] text-[#C4782A] text-[11px] font-bold px-3 py-1.5 rounded-full shadow">
                          Latest
                        </span>
                        {featCat && (
                          <span
                            className="text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow"
                            style={{ backgroundColor: featCat.color }}
                          >
                            {featCat.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-gray-400 text-xs mb-2">{formatPostDate(featPost.date)}</p>
                      <h3 className="font-display font-bold text-[#14231C] text-xl leading-snug mb-3 group-hover:text-[#C4782A] transition-colors line-clamp-2">
                        {featPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
                        {featPost.excerpt}
                      </p>
                      <span className="text-[#C4782A] text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-block">
                        Read more →
                      </span>
                    </div>
                  </Link>
                )}

                {/* 2 smaller posts stacked */}
                <div className="flex flex-col gap-5">
                  {latestPosts.slice(1).map((post) => {
                    const cat = getBlogPostCategory(post);
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C4782A]/30 hover:shadow-lg transition-all flex flex-col flex-1"
                      >
                        <div className="relative h-36 overflow-hidden flex-none">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            quality={75}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          {cat && (
                            <span
                              className="absolute bottom-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            >
                              {cat.label}
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-display font-bold text-[#14231C] text-base leading-snug mb-2 group-hover:text-[#C4782A] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                            <span>{formatPostDate(post.date)}</span>
                            <span className="text-[#C4782A] font-semibold">Read →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#14231C] border border-[#14231C]/20 px-6 py-2.5 rounded-full hover:bg-[#14231C] hover:text-white transition-all sm:hidden"
                >
                  All blog posts →
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══════════════════════════════════════════════════════
          LAKE DISTRICT WALKS FEATURE STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 bg-[#2A6B8A]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">214 Wainwright fells</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                <Link href="/guides/lake-district-walks" className="hover:text-[#C4782A] transition-colors">
                  Lake District Walks
                </Link>
              </h2>
              <p className="text-white/70 leading-relaxed mb-5 max-w-lg">
                From Scafell Pike to Catbells. Walks for every level. The complete guide to fell walking in the Lake District.
              </p>
              <div className="flex flex-wrap gap-3 text-sm mb-5">
                <span className="bg-white/10 text-white/80 rounded-full px-3 py-1">16 lakes</span>
                <span className="bg-white/10 text-white/80 rounded-full px-3 py-1">214 fells</span>
                <span className="bg-white/10 text-white/80 rounded-full px-3 py-1">All abilities</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/guides/lake-district-walks"
                  className="inline-flex items-center gap-2 bg-[#C4782A] hover:bg-[#E8B87A] text-[#14231C] px-6 py-3 rounded-full font-bold text-sm transition-all"
                >
                  Lake District Walks Guide <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/windermere"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all border border-white/20"
                >
                  Windermere Guide <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPLORE CATEGORIES
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">Everything in one place</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C] mb-3">Explore the Lake District</h2>
            <p className="text-gray-400 text-sm">
              {totalBusinesses.toLocaleString() || "999"} local businesses across {CATEGORIES.length} categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.slug] || 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl card-hover min-h-[120px] sm:min-h-[140px]"
                >
                  <Image
                    src={`/images/categories/${cat.slug}.webp`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    quality={80}
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="relative p-5 flex flex-col justify-end h-full text-center">
                    <h3 className="text-white font-bold text-sm leading-tight mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{cat.label}</h3>
                    <p className="text-white/90 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {count > 0 ? `${count} listings` : "Explore →"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/things-to-do"
              className="inline-flex items-center gap-2 bg-[#14231C] hover:bg-[#245E3F] text-white px-7 py-3 rounded-full font-semibold text-sm transition-all"
            >
              Things to Do in the Lake District <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TOP RATED — MAGAZINE GRID
      ══════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-16 bg-[#EAEDE8]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">Verified by Google</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C] mb-3">Top Rated in the Lake District</h2>
              <p className="text-gray-400 text-sm">The highest-rated businesses based on thousands of Google reviews</p>
            </div>

            {/* Asymmetric magazine grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Big card — first item */}
              {featured[0] && (() => {
                const b = featured[0];
                const theme = catMeta[b.category.slug];
                const area = getArea(b.address);
                return (
                  <Link
                    href={`/${b.category.slug}/${b.slug}`}
                    className="md:col-span-2 group relative overflow-hidden rounded-2xl min-h-[260px] card-hover"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme?.gradient || "from-[#14231C] to-[#245E3F]"}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#C4782A] text-white text-xs font-bold px-3 py-1 rounded-full">
                        #{1} Rated
                      </span>
                    </div>
                    <div className="relative p-7 flex flex-col justify-end h-full min-h-[260px]">
                      <div className="mt-auto">
                        <span className="text-white/60 text-xs uppercase tracking-wider">
                          {theme?.emoji} {b.category.slug.replace("-", " ")} · {area}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-white mt-1 mb-2 group-hover:text-[#C4782A] transition-colors">
                          {b.name}
                        </h3>
                        {b.shortDescription && (
                          <p className="text-white/70 text-sm line-clamp-2 mb-3">{b.shortDescription}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#C4782A]">
                            <Star className="w-4 h-4 fill-[#C4782A]" />
                            <span className="font-bold text-white">{b.rating?.toFixed(1)}</span>
                            {b.reviewCount && <span className="text-white/50 text-sm">({b.reviewCount.toLocaleString()} reviews)</span>}
                          </div>
                          <span className="text-white/70 text-sm group-hover:text-white group-hover:translate-x-0.5 transition-all">
                            View listing →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* Two smaller cards */}
              <div className="grid grid-rows-2 gap-4">
                {featured.slice(1, 3).map((b, i) => {
                  const theme = catMeta[b.category.slug];
                  const area = getArea(b.address);
                  return (
                    <Link
                      key={b.slug}
                      href={`/${b.category.slug}/${b.slug}`}
                      className="group relative overflow-hidden rounded-2xl card-hover"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme?.gradient || "from-[#14231C] to-[#245E3F]"}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#C4782A] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          #{i + 2}
                        </span>
                      </div>
                      <div className="relative p-5 flex flex-col justify-end min-h-[118px]">
                        <div className="mt-auto">
                          <span className="text-white/50 text-xs">{theme?.emoji} {area}</span>
                          <h3 className="font-display font-bold text-white text-lg leading-tight group-hover:text-[#C4782A] transition-colors line-clamp-1">
                            {b.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-[#C4782A] text-[#C4782A]" />
                            <span className="text-white font-semibold text-sm">{b.rating?.toFixed(1)}</span>
                            {b.reviewCount && <span className="text-white/50 text-xs">({b.reviewCount.toLocaleString()})</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom row — 4 more */}
              {featured.slice(3, 7).map((b, i) => {
                const theme = catMeta[b.category.slug];
                const area = getArea(b.address);
                return (
                  <Link
                    key={b.slug}
                    href={`/${b.category.slug}/${b.slug}`}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#C4782A]/30 card-hover flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: theme?.light || "#EAEDE8", color: "#14231C" }}
                      >
                        {theme?.emoji} {b.category.slug.replace(/-/g, " ")}
                      </span>
                      <span className="text-[#C4782A] text-xs font-bold">#{i + 4}</span>
                    </div>
                    <h3 className="font-display font-bold text-[#14231C] text-base group-hover:text-[#C4782A] transition-colors mb-1 line-clamp-2 flex-1">
                      {b.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">{area}</p>
                    <div className="flex items-center gap-1.5 mt-auto">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-sm text-gray-800">{b.rating?.toFixed(1)}</span>
                      {b.reviewCount && <span className="text-gray-400 text-xs">({b.reviewCount.toLocaleString()})</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          BUSINESS CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#14231C] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C4782A]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2E7D6E]/8 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center max-w-2xl">
          <div className="font-display text-4xl font-bold text-white mb-4">
            List Your Business.<br />
            <span className="text-[#C4782A]">It&apos;s Free.</span>
          </div>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Join {totalBusinesses.toLocaleString() || "999"}+ businesses on the Lake District&apos;s fastest-growing guide. Get discovered by visitors planning their trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/claim-listing"
              className="bg-[#C4782A] hover:bg-[#E8B87A] text-white px-8 py-4 rounded-full font-bold text-base transition-all hover:shadow-lg hover:shadow-[#C4782A]/30"
            >
              Claim Your Free Listing →
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white/20 hover:border-white/50 text-white px-8 py-4 rounded-full font-semibold text-base transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
