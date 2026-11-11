// Advertising spaces on The Lakes Guide (stage B, approved by Damian on 11 Nov 2026).
// No imports, so tests/ads.test.mjs can load this file directly.
//
// Every sponsor is null at commit. Damian fills one by hand once its invoice is
// paid; a sponsor whose `until` date has passed renders as empty again (pages
// with a space are regenerated hourly, so it drops off within the hour).
// Rules: at most one advert on any page; none on business listings, reviews, the
// two posts that describe businesses (best-restaurants-keswick, best-pubs-ambleside),
// about, privacy, terms, contact, claim-listing, advertise, pricing, the 404 page,
// category pages, the dashboard or admin. tests/ads.test.mjs checks all of this.

export type Sponsor = {
  name: string;
  /** The sponsor's own site; linked with rel="sponsored noopener". */
  url: string;
  /** At most 30 words. */
  text: string;
  /** Optional image, a path under /public, for example "/images/ads/name.jpg". */
  image?: string;
  /** Last day shown, "YYYY-MM-DD". After it the space is empty again. */
  until?: string;
};

/** home: labelled "Advertisement". guide and post: labelled "Sponsor". */
export type AdSlotKind = "home" | "guide" | "post";

export type AdSlotConfig = {
  /** The option id on /advertise (lib/ad-options.ts). */
  option: string;
  /** A human title for the space. */
  title: string;
  kind: AdSlotKind;
  sponsor: Sponsor | null;
};

export const AD_SLOTS: Record<string, AdSlotConfig> = {
  // Home page: before "Explore the Lake District".
  "home-card": { option: "home-card", title: "The home page card", kind: "home", sponsor: null },

  // Town guides: before "Explore Nearby".
  "guide-keswick": { option: "guide-sponsor", title: "Sponsor of the Keswick guide", kind: "guide", sponsor: null },
  "guide-ambleside": { option: "guide-sponsor", title: "Sponsor of the Ambleside guide", kind: "guide", sponsor: null },
  "guide-windermere": { option: "guide-sponsor", title: "Sponsor of the Windermere guide", kind: "guide", sponsor: null },
  "guide-grasmere": { option: "guide-sponsor", title: "Sponsor of the Grasmere guide", kind: "guide", sponsor: null },
  "guide-coniston": { option: "guide-sponsor", title: "Sponsor of the Coniston guide", kind: "guide", sponsor: null },

  // Topic guides: at the guide's end.
  "guide-things-to-do": { option: "guide-sponsor", title: "Sponsor of the Things to Do guide", kind: "guide", sponsor: null },
  "guide-rainy-day-lake-district": { option: "guide-sponsor", title: "Sponsor of the Rainy Days guide", kind: "guide", sponsor: null },
  "guide-lake-district-with-kids": { option: "guide-sponsor", title: "Sponsor of the With Kids guide", kind: "guide", sponsor: null },
  "guide-dog-friendly-lake-district": { option: "guide-sponsor", title: "Sponsor of the Dog-friendly guide", kind: "guide", sponsor: null },
  "guide-lake-district-walks": { option: "guide-sponsor", title: "Sponsor of the Walks guide", kind: "guide", sponsor: null },
  "guide-parking": { option: "guide-sponsor", title: "Sponsor of the Parking guide", kind: "guide", sponsor: null },

  // The winter guide (a post), sold as the winter package.
  "guide-lake-district-in-winter": { option: "winter-package", title: "Sponsor of The Lake District in Winter", kind: "guide", sponsor: null },

  // End of the travel and seasonal posts in POST_END_SLUGS: one sponsor for all of them.
  "post-end": { option: "guide-sponsor", title: "Sponsor of our travel and seasonal posts", kind: "post", sponsor: null },
};

/**
 * Posts that show the post-end space: travel and seasonal posts only. Not the
 * walk route posts, and not posts built around businesses or attractions
 * (eating out, pubs, where to stay, family days out, dog walking, rainy days,
 * the market, the Ullswater boats).
 */
export const POST_END_SLUGS: readonly string[] = [
  "lake-district-without-a-car",
  "week-itinerary-lake-district",
  "grasmere-vs-ambleside",
  "autumn-in-the-lake-district",
];

/** The winter guide: its own space, sold as the winter package. */
export const WINTER_POST_SLUG = "lake-district-in-winter";

/** Posts that describe businesses: never any advert. */
export const NO_AD_POST_SLUGS: readonly string[] = ["best-restaurants-keswick", "best-pubs-ambleside"];

/** A slot by id, or undefined. Own keys only, so "constructor" and the like never match. */
export function getAdSlot(id: string): AdSlotConfig | undefined {
  return Object.prototype.hasOwnProperty.call(AD_SLOTS, id) ? AD_SLOTS[id] : undefined;
}

/** The slot for a blog post, or null. A sponsored post never carries another advert. */
export function slotForPost(slug: string, isSponsored: boolean): string | null {
  if (isSponsored || NO_AD_POST_SLUGS.includes(slug)) return null;
  if (slug === WINTER_POST_SLUG) return "guide-lake-district-in-winter";
  return POST_END_SLUGS.includes(slug) ? "post-end" : null;
}

/** Today's date in the UK, "YYYY-MM-DD", so an `until` date ends at UK midnight. */
function ukToday(today: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(today);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** The sponsor to show today, or null when empty or past its `until` date. */
export function activeSponsor(slot: AdSlotConfig, today: Date = new Date()): Sponsor | null {
  const s = slot.sponsor;
  if (!s) return null;
  if (s.until && s.until < ukToday(today)) return null;
  return s;
}
