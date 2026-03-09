import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Clock, Star, ChevronRight, Navigation } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ViewTracker } from "@/components/ViewTracker";
import { PostcodeCopy } from "./PostcodeCopy";

type Props = { params: Promise<{ slug: string }> };

const BASE_URL = "https://www.southportguide.co.uk";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatAddress(address: string, postcode: string): string {
  let addr = address.replace(/,?\s*(United Kingdom|UK)$/i, "").trim();
  if (postcode && !addr.includes(postcode)) addr = `${addr}, ${postcode}`;
  return addr;
}

function trackUrl(businessId: string, type: string, dest: string): string {
  return `/api/out?id=${businessId}&type=${type}&url=${encodeURIComponent(dest)}`;
}

function directionsUrl(lat: number | null, lng: number | null, postcode: string): string {
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  if (postcode) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(postcode)}`;
  }
  return "https://www.google.com/maps";
}

// ── Tag helpers ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  "car-park":      "Car park",
  "surface":       "Surface",
  "multi-storey":  "Multi-storey",
  "layby":         "Layby",
  "informal":      "Informal",
  "cycle-parking": "Cycle parking",
  "street-side":   "On-street",
};

function parkingType(tags: string[]): string | null {
  for (const t of tags) if (t in TYPE_LABELS) return TYPE_LABELS[t];
  return null;
}

function isFree(tags: string[], priceRange: string | null): boolean {
  return tags.includes("free-parking") ||
    (!!priceRange && priceRange.toLowerCase() === "free");
}

function isPaid(tags: string[], priceRange: string | null): boolean {
  return tags.includes("pay-and-display") || tags.includes("paid-parking") ||
    (!!priceRange && priceRange.toLowerCase() !== "free" && priceRange !== "");
}

// ── Busy guide ────────────────────────────────────────────────────────────────

type BusyLevel = "high" | "medium" | "low";
type BusyPeriod = { label: string; level: BusyLevel };
type BusyGuide = { periods: BusyPeriod[]; note: string };

const BUSY_CFG: Record<BusyLevel, { dot: string; text: string; label: string; bg: string }> = {
  high:   { dot: "bg-red-500",   text: "text-red-700",   label: "Usually busy",   bg: "bg-red-50" },
  medium: { dot: "bg-amber-400", text: "text-amber-700", label: "Moderate",        bg: "bg-amber-50" },
  low:    { dot: "bg-green-500", text: "text-green-700", label: "Usually quiet",   bg: "bg-green-50" },
};

function getBusyGuide(name: string, tags: string[], postcode: string): BusyGuide | null {
  const n = name.toLowerCase();
  const pc = postcode.toUpperCase();

  if (n.includes("national trust") || n.includes("lifeboat road") || n.includes("victoria road woodland")) {
    return {
      periods: [
        { label: "Summer weekends", level: "high" },
        { label: "Summer weekdays", level: "medium" },
        { label: "Winter", level: "low" },
      ],
      note: "Often full by 10am on sunny summer weekends. Book via the NT app before you arrive — signal in the car park is patchy. Victoria Road is the overflow if Lifeboat Road is full.",
    };
  }
  if (n.includes("marine drive") || n.includes("esplanade") || n.includes("promenade") || n.includes("seafront")) {
    return {
      periods: [
        { label: "Summer weekends", level: "high" },
        { label: "Summer weekdays", level: "medium" },
        { label: "Winter", level: "low" },
      ],
      note: "Gets very busy in summer, especially when events are on at Pleasureland or the Flower Show. Aim to arrive before 10am on sunny Saturdays.",
    };
  }
  if (n.includes("ainsdale beach")) {
    return {
      periods: [
        { label: "Summer weekends", level: "high" },
        { label: "Summer weekdays", level: "medium" },
        { label: "Winter", level: "low" },
      ],
      note: "Quieter than the Southport seafront but still fills up on good summer days. Informal overflow available on the approach road.",
    };
  }
  if (n.includes("ncp") || n.includes("multi storey") || n.includes("multi-storey") || n.includes("tulketh")) {
    return {
      periods: [
        { label: "Saturday daytime", level: "high" },
        { label: "Weekday daytime", level: "medium" },
        { label: "Evenings / Sunday", level: "low" },
      ],
      note: "Busiest on Saturday mornings during peak shopping hours. Generally quieter evenings and Sundays. Covered, so reliable in all weathers.",
    };
  }
  if (pc.startsWith("PR8 1") || pc.startsWith("PR9 0")) {
    return {
      periods: [
        { label: "Weekends / events", level: "medium" },
        { label: "Weekday daytime", level: "medium" },
        { label: "Evenings", level: "low" },
      ],
      note: "Town centre parking can get competitive during events at Southport Theatre or the Flower Show. Worth checking for events before visiting in summer.",
    };
  }
  if (n.includes("station") || n.includes("park & ride") || n.includes("park and ride")) {
    return {
      periods: [
        { label: "Weekday mornings", level: "medium" },
        { label: "Weekends", level: "low" },
        { label: "Off-peak", level: "low" },
      ],
      note: "Mainly used by commuters on weekday mornings. Usually plenty of spaces at weekends.",
    };
  }
  if (n.includes("rspb") || n.includes("marshside") || n.includes("botanic")) {
    return {
      periods: [
        { label: "Weekend mornings", level: "medium" },
        { label: "Weekdays", level: "low" },
      ],
      note: "Rarely fully packed but can be busier during organised events or birdwatching weekends. Generally easy to find a space.",
    };
  }
  return null;
}

// ── Nearby categories ─────────────────────────────────────────────────────────

const CAT_EMOJI: Record<string, string> = {
  restaurants:      "🍽️",
  cafes:            "☕",
  "bars-nightlife": "🍺",
  attractions:      "🎡",
  "beaches-parks":  "🏖️",
  shopping:         "🛍️",
  activities:       "🏄",
};

const FORMBY_CAT_EMOJI: Record<string, string> = {
  restaurants:    "🍽️",
  cafes:          "☕",
  pubs:           "🍺",
  activities:     "🏄",
  accommodation:  "🛏️",
  shopping:       "🛍️",
  "nature-walks": "🌲",
  beaches:        "🏖️",
};

// ── Meta helpers ─────────────────────────────────────────────────────────────

const AREA_ORDER = [
  "Birkdale", "Ainsdale", "Churchtown", "Crossens", "Marshside",
  "Formby", "Ormskirk", "Scarisbrick", "Banks", "Halsall", "Burscough",
];

function extractAreaMeta(address: string): string {
  for (const area of AREA_ORDER) {
    if (address.includes(area)) return area;
  }
  return "Southport";
}

/** Detects auto-generated coordinate-based names like "Car Park (53.64, -3.00)" */
function isCoordinateName(name: string): boolean {
  return /\(\s*-?\d+\.\d+/.test(name);
}

/**
 * Generic single-word area names (e.g. a listing literally named "Southport",
 * "Birkdale", "Ainsdale") add no meaningful signal on their own in a title.
 */
function isGenericAreaName(name: string): boolean {
  const generic = ["southport", "birkdale", "ainsdale", "formby", "churchtown",
                   "ormskirk", "burscough", "crossens", "marshside"];
  return generic.includes(name.trim().toLowerCase());
}

/**
 * Generic type-only names (e.g. "Car Park", "Car Park, Southport", "Parking")
 * that give zero location signal and produce near-identical titles across
 * multiple listings — use street name + postcode instead.
 */
function isGenericTypeName(name: string): boolean {
  // Strip trailing area qualifier ("Car Park, Southport" → "car park")
  const core = name.trim().toLowerCase().replace(/,\s*(southport|birkdale|ainsdale|formby|churchtown|ormskirk|crossens|marshside)\s*$/i, "").trim();
  const generic = [
    "car park", "car parks", "parking", "parking area", "parking spaces",
    "parking space", "pay and display", "pay & display", "pay-and-display",
    "public car park", "public parking",
  ];
  return generic.includes(core);
}

/**
 * Extract the first meaningful street segment from an address string.
 * Returns null if the address starts with a generic or uninformative token.
 */
function extractStreetName(address: string): string | null {
  const first = address.split(",")[0]?.trim() ?? "";
  if (!first || first.length < 3) return null;
  // Skip if the first segment is just a town name or a number on its own
  const lc = first.toLowerCase();
  const skip = ["southport", "birkdale", "ainsdale", "formby", "churchtown",
                "ormskirk", "crossens", "marshside", "uk", "united kingdom"];
  if (skip.includes(lc)) return null;
  if (/^\d+$/.test(lc)) return null;
  return first;
}

/** Normalise common non-ASCII typography that renders as mojibake in SERP snippets. */
function sanitizeMeta(str: string): string {
  return str
    .replace(/[àáâãäå]/gi, (c) => c === c.toUpperCase() ? "A" : "a")
    .replace(/[èéêë]/gi,   (c) => c === c.toUpperCase() ? "E" : "e")
    .replace(/[ìíîï]/gi,   (c) => c === c.toUpperCase() ? "I" : "i")
    .replace(/[òóôõö]/gi,  (c) => c === c.toUpperCase() ? "O" : "o")
    .replace(/[ùúûü]/gi,   (c) => c === c.toUpperCase() ? "U" : "u")
    .replace(/[ýÿ]/gi,     (c) => c === c.toUpperCase() ? "Y" : "y")
    .replace(/[ñ]/gi,      (c) => c === c.toUpperCase() ? "N" : "n")
    .replace(/[ç]/gi,      (c) => c === c.toUpperCase() ? "C" : "c")
    .replace(/[ß]/g, "ss")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u2023\u2219\u25E6\u2043]/g, "-")
    .replace(/[^\x00-\x7E]/g, "");
}

function buildParkingTitle(
  name: string,
  postcode: string,
  address: string,
  tags: string[],
  priceRange: string | null,
): string {
  const cleanName = sanitizeMeta(name);
  const area      = extractAreaMeta(address);
  const loc       = area === "Southport" ? "Southport" : `${area}, Southport`;
  const pc        = postcode || "";
  const free      = isFree(tags, priceRange);
  const prefix    = free ? "Free Car Park" : "Car Park";

  // Coordinate-named listings — swap for a descriptive title
  if (isCoordinateName(cleanName)) {
    return pc
      ? `${prefix}, ${loc} — ${pc} | SouthportGuide.co.uk`
      : `${prefix}, ${loc} | SouthportGuide.co.uk`;
  }

  // Generic area-only names (e.g. listing literally named "Southport") — prefix with Car Park
  if (isGenericAreaName(cleanName)) {
    return pc
      ? `${prefix} — ${loc}, ${pc} | SouthportGuide.co.uk`
      : `${prefix} — ${loc} | SouthportGuide.co.uk`;
  }

  // Generic type-only names ("Car Park", "Parking", "Pay and Display" etc.)
  // — meaningless as a title; use street name + postcode to differentiate.
  if (isGenericTypeName(cleanName)) {
    const street = extractStreetName(address);
    if (street && pc) return `${prefix}, ${street} — ${pc} | SouthportGuide.co.uk`;
    if (street)       return `${prefix}, ${street}, ${loc} | SouthportGuide.co.uk`;
    if (pc)           return `${prefix} — ${loc}, ${pc} | SouthportGuide.co.uk`;
    return `${prefix} — ${loc} | SouthportGuide.co.uk`;
  }

  // Named car park. Avoid "X — Parking in Southport" when name already contains area.
  // If the name already mentions the location, drop the redundant "in ${loc}" part.
  const nameContainsLoc = cleanName.toLowerCase().includes(area.toLowerCase()) ||
                          cleanName.toLowerCase().includes("southport");

  if (nameContainsLoc) {
    // Name has location baked in — just add parking signal and postcode
    const withPc  = pc ? `${cleanName} — ${pc} | SouthportGuide.co.uk` : `${cleanName} — Parking | SouthportGuide.co.uk`;
    if (withPc.length <= 70) return withPc;
    return `${cleanName} | SouthportGuide.co.uk`;
  }

  // Standard: Name — Parking in Location, Postcode
  const withPc  = pc
    ? `${cleanName} — Parking in ${loc}, ${pc} | SouthportGuide.co.uk`
    : `${cleanName} — Parking in ${loc} | SouthportGuide.co.uk`;
  if (withPc.length <= 70) return withPc;

  const shorter = `${cleanName} — Parking, ${loc} | SouthportGuide.co.uk`;
  if (shorter.length <= 70) return shorter;

  return `${cleanName} — ${loc} Parking | SouthportGuide.co.uk`;
}

function buildParkingMetaDesc(
  name: string,
  address: string,
  postcode: string,
  tags: string[],
  priceRange: string | null,
  description: string | null,
  rating: number | null,
  reviewCount: number | null,
): string {
  const free     = isFree(tags, priceRange);
  const paid     = isPaid(tags, priceRange);
  const hasEv    = tags.includes("ev-charging");
  const area     = extractAreaMeta(address);
  const locLabel = area === "Southport" ? "Southport" : `${area}, Southport`;

  // "Free parking" / "Pay-and-display" / "Car park" — avoid "Parking." which
  // creates the "Parking. ... Parking in" double-up in the fallback.
  const priceSignal = free ? "Free parking." : paid ? "Pay-and-display." : "Car park.";
  const pcPart      = postcode ? ` ${postcode}.` : "";
  const evPart      = hasEv ? " EV charging on site." : "";
  const ratingPart  = rating && reviewCount
    ? ` Rated ${rating.toFixed(1)}/5 (${reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount} reviews).`
    : "";

  // Prefer the first sentence of the existing description if it's punchy enough.
  // Sanitize to remove curly quotes / em-dashes that render as mojibake in SERPs.
  if (description) {
    const stripped = sanitizeMeta(description.replace(/\n+/g, " ").trim());
    // Split only at real sentence boundaries (punctuation followed by uppercase)
    const sentences = stripped.split(/(?<=[.!?]) +(?=[A-Z])/);
    const first = sentences[0] ?? "";
    if (first.length >= 40 && first.length <= 130) {
      const suffix = postcode && !first.includes(postcode) ? ` ${postcode}.` : "";
      const evSuffix = hasEv && !first.toLowerCase().includes("ev") && !first.toLowerCase().includes("electric") ? evPart : "";
      const candidate = `${first}${suffix}${evSuffix}${ratingPart}`.trim();
      return candidate.length <= 160 ? candidate : candidate.slice(0, 157) + "…";
    }
  }

  // Synthetic fallback — no "Parking in" repetition, leads with actionable signals.
  const cleanName = sanitizeMeta(name);
  let nameLabel: string;
  if (isGenericAreaName(cleanName) || isGenericTypeName(cleanName)) {
    const street = extractStreetName(address);
    nameLabel = street ? `car park on ${street}, ${locLabel}` : `car park in ${locLabel}`;
  } else {
    nameLabel = cleanName;
  }
  const base = `${priceSignal}${pcPart}${evPart}${ratingPart} ${nameLabel} — get directions and see busy times on SouthportGuide.co.uk.`;
  return base.length <= 160 ? base : base.slice(0, 157) + "…";
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const catRecord = await prisma.category.findFirst({ where: { slug: "parking" } });
    if (!catRecord) return { title: "Parking" };
    const b = await prisma.business.findFirst({
      where: { slug, categoryId: catRecord.id },
      select: {
        name: true, address: true, postcode: true,
        description: true, images: true,
        tags: true, priceRange: true,
        rating: true, reviewCount: true,
      },
    });
    if (!b) return { title: "Parking" };

    const tags      = (b.tags ?? []) as string[];
    const cleanName = sanitizeMeta(b.name);

    const title = buildParkingTitle(cleanName, b.postcode, b.address, tags, b.priceRange);
    const desc  = buildParkingMetaDesc(
      cleanName, b.address, b.postcode,
      tags, b.priceRange,
      b.description, b.rating, b.reviewCount,
    );

    const canonicalUrl = `${BASE_URL}/parking/${slug}`;

    return {
      title,
      description: desc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title, description: desc,
        url: canonicalUrl,
        type: "website",
        siteName: "SouthportGuide.co.uk",
        locale: "en_GB",
        ...(b.images?.[0] ? { images: [{ url: b.images[0], width: 1200, height: 630, alt: cleanName }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title, description: desc,
        ...(b.images?.[0] ? { images: [b.images[0]] } : {}),
      },
    };
  } catch {
    return { title: "Parking" };
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ParkingSlugPage({ params }: Props) {
  const { slug } = await params;

  type ParkingBusiness = {
    id: string; name: string; address: string; postcode: string;
    lat: number | null; lng: number | null;
    description: string | null; shortDescription: string | null;
    images: string[]; tags: string[]; priceRange: string | null;
    openingHours: unknown; rating: number | null; reviewCount: number | null;
    placeId: string | null; updatedAt: Date;
  };

  type NearbyPlace = {
    slug: string; name: string; address: string;
    categorySlug: string; categoryName: string;
    distance_m: number;
  };

  type NearbyParking = {
    slug: string; name: string; postcode: string;
    distance_m: number; priceRange: string | null;
  };

  type FormbyNearbyPlace = {
    slug: string; name: string; address: string;
    categorySlug: string; categoryName: string; distance_m: number;
  };

  let business: ParkingBusiness | null = null;
  let nearbyPlaces: NearbyPlace[] = [];
  let nearbyParking: NearbyParking[] = [];
  let nearbyFormbyPlaces: FormbyNearbyPlace[] = [];

  try {
    const catRecord = await prisma.category.findFirst({ where: { slug: "parking" } });
    if (!catRecord) notFound();

    business = await prisma.business.findFirst({
      where: { slug, categoryId: catRecord.id },
      select: {
        id: true, name: true, address: true, postcode: true,
        lat: true, lng: true, description: true, shortDescription: true,
        images: true, tags: true, priceRange: true, openingHours: true,
        rating: true, reviewCount: true, placeId: true, updatedAt: true,
      },
    }) as ParkingBusiness | null;

    if (business?.lat && business?.lng) {
      // Nearby places (restaurants, cafes, attractions etc.)
      nearbyPlaces = await prisma.$queryRaw<NearbyPlace[]>`
        SELECT sub.slug, sub.name, sub.address,
               sub."categorySlug", sub."categoryName",
               ROUND(sub.distance_m::numeric) AS distance_m
        FROM (
          SELECT b.slug, b.name, b.address,
                 c.slug AS "categorySlug", c.name AS "categoryName",
                 (6371000 * acos(LEAST(1.0,
                   cos(radians(${business.lat})) * cos(radians(b.lat)) *
                   cos(radians(b.lng) - radians(${business.lng})) +
                   sin(radians(${business.lat})) * sin(radians(b.lat))
                 ))) AS distance_m
          FROM "Business" b
          JOIN "Category" c ON b."categoryId" = c.id
          WHERE c.slug IN ('restaurants','cafes','bars-nightlife','attractions','beaches-parks','shopping','activities')
            AND b.lat IS NOT NULL AND b.lng IS NOT NULL
        ) sub
        WHERE sub.distance_m < 800
        ORDER BY sub.distance_m
        LIMIT 8
      `;

      // Nearby parking (other car parks)
      nearbyParking = await prisma.$queryRaw<NearbyParking[]>`
        SELECT sub.slug, sub.name, sub.postcode, sub."priceRange",
               ROUND(sub.distance_m::numeric) AS distance_m
        FROM (
          SELECT b.slug, b.name, b.postcode, b."priceRange",
                 (6371000 * acos(LEAST(1.0,
                   cos(radians(${business.lat})) * cos(radians(b.lat)) *
                   cos(radians(b.lng) - radians(${business.lng})) +
                   sin(radians(${business.lat})) * sin(radians(b.lat))
                 ))) AS distance_m
          FROM "Business" b
          JOIN "Category" c ON b."categoryId" = c.id
          WHERE c.slug = 'parking'
            AND b.slug != ${slug}
            AND b.lat IS NOT NULL AND b.lng IS NOT NULL
            AND b.postcode != ''
        ) sub
        WHERE sub.distance_m < 1500
        ORDER BY sub.distance_m
        LIMIT 5
      `;
    }
  } catch {
    /* DB unavailable */
  }

  // Fetch nearby FormbyGuide listings for Formby car parks
  if (business?.lat && business?.lng && extractAreaMeta(business.address) === "Formby") {
    try {
      const fgUrl = `https://www.formbyguide.co.uk/api/nearby?lat=${business.lat}&lng=${business.lng}&radius=1500`;
      const res = await fetch(fgUrl, { next: { revalidate: 3600 } });
      if (res.ok) nearbyFormbyPlaces = (await res.json()) as FormbyNearbyPlace[];
    } catch {
      /* FormbyGuide unavailable */
    }
  }

  if (!business) notFound();

  const heroImage   = business.images?.[0] ?? null;
  const mapsKey     = process.env.GOOGLE_PLACES_API_KEY;
  const tags        = business.tags ?? [];
  const ptype       = parkingType(tags);
  const free        = isFree(tags, business.priceRange);
  const paid        = isPaid(tags, business.priceRange);
  const hasEV       = tags.some((t) => t.includes("ev"));
  const hasDisabled = tags.some((t) => t.includes("disabled") || t.includes("blue-badge"));
  const busyGuide   = getBusyGuide(business.name, tags, business.postcode);
  const formattedAddress = formatAddress(business.address, business.postcode);
  const dUrl        = directionsUrl(business.lat, business.lng, business.postcode);

  const mapSrc = mapsKey
    ? business.placeId
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=place_id:${business.placeId}&zoom=16`
      : business.lat && business.lng
        ? `https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${business.lat},${business.lng}&zoom=16&maptype=roadmap`
        : null
    : null;

  // Schema.org — ParkingFacility entity
  const schemaFree  = isFree(tags, business.priceRange);
  const schemaPaid  = isPaid(tags, business.priceRange);
  const schemaArea  = extractAreaMeta(business.address);
  const schemaLocality = schemaArea === "Southport" ? "Southport" : schemaArea;

  // Build openingHoursSpecification from stored data (same logic as general listing page)
  let openingHoursSpec: unknown[] = [];
  if (business.openingHours && typeof business.openingHours === "object") {
    const oh = business.openingHours as { weekdayText?: string[] };
    if (oh.weekdayText?.length) {
      openingHoursSpec = oh.weekdayText.map((line: string) => {
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
    }
  }

  // amenityFeature — EV charging
  const amenityFeatures = [];
  if (tags.includes("ev-charging")) {
    amenityFeatures.push({
      "@type": "LocationFeatureSpecification",
      name: "Electric vehicle charging station",
      value: true,
    });
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ParkingFacility"],
    name: business.name,
    url: `${BASE_URL}/parking/${slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.replace(/,?\s*(United Kingdom|UK)$/i, "").split(",")[0].trim(),
      addressLocality: schemaLocality,
      addressRegion: "Merseyside",
      postalCode: business.postcode,
      addressCountry: "GB",
    },
    ...(business.lat && business.lng ? {
      geo: { "@type": "GeoCoordinates", latitude: business.lat, longitude: business.lng },
    } : {}),
    ...(business.rating && business.reviewCount ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating.toFixed(1),
        reviewCount: business.reviewCount,
        bestRating: "5", worstRating: "1",
      },
    } : {}),
    ...(business.description ? { description: business.description } : {}),
    ...(heroImage ? { image: heroImage } : {}),
    // ParkingFacility-specific
    ...(schemaFree || schemaPaid ? { isAccessibleForFree: schemaFree } : {}),
    ...(openingHoursSpec.length ? { openingHoursSpecification: openingHoursSpec } : {}),
    ...(amenityFeatures.length ? { amenityFeature: amenityFeatures } : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: `${BASE_URL}` },
      { "@type": "ListItem", position: 2, name: "Parking", item: `${BASE_URL}/parking` },
      { "@type": "ListItem", position: 3, name: business.name, item: `${BASE_URL}/parking/${slug}` },
    ],
  };

  return (
    <>
      <ViewTracker businessId={business.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="min-h-screen bg-[#FAF8F5]">

        {/* ── Street View hero strip ──────────────────────────────────────── */}
        <div className="relative w-full h-44 bg-[#1C3148] overflow-hidden">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImage} alt={business.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-20 select-none">🅿️</span>
            </div>
          )}
          {/* Dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Breadcrumb overlaid on image */}
          <nav className="absolute top-3 left-4 flex items-center gap-1 text-white/60 text-xs">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/parking" className="hover:text-white transition-colors">Parking</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 font-medium truncate max-w-[160px]">{business.name}</span>
          </nav>
        </div>

        {/* ── Hero action bar ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 max-w-5xl py-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">

              {/* Name + postcode */}
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1B2E4B] leading-tight">
                  {business.name}
                </h1>
                {business.postcode && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-sm font-mono font-semibold tracking-wide">
                      {business.postcode}
                    </span>
                    <PostcodeCopy postcode={business.postcode} />
                  </div>
                )}
              </div>

              {/* Primary CTA — directions */}
              <a
                href={trackUrl(business.id, "directions", dUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>

            {/* Quick fact chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {free && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✓ Free
                </span>
              )}
              {!free && paid && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  £ {business.priceRange || "Paid"}
                </span>
              )}
              {!free && !paid && (
                <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  £ Check signs
                </span>
              )}
              {ptype && (
                <span className="inline-flex items-center gap-1 bg-[#EBF0F7] text-[#1B2E4B] border border-[#1B2E4B]/10 text-xs font-medium px-2.5 py-1 rounded-full">
                  🅿️ {ptype}
                </span>
              )}
              {hasEV && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  ⚡ EV charging
                </span>
              )}
              {hasDisabled && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  ♿ Blue badge
                </span>
              )}
              {business.rating && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {business.rating.toFixed(1)}
                  {business.reviewCount ? ` (${business.reviewCount.toLocaleString()})` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 max-w-5xl py-6">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Left / main column ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Description */}
              {(business.description || business.shortDescription) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="text-gray-700 text-[15px] leading-relaxed space-y-3">
                    {(business.description || business.shortDescription)!
                      .split("\n\n").filter(Boolean)
                      .map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              )}

              {/* How busy? */}
              {busyGuide && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-[15px]">
                    🚦 How busy does it get?
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {busyGuide.periods.map((p) => {
                      const cfg = BUSY_CFG[p.level];
                      return (
                        <div key={p.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${cfg.bg} border-transparent`}>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          <span className="text-xs text-gray-700 font-medium">{p.label}</span>
                          <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{busyGuide.note}</p>
                </div>
              )}

              {/* Nearby places */}
              {nearbyPlaces.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-900 mb-3 text-[15px]">
                    📍 What&apos;s nearby
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {nearbyPlaces.map((place) => {
                      const distM = Number(place.distance_m);
                      const distLabel = distM < 100  ? "under 100m"
                        : distM < 1000 ? `${Math.round(distM / 50) * 50}m`
                        : `${(distM / 1000).toFixed(1)}km`;
                      const emoji = CAT_EMOJI[place.categorySlug] ?? "📍";
                      return (
                        <Link
                          key={`${place.categorySlug}-${place.slug}`}
                          href={`/${place.categorySlug}/${place.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group border border-gray-100"
                        >
                          <span className="text-base leading-none flex-shrink-0">{emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition text-sm truncate">
                              {place.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{place.categoryName}</p>
                          </div>
                          <span className="flex-shrink-0 text-xs text-gray-400 font-medium tabular-nums">
                            {distLabel}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nearby FormbyGuide listings — shown on Formby car park pages */}
              {nearbyFormbyPlaces.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900 text-[15px]">
                      📍 What&apos;s nearby
                    </h2>
                    <a
                      href="https://www.formbyguide.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#2D6A4F] hover:underline"
                    >
                      FormbyGuide →
                    </a>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {nearbyFormbyPlaces.map((place) => {
                      const distM = Number(place.distance_m);
                      const distLabel = distM < 100  ? "under 100m"
                        : distM < 1000 ? `${Math.round(distM / 50) * 50}m`
                        : `${(distM / 1000).toFixed(1)}km`;
                      const emoji = FORMBY_CAT_EMOJI[place.categorySlug] ?? "📍";
                      return (
                        <a
                          key={`${place.categorySlug}-${place.slug}`}
                          href={`https://www.formbyguide.co.uk/${place.categorySlug}/${place.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group border border-gray-100"
                        >
                          <span className="text-base leading-none flex-shrink-0">{emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition text-sm truncate">
                              {place.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{place.categoryName}</p>
                          </div>
                          <span className="flex-shrink-0 text-xs text-gray-400 font-medium tabular-nums">
                            {distLabel}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                  <a
                    href="https://www.formbyguide.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[#2D6A4F] text-xs font-bold mt-3 hover:underline"
                  >
                    Explore Formby on FormbyGuide →
                  </a>
                </div>
              )}

              {/* Fallback editorial callout when no nearby results — Formby pages only */}
              {nearbyFormbyPlaces.length === 0 && extractAreaMeta(business.address) === "Formby" && (
                <div className="bg-[#F0F7F2] rounded-xl border border-[#B8D9C4] p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1">Visiting Formby?</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    FormbyGuide has the full local guide — the National Trust pinewoods, red squirrel trail, and Formby beach.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { href: "https://www.formbyguide.co.uk/red-squirrels-formby", label: "Red Squirrel Trail" },
                      { href: "https://www.formbyguide.co.uk/formby-beach", label: "Formby Beach" },
                      { href: "https://www.formbyguide.co.uk/formby-pinewoods", label: "Formby Pinewoods" },
                    ].map(({ href, label }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-white border border-[#B8D9C4] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                      >
                        {label} →
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Map embed — mobile only (desktop in sidebar) */}
              {mapSrc && (
                <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <h2 className="font-semibold text-gray-900 text-[15px]">Location</h2>
                  </div>
                  <iframe
                    loading="lazy"
                    className="w-full h-64"
                    src={mapSrc}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map — ${business.name}`}
                  />
                </div>
              )}
            </div>

            {/* ── Right sidebar ───────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* Map embed — desktop */}
              {mapSrc && (
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <iframe
                    loading="lazy"
                    className="w-full h-56"
                    src={mapSrc}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map — ${business.name}`}
                  />
                  <div className="p-4">
                    <a
                      href={trackUrl(business.id, "directions", dUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                </div>
              )}

              {/* Essential facts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Car park details</h3>

                {business.postcode && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Postcode</p>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#1B2E4B] text-sm">{business.postcode}</span>
                        <PostcodeCopy postcode={business.postcode} />
                      </div>
                    </div>
                  </div>
                )}

                {business.address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5 opacity-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">{formattedAddress}</p>
                  </div>
                )}

                {business.openingHours != null && typeof business.openingHours === "object" && (
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Opening hours</p>
                      <OpeningHours data={business.openingHours} />
                    </div>
                  </div>
                )}
              </div>

              {/* Nearby parking alternatives */}
              {nearbyParking.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Nearby car parks</h3>
                  <div className="space-y-2">
                    {nearbyParking.map((p) => {
                      const distM = Number(p.distance_m);
                      const distLabel = distM < 1000
                        ? `${Math.round(distM / 50) * 50}m`
                        : `${(distM / 1000).toFixed(1)}km`;
                      return (
                        <Link
                          key={p.slug}
                          href={`/parking/${p.slug}`}
                          className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 transition group"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition truncate">
                              {p.name}
                            </p>
                            {p.postcode && (
                              <p className="text-xs text-gray-400 font-mono mt-0.5">{p.postcode}</p>
                            )}
                          </div>
                          <span className="flex-shrink-0 text-xs text-gray-400 tabular-nums pt-0.5">
                            {distLabel}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/parking"
                    className="block text-center text-[#C9A84C] text-xs font-bold mt-3 hover:underline"
                  >
                    All parking →
                  </Link>
                </div>
              )}

              {/* Google rating */}
              {business.rating && business.placeId && (
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${business.placeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-amber-200 transition group"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-amber-700 text-sm">{business.rating.toFixed(1)}</span>
                    {business.reviewCount && (
                      <span className="text-gray-500 text-xs ml-1">
                        ({business.reviewCount.toLocaleString()} Google reviews)
                      </span>
                    )}
                  </div>
                  <span className="text-gray-300 group-hover:text-amber-400 transition text-sm">↗</span>
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Opening hours ────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function OpeningHours({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return null;
  const hours = data as {
    weekdayText?: string[];
    periods?: Array<{ open: { day: number; time: string }; close?: { day: number; time: string } }>;
  };

  if (hours.weekdayText?.length) {
    const today = new Date().getDay();
    const reordered = [...hours.weekdayText.slice(1), hours.weekdayText[0]];
    const todayIdx = today === 0 ? 6 : today - 1;
    return (
      <ul className="space-y-0.5 text-xs">
        {reordered.map((line, i) => {
          const ci = line.indexOf(": ");
          const day = line.slice(0, ci);
          const time = line.slice(ci + 2);
          const isToday = i === todayIdx;
          return (
            <li key={day} className={`flex justify-between gap-2 py-0.5 px-1.5 rounded ${isToday ? "bg-blue-50 font-semibold text-blue-800" : "text-gray-600"}`}>
              <span className="w-20 flex-shrink-0">{day}</span>
              <span className="text-right">{time}</span>
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
      <ul className="space-y-0.5 text-xs text-gray-600">
        {hours.periods.map((p, i) => (
          <li key={i} className="flex justify-between gap-2">
            <span>{DAY_NAMES[p.open.day]}</span>
            <span>{fmt(p.open.time)}{p.close ? ` – ${fmt(p.close.time)}` : " (24h)"}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="text-xs text-gray-400">Hours not available</p>;
}
