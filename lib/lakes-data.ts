// ── Shared site data ──────────────────────────────────────────────────────
// Events and blog posts are defined here so they can be imported by
// the homepage, the events page, and the blog page without duplication.

export interface LakeEvent {
  title: string;
  /** ISO date string (YYYY-MM-DD) used for sorting / filtering */
  isoDate: string;
  /** ISO end date for multi-day events (YYYY-MM-DD). Omit for single-day events. */
  endIsoDate?: string;
  /** Human-readable date label shown on cards */
  dayLabel: string;
  venue: string;
  category: string;
  emoji: string;
  free: boolean;
  link: string;
}

export const EVENTS: LakeEvent[] = [];

// ── Blog categories ────────────────────────────────────────────────────────

export interface BlogCategory {
  slug: string;
  label: string;
  color: string;
  emoji: string;
  description: string;
  /** Matches a site category slug for cross-linking */
  siteCategory?: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "food-drink",
    label: "Food & Drink",
    color: "#8B2635",
    emoji: "🍽️",
    description: "Restaurant reviews, cafe guides, and food news from across the Lake District.",
    siteCategory: "restaurants",
  },
  {
    slug: "where-to-stay",
    label: "Where to Stay",
    color: "#1B2E4B",
    emoji: "🏨",
    description: "Hotels, B&Bs, and accommodation guides for every budget.",
    siteCategory: "accommodation",
  },
  {
    slug: "pubs",
    label: "Pubs & Inns",
    color: "#3D1A5C",
    emoji: "🍺",
    description: "The best pubs, inns, and post-walk watering holes in the Lake District.",
    siteCategory: "pubs",
  },
  {
    slug: "cafes",
    label: "Coffee & Cafes",
    color: "#6B3A1F",
    emoji: "☕",
    description: "Independent coffee shops, tea rooms, and brunch spots.",
    siteCategory: "cafes",
  },
  {
    slug: "walks",
    label: "Walks & Hiking",
    color: "#1A5C5B",
    emoji: "🥾",
    description: "Fell walks, valley routes, and hiking guides.",
    siteCategory: "walks",
  },
  {
    slug: "villages",
    label: "Villages & Towns",
    color: "#1A5C7A",
    emoji: "🏘️",
    description: "Keswick, Ambleside, Windermere, and the villages that make the Lakes.",
    siteCategory: "villages",
  },
  {
    slug: "activities",
    label: "Activities",
    color: "#0D6E6E",
    emoji: "🏄",
    description: "Watersports, cycling, and things to do for all ages.",
    siteCategory: "activities",
  },
  {
    slug: "shopping",
    label: "Shopping",
    color: "#8B2847",
    emoji: "🛍️",
    description: "Independent shops, outdoor gear, and local produce.",
    siteCategory: "shopping",
  },
  {
    slug: "local-guides",
    label: "Local Guides",
    color: "#5C3A1A",
    emoji: "📍",
    description: "In-depth guides written by locals who know the Lake District.",
  },
  {
    slug: "events",
    label: "Events",
    color: "#8B5A1A",
    emoji: "🎉",
    description: "Event previews, reviews, and what's on in the Lake District.",
  },
  {
    slug: "for-business",
    label: "For Business",
    color: "#1A5C3A",
    emoji: "📊",
    description: "The Lakes Guide Business Hub. Tools, news, and updates for Lake District businesses.",
  },
];

// ── Blog posts ─────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  image: string;
  date: string;
  /** Omit for default Damian author. Set to "terry" for posts written by Terry. */
  author?: "terry" | "damian";
  /** Pin this post to the homepage blog section. Up to 3 featured posts are shown; extras are ignored. */
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [];

// ── Blog helper functions ──────────────────────────────────────────────────

export function getBlogCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.categorySlug === categorySlug);
}

export function getBlogPostCategory(post: BlogPost): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === post.categorySlug);
}

/** Returns upcoming events from today onwards, sorted by date */
export function getUpcomingEvents(limit?: number): LakeEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = EVENTS.filter((e) => new Date(e.endIsoDate ?? e.isoDate) >= today).sort(
    (a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime()
  );
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** Group events by month label for the full calendar view */
export function getEventsByMonth(): Record<string, LakeEvent[]> {
  const grouped: Record<string, LakeEvent[]> = {};
  for (const event of EVENTS) {
    const d = new Date(event.isoDate);
    const label = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(event);
  }
  return grouped;
}
