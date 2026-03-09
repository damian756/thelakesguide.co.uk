import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, MapPin } from "lucide-react";
import type { Guide } from "@/lib/guides-config";
import { getRelatedGuides, GUIDE_CATEGORIES } from "@/lib/guides-config";

interface BusinessCard {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  category: { slug: string; name: string };
  images: string[];
  listingTier: string;
  rating: number | null;
}

interface GuideLayoutProps {
  guide: Guide;
  children: React.ReactNode;
}

async function fetchRelatedListings(guide: Guide): Promise<BusinessCard[]> {
  if (!guide.listingFilter) return [];
  try {
    const { prisma } = await import("@/lib/prisma");
    const { categorySlugs, tags } = guide.listingFilter;

    const whereCondition = {
      OR: [
        categorySlugs && categorySlugs.length > 0
          ? { category: { slug: { in: categorySlugs } } }
          : undefined,
        tags && tags.length > 0
          ? { tags: { hasSome: tags } }
          : undefined,
      ].filter(Boolean) as object[],
    };

    // Prefer paid tiers first; fall back to top-rated standard listings so the
    // section is never empty just because no business has paid for a tier upgrade.
    const paid = await prisma.business.findMany({
      where: { ...whereCondition, listingTier: { in: ["featured", "premium"] } },
      select: {
        id: true, slug: true, name: true, shortDescription: true,
        category: { select: { slug: true, name: true } },
        images: true, listingTier: true, rating: true,
      },
      orderBy: [{ listingTier: "desc" }, { rating: "desc" }],
      take: 6,
    });

    if (paid.length >= 3) return paid as BusinessCard[];

    // Not enough paid listings — top up with best-rated free/standard listings
    const paidIds = paid.map((b) => b.id);
    const standard = await prisma.business.findMany({
      where: {
        ...whereCondition,
        listingTier: { notIn: ["featured", "premium"] },
        id: { notIn: paidIds },
        rating: { not: null },
      },
      select: {
        id: true, slug: true, name: true, shortDescription: true,
        category: { select: { slug: true, name: true } },
        images: true, listingTier: true, rating: true,
      },
      orderBy: [{ rating: "desc" }],
      take: 6 - paid.length,
    });

    return [...paid, ...standard] as BusinessCard[];
  } catch {
    return [];
  }
}

export default async function GuideLayout({ guide, children }: GuideLayoutProps) {
  const [relatedGuides, listings] = await Promise.all([
    Promise.resolve(getRelatedGuides(guide.slug)),
    fetchRelatedListings(guide),
  ]);

  const categoryLabel = GUIDE_CATEGORIES[guide.category].label;

  return (
    <div className="min-h-screen bg-[#EAEDE8]">

      {/* ── Breadcrumb strip ── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#14231C] border-b border-white/10"
      >
        <div className="container mx-auto px-4 max-w-7xl py-2.5">
          <ol className="flex items-center gap-1.5 text-xs text-white/50 flex-wrap">
            <li>
              <Link href="/" className="hover:text-[#C4782A] transition-colors font-medium">
                Home
              </Link>
            </li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li>
              <Link href="/guides" className="hover:text-[#C4782A] transition-colors font-medium">
                Guides
              </Link>
            </li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li>
              <Link
                href={`/guides?category=${guide.category}`}
                className="hover:text-[#C4782A] transition-colors font-medium"
              >
                {categoryLabel}
              </Link>
            </li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li className="text-white/80 font-semibold">{guide.title}</li>
          </ol>
        </div>
      </nav>

      {/* ── Bespoke page content ── */}
      {children}

      {/* ── Related Listings ── */}
      {listings.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl py-16">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">
                Lake District Businesses
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#14231C]">
                Relevant Listings
              </h2>
              <p className="text-gray-600 mt-2 text-base">
                Featured businesses related to this guide.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/${biz.category.slug}/${biz.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#C4782A]/30 transition-all group overflow-hidden"
                >
                  <div className="relative h-36 overflow-hidden">
                    {biz.images[0] ? (
                      <Image
                        src={biz.images[0]}
                        alt={biz.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#14231C] to-[#245E3F] flex items-center justify-center">
                        <span className="text-white/20 font-display font-bold text-4xl select-none">
                          {biz.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <p className="text-[#C4782A] text-[10px] font-bold uppercase tracking-wider">
                        {biz.category.name}
                      </p>
                    </div>
                    {biz.listingTier === "featured" && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-[#C4782A] text-[#14231C] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-[#14231C] text-base mb-1.5 group-hover:text-[#C4782A] transition-colors">
                      {biz.name}
                    </h3>
                    {biz.shortDescription && (
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                        {biz.shortDescription}
                      </p>
                    )}
                    {biz.rating && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-amber-500 text-sm">★</span>
                        <span className="text-xs font-semibold text-gray-700">{biz.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={`/${guide.listingFilter?.categorySlugs?.[0] ?? "restaurants"}`}
                className="inline-flex items-center gap-2 text-[#C4782A] font-semibold text-sm hover:text-[#14231C] transition-colors"
              >
                Browse all listings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Guides ── */}
      {relatedGuides.length > 0 && (
        <section className="bg-[#EAEDE8] border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl py-16">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">
                Keep Exploring
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#14231C]">
                Related Guides
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedGuides.map((related) => (
                <Link
                  key={related.slug}
                  href={`/guides/${related.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#C4782A]/30 transition-all group overflow-hidden"
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={related.heroImage}
                      alt={related.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[#C4782A] text-[10px] font-bold uppercase tracking-wider">
                        {GUIDE_CATEGORIES[related.category].label}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-[#14231C] text-sm mb-1.5 group-hover:text-[#C4782A] transition-colors leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-[#C4782A] font-semibold text-sm hover:text-[#14231C] transition-colors"
              >
                All guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── List Your Business CTA ── */}
      <section className="bg-[#14231C] py-14">
        <div className="container mx-auto px-4 max-w-7xl text-center text-white">
          <MapPin className="w-8 h-8 text-[#C4782A] mx-auto mb-4" />
          <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
            Lake District Business?
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Get Your Business in These Guides
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            TheLakesGuide.co.uk reaches visitors actively planning a trip. 
            List your business and appear in relevant guides automatically.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/claim-listing"
              className="bg-[#C4782A] hover:bg-[#E8B87A] text-[#14231C] px-8 py-3.5 rounded-full font-bold transition-colors"
            >
              List Your Business
            </Link>
            <Link
              href="/advertise"
              className="bg-white/10 border border-white/25 text-white px-8 py-3.5 rounded-full font-semibold transition-colors hover:bg-white/20"
            >
              Advertising Options →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
