import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import { COLLECTIONS, MIN_LISTINGS } from "@/lib/collections-config";
import { prisma } from "@/lib/prisma";

// Revalidate every hour so tag counts stay fresh
export const revalidate = 3600;

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Collections | Curated Lists of Lake District Businesses | The Lakes Guide",
  description:
    "Curated collections of Lake District businesses. Dog-friendly restaurants, hotels with parking, lakeside pubs, and more. Filtered, local, and honest.",
  alternates: { canonical: `${BASE_URL}/collections` },
  openGraph: {
    title: "Collections | The Lakes Guide",
    description: "Curated Lake District business collections. Dog-friendly, family-friendly, lakeside, and more.",
    url: `${BASE_URL}/collections`,
    type: "website",
    siteName: "TheLakesGuide.co.uk",
  },
};

const COLLECTION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Lake District Collections",
  description: "Curated collections of Lake District businesses. Dog-friendly restaurants, hotels with parking, lakeside pubs, and more.",
  url: `${BASE_URL}/collections`,
  publisher: { "@type": "Organization", name: "TheLakesGuide.co.uk", url: BASE_URL },
};

async function getCollectionCounts(): Promise<Record<string, number>> {
  try {
    const rows = await prisma.$queryRaw<{ tag: string; count: number }[]>`
      SELECT tag, COUNT(*)::int AS count
      FROM "Business", unnest(tags) AS tag
      GROUP BY tag
    `;
    return Object.fromEntries(rows.map((r) => [r.tag, r.count]));
  } catch {
    return {};
  }
}

export default async function CollectionsIndexPage() {
  const tagCounts = await getCollectionCounts();

  // A collection is "live" if at least one of its required tags has enough matches
  // considering its category scope (approximate — exact count is on the individual page)
  const liveCollections = COLLECTIONS.filter((c) => {
    const count = c.tags.reduce((sum, tag) => sum + (tagCounts[tag] ?? 0), 0);
    return count >= MIN_LISTINGS;
  });

  const comingSoon = COLLECTIONS.filter((c) => {
    const count = c.tags.reduce((sum, tag) => sum + (tagCounts[tag] ?? 0), 0);
    return count < MIN_LISTINGS;
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_LD) }} />

      <div className="min-h-screen bg-[#EAEDE8]">

        {/* ── Hero — walks-style ───────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
          <div className="absolute inset-0">
            <Image src={HERO_IMAGE_URL} alt="" fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: "center 20%" }} priority />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
          </div>
          <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
            <nav className="flex items-center gap-1.5 text-white/50 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">Collections</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">The Lakes Guide</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Lake District Collections
            </h1>
            <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-2xl">
              Filtered lists of Lake District businesses. Dog-friendly, family-friendly, lakeside, and more.
              No aggregator ranking. Just what&apos;s actually there, with a bit of honest context.
            </p>
          </div>
          <div className="relative h-8 overflow-hidden">
            <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
            </svg>
          </div>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 max-w-6xl py-12">
          {/* Live collections */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveCollections.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h2 className="font-display font-bold text-[#1B2E4B] text-base leading-snug mb-2 group-hover:text-[#C4782A] transition-colors">
                  {c.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                  {c.metaDescription}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[#C4782A] text-sm font-semibold">
                  View list <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          {/* Coming soon — collapsed, not linked */}
          {comingSoon.length > 0 && (
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Coming soon</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {comingSoon.map((c) => (
                  <div
                    key={c.slug}
                    className="bg-white/60 rounded-xl border border-gray-100 border-dashed p-4 opacity-60"
                  >
                    <span className="text-2xl mb-2 block">{c.emoji}</span>
                    <p className="font-semibold text-[#1B2E4B] text-sm leading-snug">{c.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 bg-[#1B2E4B] rounded-2xl p-8 text-center">
            <h2 className="font-display text-xl font-bold text-white mb-2">
              Own a business in the Lake District?
            </h2>
            <p className="text-white/60 text-sm mb-5 max-w-sm mx-auto">
              List your business and we&apos;ll include you in relevant collections automatically.
            </p>
            <Link
              href="/claim-listing"
              className="inline-block bg-[#C4782A] hover:bg-[#E8C87A] text-white px-7 py-3 rounded-full font-bold text-sm transition-all"
            >
              Add Your Business →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
