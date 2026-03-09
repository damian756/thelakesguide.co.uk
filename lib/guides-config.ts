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
    description: "The best walks in the Lake District. Coming soon.",
    excerpt: "Lake District walks guide. Content coming soon.",
    category: "walks-fells",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.9,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["walks", "hiking", "fells"],
    status: "coming-soon",
    metaTitle: "Lake District Walks | The Lakes Guide",
    metaDescription: "The best walks in the Lake District. Content coming soon.",
  },

  // ── Areas ──────────────────────────────────────────────────────────────────
  {
    slug: "windermere",
    title: "Windermere",
    description: "England's longest lake. Coming soon.",
    excerpt: "Windermere guide. Content coming soon.",
    category: "areas",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.88,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["windermere", "lakes", "villages"],
    status: "coming-soon",
    metaTitle: "Windermere | The Lakes Guide",
    metaDescription: "Windermere guide. Content coming soon.",
  },
  {
    slug: "keswick",
    title: "Keswick",
    description: "Gateway to the northern fells. Coming soon.",
    excerpt: "Keswick guide. Content coming soon.",
    category: "areas",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.88,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["keswick", "northern-fells"],
    status: "coming-soon",
    metaTitle: "Keswick | The Lakes Guide",
    metaDescription: "Keswick guide. Content coming soon.",
  },
  {
    slug: "ambleside",
    title: "Ambleside",
    description: "Walking hub at the head of Windermere. Coming soon.",
    excerpt: "Ambleside guide. Content coming soon.",
    category: "areas",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["ambleside", "windermere"],
    status: "coming-soon",
    metaTitle: "Ambleside | The Lakes Guide",
    metaDescription: "Ambleside guide. Content coming soon.",
  },
  {
    slug: "grasmere",
    title: "Grasmere",
    description: "Wordsworth country. Gingerbread and the lakeshore. Coming soon.",
    excerpt: "Grasmere guide. Content coming soon.",
    category: "areas",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.84,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["grasmere", "wordsworth", "central-lakes"],
    status: "coming-soon",
    metaTitle: "Grasmere | The Lakes Guide",
    metaDescription: "Grasmere guide. Content coming soon.",
  },
  {
    slug: "coniston",
    title: "Coniston",
    description: "Coniston Water and the Old Man. Coming soon.",
    excerpt: "Coniston guide. Content coming soon.",
    category: "areas",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.84,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["coniston", "coniston-water", "southern-fells"],
    status: "coming-soon",
    metaTitle: "Coniston | The Lakes Guide",
    metaDescription: "Coniston guide. Content coming soon.",
  },

  // ── Practical ──────────────────────────────────────────────────────────────
  {
    slug: "parking-lake-district",
    title: "Parking in the Lake District",
    description: "Where to park. Coming soon.",
    excerpt: "Parking guide for the Lake District. Content coming soon.",
    category: "practical",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["parking", "practical"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["accommodation"] },
    metaTitle: "Parking in the Lake District | The Lakes Guide",
    metaDescription: "Where to park in the Lake District. Content coming soon.",
  },
  {
    slug: "dog-friendly-lake-district",
    title: "Dog-Friendly Lake District",
    description: "Where to go and where to stay with your dog. Coming soon.",
    excerpt: "Dog-friendly Lake District guide. Walks, pubs, accommodation. Content coming soon.",
    category: "practical",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.82,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["dog-friendly", "walks", "practical"],
    status: "coming-soon",
    metaTitle: "Dog-Friendly Lake District | The Lakes Guide",
    metaDescription: "Dog-friendly Lake District. Walks, pubs, accommodation. Content coming soon.",
  },
  {
    slug: "lake-district-with-kids",
    title: "Lake District with Kids",
    description: "Family-friendly days out. Coming soon.",
    excerpt: "Lake District with kids. Family walks, activities, accommodation. Content coming soon.",
    category: "practical",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.82,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["family", "kids", "practical"],
    status: "coming-soon",
    metaTitle: "Lake District with Kids | The Lakes Guide",
    metaDescription: "Lake District with kids. Family walks and activities. Content coming soon.",
  },
  {
    slug: "rainy-day-lake-district",
    title: "Rainy Day in the Lake District",
    description: "What to do when the weather turns. Coming soon.",
    excerpt: "Rainy day options in the Lake District. Content coming soon.",
    category: "practical",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.82,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["indoor", "rainy-day", "practical"],
    status: "coming-soon",
    metaTitle: "Rainy Day in the Lake District | The Lakes Guide",
    metaDescription: "What to do in the Lake District when it rains. Content coming soon.",
  },

  // ── Food & Drink ──────────────────────────────────────────────────────────
  {
    slug: "best-restaurants-lake-district",
    title: "Best Restaurants in the Lake District",
    description: "Where to eat. Coming soon.",
    excerpt: "The best restaurants in the Lake District. Content coming soon.",
    category: "food-drink",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.88,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["restaurants", "food", "dining"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["restaurants"] },
    metaTitle: "Best Restaurants in the Lake District | The Lakes Guide",
    metaDescription: "The best restaurants in the Lake District. Content coming soon.",
  },
  {
    slug: "best-cafes-lake-district",
    title: "Best Cafés in the Lake District",
    description: "Independent coffee and tea. Coming soon.",
    excerpt: "The best cafés in the Lake District. Content coming soon.",
    category: "food-drink",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["cafes", "coffee", "food"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["cafes"] },
    metaTitle: "Best Cafés in the Lake District | The Lakes Guide",
    metaDescription: "The best cafés in the Lake District. Content coming soon.",
  },
  {
    slug: "best-pubs-lake-district",
    title: "Best Pubs in the Lake District",
    description: "Post-walk pubs and inns. Coming soon.",
    excerpt: "The best pubs in the Lake District. Content coming soon.",
    category: "food-drink",
    heroImage: HERO_IMAGE_URL,
    seoPriority: 0.85,
    datePublished: "2026-03-09",
    dateUpdated: "2026-03-09",
    tags: ["pubs", "inns", "food"],
    status: "coming-soon",
    listingFilter: { categorySlugs: ["pubs"] },
    metaTitle: "Best Pubs in the Lake District | The Lakes Guide",
    metaDescription: "The best pubs in the Lake District. Content coming soon.",
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
