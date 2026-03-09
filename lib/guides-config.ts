import { HERO_IMAGE_URL } from "./site-constants";

// ── Guides Config ────────────────────────────────────────────────────────────
// Single source of truth for all editorial guide pages.
// Adding a new guide: add one entry here + create app/guides/[slug]/page.tsx.
// Drives: /guides/ index, sitemap, related guides, dynamic listings, nav.

export type GuideCategory =
  | "walks-fells"
  | "areas"
  | "practical"
  | "food-drink";

export type GuideStatus = "published" | "coming-soon";

export interface Guide {
  slug: string;
  title: string;
  /** Shorter label used in nav dropdowns where space is tight */
  shortTitle?: string;
  /** One-liner shown on index cards */
  description: string;
  /** Longer excerpt used in SEO meta description */
  excerpt: string;
  category: GuideCategory;
  heroImage: string;
  /** 0–1 for sitemap priority */
  seoPriority: number;
  datePublished: string;
  dateUpdated: string;
  tags: string[];
  status: GuideStatus;
  /**
   * When set, index cards and /guides/[slug] redirect to this path instead.
   * Use for guides that live at their own top-level route (e.g. /windermere).
   */
  canonicalPath?: string;
  /**
   * Controls which business listings the GuideLayout renders at the bottom.
   * Matches against Business.secondaryCategoryIds (category slugs) or Business.tags.
   */
  listingFilter?: {
    categorySlugs?: string[];
    tags?: string[];
  };
  /** Optional override for SEO title */
  metaTitle?: string;
  /** Optional override for SEO description */
  metaDescription?: string;
}

export const GUIDE_CATEGORIES: Record<GuideCategory, { label: string; description: string; emoji: string }> = {
  "walks-fells": {
    label: "Walks & Fells",
    description: "Fell walks, valley routes, and hiking guides for the Lake District.",
    emoji: "🥾",
  },
  areas: {
    label: "Areas",
    description: "The villages and towns that make up the Lake District.",
    emoji: "📍",
  },
  practical: {
    label: "Practical",
    description: "Parking, transport, rainy days, and dog-friendly. The useful stuff.",
    emoji: "🔧",
  },
  "food-drink": {
    label: "Food & Drink",
    description: "Where to eat, drink, and refuel in the Lake District.",
    emoji: "🍽️",
  },
};

export const GUIDES: Guide[] = [
  // ── Walks & Fells ─────────────────────────────────────────────────────────
  {
    slug: "lake-district-walks",
    title: "Lake District Walks",
    shortTitle: "Walks",
    description: "Fell walks, valley routes, and everything in between. From Scafell Pike to Catbells — the honest guide to walking in the Lakes.",
    excerpt: "The complete guide to walking in the Lake District. Fell routes for all abilities, the Wainwrights, the best introductory walks, and what you actually need to bring.",
    category: "walks-fells",
    heroImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    seoPriority: 0.9,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["walks", "hiking", "fells", "wainwrights"],
    status: "published",
    canonicalPath: "/lake-district-walks",
    metaTitle: "Lake District Walks | The Lakes Guide",
    metaDescription: "The complete guide to walking in the Lake District. Fell routes for all abilities, the Wainwrights, and what you need to bring.",
  },

  // ── Areas ──────────────────────────────────────────────────────────────────
  {
    slug: "windermere",
    title: "Windermere",
    description: "England's largest natural lake. Lake cruises, Orrest Head, and where to eat in Bowness. The complete visitor guide.",
    excerpt: "Complete visitor guide to Windermere and Bowness. Restaurants, lake cruises, Orrest Head walk, accommodation, parking, and getting there without a car.",
    category: "areas",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    seoPriority: 0.88,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["windermere", "bowness", "lakes", "villages"],
    status: "published",
    canonicalPath: "/windermere",
    metaTitle: "Windermere | Restaurants, Things to Do & Visitor Guide",
    metaDescription: "Complete visitor guide to Windermere and Bowness. Restaurants, lake cruises, accommodation, parking, and what to do.",
  },
  {
    slug: "keswick",
    title: "Keswick",
    description: "The capital of the northern Lakes. Derwentwater, Catbells, Skiddaw, and a proper market town with good food.",
    excerpt: "Complete guide to Keswick. Derwentwater lake cruises, Catbells and Skiddaw walks, the Thursday and Saturday market, where to eat, and how to get there.",
    category: "areas",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    seoPriority: 0.88,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["keswick", "northern-fells", "derwentwater", "catbells"],
    status: "published",
    canonicalPath: "/keswick",
    metaTitle: "Keswick | Restaurants, Walks & Complete Visitor Guide",
    metaDescription: "Complete guide to Keswick in the Lake District. Restaurants, walking routes, accommodation, Derwentwater, and what to see.",
  },
  {
    slug: "ambleside",
    title: "Ambleside",
    description: "The walking hub of the southern Lakes. Good restaurants, a proper outdoor gear scene, and direct access to the central fells.",
    excerpt: "Complete guide to Ambleside. The walking hub at the head of Windermere — restaurants, gear shops, Waterhead pier, and walks straight from the town centre.",
    category: "areas",
    heroImage: "https://images.unsplash.com/photo-1546430498-f6b45e5b35ca?w=800&q=80",
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["ambleside", "windermere", "southern-fells"],
    status: "published",
    canonicalPath: "/ambleside",
    metaTitle: "Ambleside | Restaurants, Walks & Visitor Guide",
    metaDescription: "Complete guide to Ambleside. Walking hub at the head of Windermere. Restaurants, walks, Waterhead, and the central fells.",
  },
  {
    slug: "grasmere",
    title: "Grasmere",
    description: "Wordsworth country. One of the most beautiful lakes, the famous gingerbread, and direct access to the central fells.",
    excerpt: "Complete guide to Grasmere. Dove Cottage, the famous gingerbread shop, lake walks, and the central fell routes from Grasmere village.",
    category: "areas",
    heroImage: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80",
    seoPriority: 0.84,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["grasmere", "wordsworth", "central-lakes", "dove-cottage"],
    status: "published",
    canonicalPath: "/grasmere",
    metaTitle: "Grasmere | Visitor Guide | The Lakes Guide",
    metaDescription: "Wordsworth, gingerbread, and one of the most beautiful lakes in the Lake District. Complete visitor guide to Grasmere.",
  },
  {
    slug: "coniston",
    title: "Coniston",
    description: "Coniston Old Man, Brantwood, Tarn Hows, and Coniston Water. The quieter alternative to the central Lakes.",
    excerpt: "Complete guide to Coniston. The Old Man walk, Brantwood house and gardens, Coniston Water boat trips, Tarn Hows, and where to eat and stay.",
    category: "areas",
    heroImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    seoPriority: 0.84,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["coniston", "coniston-water", "southern-fells", "tarn-hows"],
    status: "published",
    canonicalPath: "/coniston",
    metaTitle: "Coniston | Ruskin, Old Man & Complete Visitor Guide",
    metaDescription: "Complete guide to Coniston. Coniston Old Man walk, Brantwood, Coniston Water boat trips, Tarn Hows. Restaurants and accommodation.",
  },

  // ── Practical ──────────────────────────────────────────────────────────────
  {
    slug: "parking-lake-district",
    title: "Parking in the Lake District",
    description: "Where to park and when to arrive. The honest guide to car parks across the national park.",
    excerpt: "Parking in the Lake District. Which car parks to use, which fill early, and how to avoid the summer gridlock. Practical advice for every major destination.",
    category: "practical",
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["parking", "practical"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["accommodation"] },
    metaTitle: "Parking in the Lake District | The Lakes Guide",
    metaDescription: "Where to park in the Lake District. Which car parks to use, which fill early, and how to plan your visit.",
  },
  {
    slug: "dog-friendly-lake-district",
    title: "Dog-Friendly Lake District",
    description: "Where to walk, which pubs let dogs in, and the practical things you need to know about the Lakes with a dog.",
    excerpt: "Dog-friendly Lake District. Fell walks, pub beer gardens, and accommodation that actually welcomes dogs. Practical notes on sheep, ticks, and the fells.",
    category: "practical",
    heroImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    seoPriority: 0.82,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["dog-friendly", "walks", "practical", "pubs"],
    status: "published",
    canonicalPath: "/dog-friendly-lake-district",
    metaTitle: "Dog-Friendly Lake District | The Lakes Guide",
    metaDescription: "Dog-friendly Lake District. Walks, pubs, and accommodation that welcomes dogs. Practical notes on fell walking with dogs.",
  },
  {
    slug: "lake-district-with-kids",
    title: "Lake District with Kids",
    description: "Field-tested family days out. What actually works with children and what to avoid.",
    excerpt: "Lake District with kids. Family walks, boat trips, and activities that justify the drive. What works with children of different ages.",
    category: "practical",
    heroImage: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80",
    seoPriority: 0.82,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["family", "kids", "practical", "activities"],
    status: "published",
    canonicalPath: "/lake-district-with-kids",
    metaTitle: "Lake District with Kids | The Lakes Guide",
    metaDescription: "Lake District with kids. Family walks, boat trips, and the activities that actually work with children.",
  },
  {
    slug: "rainy-day-lake-district",
    title: "Rainy Day in the Lake District",
    description: "It will rain. Here is the plan — museums, indoor activities, and the walks that are still worth it in bad weather.",
    excerpt: "Rainy day in the Lake District. The best museums, indoor activities, and wet weather walks. What to do when the clouds arrive and refuse to leave.",
    category: "practical",
    heroImage: "https://images.unsplash.com/photo-1511225070847-8c58a0a29c07?w=800&q=80",
    seoPriority: 0.82,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["indoor", "rainy-day", "practical", "museums"],
    status: "published",
    canonicalPath: "/rainy-day-lake-district",
    metaTitle: "Rainy Day in the Lake District | The Lakes Guide",
    metaDescription: "What to do in the Lake District when it rains. Museums, indoor activities, and walks still worth doing in bad weather.",
  },

  // ── Food & Drink ──────────────────────────────────────────────────────────
  {
    slug: "best-restaurants-lake-district",
    title: "Best Restaurants in the Lake District",
    description: "Where to eat well, from post-walk dinners to proper lunches. No filler.",
    excerpt: "The best restaurants in the Lake District. Honest recommendations from Keswick to Coniston. No lists that just repeat TripAdvisor.",
    category: "food-drink",
    heroImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    seoPriority: 0.88,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["restaurants", "food", "dining"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["restaurants"] },
    metaTitle: "Best Restaurants in the Lake District | The Lakes Guide",
    metaDescription: "The best restaurants in the Lake District. Honest recommendations across every area of the national park.",
  },
  {
    slug: "best-cafes-lake-district",
    title: "Best Cafés in the Lake District",
    description: "Independent cafes worth stopping at before, during, and after a day on the fells.",
    excerpt: "The best cafés in the Lake District. Independent coffee stops and proper tearooms across the national park.",
    category: "food-drink",
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["cafes", "coffee", "food"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["cafes"] },
    metaTitle: "Best Cafés in the Lake District | The Lakes Guide",
    metaDescription: "The best cafés in the Lake District. Independent coffee stops and tearooms worth stopping at.",
  },
  {
    slug: "best-pubs-lake-district",
    title: "Best Pubs in the Lake District",
    description: "Post-walk pubs that actually deliver. Real ale, decent food, and dogs welcome.",
    excerpt: "The best pubs in the Lake District. Post-walk pubs with real ale, good food, and the welcome that walkers need.",
    category: "food-drink",
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["pubs", "inns", "food", "real-ale"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["pubs"] },
    metaTitle: "Best Pubs in the Lake District | The Lakes Guide",
    metaDescription: "The best pubs in the Lake District. Post-walk pubs with real ale, good food, and dogs welcome.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

/** Get a single guide by slug. Throws if not found. */
export function getGuide(slug: string): Guide {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Guide not found: ${slug}`);
  return guide;
}

/** Get a single guide by slug. Returns undefined if not found. */
export function getGuideOptional(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Get all published guides. */
export function getPublishedGuides(): Guide[] {
  return GUIDES.filter((g) => g.status === "published");
}

/** Get guides in a category. */
export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return GUIDES.filter((g) => g.category === category);
}

/**
 * Get related guides for a given guide.
 * Returns up to `limit` guides that share tags or category, excluding self.
 */
export function getRelatedGuides(slug: string, limit = 4): Guide[] {
  const current = GUIDES.find((g) => g.slug === slug);
  if (!current) return [];

  const scored = GUIDES.filter((g) => g.slug !== slug && (g.status === "published" || g.status === "coming-soon")).map((g) => {
    let score = 0;
    if (g.category === current.category) score += 2;
    const sharedTags = g.tags.filter((t) => current.tags.includes(t));
    score += sharedTags.length;
    return { guide: g, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.guide);
}
