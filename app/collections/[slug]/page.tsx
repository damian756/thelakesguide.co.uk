import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Star, MapPin, ArrowRight } from "lucide-react";
import { getCollection, COLLECTIONS, MIN_LISTINGS } from "@/lib/collections-config";
import { prisma } from "@/lib/prisma";

// Revalidate every hour so new tags appear without a code push
export const revalidate = 3600;

const BASE_URL = "https://www.southportguide.co.uk";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Not Found" };

  const url = `${BASE_URL}/collections/${slug}`;
  return {
    title: `${collection.title} | SouthportGuide.co.uk`,
    description: collection.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: collection.title,
      description: collection.metaDescription,
      url,
      type: "website",
      siteName: "SouthportGuide.co.uk",
    },
    twitter: { card: "summary", title: collection.title, description: collection.metaDescription },
  };
}

// ── Business shape for collection cards ───────────────────────────────────────

type CollectionBusiness = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string | null;
  description: string | null;
  listingTier: string;
  address: string;
  postcode: string;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
  images: string[];
  photoUrl: string | null;
};

const AREAS = ["Birkdale", "Ainsdale", "Churchtown", "Crossens", "Marshside", "Banks", "Halsall"];

function extractArea(address: string): string {
  for (const area of AREAS) {
    if (address.includes(area)) return area;
  }
  return "Southport";
}

function formatReviewCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  let businesses: CollectionBusiness[] = [];

  try {
    const rawResults = await prisma.business.findMany({
      where: {
        category: { slug: { in: collection.categorySlugs } },
        tags: { hasEvery: collection.tags },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        shortDescription: true,
        description: true,
        listingTier: true,
        address: true,
        postcode: true,
        rating: true,
        reviewCount: true,
        priceRange: true,
        images: true,
        category: { select: { slug: true } },
      },
    });

    const tierOrder: Record<string, number> = { premium: 1, featured: 2, standard: 3 };

    businesses = rawResults
      .map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        categorySlug: b.category.slug,
        shortDescription: b.shortDescription,
        description: b.description,
        listingTier: b.listingTier,
        address: b.address,
        postcode: b.postcode,
        rating: b.rating,
        reviewCount: b.reviewCount,
        priceRange: b.priceRange,
        images: b.images ?? [],
        photoUrl: b.images?.[0] ?? null,
      }))
      .sort((a, b) => {
        const ta = tierOrder[a.listingTier] ?? 4;
        const tb = tierOrder[b.listingTier] ?? 4;
        if (ta !== tb) return ta - tb;
        const scoreA = (a.rating ?? 0) * Math.log((a.reviewCount ?? 0) + 1);
        const scoreB = (b.rating ?? 0) * Math.log((b.reviewCount ?? 0) + 1);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.name.localeCompare(b.name);
      });
  } catch (e) {
    console.error("Collection query failed:", e);
  }

  const count = businesses.length;
  const isIndexable = count >= MIN_LISTINGS;
  const url = `${BASE_URL}/collections/${slug}`;

  // ── Structured data ──────────────────────────────────────────────────────
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.metaDescription,
    url,
    numberOfItems: count,
    itemListElement: businesses.slice(0, 20).map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/${b.categorySlug}/${b.slug}`,
      name: b.name,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${BASE_URL}/collections` },
      { "@type": "ListItem", position: 3, name: collection.title, item: url },
    ],
  };

  return (
    <>
      {/* noindex for thin pages */}
      {!isIndexable && (
        <meta name="robots" content="noindex, nofollow" />
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-[#FAF8F5]">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="bg-[#1B2E4B] text-white">
          <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
            <nav className="flex items-center gap-1.5 text-white/40 text-xs mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/collections" className="hover:text-white/70 transition-colors">Collections</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/70">{collection.title}</span>
            </nav>

            <div className="text-5xl mb-4">{collection.emoji}</div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
              {collection.title}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              {collection.intro}
            </p>

            <div className="mt-6 flex items-center gap-3 text-sm text-white/50">
              <span className="font-semibold text-[#C9A84C] text-2xl">{count}</span>
              <span>{count === 1 ? "listing" : "listings"} found</span>
              {!isIndexable && (
                <span className="ml-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  · Building — more coming soon
                </span>
              )}
            </div>
          </div>

          <div className="h-6 overflow-hidden">
            <svg viewBox="0 0 1440 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
              <path d="M0 24L360 12C720 0 1080 0 1440 12V24H0Z" fill="#FAF8F5" />
            </svg>
          </div>
        </div>

        {/* ── Listings ─────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 max-w-6xl py-10">

          {count === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="font-display text-2xl font-bold text-[#1B2E4B] mb-2">Building this list</h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                We&apos;re working through our database to tag businesses for this collection. Check back soon.
              </p>
              <Link
                href={`/${collection.categorySlugs[0]}`}
                className="inline-flex items-center gap-2 mt-6 text-[#C9A84C] font-semibold hover:underline"
              >
                Browse all in this category <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          )}

          {/* ── Category link ──────────────────────────────────────────── */}
          {count > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-3">
                Want to see everything in {collection.categorySlugs.length > 1 ? "these categories" : "this category"}?
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {collection.categorySlugs.map((catSlug) => (
                  <Link
                    key={catSlug}
                    href={`/${catSlug}`}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B2E4B] px-5 py-2.5 rounded-full text-sm font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all shadow-sm"
                  >
                    Browse all {catSlug.replace(/-/g, " ")} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <div className="mt-14 bg-[#1B2E4B] rounded-2xl p-8 text-center">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Own a business that belongs here?
            </h3>
            <p className="text-white/60 text-sm mb-5 max-w-sm mx-auto">
              List your business and get featured in relevant collections across SouthportGuide.
            </p>
            <Link
              href="/claim-listing"
              className="inline-block bg-[#C9A84C] hover:bg-[#E8C87A] text-white px-7 py-3 rounded-full font-bold text-sm transition-all"
            >
              Add Your Business →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Business Card ─────────────────────────────────────────────────────────────

function BusinessCard({ business: b }: { business: CollectionBusiness }) {
  const snippet = b.shortDescription || b.description?.slice(0, 120) || null;
  const area = extractArea(b.address);
  const areaLabel = area === "Southport" ? "Southport" : `${area}, Southport`;

  return (
    <Link
      href={`/${b.categorySlug}/${b.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
    >
      {/* Photo / placeholder */}
      <div className="relative w-full h-44 bg-gradient-to-br from-[#1B2E4B] to-[#2A4A73] flex-none overflow-hidden">
        {b.photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.photoUrl}
              alt={b.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-3 right-3 w-20 h-20 bg-[#C9A84C]/10 rounded-full blur-2xl" />
            <span className="text-5xl opacity-30 select-none">📍</span>
          </div>
        )}

        {/* Featured badge overlaid on image */}
        {b.listingTier === "premium" && (
          <span className="absolute top-3 left-3 text-[10px] font-black bg-[#C9A84C] text-[#1B2E4B] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            ✦ Featured
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h2 className="font-display font-bold text-[#1B2E4B] text-base leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
          {b.name}
        </h2>

        <p className="flex items-center gap-1 text-gray-400 text-xs">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{areaLabel}</span>
        </p>

        {snippet ? (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{snippet}</p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
          {b.rating != null ? (
            <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {b.rating.toFixed(1)}
              {b.reviewCount != null && (
                <span className="font-normal text-amber-500 ml-0.5">({formatReviewCount(b.reviewCount)})</span>
              )}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {b.priceRange && (
              <span className="text-gray-400 text-xs font-semibold">{b.priceRange}</span>
            )}
            <span className="text-xs font-bold text-[#C9A84C] group-hover:translate-x-0.5 transition-transform">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
