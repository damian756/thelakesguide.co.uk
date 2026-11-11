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
    description: "Where to eat and drink across the Lake District.",
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
    description: "Pubs and inns across the Lake District, with what each one offers.",
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
    description: "Practical guides to planning a visit to the Lake District.",
  },
  {
    slug: "events",
    label: "Events",
    color: "#8B5A1A",
    emoji: "🎉",
    description: "What's on in the Lake District.",
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
  /** Describes the picture itself (alt text). Falls back to the title. */
  imageAlt?: string;
  date: string;
  /** Omit for default Damian author. Set to "terry" for posts written by Terry. */
  author?: "terry" | "damian";
  /**
   * Set only for a sponsored article (see /advertise). The post is labelled
   * Sponsored, its byline is "Sponsored by <name>" with no author box, its
   * outbound links carry rel="sponsored noopener", and it shows no other advert.
   */
  sponsor?: { name: string; url: string };
}

export const BLOG_POSTS: BlogPost[] = [
  // ── Lakes Guide Editorial Posts ────────────────────────────────────────────
  {
    slug: "lake-district-in-winter",
    title: "The Lake District in Winter: What to Expect from December to February",
    excerpt: "Short days, snow on the high fells and quieter valleys. Daylight hours, fell top reports, winter kit, boats and roads in the Lake District from December to February.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-winter-fells-2400.webp",
    imageAlt: "Illustration of snow-covered fells above a frozen tarn, with a stone wall, bare trees and a farmhouse",
    date: "11 Nov 2026",
    author: "damian",
  },
  {
    slug: "lake-district-without-a-car",
    title: "The Lake District Without a Car: Trains, Buses and Boats",
    excerpt: "How to get to and around the Lake District without a car: the Lakes Line to Windermere, the 555 and other buses, bus fares, lake boats and the Windermere ferry.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-bus-train-2400.webp",
    imageAlt: "Illustration of a small steam train on a stone bridge and a green country bus on a lakeside road in a valley",
    date: "11 Nov 2026",
    author: "damian",
  },
  {
    slug: "best-restaurants-keswick",
    title: "Eating Out in Keswick",
    excerpt: "Places to eat in and around Keswick, from a craft bakery on Main Street and a pub on Lake Road to a hotel restaurant on Derwentwater, with addresses and what each serves.",
    categorySlug: "food-drink",
    image: "/images/illustrations/post-village-street-2400.webp",
    imageAlt: "Illustration of a village street of stone cottages with slate roofs and colourful doors, with fells behind",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "best-pubs-ambleside",
    title: "Pubs in and around Ambleside",
    excerpt: "Pubs in and near Ambleside, from Smithy Brow to Barngates and Great Langdale: where they are, what they serve, and which welcome dogs, from each pub's own website.",
    categorySlug: "pubs",
    image: "/images/illustrations/post-pub-2400.webp",
    imageAlt: "Illustration of a whitewashed country pub with a slate roof and its door open, with pints of ale on a picnic bench outside",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "helvellyn-what-to-expect",
    title: "Helvellyn: What to Expect",
    excerpt: "Walking Helvellyn: Striding Edge, Swirral Edge and the Grisedale route, conditions, what to bring, and what most people get wrong on their first attempt.",
    categorySlug: "walks",
    image: "/images/illustrations/post-fell-walk-2400.webp",
    imageAlt: "Illustration of a stone path climbing a grassy fellside to a summit cairn, with a lake and ridges beyond",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "scafell-pike-complete-guide",
    title: "Scafell Pike: Routes, Parking and What to Bring",
    excerpt: "Before you walk Scafell Pike: the Wasdale, Langdale and Corridor routes, where to park, what to bring, and the one mistake most people make on England's highest mountain.",
    categorySlug: "walks",
    image: "/images/illustrations/post-fell-walk-2400.webp",
    imageAlt: "Illustration of a stone path climbing a grassy fellside to a summit cairn, with a lake and ridges beyond",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "where-to-stay-windermere",
    title: "Where to Stay in Windermere",
    excerpt: "Hotels, B&Bs and self-catering in Windermere and Bowness, and how the two places differ as a base.",
    categorySlug: "where-to-stay",
    image: "/images/illustrations/post-lake-boat-2400.webp",
    imageAlt: "Illustration of a lake cruise boat moored at a wooden pier, with rowing boats, a wooded shore and fells behind",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "grasmere-vs-ambleside",
    title: "Grasmere vs Ambleside: Where to Base Yourself",
    excerpt: "Two different bases four miles apart. Grasmere is quieter, with Dove Cottage and the central fells on the doorstep. Ambleside is a town with more to do on a rainy day. Which one suits you?",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-village-street-2400.webp",
    imageAlt: "Illustration of a village street of stone cottages with slate roofs and colourful doors, with fells behind",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "best-family-days-out-lake-district",
    title: "Family Days Out in the Lake District",
    excerpt: "Family days out in the Lakes: an easy tarn walk, boat and steam train trips, waterfalls, and indoor options for wet days, with postcodes and winter opening notes.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-family-lake-2400.webp",
    imageAlt: "Illustration of a picnic on a grassy lakeshore, with a parent and two children paddling at the water's edge and a kayak on the lake",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "autumn-in-the-lake-district",
    title: "Autumn in the Lake District",
    excerpt: "October and November in the Lakes: autumn colour, the red deer rut in Martindale, shorter days on the fells, and pubs with open fires.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-autumn-woodland-2400.webp",
    imageAlt: "Illustration of autumn woodland in copper and gold, with a leafy path and a beck with stepping stones",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "the-open-2026-staying-lake-district",
    title: "The Open 2026: Staying in the Lake District",
    excerpt: "Written before The Open at Royal Birkdale in July 2026: how the southern Lakes worked as a base for the championship. Kept for reference.",
    categorySlug: "events",
    image: "/images/illustrations/post-bus-train-2400.webp",
    imageAlt: "Illustration of a small steam train on a stone bridge and a green country bus on a lakeside road in a valley",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "week-itinerary-lake-district",
    title: "One Week in the Lake District: An Itinerary",
    excerpt: "Seven days in the Lakes, day by day: Catbells, Langdale, Grasmere, Helvellyn, Coniston and Ullswater, with boat trips and places to eat along the way.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-lake-boat-2400.webp",
    imageAlt: "Illustration of a lake cruise boat moored at a wooden pier, with rowing boats, a wooded shore and fells behind",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "wainwrights-beginners-guide",
    title: "The Wainwrights: A Beginner's Guide",
    excerpt: "What the Wainwrights are, which of the 214 fells suit a beginner, how people go about completing them, and the books that describe them.",
    categorySlug: "walks",
    image: "/images/illustrations/post-fell-walk-2400.webp",
    imageAlt: "Illustration of a stone path climbing a grassy fellside to a summit cairn, with a lake and ridges beyond",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "dog-walking-lake-district",
    title: "Dog Walking in the Lake District",
    excerpt: "Where to walk with dogs, which pubs say dogs are welcome, and the practical things you need to know about sheep, ticks and blue-green algae.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-dog-tarn-2400.webp",
    imageAlt: "Illustration of a walker and their dog on a path beside a small upland tarn among the fells",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "rainy-day-lake-district-guide",
    title: "Rainy Day in the Lake District",
    excerpt: "It will rain. Here is the plan: museums, indoor options, wet-weather walks and pubs with open fires, with winter opening notes.",
    categorySlug: "local-guides",
    image: "/images/illustrations/post-rainy-day-2400.webp",
    imageAlt: "Illustration of a museum gallery with display cases and paintings, and rain on a tall window looking out to the fells",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "keswick-market-guide",
    title: "Keswick Market: Days, Stalls and Parking",
    excerpt: "Keswick's street market is on the Market Square every Thursday and Saturday. When it runs, what is sold, and where to park.",
    categorySlug: "shopping",
    image: "/images/illustrations/post-village-street-2400.webp",
    imageAlt: "Illustration of a village street of stone cottages with slate roofs and colourful doors, with fells behind",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "ullswater-by-boat",
    title: "Ullswater by Boat",
    excerpt: "Ullswater by boat: the piers, journey times, dogs, winter sailings, and the lakeshore walk from Howtown back to Glenridding.",
    categorySlug: "activities",
    image: "/images/illustrations/post-lake-boat-2400.webp",
    imageAlt: "Illustration of a lake cruise boat moored at a wooden pier, with rowing boats, a wooded shore and fells behind",
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
