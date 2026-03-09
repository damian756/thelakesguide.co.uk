import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, isValidCategory } from "@/lib/config";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import { prisma } from "@/lib/prisma";
import CategoryBrowser, { type BrowserBusiness } from "@/components/CategoryBrowser";
import type { MapPin as MapPinType } from "@/components/CategoryMapTypes";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; area?: string }>;
};

// ── Category config ──────────────────────────────────────────────────────────

const THEMES: Record<string, { gradient: string; accent: string; emoji: string; tagline: string; heroPos: string }> = {
  walks:        { gradient: "from-[#2A6B8A] to-[#245E3F]", accent: "#245E3F", emoji: "🥾", tagline: "Walks and hiking routes in the Lake District", heroPos: "center 20%" },
  villages:     { gradient: "from-[#2A3F5C] to-[#3A5070]", accent: "#3A4F6B", emoji: "🏘️", tagline: "Villages and towns in the Lake District", heroPos: "center" },
  restaurants:  { gradient: "from-[#8B2635] to-[#C94B3B]", accent: "#C94B3B", emoji: "🍽️", tagline: "The best places to eat in the Lake District", heroPos: "center 75%" },
  cafes:         { gradient: "from-[#6B3A1F] to-[#A06040]", accent: "#8B5E3C", emoji: "☕", tagline: "Great coffee, cafes and tea rooms", heroPos: "center 35%" },
  pubs:         { gradient: "from-[#3D1A5C] to-[#6B3AA0]", accent: "#5B2D8A", emoji: "🍺", tagline: "Pubs and inns in the Lake District", heroPos: "center 5%" },
  activities:   { gradient: "from-[#0D6E6E] to-[#0F9B8E]", accent: "#0D6E6E", emoji: "🏄", tagline: "Sport, leisure and outdoor activities", heroPos: "center" },
  attractions:  { gradient: "from-[#5C2A6B] to-[#8B3AA0]", accent: "#6B3A7A", emoji: "🏛️", tagline: "Dove Cottage, Hill Top, Brockhole, Lakes Aquarium and more", heroPos: "center" },
  accommodation: { gradient: "from-[#14231C] to-[#245E3F]", accent: "#245E3F", emoji: "🏨", tagline: "Where to stay in the Lake District", heroPos: "center" },
  shopping:     { gradient: "from-[#8B2847] to-[#C45C6A]", accent: "#C45C6A", emoji: "🛍️", tagline: "Shops, boutiques and markets", heroPos: "center" },
};

const CAT_ORDER = [
  "walks", "villages", "restaurants", "cafes", "pubs",
  "activities", "attractions", "accommodation", "shopping",
];

const CATEGORY_GUIDES: Record<string, { href: string; label: string }[]> = {
  restaurants: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections", label: "Collections" },
  ],
  cafes: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections", label: "Collections" },
  ],
  pubs: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections/dog-friendly-pubs-lake-district", label: "Dog-Friendly Pubs" },
  ],
  activities: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections", label: "Collections" },
  ],
  accommodation: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections/accommodation-with-parking-lake-district", label: "Accommodation with Parking" },
  ],
  shopping: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections", label: "Collections" },
  ],
  walks: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections/free-things-to-do-lake-district", label: "Free Things to Do" },
  ],
  villages: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/collections", label: "Collections" },
  ],
  attractions: [
    { href: "/things-to-do", label: "Things to Do in the Lake District" },
    { href: "/guides/lake-district-with-kids", label: "Lake District with Kids" },
  ],
};

const CATEGORY_CONTENT: Record<string, string[]> = {
  "walks": [
    "Most people come for the walking. The fells, the lakes, the views. Scafell Pike, Helvellyn, Catbells. The 214 Wainwrights draw completionists from around the world. There are routes for every level, from gentle lakeside strolls to serious mountain days.",
    "The National Trust and Lake District National Park maintain paths and waymarking. Check conditions before heading onto the high fells. Weather changes fast. Grizedale Forest has family-friendly trails. Tarn Hows is a classic easy loop with proper views.",
    "Worth knowing: popular routes like Catbells and Helvellyn get busy in summer. Go early or pick a quieter fell. The bus is a good way to avoid parking fees at the busiest spots.",
  ],
  "villages": [
    "Ambleside, Keswick, Grasmere, Windermere, Bowness. Each has its own character. Ambleside is the walkers' hub. Keswick has the best outdoor shops and Derwentwater on the doorstep. Grasmere is Wordsworth and gingerbread. Windermere and Bowness are the busiest, with the steamers and most of the tourist infrastructure.",
    "Smaller villages like Hawkshead, Coniston, and Glenridding are worth the drive. Hawkshead has Beatrix Potter connections. Coniston has the Old Man and the Ruskin Museum. Glenridding is the start of Helvellyn and the Ullswater steamer.",
    "Worth knowing: village car parks fill early on summer weekends. Arrive before 10am or use the bus. The 555 runs the length of the A591 and connects the main centres.",
  ],
  "restaurants": [
    "The Lake District has more good food than it gets credit for. Ambleside and Keswick have the best concentration of independents. The Drunken Duck, The Old Stamp House, and The Cottage in the Wood are the ones that get mentioned when people want a proper meal. Book ahead at weekends.",
    "Village pubs do solid food. Many are walker-friendly with boots and dogs welcome. The bigger hotels (Gilpin, Linthwaite House) have restaurants that are worth the splurge if you're celebrating.",
    "Worth knowing: the busier spots fill up quickly in peak season. Book ahead or eat early. Lunch is often easier than dinner if you're flexible.",
  ],
  "cafes": [
    "Every village has at least one decent café. Grasmere has the famous gingerbread shop. Ambleside and Keswick have the best coffee. The NT cafés at Tarn Hows and Grizedale are reliable for post-walk cake.",
    "Tea rooms are everywhere. The slower pace suits the Lakes. Many are dog-friendly. Worth knowing: the popular ones get queues on rainy days. Go early or pick a quieter spot.",
    "For a proper sit-down, the bigger villages have options. Ambleside's Zeffirellis does good vegetarian. Keswick has a solid range. Windermere and Bowness are busier and more tourist-focused.",
  ],
  "pubs": [
    "The Lake District does pubs well. Walkers, dogs, muddy boots. The Kirkstile Inn, The Drunken Duck, The Mortal Man. Proper food, local ales, and the kind of atmosphere that makes you want to stay.",
    "Keswick has a good run of pubs. Ambleside and Grasmere too. The smaller villages often have one standout. Worth booking at weekends in summer.",
    "Worth knowing: many pubs stop serving food by 9pm. If you're coming off the fells late, call ahead. Dog-friendly is the norm, but always check if you're unsure.",
  ],
  "activities": [
    "Walking is the main draw, but there's more. Windermere and Coniston have steamers. Ullswater too. Paddleboarding, kayaking, and sailing are available on the main lakes. Grizedale has mountain biking and Go Ape.",
    "Brockhole on Windermere is the main family attraction. Adventure activities, gardens, lake access. The Ravenglass and Eskdale Railway is a proper day out. Honister Slate Mine does via ferrata for the adventurous.",
    "Worth knowing: water sports and boat hire get booked up in summer. Book ahead. The steamers run year-round but with reduced schedules in winter.",
  ],
  "attractions": [
    "Dove Cottage, Hill Top, Brockhole, Lakes Aquarium, Haverthwaite Railway, World of Beatrix Potter, Honister Slate Mine. The Lake District has a solid mix of heritage and family attractions.",
    "Dove Cottage in Grasmere is Wordsworth's home. Hill Top near Sawrey is Beatrix Potter's. Both need booking. Brockhole on Windermere is the main family day out. Lakes Aquarium at the southern end of Windermere is good for wet weather.",
    "Worth knowing: the heritage sites get busy in summer. Book ahead. Honister Slate Mine does tours and via ferrata. The Ravenglass and Eskdale Railway is a proper day out for families.",
  ],
  "accommodation": [
    "The Lake District has everything from bunkhouses to five-star hotels. Ambleside, Keswick, and Windermere have the biggest range. Grasmere and Coniston are quieter. The Gilpin and Linthwaite House are the splurge options. B&Bs and inns are the backbone.",
    "If you're here for The Open 2026 at Royal Birkdale, accommodation in the Lakes fills up. It's a drive to the course but a lot of visitors base themselves here for the week. Book early.",
    "Worth knowing: peak season (Easter, summer holidays, half terms) books out months ahead. Flexible on dates? Spring and autumn are quieter and often better for walking.",
  ],
  "shopping": [
    "Keswick has the best outdoor shops. George Fisher, Cotswold Outdoor, and a cluster of independents. Ambleside has a good range too. If you need gear, that's where to go.",
    "Grasmere has the gingerbread shop and a few independents. Hawkshead has Beatrix Potter connections and gift shops. Windermere and Bowness are more tourist-focused with the usual mix.",
    "Worth knowing: the outdoor shops know their stuff. If you're unsure about a route or conditions, ask. They'll give you honest advice.",
  ],
};

const FOOD_CATS = new Set(["restaurants", "cafes", "pubs", "accommodation", "activities"]);

// ── Area definitions ─────────────────────────────────────────────────────────

const AREAS: { key: string; label: string; test: (addr: string, pc: string) => boolean }[] = [
  { key: "windermere", label: "Windermere", test: (addr, pc) => pc.startsWith("LA23") || addr.includes("Windermere") || addr.includes("Bowness") },
  { key: "ambleside",  label: "Ambleside",  test: (addr, pc) => pc.startsWith("LA22") || addr.includes("Ambleside") },
  { key: "keswick",    label: "Keswick",    test: (addr, pc) => pc.startsWith("CA12") || addr.includes("Keswick") },
  { key: "grasmere",   label: "Grasmere",  test: (addr, pc) => addr.includes("Grasmere") },
  { key: "coniston",   label: "Coniston",  test: (addr, pc) => pc.startsWith("LA21") || addr.includes("Coniston") },
  { key: "hawkshead",  label: "Hawkshead", test: (addr, pc) => addr.includes("Hawkshead") },
  { key: "kendal",     label: "Kendal",    test: (addr, pc) => pc.startsWith("LA9") || addr.includes("Kendal") },
  { key: "glenridding", label: "Glenridding", test: (addr, pc) => addr.includes("Glenridding") || addr.includes("Patterdale") },
];

function matchesArea(address: string, postcode: string, areaKey: string): boolean {
  const def = AREAS.find((a) => a.key === areaKey);
  if (!def) return true;
  return def.test(address, postcode);
}

// ── Dynamic rendering (DB-dependent, uses searchParams) ──────────────────────

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.thelakesguide.co.uk";

// Per-category meta description overrides — more specific than the generic template
const CAT_META_DESCRIPTIONS: Partial<Record<string, string>> = {
  activities: "Kayaking, sailing, walking, mountain biking in the Lake District. Browse all activity listings with ratings and contact details on TheLakesGuide.co.uk.",
  accommodation: "Hotels, B&Bs and holiday lets in the Lake District. Find every place to stay with Google ratings and availability. Book early for summer.",
  restaurants: "Restaurants in the Lake District. Italian, pub grub, fine dining. Browse every restaurant with Google ratings and booking links on TheLakesGuide.co.uk.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category" };
  const theme = THEMES[category];
  const title = `${cat.name} in the Lake District`;
  const description = CAT_META_DESCRIPTIONS[category]
    ?? `${theme?.tagline || cat.description}. Browse all listings with Google ratings, food hygiene scores and contact details on TheLakesGuide.co.uk`;
  const url = `${BASE_URL}/${category}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "TheLakesGuide.co.uk" },
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

  // ItemList schema — top 15 listings by rating
  const top15 = filteredBusinesses
    .slice(0, 15)
    .map((b, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      url: `${BASE_URL}/${category}/${b.slug}`,
      name: b.name,
    }));
  const itemListLd =
    top15.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${cat.name} in the Lake District`,
          description: theme.tagline,
          url: `${BASE_URL}/${category}`,
          numberOfItems: top15.length,
          itemListElement: top15,
        }
      : null;

  return (
    <>
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
    <div className="min-h-screen bg-[#EAEDE8]">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
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
                <span className="text-white/50 font-normal"> in the Lake District</span>
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
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
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
                <p className="text-xs font-bold uppercase tracking-widest text-[#C4782A] mb-4">Related Guides</p>
                <div className="flex flex-wrap gap-3">
                  {CATEGORY_GUIDES[category].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="inline-flex items-center gap-1.5 bg-[#EAEDE8] hover:bg-[#14231C] text-[#14231C] hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-gray-100 hover:border-[#14231C]"
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
                  List for free and get discovered by thousands of visitors planning their Lake District trip.
                </p>
                <Link href="/claim-listing" className="inline-block bg-[#C4782A] hover:bg-[#E8B87A] text-white px-7 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg">
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
