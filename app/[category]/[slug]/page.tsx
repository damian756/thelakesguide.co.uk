import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Phone, Globe, Clock, Star, ChevronRight, ShieldCheck, ShieldAlert, ShieldX, Shield } from "lucide-react";
import { getCategoryBySlug, isValidCategory } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ViewTracker } from "@/components/ViewTracker";
import ReviewSection from "@/components/ReviewSection";

type Props = {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ review?: string }>;
};

function trackUrl(businessId: string, type: string, dest: string): string {
  return `/api/out?id=${businessId}&type=${type}&url=${encodeURIComponent(dest)}`;
}

function websiteHref(website: string): string {
  return website.startsWith("http") ? website : `https://${website}`;
}

// Normalise non-ASCII typography for safe SERP output.
// Order: transliterate common Latin accented chars → normalise typographic punctuation → strip remainder.
function sanitize(str: string): string {
  return str
    // Latin accented characters → ASCII equivalents
    .replace(/[àáâãäå]/gi, (c) => c === c.toUpperCase() ? "A" : "a")
    .replace(/[èéêë]/gi,   (c) => c === c.toUpperCase() ? "E" : "e")
    .replace(/[ìíîï]/gi,   (c) => c === c.toUpperCase() ? "I" : "i")
    .replace(/[òóôõö]/gi,  (c) => c === c.toUpperCase() ? "O" : "o")
    .replace(/[ùúûü]/gi,   (c) => c === c.toUpperCase() ? "U" : "u")
    .replace(/[ýÿ]/gi,     (c) => c === c.toUpperCase() ? "Y" : "y")
    .replace(/[ñ]/gi,      (c) => c === c.toUpperCase() ? "N" : "n")
    .replace(/[ç]/gi,      (c) => c === c.toUpperCase() ? "C" : "c")
    .replace(/[ß]/g, "ss")
    // Typographic punctuation
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u2023\u2219\u25E6\u2043]/g, "-")
    // Strip any remaining high-byte characters
    .replace(/[^\x00-\x7E]/g, "");
}

// Map category slugs to Schema.org @type
// TouristAttraction and Park are not in Google's supported types for Review Snippets.
// Using arrays so the entity is also a LocalBusiness (which IS supported), preserving
// aggregateRating eligibility while retaining semantic accuracy.
const SCHEMA_TYPES: Record<string, string | string[]> = {
  restaurants:   "Restaurant",
  accommodation: "LodgingBusiness",
  pubs:          "BarOrPub",
  cafes:         "CafeOrCoffeeShop",
  shopping:      "Store",
  walks:         "LocalBusiness",
  villages:      "LocalBusiness",
  activities:    "LocalBusiness",
};

// Categories that might have food hygiene ratings
const FOOD_CATS = new Set(["restaurants", "cafes", "pubs", "accommodation", "activities"]);

function extractArea(address: string, _postcode: string): string {
  const areas = ["Windermere", "Bowness", "Ambleside", "Keswick", "Grasmere", "Coniston",
                 "Glenridding", "Hawkshead", "Cockermouth", "Ulverston", "Kendal"];
  for (const area of areas) {
    if (address.includes(area)) return area;
  }
  return "Lake District";
}

function formatAddress(address: string, postcode: string): string {
  let addr = address.replace(/,?\s*(United Kingdom|UK)$/i, "").trim();
  if (postcode && !addr.includes(postcode)) addr = `${addr}, ${postcode}`;
  return addr;
}

// Per-slug meta overrides for high-value listings with poor SERP CTR
const LISTING_META_OVERRIDES: Record<string, { title?: string; description?: string }> = {};

// Short category labels for concise page titles (template appends " | The Lakes Guide")
const SHORT_CAT: Record<string, string> = {
  restaurants:   "Restaurant",
  accommodation: "Hotel",
  pubs:         "Bar & Pub",
  cafes:        "Café",
  walks:        "Walk",
  villages:     "Village",
  shopping:     "Shop",
  activities:   "Activity",
};

// Budget: local part ≤47 chars so full <title> stays ≤70 with " | The Lakes Guide" (18 chars).
// Three-tier fallback: Name — Cat, Location → Name — Cat → Name — Location → truncated Name.
// For beaches-parks, detect "beach" in the name to label it correctly.
function buildTitle(name: string, catSlug: string, area: string): string {
  const cleanName = sanitize(name);
  const isBeach   = cleanName.toLowerCase().includes("beach");
  const catLabel  = catSlug === "beaches-parks"
    ? (isBeach ? "Beach" : "Park")
    : (SHORT_CAT[catSlug] ?? catSlug);
  const location  = area === "Lake District" ? "Lake District" : `${area}, Lake District`;

  const withBoth = `${cleanName} — ${catLabel}, ${location}`;
  if (withBoth.length <= 47) return withBoth;

  const catOnly = `${cleanName} — ${catLabel}`;
  if (catOnly.length <= 47) return catOnly;

  const locOnly = `${cleanName} — ${location}`;
  if (locOnly.length <= 47) return locOnly;

  return cleanName.length <= 44 ? cleanName : cleanName.slice(0, 44) + "…";
}

function buildMetaDescription(
  name: string, catName: string, area: string,
  description: string | null, shortDescription: string | null,
  rating: number | null, reviewCount: number | null
): string {
  const cleanName = sanitize(name);
  const locLabel  = area === "Lake District" ? "Lake District" : `${area}, Lake District`;

  if (description) {
    const stripped = sanitize(description.replace(/\n+/g, " ").trim());
    // Split on sentence boundaries only where punctuation is followed by a space and uppercase letter.
    // This avoids false splits on decimals (4.6), abbreviations (U.S.), etc.
    const sentences = stripped.split(/(?<=[.!?]) +(?=[A-Z])/);
    let result = "";
    for (const sentence of sentences) {
      const candidate = result ? `${result} ${sentence}` : sentence;
      if (candidate.length <= 155) { result = candidate; } else break;
    }
    // Fallback: slice at word boundary if no sentence fitted
    if (!result) {
      const cut = stripped.lastIndexOf(" ", 152);
      result = (cut > 100 ? stripped.slice(0, cut) : stripped.slice(0, 152)) + "…";
    }
    // Inject a location signal if neither the area name nor "Lake District" appear in the snippet.
    if (!result.includes(area) && !result.includes("Lake District")) {
      const suffix = ` ${locLabel}.`;
      if ((result + suffix).length <= 160) result += suffix;
    }
    return result.slice(0, 160);
  }

  if (shortDescription) {
    const ratingPart = rating ? ` Rated ${rating}/5.` : "";
    const locPart    = area !== "Lake District" ? ` In ${area}, Lake District.` : " In the Lake District.";
    return `${cleanName} - ${sanitize(shortDescription)}${ratingPart}${locPart} Find address, opening hours & more on TheLakesGuide.co.uk`.slice(0, 160);
  }

  const ratingStr = rating && reviewCount
    ? `Rated ${rating.toFixed(1)}/5 by ${reviewCount.toLocaleString()} reviewers. `
    : "";
  return `${cleanName} - ${catName} in ${locLabel}. ${ratingStr}Find opening hours, directions and contact details on TheLakesGuide.co.uk`.slice(0, 160);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isValidCategory(category)) return { title: "Business" };
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: slug };

  try {
    const catRecord = await prisma.category.findFirst({ where: { slug: category } });
    if (!catRecord) return { title: slug };
    const b = await prisma.business.findFirst({
      where: { slug, categoryId: catRecord.id },
      select: { name: true, address: true, postcode: true, shortDescription: true, description: true, rating: true, reviewCount: true, images: true },
    });
    if (!b) return { title: slug };

    const area      = extractArea(b.address, b.postcode);
    const cleanName = sanitize(b.name);
    const overrideKey = `${category}/${slug}`;
    const override  = LISTING_META_OVERRIDES[overrideKey];
    const title     = override?.title ?? buildTitle(cleanName, category, area);
    const desc      = override?.description ?? buildMetaDescription(cleanName, cat.name, area, b.description, b.shortDescription, b.rating, b.reviewCount);
    const imageUrl  = b.images?.[0] || null;

    const canonicalUrl = `https://www.thelakesguide.co.uk/${category}/${slug}`;

    return {
      title,
      description: desc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description: desc,
        url: canonicalUrl,
        type: "website",
        siteName: "TheLakesGuide.co.uk",
        locale: "en_GB",
        ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: cleanName }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
    };
  } catch {
    return { title: slug };
  }
}

export default async function BusinessPage({ params, searchParams }: Props) {
  const { category, slug } = await params;
  const { review: reviewParam } = await searchParams;
  if (!isValidCategory(category)) notFound();
  const cat = getCategoryBySlug(category)!;

  type Business = {
    id: string;
    name: string;
    address: string;
    postcode: string;
    lat: number | null;
    lng: number | null;
    phone: string | null;
    website: string | null;
    description: string | null;
    shortDescription: string | null;
    listingTier: string;
    priceRange: string | null;
    openingHours: unknown;
    images: string[];
    claimed: boolean;
    rating: number | null;
    reviewCount: number | null;
    placeId: string | null;
    hygieneRating: string | null;
    hygieneRatingDate: Date | null;
    hygieneRatingShow: boolean;
    fhrsId: string | null;
    updatedAt: Date;
    secondaryCategoryIds: string[];
    tags: string[];
    _count?: { clicks: number };
  };

  type NearbyPlace = {
    slug: string; name: string; address: string;
    categorySlug: string; categoryName: string;
    distance_m: number;
  };

  let business: Business | null = null;
  let related: { slug: string; name: string; rating: number | null; reviewCount: number | null; address: string; priceRange: string | null }[] = [];
  let nearbyPlaces: NearbyPlace[] = [];

  try {
    const categoryRecord = await prisma.category.findFirst({ where: { slug: category } });
    if (categoryRecord) {
      business = await prisma.business.findFirst({
        where: {
          slug,
          OR: [
            { categoryId: categoryRecord.id },
            { secondaryCategoryIds: { has: categoryRecord.id } },
          ],
        },
        select: {
          id: true, name: true, address: true, postcode: true, lat: true, lng: true,
          phone: true, website: true, description: true, shortDescription: true,
          listingTier: true, priceRange: true, openingHours: true, images: true,
          claimed: true, rating: true, reviewCount: true, placeId: true,
          hygieneRating: true, hygieneRatingDate: true, hygieneRatingShow: true, fhrsId: true,
          updatedAt: true, secondaryCategoryIds: true, tags: true,
          _count: { select: { clicks: true } },
        },
      }) as Business | null;

      if (business) {
        related = await prisma.$queryRaw<typeof related>`
          SELECT slug, name, rating, "reviewCount", address, "priceRange"
          FROM "Business"
          WHERE "categoryId" = ${categoryRecord.id}
            AND id != ${business.id}
          ORDER BY (COALESCE(rating, 0) * LOG(COALESCE("reviewCount", 0) + 1)) DESC
          LIMIT 4
        `;

      }
    }
  } catch {
    // DB not connected
  }

  if (!business) notFound();

  const isFeatured = business.listingTier === "featured" || business.listingTier === "premium";
  const isPremium = business.listingTier === "premium";
  const area = extractArea(business.address, business.postcode);
  const formattedAddress = formatAddress(business.address, business.postcode);
  const mapsKey = process.env.GOOGLE_PLACES_API_KEY;
  const isFoodCategory = FOOD_CATS.has(category);
  const totalClicks = business._count?.clicks ?? 0;

  const heroImage = business.images?.[0] ?? null;

  // Format "last updated" label
  const updatedLabel = (() => {
    const d = business.updatedAt;
    if (!d) return null;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - new Date(d).getTime()) / 86_400_000);
    if (diffDays < 1) return "Updated today";
    if (diffDays < 7) return `Updated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffDays < 31) return `Updated ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return `Updated ${new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  })();

  // Resolve secondary category names for badge display
  let secondaryCategories: { slug: string; name: string }[] = [];
  if (business.secondaryCategoryIds?.length) {
    try {
      const secCats = await prisma.category.findMany({
        where: { id: { in: business.secondaryCategoryIds } },
        select: { slug: true, name: true },
      });
      secondaryCategories = secCats.filter((c) => c.slug !== category);
    } catch { /* ignore */ }
  }

  // Build JSON-LD structured data
  const schemaType = SCHEMA_TYPES[category] || "LocalBusiness";
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.replace(/,?\s*(United Kingdom|UK)$/i, "").split(",")[0].trim(),
      addressLocality: area,
      addressRegion: "Cumbria",
      postalCode: business.postcode,
      addressCountry: "GB",
    },
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.website ? { url: business.website } : {}),
    ...(business.lat && business.lng ? {
      geo: { "@type": "GeoCoordinates", latitude: business.lat, longitude: business.lng },
    } : {}),
    ...(business.rating && business.reviewCount ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating.toFixed(1),
        reviewCount: business.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
    } : {}),
    ...(business.priceRange ? { priceRange: business.priceRange } : {}),
    ...(business.description || business.shortDescription ? {
      description: business.description || business.shortDescription,
    } : {}),
    ...(business.images?.[0] ? { image: business.images[0] } : {}),
  };

  // Opening hours for JSON-LD
  if (business.openingHours && typeof business.openingHours === "object") {
    const oh = business.openingHours as { weekdayText?: string[] };
    if (oh.weekdayText?.length) {
      const specs = oh.weekdayText.map((line: string) => {
        const [day, times] = line.split(": ");
        if (!times || times === "Closed") return null;
        if (times === "Open 24 hours") {
          return { "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${day}`, opens: "00:00", closes: "23:59" };
        }
        const [open, close] = times.split(" – ").map((t: string) => {
          const [time, ampm] = t.split(" ");
          const [h, m] = time.split(":").map(Number);
          const h24 = ampm === "PM" && h !== 12 ? h + 12 : (ampm === "AM" && h === 12 ? 0 : h);
          return `${String(h24).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
        });
        return { "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${day}`, opens: open, closes: close };
      }).filter(Boolean);
      if (specs.length) jsonLd.openingHoursSpecification = specs;
    }
  }

  // Map embed URL – use placeId if available, else lat/lng
  const mapSrc = mapsKey
    ? business.placeId
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=place_id:${business.placeId}&zoom=16`
      : business.lat && business.lng
        ? `https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${business.lat},${business.lng}&zoom=16&maptype=roadmap`
        : null
    : null;

  // Breadcrumb JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: "https://www.thelakesguide.co.uk" },
      { "@type": "ListItem", position: 2, name: cat.name,  item: `https://www.thelakesguide.co.uk/${category}` },
      { "@type": "ListItem", position: 3, name: business.name, item: `https://www.thelakesguide.co.uk/${category}/${slug}` },
    ],
  };

  return (
    <>
      <ViewTracker businessId={business.id} />
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="min-h-screen bg-[#FAF8F5]">
        <div className="container mx-auto px-4 py-8 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${category}`} className="hover:text-[#C9A84C] transition-colors">{cat.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1B2E4B] font-medium">{business.name}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Main column ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6 min-w-0">

              {/* Hero card */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="h-52 bg-gradient-to-br from-[#1B2E4B] to-[#2A4A73] flex items-center justify-center relative overflow-hidden">
                  {heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroImage} alt={business.name} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1B2E4B] to-[#2A4A73]" />
                      <div className="absolute top-4 right-4 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl" />
                      <span className="relative text-6xl select-none opacity-40">📍</span>
                    </>
                  )}
                </div>

                <div className="p-6">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {isFeatured && (
                      <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-bold px-3 py-1 rounded-full border border-[#C9A84C]/20">✦ FEATURED</span>
                    )}
                    <Link href={`/${category}`} className="bg-[#FAF8F5] text-[#1B2E4B] text-xs font-medium px-3 py-1 rounded-full border border-gray-200 hover:border-gray-400 transition-colors">{cat.name}</Link>
                    {secondaryCategories.map((sc) => (
                      <Link key={sc.slug} href={`/${sc.slug}`} className="bg-[#FAF8F5] text-[#1B2E4B] text-xs font-medium px-3 py-1 rounded-full border border-gray-200 hover:border-gray-400 transition-colors">{sc.name}</Link>
                    ))}
                    {business.priceRange && (
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">{business.priceRange}</span>
                    )}
                    {isFoodCategory && (
                      <HygieneBadgeInline
                        rating={business.hygieneRating}
                        date={business.hygieneRatingDate}
                        claimed={business.claimed}
                        show={business.hygieneRatingShow}
                        fhrsId={business.fhrsId}
                      />
                    )}
                    {isPremium && totalClicks >= 10 && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                        {totalClicks.toLocaleString()} people clicked through
                      </span>
                    )}
                    {updatedLabel && (
                      <span className="text-gray-400 text-xs">{updatedLabel}</span>
                    )}
                  </div>

                  <h1 className="font-display text-3xl font-bold text-[#1B2E4B] mb-3">{business.name}</h1>

                  {/* Google rating */}
                  {business.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      {business.placeId ? (
                        <a
                          href={trackUrl(
                            business.id,
                            "google_reviews",
                            `https://www.google.com/maps/place/?q=place_id:${business.placeId}`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-full border border-amber-200 text-sm transition-colors cursor-pointer group"
                          title="Read Google reviews"
                        >
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {business.rating.toFixed(1)}
                          {business.reviewCount && (
                            <span className="text-amber-600 font-normal ml-0.5">({business.reviewCount.toLocaleString()} reviews)</span>
                          )}
                          <span className="text-amber-400 text-xs group-hover:translate-x-0.5 transition-transform">↗</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 font-semibold px-3 py-1.5 rounded-full border border-amber-200 text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {business.rating.toFixed(1)}
                          {business.reviewCount && (
                            <span className="text-amber-600 font-normal ml-0.5">({business.reviewCount.toLocaleString()} reviews)</span>
                          )}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">Google rating</span>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="flex flex-wrap gap-3">
                    {business.website && (
                      <a
                        href={trackUrl(business.id, "website", websiteHref(business.website))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#1B2E4B] text-white px-5 py-2.5 rounded-full hover:bg-[#2A4A73] transition font-semibold text-sm"
                      >
                        <Globe className="w-4 h-4" /> Visit Website
                      </a>
                    )}
                    {business.phone && (
                      <a
                        href={`tel:${business.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 bg-[#C9A84C]/10 text-[#1B2E4B] border border-[#C9A84C]/30 px-5 py-2.5 rounded-full hover:bg-[#C9A84C]/20 transition font-semibold text-sm"
                      >
                        <Phone className="w-4 h-4 text-[#C9A84C]" /> {business.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {(business.description || business.shortDescription) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About {business.name}</h2>
                  <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
                    {(business.description || business.shortDescription)!
                      .split("\n\n")
                      .filter(Boolean)
                      .map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              )}

              {/* ── Reviews ─────────────────────────────────────────────── */}
              <ReviewSection
                businessId={business.id}
                businessName={business.name}
                slug={slug}
                categorySlug={category}
                reviewVerifiedParam={reviewParam ?? null}
              />

              {/* Address + Hours */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" /> Address
                    </h2>
                    <address className="text-gray-700 not-italic leading-relaxed text-sm">
                      {formattedAddress}
                    </address>
                    {business.lat && business.lng && (
                      <a
                        href={trackUrl(
                          business.id,
                          "directions",
                          `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-600 text-sm hover:underline font-medium"
                      >
                        Get directions →
                      </a>
                    )}
                  </div>

                  {business.openingHours != null && typeof business.openingHours === "object" && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" /> Opening Hours
                      </h2>
                      <OpeningHours data={business.openingHours} />
                    </div>
                  )}
                </div>
              </div>

              {/* Google Maps embed */}
              {mapSrc && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 pt-5 pb-2">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" /> Location
                    </h2>
                  </div>
                  <iframe
                    loading="lazy"
                    className="w-full h-80"
                    src={mapSrc}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map showing location of ${business.name}`}
                  />
                </div>
              )}

              {/* Food Hygiene Rating — full card (food categories only) */}
              {isFoodCategory && (
                <HygieneCard
                  name={business.name}
                  rating={business.hygieneRating}
                  date={business.hygieneRatingDate}
                  claimed={business.claimed}
                  show={business.hygieneRatingShow}
                  fhrsId={business.fhrsId}
                />
              )}

              {/* Related listings */}
              {related.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">More {cat.name} in the Lake District</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/${category}/${r.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition group border border-gray-100"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition text-sm truncate">{r.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {r.address.replace(/,?\s*(United Kingdom|UK)$/i, "").split(",").slice(-2).join(",").trim()}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {r.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-amber-600 font-medium">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {r.rating.toFixed(1)}
                            </span>
                          )}
                          {r.priceRange && <span className="block text-xs text-gray-400">{r.priceRange}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/${category}`} className="block text-center text-[#C9A84C] text-sm mt-4 hover:underline font-bold">
                    View all {cat.name} →
                  </Link>
                </div>
              )}
            </div>

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="space-y-4">

              {/* Quick info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                <h3 className="font-semibold text-gray-900">Quick Info</h3>

                {business.phone && (
                  <InfoRow icon={<Phone className="w-4 h-4 text-blue-500" />} label="Phone">
                    <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="text-gray-800 text-sm hover:text-blue-600">{business.phone}</a>
                  </InfoRow>
                )}

                {business.website && (
                  <InfoRow icon={<Globe className="w-4 h-4 text-blue-500" />} label="Website">
                    <a
                      href={trackUrl(business.id, "website", websiteHref(business.website))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline break-all"
                    >
                      {business.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                    </a>
                  </InfoRow>
                )}

                <InfoRow icon={<MapPin className="w-4 h-4 text-blue-500" />} label="Location">
                  <span className="text-gray-800 text-sm">{area}{area !== "Lake District" ? ", Lake District" : ""}</span>
                </InfoRow>

                {business.priceRange && (
                  <InfoRow icon={<span className="w-4 h-4 text-blue-500 text-sm font-bold leading-none mt-0.5">£</span>} label="Price range">
                    <span className="text-gray-800 text-sm">{business.priceRange}</span>
                  </InfoRow>
                )}

                {business.rating && (
                  <InfoRow icon={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />} label="Google rating">
                    {business.placeId ? (
                      <a
                        href={trackUrl(
                          business.id,
                          "google_reviews",
                          `https://www.google.com/maps/place/?q=place_id:${business.placeId}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 text-sm font-semibold hover:underline"
                        title="Read Google reviews"
                      >
                        {business.rating.toFixed(1)}/5
                        {business.reviewCount && <span className="font-normal text-gray-500"> ({business.reviewCount.toLocaleString()} reviews) ↗</span>}
                      </a>
                    ) : (
                      <span className="text-gray-800 text-sm">
                        {business.rating.toFixed(1)}/5
                        {business.reviewCount && <span className="text-gray-500"> ({business.reviewCount.toLocaleString()} reviews)</span>}
                      </span>
                    )}
                  </InfoRow>
                )}
              </div>

              {/* Hygiene sidebar teaser (food cats only) */}
              {isFoodCategory && (
                <HygieneSidebar
                  rating={business.hygieneRating}
                  date={business.hygieneRatingDate}
                  claimed={business.claimed}
                  show={business.hygieneRatingShow}
                  fhrsId={business.fhrsId}
                />
              )}

              {/* Claim listing */}
              {!business.claimed && (
                <div className="bg-[#1B2E4B] rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
                  <div className="relative">
                    <p className="font-display font-bold text-white mb-1">Is this your business?</p>
                    <p className="text-white/60 text-sm mb-4">Claim your free listing to update details, manage your food hygiene display, and attract more customers.</p>
                    <Link
                      href="/claim-listing"
                      className="block text-center bg-[#C9A84C] text-white px-4 py-2.5 rounded-full font-bold text-sm hover:bg-[#E8C87A] transition"
                    >
                      Claim Free Listing →
                    </Link>
                  </div>
                </div>
              )}

              {/* Upgrade */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Upgrade this listing</p>
                <p className="text-gray-600 text-sm mb-3">Get more visibility with a featured listing from £29/month</p>
                <Link href="/pricing" className="text-[#C9A84C] text-sm font-bold hover:underline">View pricing →</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Helper components ────────────────────────────────────────────────────

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

// Hygiene rating config
const HYGIENE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; description: string }> = {
  "5": { label: "5 – Very Good", color: "text-green-700", bg: "bg-green-50", border: "border-green-300", icon: <ShieldCheck className="w-5 h-5 text-green-600" />, description: "Top food hygiene standards" },
  "4": { label: "4 – Good", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: <ShieldCheck className="w-5 h-5 text-green-500" />, description: "Good food hygiene standards" },
  "3": { label: "3 – Generally Satisfactory", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300", icon: <Shield className="w-5 h-5 text-yellow-500" />, description: "Generally satisfactory hygiene" },
  "2": { label: "2 – Improvement Necessary", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", icon: <ShieldAlert className="w-5 h-5 text-orange-500" />, description: "Improvement necessary" },
  "1": { label: "1 – Major Improvement Required", color: "text-red-700", bg: "bg-red-50", border: "border-red-300", icon: <ShieldAlert className="w-5 h-5 text-red-500" />, description: "Major improvement required" },
  "0": { label: "0 – Urgent Improvement Required", color: "text-red-900", bg: "bg-red-100", border: "border-red-400", icon: <ShieldX className="w-5 h-5 text-red-700" />, description: "Urgent improvement required" },
  "AwaitingInspection": { label: "Awaiting Inspection", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-300", icon: <Shield className="w-5 h-5 text-gray-400" />, description: "Not yet inspected" },
  "Exempt": { label: "Exempt", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200", icon: <Shield className="w-5 h-5 text-gray-400" />, description: "Not required to be rated" },
};

function fsaUrl(fhrsId: string | null): string {
  return fhrsId
    ? `https://ratings.food.gov.uk/business/en-GB/${fhrsId}`
    : "https://ratings.food.gov.uk/";
}

function HygieneBadgeInline({ rating, date: _date, claimed: _claimed, show, fhrsId }: {
  rating: string | null; date: Date | null; claimed: boolean; show: boolean; fhrsId: string | null;
}) {
  if (!rating || !show) return null;
  const cfg = HYGIENE_CONFIG[rating];
  if (!cfg) return null;
  return (
    <a
      href={fsaUrl(fhrsId)}
      target="_blank"
      rel="noopener noreferrer"
      title={fhrsId ? "View FSA food hygiene rating" : "Food Standards Agency"}
      className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium hover:opacity-80 transition-opacity", cfg.bg, cfg.color, cfg.border)}
    >
      {rating === "5" || rating === "4" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
      FSA {cfg.label} ↗
    </a>
  );
}

function HygieneCard({ name, rating, date, claimed, show, fhrsId }: {
  name: string; rating: string | null; date: Date | null; claimed: boolean; show: boolean; fhrsId: string | null;
}) {
  if (claimed && !show) return null;
  if (!rating) return null;

  const cfg = HYGIENE_CONFIG[rating];
  if (!cfg) return null;

  const numRating = parseInt(rating);

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border p-6", cfg.border)}>
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Food Hygiene Rating</h2>
        <a
          href={fsaUrl(fhrsId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 text-xs hover:text-blue-500 hover:underline"
          title={fhrsId ? "View this business on the FSA website" : "Food Standards Agency"}
        >
          {fhrsId ? "View on food.gov.uk ↗" : "food.gov.uk ↗"}
        </a>
      </div>

      <div className="flex items-center gap-5">
        {/* Score box */}
        <div className={cn("w-20 h-20 rounded-xl flex flex-col items-center justify-center border-2 flex-shrink-0", cfg.bg, cfg.border)}>
          <span className={cn("text-3xl font-black leading-none", cfg.color)}>
            {rating === "AwaitingInspection" || rating === "Exempt" ? "–" : rating}
          </span>
          {!isNaN(numRating) && <span className={cn("text-xs font-medium mt-0.5", cfg.color)}>/ 5</span>}
        </div>

        <div className="flex-1">
          <p className={cn("text-xl font-bold", cfg.color)}>{cfg.label}</p>
          <p className="text-gray-500 text-sm mt-1">{cfg.description}, as rated by the Food Standards Agency</p>
          {date && (
            <p className="text-gray-400 text-xs mt-2">
              Last inspected: {new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          {/* Score bar */}
          {!isNaN(numRating) && (
            <div className="flex gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    n <= numRating
                      ? numRating >= 4 ? "bg-green-400" : numRating === 3 ? "bg-yellow-400" : "bg-red-400"
                      : "bg-gray-100"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* If unclaimed — invite them to manage it */}
      {!claimed && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-gray-400 text-xs">Own <strong className="text-gray-600">{name}</strong>? Claim your listing to manage how this rating is displayed.</p>
          <Link href="/claim-listing" className="flex-shrink-0 ml-4 text-blue-600 text-xs font-semibold hover:underline">
            Claim →
          </Link>
        </div>
      )}
    </div>
  );
}

function HygieneSidebar({ rating, date, claimed, show, fhrsId }: {
  rating: string | null; date: Date | null; claimed: boolean; show: boolean; fhrsId: string | null;
}) {
  if (claimed && !show) return null;
  if (!rating) return null;

  const cfg = HYGIENE_CONFIG[rating];
  if (!cfg) return null;
  const numRating = parseInt(rating);

  return (
    <div className={cn("rounded-xl border p-4", cfg.bg, cfg.border)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {cfg.icon}
          <span className={cn("font-semibold text-sm", cfg.color)}>Food Hygiene</span>
        </div>
        <a
          href={fsaUrl(fhrsId)}
          target="_blank"
          rel="noopener noreferrer"
          title={fhrsId ? "View on food.gov.uk" : "Food Standards Agency"}
          className="text-gray-400 text-xs hover:underline"
        >
          FSA ↗
        </a>
      </div>
      <p className={cn("font-bold text-base", cfg.color)}>{cfg.label}</p>
      {date && (
        <p className="text-gray-500 text-xs mt-1">
          Inspected {new Date(date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
        </p>
      )}
      {!isNaN(numRating) && (
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={cn("h-2 flex-1 rounded-full",
              n <= numRating
                ? numRating >= 4 ? "bg-green-400" : numRating === 3 ? "bg-yellow-400" : "bg-red-400"
                : "bg-white/60 border border-white"
            )} />
          ))}
        </div>
      )}
      {!claimed && (
        <Link href="/claim-listing" className={cn("block text-center text-xs font-semibold px-3 py-1.5 rounded-lg mt-3 transition",
          numRating >= 4 ? "bg-green-600 text-white hover:bg-green-700"
          : numRating === 3 ? "bg-yellow-500 text-white hover:bg-yellow-600"
          : "bg-red-600 text-white hover:bg-red-700"
        )}>
          Claim to manage →
        </Link>
      )}
    </div>
  );
}

// ─── Opening Hours ────────────────────────────────────────────────────────

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function OpeningHours({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return null;
  const hours = data as { weekdayText?: string[]; periods?: Array<{ open: { day: number; time: string }; close?: { day: number; time: string } }> };

  if (hours.weekdayText?.length) {
    const today = new Date().getDay();
    const reordered = [...hours.weekdayText.slice(1), hours.weekdayText[0]];
    const todayIndex = today === 0 ? 6 : today - 1;
    return (
      <ul className="space-y-0.5">
        {reordered.map((line, i) => {
          const colonIdx = line.indexOf(": ");
          const day = line.slice(0, colonIdx);
          const time = line.slice(colonIdx + 2);
          const isToday = i === todayIndex;
          return (
            <li key={day} className={cn("flex justify-between text-sm py-1 px-2 rounded", isToday ? "bg-blue-50 font-semibold text-blue-800" : "text-gray-600")}>
              <span className="w-24 flex-shrink-0">{day}</span>
              <span className="text-right text-xs leading-relaxed">{time}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (hours.periods?.length) {
    const fmt = (t: string) => {
      const h = parseInt(t.slice(0, 2)), m = t.slice(2);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${h12}:${m} ${ampm}`;
    };
    return (
      <ul className="space-y-1">
        {hours.periods.map((p, i) => (
          <li key={i} className="flex justify-between text-sm text-gray-600">
            <span>{DAY_NAMES[p.open.day]}</span>
            <span>{fmt(p.open.time)}{p.close ? ` – ${fmt(p.close.time)}` : " (24h)"}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm text-gray-400">Hours not available</p>;
}

// ─── Parking busy guide ───────────────────────────────────────────────────

type BusyLevel = "high" | "medium" | "low";
type BusyPeriod = { label: string; level: BusyLevel };

function getParkingBusyGuide(name: string, tags: string[], postcode: string): {
  periods: BusyPeriod[];
  note: string;
} | null {
  const n = name.toLowerCase();
  const pc = postcode.toUpperCase();

  // National Trust Formby — always in demand on weekends
  if (n.includes('national trust') || n.includes('lifeboat road') || n.includes('victoria road woodland')) {
    return {
      periods: [
        { label: "Summer weekend", level: "high" },
        { label: "Summer weekday", level: "medium" },
        { label: "Winter weekend", level: "low" },
      ],
      note: "Fills early on sunny weekends — often full by 10am in July and August. Book via the NT app in advance. Victoria Road car park is a good overflow if Lifeboat Road is full.",
    };
  }

  // Seafront / beach car parks
  if (n.includes('marine drive') || n.includes('esplanade') || n.includes('promenade') || n.includes('seafront')) {
    return {
      periods: [
        { label: "Summer weekend", level: "high" },
        { label: "Summer weekday", level: "medium" },
        { label: "Winter", level: "low" },
      ],
      note: "Can fill up fast on warm summer days, especially during events. Arrive before 10am on sunny Saturdays to be safe.",
    };
  }

  // Ainsdale Beach
  if (n.includes('ainsdale beach')) {
    return {
      periods: [
        { label: "Summer weekend", level: "high" },
        { label: "Summer weekday", level: "medium" },
        { label: "Winter", level: "low" },
      ],
      note: "Quieter than the main hubs but still gets busy on good summer days. Informal overflow parking available on the approach road.",
    };
  }

  // Town centre multi-storey / NCP
  if (n.includes('ncp') || n.includes('multi storey') || n.includes('multi-storey') || n.includes('tulketh')) {
    return {
      periods: [
        { label: "Saturday daytime", level: "high" },
        { label: "Weekday daytime", level: "medium" },
        { label: "Evening / Sunday", level: "low" },
      ],
      note: "Busiest on Saturday mornings during peak shopping hours. Generally quieter in the evenings and on Sundays. Covered, so a reliable option regardless of weather.",
    };
  }

  // Town centre general (PR8 1, PR9 0)
  if (pc.startsWith('PR8 1') || pc.startsWith('PR9 0')) {
    return {
      periods: [
        { label: "Weekend / events", level: "medium" },
        { label: "Weekday daytime", level: "medium" },
        { label: "Evening", level: "low" },
      ],
      note: "Town centre parking can be competitive during events and festivals. Worth checking for events before you visit in summer.",
    };
  }

  // Station car parks
  if (n.includes('station') || n.includes('park & ride') || n.includes('park and ride')) {
    return {
      periods: [
        { label: "Weekday commute", level: "medium" },
        { label: "Weekend", level: "low" },
        { label: "Off-peak", level: "low" },
      ],
      note: "Mainly used by commuters on weekday mornings. Usually plenty of space at weekends.",
    };
  }

  // RSPB / nature reserves
  if (n.includes('rspb') || n.includes('marshside') || n.includes('botanic')) {
    return {
      periods: [
        { label: "Weekend morning", level: "medium" },
        { label: "Weekday", level: "low" },
      ],
      note: "Rarely gets fully packed but can be busy during birdwatching events or organised walks. Free and usually straightforward to find a space.",
    };
  }

  return null;
}

const BUSY_COLOURS: Record<BusyLevel, { bg: string; text: string; bar: string; label: string }> = {
  high:   { bg: "bg-red-50",    text: "text-red-700",    bar: "bg-red-400",    label: "Busy" },
  medium: { bg: "bg-amber-50",  text: "text-amber-700",  bar: "bg-amber-400",  label: "Moderate" },
  low:    { bg: "bg-green-50",  text: "text-green-700",  bar: "bg-green-400",  label: "Usually quiet" },
};

const CAT_EMOJI: Record<string, string> = {
  restaurants: "🍽️", cafes: "☕", "bars-nightlife": "🍺",
  attractions: "🎡", "beaches-parks": "🏖️", shopping: "🛍️", activities: "🏄",
};
