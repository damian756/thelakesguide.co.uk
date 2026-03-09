import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, isValidCategory } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import CategoryBrowser, { type BrowserBusiness } from "@/components/CategoryBrowser";
import type { MapPin as MapPinType } from "@/components/CategoryMapTypes";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; area?: string }>;
};

// ── Category config ──────────────────────────────────────────────────────────

const THEMES: Record<string, { gradient: string; accent: string; emoji: string; tagline: string; heroPos: string }> = {
  restaurants:      { gradient: "from-[#8B2635] to-[#C94B3B]", accent: "#C94B3B", emoji: "🍽️", tagline: "The best places to eat in Southport", heroPos: "center 75%" },
  hotels:           { gradient: "from-[#1B2E4B] to-[#2A4A73]", accent: "#1B2E4B", emoji: "🏨", tagline: "Where to stay in Southport", heroPos: "center" },
  "bars-nightlife": { gradient: "from-[#3D1A5C] to-[#6B3AA0]", accent: "#5B2D8A", emoji: "🍺", tagline: "Pubs, bars and nightlife in Southport", heroPos: "center 5%" },
  cafes:            { gradient: "from-[#6B3A1F] to-[#A06040]", accent: "#8B5E3C", emoji: "☕", tagline: "Great coffee, cafes and tea rooms", heroPos: "center 35%" },
  attractions:      { gradient: "from-[#1A5C5B] to-[#2E8B7A]", accent: "#2E7D6E", emoji: "🎡", tagline: "Southport's attractions, venues and visitor experiences", heroPos: "center 20%" },
  "beaches-parks":  { gradient: "from-[#1A5C7A] to-[#1E8AB0]", accent: "#1A6B8A", emoji: "🏖️", tagline: "Beautiful beaches and open spaces", heroPos: "center 15%" },
  golf:             { gradient: "from-[#1A4020] to-[#2E6830]", accent: "#2C5F2E", emoji: "⛳", tagline: "World-class golf courses near Southport", heroPos: "center 20%" },
  shopping:         { gradient: "from-[#8B2847] to-[#C45C6A]", accent: "#C45C6A", emoji: "🛍️", tagline: "Shops, boutiques and markets", heroPos: "center" },
  wellness:         { gradient: "from-[#4A2060] to-[#7B3FAA]", accent: "#6B4C8B", emoji: "💆", tagline: "Spas, salons and wellness in Southport", heroPos: "center" },
  activities:       { gradient: "from-[#0D6E6E] to-[#0F9B8E]", accent: "#0D6E6E", emoji: "🏄", tagline: "Sport, leisure and outdoor activities", heroPos: "center" },
  transport:        { gradient: "from-[#2A3F5C] to-[#3A5070]", accent: "#3A4F6B", emoji: "🚌", tagline: "Getting around Southport", heroPos: "center" },
  parking:          { gradient: "from-[#1C3148] to-[#2E4A6A]", accent: "#2E4A6A", emoji: "🅿️", tagline: "Car parks and parking across Southport and the Sefton Coast", heroPos: "center" },
};

const CAT_ORDER = [
  "restaurants", "hotels", "bars-nightlife", "cafes",
  "attractions", "golf", "shopping", "beaches-parks",
  "wellness", "activities", "transport", "parking",
];

const CATEGORY_GUIDES: Record<string, { href: string; label: string }[]> = {
  "restaurants": [
    { href: "/guides/southport-eateries", label: "Where to Eat in Southport" },
    { href: "/guides/best-restaurants-southport", label: "Best Restaurants Guide" },
    { href: "/guides/birkdale-village", label: "Birkdale Village" },
  ],
  "cafes": [
    { href: "/guides/best-cafes-southport", label: "Best Cafés Guide" },
    { href: "/guides/southport-eateries", label: "Where to Eat in Southport" },
    { href: "/guides/lord-street", label: "Lord Street" },
  ],
  "beaches-parks": [
    { href: "/guides/southport-beach", label: "Southport Beach Guide" },
    { href: "/guides/southport-pier", label: "Southport Pier Guide" },
  ],
  "attractions": [
    { href: "/things-to-do", label: "Things to Do in Southport" },
    { href: "/guides/southport-pier", label: "Southport Pier Guide" },
    { href: "/guides/southport-beach", label: "Southport Beach Guide" },
  ],
  "golf": [
    { href: "/the-open-2026", label: "The Open 2026 Visitor Guide" },
    { href: "/guides/birkdale-village", label: "Birkdale Village" },
  ],
  "hotels": [
    { href: "/the-open-2026/accommodation", label: "Open 2026 Accommodation Guide" },
    { href: "/things-to-do", label: "Things to Do in Southport" },
    { href: "/guides/birkdale-village", label: "Birkdale Village" },
  ],
  "parking": [
    { href: "/guides/parking-southport", label: "Southport Parking Guide" },
    { href: "/guides/free-parking-southport", label: "Free Parking in Southport" },
  ],
  "activities": [
    { href: "/things-to-do", label: "Things to Do in Southport" },
    { href: "/guides/southport-beach", label: "Southport Beach Guide" },
  ],
  "shopping": [
    { href: "/guides/lord-street", label: "Lord Street Guide" },
    { href: "/guides/birkdale-village", label: "Birkdale Village Guide" },
  ],
};

const CATEGORY_CONTENT: Record<string, string[]> = {
  "restaurants": [
    "Lord Street is the obvious starting point for eating out in Southport — it runs through the town centre and has a good mix of options at most price points. Bistrot Verite in Birkdale is the one that gets mentioned most when people want a proper meal, and it's worth booking ahead. Bistro Bar Med and The Vincent are solid choices if you want something central.",
    "The town has more independent restaurants than you'd expect — particularly on and around Lord Street and Chapel Street. If you're after Indian or Asian food, you've got a decent range and most places are very reasonably priced.",
    "Worth knowing: the busier spots on Lord Street fill up quickly at weekends, particularly if there's an event on at Southport Theatre. Book ahead or go early.",
  ],
  "hotels": [
    "Southport has a good range of places to stay — from The Bold Hotel on Lord Street (the nicest in town by most accounts) to seafront B&Bs and a clutch of chain hotels near the retail park. The Scarisbrick Hotel is the historic option on Lord Street if you want somewhere with character.",
    "If you're here for The Open 2026 at Royal Birkdale, accommodation books out fast — months in advance for tournament week. Get in early. Birkdale village (walking distance from the course) is the most practical base, but the whole town fills up.",
    "For a quieter stay, Churchtown is worth considering — it's the old village end of Southport, much calmer than the seafront, and still only about 10 minutes from the town centre.",
  ],
  "bars-nightlife": [
    "Southport's nightlife is mostly concentrated around Neville Street and the town centre — it's a proper night-out town when it gets going. Sinclairs is one of the long-standing locals' favourites. Thatch and Thistle is popular too, particularly earlier in the evening.",
    "Lord Street has a good run of bars and restaurants that work well for a lower-key evening — cocktails and food rather than clubs. If you want to keep going later, the town centre has options.",
    "Worth knowing: weekend nights in Southport get properly busy in summer. If you're visiting in peak season and want somewhere specific, arrive early or book where you can.",
  ],
  "cafes": [
    "Southport does good coffee. There are independent cafes along Lord Street and in the side streets around it — worth exploring if you're spending a day in town. Cibo on Lord Street comes up regularly as a local favourite.",
    "Over at the seafront end, there are plenty of spots to grab a coffee with a sea view — quality varies but the setting makes up for a lot.",
    "For tea rooms and a slower pace, Churchtown village is worth the short drive — it's got that quieter, more village feel that can be hard to find in the town centre on a busy day.",
  ],
  "attractions": [
    "Southport has more to keep you busy than most people expect. The Botanic Gardens in Churchtown are free, genuinely lovely, and rarely crowded. Southport Pier is one of the longest in England — worth a walk, especially if the weather's decent.",
    "Adventure Coast Southport (formerly Pleasureland) is the obvious family draw — fairground rides, free entry with pay-per-ride. Combine it with the beach and a walk along the seafront and you've got a solid day out without spending much.",
    "The Atkinson on Lord Street is the arts centre and local museum — free entry, good exhibitions, and a decent café. Worth an hour if the weather turns.",
  ],
  "beaches-parks": [
    "Southport Beach is broad, sandy, and free — you can drive onto part of it, which is very useful if you've got kids and a lot of kit. The sea goes out a long way at low tide; it's not always swimmable, but as a beach for walking and messing about on, it's brilliant.",
    "Victoria Park hosts the big events — Southport Flower Show, air shows, the food festival. If one of those is on when you're visiting, the park is worth seeing at its best.",
    "The Marine Lake is a calmer alternative to the open beach — separated from the sea by the promenade, much flatter water. Good for paddleboarding and kayaking; the Watersports Centre is based there.",
  ],
  "golf": [
    "Southport is one of the best places to play golf in England — no exaggeration. Royal Birkdale is the headline act, one of the Open Championship venues and hosting The Open again in summer 2026. Getting on as a visitor requires forward planning and a handicap certificate, but it's possible.",
    "Formby Golf Club is about 15 minutes south and considered one of the finest heathland links courses in the country — slightly more straightforward to book as a visitor than Royal Birkdale. Southport Old Links, Hillside Golf Club, and Southport & Ainsdale are all nearby and all serious courses.",
    "If you're a golfer visiting the area, this stretch of the Sefton Coast is genuinely exceptional and underrated by most people outside the golfing community. Plan a few days and work your way around them.",
  ],
  "shopping": [
    "Lord Street is the main shopping strip — a long Victorian boulevard with covered arcades, a mix of independents and some chains. It's one of the nicest high streets in the north west, worth a stroll even if you're not buying anything.",
    "The Wayfarers Arcade is the best of the covered arcades — independent shops, antiques, a bit eclectic. Worth a browse on a rainy afternoon. The Market is useful for fresh food and local produce.",
    "Cambridge Walks and the side streets off Lord Street are where you'll find most of the boutiques and independents. Hirshmans on Chapel Street has been going for years and is reliable for pharmacy and travel essentials.",
  ],
  "wellness": [
    "Southport has a decent number of salons, spas and wellness places, mostly dotted around the town centre and Birkdale. If you're staying for a few days, booking a treatment is straightforward. The bigger hotels — The Bold, The Vincent — have spa facilities if you'd rather keep it all in one place.",
    "Day spas and independent beauty salons are scattered throughout town. This directory lists what's available across all areas so you can find what you need based on where you're staying.",
  ],
  "activities": [
    "Things to do in Southport range from the obvious (beach, Pleasureland, the pier) to the less expected. The Marine Lake Watersports Centre does paddleboarding, kayaking and sailing — good fun for adults and kids, no experience needed for most sessions.",
    "Southport is well set up for cycling — the coastal path runs along the seafront and bikes are available to hire locally. It's a flat, easy ride with proper sea views.",
    "For families, Pleasureland is the main draw alongside the beach. The Botanic Gardens in Churchtown have a small zoo and play areas — free entry and much less busy than the seafront on peak days.",
  ],
  "transport": [
    "Southport has a direct train link to Liverpool — about 45 minutes on the Merseyrail Northern line. It runs frequently and is the easiest way in if you're coming from Liverpool or Formby.",
    "By road, the A565 is the main route from Liverpool and Formby. Parking in the town centre is mostly paid — there are car parks off Lord Street and near the seafront. The beach itself has paid parking with reasonable rates for a full day.",
    "Getting around within Southport is straightforward on foot if you're based on Lord Street — the beach, Pleasureland and most of the town centre are walkable. For Churchtown and the golf courses, you'll want a car.",
  ],
  "parking": [
    "Parking in Southport is mostly paid and can get busy in summer — especially on the seafront and near Pleasureland. The Esplanade car park (Sefton Council) on the seafront is the main one. The NCP on London Street is useful for the town centre. There's also on-street parking off Lord Street if you're lucky with timing.",
    "For the beach, the Marine Drive car parks are the most practical. They fill up early on hot Saturdays — arrive before 10am if you want a spot close to the sand. The Southport Marine Drive Car Park has pay-and-display all day.",
    "Over in Formby, the National Trust car parks at Victoria Road (L37 1YH) and Lifeboat Road (L37 2EB) are the main options for the pinewoods and beach. Book via the NT app — the signal in the car park is patchy and there's no paper ticket option. Formby Station Park & Ride on Duke Street is a good alternative if the NT car parks are full.",
  ],
};

const FOOD_CATS = new Set(["restaurants", "cafes", "bars-nightlife", "hotels", "activities"]);

// ── Area definitions ─────────────────────────────────────────────────────────

const AREAS: { key: string; label: string; test: (addr: string, pc: string) => boolean }[] = [
  { key: "town-centre", label: "Town Centre", test: (_, pc) => pc.startsWith("PR8 1") || pc.startsWith("PR9 0") },
  { key: "birkdale",    label: "Birkdale",    test: (addr, pc) => pc.startsWith("PR8 2") || addr.includes("Birkdale") },
  { key: "ainsdale",    label: "Ainsdale",    test: (addr, pc) => pc.startsWith("PR8 3") || addr.includes("Ainsdale") },
  { key: "seafront",    label: "Seafront",    test: (addr) => ["Promenade", "Marine Drive", "Esplanade", "Ocean Plaza"].some((s) => addr.toLowerCase().includes(s.toLowerCase())) },
  { key: "churchtown",  label: "Churchtown",  test: (addr, pc) => pc.startsWith("PR9 7") || pc.startsWith("PR9 9") || addr.includes("Churchtown") },
  { key: "crossens",    label: "Crossens",    test: (addr, pc) => pc.startsWith("PR9 8") || addr.includes("Crossens") || addr.includes("Marshside") },
  { key: "formby",      label: "Formby",      test: (addr, pc) => addr.includes("Formby") || pc.startsWith("L37") || pc.startsWith("PR6") },
];

function matchesArea(address: string, postcode: string, areaKey: string): boolean {
  const def = AREAS.find((a) => a.key === areaKey);
  if (!def) return true;
  return def.test(address, postcode);
}

// ── Dynamic rendering (DB-dependent, uses searchParams) ──────────────────────

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.southportguide.co.uk";

// Per-category meta description overrides — more specific than the generic template
const CAT_META_DESCRIPTIONS: Partial<Record<string, string>> = {
  parking: "Car parks and parking across Southport, Formby and the Sefton Coast. Free and paid options with postcodes, directions, and how busy they get on peak days — all on SouthportGuide.",
  attractions: "Browse Southport's attractions — The Atkinson, Adventure Coast, Marine Lake, Southport Pier, Botanic Gardens, and more. Listings with Google ratings, opening times and directions.",
  activities: "Watersports on Marine Lake, coastal cycling, walking the Sefton Coastal Path, horse riding, and outdoor leisure in Southport. Browse all activity listings with ratings and contact details.",
  hotels: "Hotels in Southport — from The Vincent and The Bold Hotel on Lord Street to B&Bs in Birkdale and budget chains. Find every hotel with Google ratings, walking times from the beach, and availability. Booking early is essential for The Open 2026.",
  restaurants: "Restaurants in Southport — Italian, Indian, seafood, brunch and Sunday lunch. Browse every restaurant with Google ratings, menus and booking links. From Bistrot Verite in Birkdale to Lord Street dining.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category" };
  const theme = THEMES[category];
  const title = `${cat.name} in Southport`;
  const description = CAT_META_DESCRIPTIONS[category]
    ?? `${theme?.tagline || cat.description} — browse all listings with Google ratings, food hygiene scores and contact details on SouthportGuide.co.uk`;
  const url = `${BASE_URL}/${category}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "SouthportGuide.co.uk" },
    twitter: { card: "summary", title, description },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { sort, area } = await searchParams;
  if (!isValidCategory(category)) notFound();

  const cat = getCategoryBySlug(category)!;
  const theme = THEMES[category] || THEMES.restaurants;
  const isFoodCat = FOOD_CATS.has(category);
  let businesses: BrowserBusiness[] = [];
  let boostedIds: string[] = [];

  try {
    const categoryRecord = await prisma.category.findFirst({ where: { slug: category } });
    if (categoryRecord) {
      const catId = categoryRecord.id;
      const now = new Date();
      const activeBoosts = await prisma.listingBoost.findMany({
        where: {
          categoryId: catId,
          status: "active",
          startsAt: { lte: now },
          endsAt: { gte: now },
        },
        select: { businessId: true, label: true },
      });
      boostedIds = activeBoosts.map((b) => b.businessId);

      if (sort === "alpha") {
        businesses = await prisma.$queryRaw<BrowserBusiness[]>`
          SELECT id, slug, name, "shortDescription", description, "listingTier", address, postcode,
                 rating, "reviewCount", "priceRange", "hygieneRating", "hygieneRatingShow", lat, lng,
                 images[1] AS "firstImage"
          FROM "Business"
          WHERE "categoryId" = ${catId} OR ${catId} = ANY("secondaryCategoryIds")
          ORDER BY name ASC
        `;
      } else if (sort === "hygiene") {
        businesses = await prisma.$queryRaw<BrowserBusiness[]>`
          SELECT id, slug, name, "shortDescription", description, "listingTier", address, postcode,
                 rating, "reviewCount", "priceRange", "hygieneRating", "hygieneRatingShow", lat, lng,
                 images[1] AS "firstImage"
          FROM "Business"
          WHERE "categoryId" = ${catId} OR ${catId} = ANY("secondaryCategoryIds")
          ORDER BY
            CASE WHEN "hygieneRating" ~ '^[0-9]+$' THEN CAST("hygieneRating" AS INTEGER) ELSE -1 END DESC,
            (COALESCE(rating, 0) * LOG(COALESCE("reviewCount", 0) + 1)) DESC, name ASC
        `;
      } else if (sort === "google") {
        businesses = await prisma.$queryRaw<BrowserBusiness[]>`
          SELECT id, slug, name, "shortDescription", description, "listingTier", address, postcode,
                 rating, "reviewCount", "priceRange", "hygieneRating", "hygieneRatingShow", lat, lng,
                 images[1] AS "firstImage"
          FROM "Business"
          WHERE "categoryId" = ${catId} OR ${catId} = ANY("secondaryCategoryIds")
          ORDER BY
            CASE "listingTier" WHEN 'premium' THEN 1 WHEN 'featured' THEN 2 WHEN 'standard' THEN 3 ELSE 4 END ASC,
            COALESCE(rating, 0) DESC, COALESCE("reviewCount", 0) DESC, name ASC
        `;
      } else {
        businesses = await prisma.$queryRaw<BrowserBusiness[]>`
          SELECT id, slug, name, "shortDescription", description, "listingTier", address, postcode,
                 rating, "reviewCount", "priceRange", "hygieneRating", "hygieneRatingShow", lat, lng,
                 images[1] AS "firstImage"
          FROM "Business"
          WHERE "categoryId" = ${catId} OR ${catId} = ANY("secondaryCategoryIds")
          ORDER BY
            CASE "listingTier" WHEN 'premium' THEN 1 WHEN 'featured' THEN 2 WHEN 'standard' THEN 3 ELSE 4 END ASC,
            (COALESCE(rating, 0) * LOG(COALESCE("reviewCount", 0) + 1)) DESC, name ASC
        `;
      }

      const boostedSet = new Set(boostedIds);
      if (boostedSet.size > 0 && sort !== "alpha" && sort !== "hygiene") {
        businesses = [
          ...businesses.filter((b) => boostedSet.has(b.id)),
          ...businesses.filter((b) => !boostedSet.has(b.id)),
        ];
      }
    }
  } catch { /* DB unavailable — page renders with empty listings */ }

  // Area filter applied server-side (before passing to client)
  const filteredBusinesses = area
    ? businesses.filter((b) => matchesArea(b.address ?? "", b.postcode ?? "", area))
    : businesses;

  // Map pins (only geolocated businesses)
  const mapPins: MapPinType[] = filteredBusinesses
    .filter((b) => b.lat != null && b.lng != null)
    .map((b) => ({
      slug: b.slug, name: b.name, lat: b.lat!, lng: b.lng!,
      rating: b.rating, reviewCount: b.reviewCount, priceRange: b.priceRange,
      listingTier: b.listingTier, address: b.address, category,
    }));

  const activeSort = sort || "default";
  const sortOptions = [
    { key: "default", label: "Best Match" },
    { key: "alpha",   label: "A – Z" },
    { key: "google",  label: "⭐ Google Rating" },
    ...(isFoodCat ? [{ key: "hygiene", label: "🛡️ Hygiene Rating" }] : []),
  ];

  // ItemList schema — top 15 listings (Lakes: no parking category, schema disabled)
  const itemListLd: { "@context": string; "@type": string; name: string; description: string; url: string; numberOfItems: number; itemListElement: { "@type": string; position: number; url: string; name: string }[] } | null = null;

  return (
    <>
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        <div className="absolute inset-0">
          <Image
            src={`/images/categories/${category}.webp`}
            alt="" fill sizes="100vw" quality={80}
            className="object-cover"
            style={{ objectPosition: theme.heroPos }}
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>

        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
          <nav className="flex items-center gap-1.5 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{cat.name}</span>
          </nav>

          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-5xl mb-4 drop-shadow-md">{theme.emoji}</div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <strong>{cat.name}</strong>
                <span className="text-white/50 font-normal"> in Southport</span>
              </h1>
              <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-xl">{theme.tagline}</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
              <div className="font-display text-6xl font-bold text-white/20 leading-none">{filteredBusinesses.length}</div>
              <div className="text-white/35 text-xs uppercase tracking-widest">listings</div>
            </div>
          </div>
        </div>

        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      {/* ── Mobile category strip (hidden on desktop) ─────────────────────── */}
      <div className="lg:hidden container mx-auto px-4 max-w-7xl pt-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-2.5 mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CAT_ORDER.map((slug) => {
              const t = THEMES[slug];
              const c = getCategoryBySlug(slug);
              if (!t || !c) return null;
              const isActive = slug === category;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all border flex-shrink-0 ${
                    isActive ? "text-white border-transparent shadow-sm" : "text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  style={isActive ? { backgroundColor: theme.accent, borderColor: theme.accent } : {}}
                >
                  <span className="text-sm leading-none">{t.emoji}</span>
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Mobile editorial */}
        {CATEGORY_CONTENT[category] && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-4">
            <div className="space-y-2.5">
              {CATEGORY_CONTENT[category].map((para, i) => (
                <p key={i} className="text-gray-600 text-[14px] leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-7xl py-4 lg:py-6">
        <div className="flex gap-6 items-start">

          {/* ── Desktop sidebar ───────────────────────────────────────────── */}
          <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-3">

              {/* Category nav */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Browse</p>
                <nav className="space-y-0.5">
                  {CAT_ORDER.map((slug) => {
                    const t = THEMES[slug];
                    const c = getCategoryBySlug(slug);
                    if (!t || !c) return null;
                    const isActive = slug === category;
                    return (
                      <Link
                        key={slug}
                        href={`/${slug}`}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all font-medium ${
                          isActive ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        style={isActive ? { backgroundColor: theme.accent } : {}}
                      >
                        <span className="text-base leading-none w-5 text-center flex-shrink-0">{t.emoji}</span>
                        {c.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Area filter */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 -rotate-90 opacity-50" /> Area
                </p>
                <div className="space-y-1">
                  <Link
                    href={`/${category}${sort ? `?sort=${sort}` : ""}`}
                    className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      !area ? "text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    style={!area ? { backgroundColor: theme.accent } : {}}
                  >
                    All areas
                    {!area && <span className="text-white/70 text-xs">{filteredBusinesses.length}</span>}
                  </Link>
                  {AREAS.map(({ key, label }) => {
                    const count = businesses.filter((b) => matchesArea(b.address ?? "", b.postcode ?? "", key)).length;
                    return (
                      <Link
                        key={key}
                        href={`/${category}?area=${key}${sort ? `&sort=${sort}` : ""}`}
                        className={`flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          area === key ? "text-white" : "text-gray-600 hover:bg-gray-50"
                        }`}
                        style={area === key ? { backgroundColor: theme.accent } : {}}
                      >
                        {label}
                        <span className={`text-xs ${area === key ? "text-white/70" : "text-gray-400"}`}>{count}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Editorial snippet */}
              {CATEGORY_CONTENT[category] && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {CATEGORY_CONTENT[category][0]}
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <CategoryBrowser
              businesses={filteredBusinesses}
              mapPins={mapPins}
              accentColor={theme.accent}
              themeGradient={theme.gradient}
              emoji={theme.emoji}
              category={category}
              isFoodCat={isFoodCat}
              activeArea={area}
              activeSort={activeSort}
              sortOptions={sortOptions}
              areas={AREAS.map(({ key, label }) => ({ key, label }))}
              currentSort={sort}
              currentArea={area}
              boostedBusinessIds={boostedIds}
            />

            {/* ── Related Guides ──────────────────────────────────────────── */}
            {CATEGORY_GUIDES[category] && (
              <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-4">Related Guides</p>
                <div className="flex flex-wrap gap-3">
                  {CATEGORY_GUIDES[category].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#1B2E4B] text-[#1B2E4B] hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-gray-100 hover:border-[#1B2E4B]"
                    >
                      {label} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── Bottom CTA ──────────────────────────────────────────────── */}
            <div className="mt-10 rounded-2xl overflow-hidden">
              <div className={`bg-gradient-to-br ${theme.gradient} p-8 md:p-10 text-center`}>
                <div className="text-4xl mb-3">{theme.emoji}</div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Own a business in this category?</h3>
                <p className="text-white/70 text-sm mb-6 max-w-sm mx-auto">
                  List for free and get discovered by thousands of visitors planning their Southport trip.
                </p>
                <Link href="/claim-listing" className="inline-block bg-[#C9A84C] hover:bg-[#E8C87A] text-white px-7 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg">
                  Add Your Business →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
