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

export const EVENTS: LakeEvent[] = [
  { title: "Keswick Mountain Festival", isoDate: "2026-05-14", endIsoDate: "2026-05-17", dayLabel: "14–17 May 2026", venue: "Keswick", category: "Outdoor", emoji: "🥾", free: false, link: "https://www.keswickmountainfestival.co.uk" },
  { title: "Great North Swim", isoDate: "2026-06-12", endIsoDate: "2026-06-14", dayLabel: "12–14 June 2026", venue: "Windermere", category: "Sport", emoji: "🏊", free: false, link: "https://www.greatswim.org" },
  { title: "Ullswater Sportive", isoDate: "2026-05-24", dayLabel: "24 May 2026", venue: "Ullswater", category: "Sport", emoji: "🚴", free: false, link: "https://www.ullswatersportive.co.uk" },
  { title: "Cartmel Races (Spring)", isoDate: "2026-05-23", dayLabel: "23 May 2026", venue: "Cartmel", category: "Sport", emoji: "🏇", free: false, link: "https://www.cartmel-racecourse.co.uk" },
  { title: "Ambleside Sports", isoDate: "2026-07-25", dayLabel: "25 July 2026", venue: "Ambleside", category: "Community", emoji: "🏃", free: true, link: "https://www.amblesidesports.co.uk" },
  { title: "Grasmere Lakeland Sports", isoDate: "2026-08-27", dayLabel: "27 August 2026", venue: "Grasmere", category: "Community", emoji: "🏃", free: true, link: "https://www.grasmeresports.co.uk" },
  { title: "Borrowdale Fell Race", isoDate: "2026-08-01", dayLabel: "1 August 2026", venue: "Borrowdale", category: "Outdoor", emoji: "⛰️", free: false, link: "https://www.borrowdalefellrace.org.uk" },
  { title: "Kendal Calling", isoDate: "2026-07-31", endIsoDate: "2026-08-02", dayLabel: "31 July – 2 Aug 2026", venue: "Lowther Deer Park", category: "Music", emoji: "🎵", free: false, link: "https://www.kendalcalling.co.uk" },
  { title: "Loweswater Show", isoDate: "2026-10-03", dayLabel: "3 October 2026", venue: "Loweswater", category: "Community", emoji: "🌾", free: true, link: "https://www.loweswatershow.org.uk" },
  { title: "Cartmel Races (Summer)", isoDate: "2026-08-29", dayLabel: "29 August 2026", venue: "Cartmel", category: "Sport", emoji: "🏇", free: false, link: "https://www.cartmel-racecourse.co.uk" },
  { title: "Lakeland Trials", isoDate: "2026-10-10", dayLabel: "10 October 2026", venue: "Grizedale", category: "Outdoor", emoji: "🚗", free: false, link: "https://www.lakelandtrials.co.uk" },
  { title: "Wordsworth Trust Events", isoDate: "2026-01-01", dayLabel: "Year-round", venue: "Grasmere", category: "Culture", emoji: "📚", free: false, link: "https://wordsworth.org.uk" },
];

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

export const BLOG_POSTS: BlogPost[] = [
  // ── Lakes Guide Editorial Posts ────────────────────────────────────────────
  {
    slug: "best-restaurants-keswick",
    title: "Best Restaurants in Keswick",
    excerpt: "Where to eat in Keswick. The honest guide to the town's best restaurants, from post-walk dinners to proper lunches. No filler, just the places worth your time.",
    categorySlug: "food-drink",
    image: "/images/blog/keswick-restaurant.jpg",
    date: "9 Mar 2026",
    author: "damian",
    featured: true,
  },
  {
    slug: "best-pubs-ambleside",
    title: "Best Pubs in Ambleside",
    excerpt: "The best pubs in Ambleside for a post-walk pint or a proper evening meal. Practical details on which ones to use, when to book, and what to order.",
    categorySlug: "pubs",
    image: "/images/blog/ambleside-pub.jpg",
    date: "9 Mar 2026",
    author: "damian",
    featured: true,
  },
  {
    slug: "helvellyn-what-to-expect",
    title: "Helvellyn: What to Expect",
    excerpt: "The honest guide to walking Helvellyn. Striding Edge, conditions, what to bring, when to go, and what most people get wrong on their first attempt.",
    categorySlug: "walks",
    image: "/images/blog/helvellyn.jpg",
    date: "9 Mar 2026",
    author: "damian",
    featured: true,
  },
  {
    slug: "scafell-pike-complete-guide",
    title: "Scafell Pike: The Complete Guide",
    excerpt: "Everything you need to know before walking Scafell Pike. Routes, conditions, gear, parking, and the one mistake most people make on England's highest mountain.",
    categorySlug: "walks",
    image: "/images/blog/scafell-pike.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "where-to-stay-windermere",
    title: "Where to Stay in Windermere",
    excerpt: "Hotels, B&Bs, and self-catering options in Windermere and Bowness. Practical advice on which area to base yourself and what each option actually costs.",
    categorySlug: "where-to-stay",
    image: "/images/blog/windermere-stay.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "grasmere-vs-ambleside",
    title: "Grasmere vs Ambleside: Where to Base Yourself",
    excerpt: "Two different experiences five minutes apart. Grasmere is quieter, more literary, and better positioned for the central fells. Ambleside is a proper town with more to do on a rainy day. Which one suits you?",
    categorySlug: "local-guides",
    image: "/images/blog/grasmere-ambleside.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "best-family-days-out-lake-district",
    title: "Best Family Days Out in the Lake District",
    excerpt: "Field-tested family days out in the Lakes. What actually works with children, what to avoid, and the activities that justify the drive.",
    categorySlug: "local-guides",
    image: "/images/blog/family-lakes.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "autumn-in-the-lake-district",
    title: "Autumn in the Lake District",
    excerpt: "October and November in the Lakes. The crowds thin, the colours are extraordinary, the deer rut is on, and the pubs are better than ever. Why autumn is the best time to visit.",
    categorySlug: "local-guides",
    image: "/images/blog/autumn-lakes.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "the-open-2026-staying-lake-district",
    title: "The Open 2026: Staying in the Lake District",
    excerpt: "Royal Birkdale is 45 minutes from the southern Lakes. If Southport and Formby are full, the Lake District is a genuine option for Open week accommodation. Here is what you need to know.",
    categorySlug: "events",
    image: "/images/blog/open-2026.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "week-itinerary-lake-district",
    title: "One Week in the Lake District: An Itinerary",
    excerpt: "Seven days in the Lakes, day by day. A practical itinerary covering the best fells, villages, boat trips, and pubs, designed for someone who wants to see the Lakes properly.",
    categorySlug: "local-guides",
    image: "/images/blog/week-lakes.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "wainwrights-beginners-guide",
    title: "The Wainwrights: A Beginner's Guide",
    excerpt: "214 fells, one obsession. What the Wainwrights are, where to start, how long it takes to complete them, and why people who begin never quite stop.",
    categorySlug: "walks",
    image: "/images/blog/wainwrights.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "dog-walking-lake-district",
    title: "Dog Walking in the Lake District",
    excerpt: "Where to walk with dogs, which pubs let them in, and the practical things you need to know. Sheep, ticks, midges, and the best fell routes for dogs.",
    categorySlug: "local-guides",
    image: "/images/blog/dog-walking-lakes.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "rainy-day-lake-district-guide",
    title: "Rainy Day in the Lake District",
    excerpt: "It will rain. Here is the plan. The best museums, indoor activities, wet weather walks, and where to eat when the clouds come in and refuse to shift.",
    categorySlug: "local-guides",
    image: "/images/blog/rainy-lakes.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "keswick-market-guide",
    title: "Keswick Market: The Honest Guide",
    excerpt: "Keswick market runs Thursday and Saturday on the Market Square. What is there, what is worth buying, and how long you actually need. No fluff.",
    categorySlug: "shopping",
    image: "/images/blog/keswick-market.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "ullswater-by-boat",
    title: "Ullswater by Boat",
    excerpt: "Taking the Ullswater Steamers. Routes, timetables, how to combine a boat trip with a walk, and why the Howtown to Glenridding approach is one of the best days out in the Lakes.",
    categorySlug: "activities",
    image: "/images/blog/ullswater-boat.jpg",
    date: "9 Mar 2026",
    author: "damian",
  },
];

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
