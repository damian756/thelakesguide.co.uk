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
}

export const BLOG_POSTS: BlogPost[] = [
  // ── Lakes Guide Editorial Posts ────────────────────────────────────────────
  {
    slug: "lake-district-in-winter",
    title: "The Lake District in Winter: What to Expect from December to February",
    excerpt: "Short days, snow on the high fells and quieter valleys. Daylight hours, fell top reports, winter kit, boats and roads in the Lake District from December to February.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    imageAlt: "Snow-covered mountain ridges under a starry night sky",
    date: "11 Nov 2026",
    author: "damian",
  },
  {
    slug: "lake-district-without-a-car",
    title: "The Lake District Without a Car: Trains, Buses and Boats",
    excerpt: "How to get to and around the Lake District without a car: the Lakes Line to Windermere, the 555 and other buses, bus fares, lake boats and the Windermere ferry.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    imageAlt: "A rowing boat on a clear green lake below steep wooded mountains",
    date: "11 Nov 2026",
    author: "damian",
  },
  {
    slug: "best-restaurants-keswick",
    title: "Eating Out in Keswick",
    excerpt: "Places to eat in and around Keswick, from a craft bakery on Main Street and a pub on Lake Road to a hotel restaurant on Derwentwater, with addresses and what each serves.",
    categorySlug: "food-drink",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    imageAlt: "A plated dish and wine glasses on a restaurant table",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "best-pubs-ambleside",
    title: "Pubs in and around Ambleside",
    excerpt: "Pubs in and near Ambleside, from Smithy Brow to Barngates and Great Langdale: where they are, what they serve, and which welcome dogs, from each pub's own website.",
    categorySlug: "pubs",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    imageAlt: "Tables and chairs in a large café with a counter and hanging lights",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "helvellyn-what-to-expect",
    title: "Helvellyn: What to Expect",
    excerpt: "Walking Helvellyn: Striding Edge, Swirral Edge and the Grisedale route, conditions, what to bring, and what most people get wrong on their first attempt.",
    categorySlug: "walks",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "scafell-pike-complete-guide",
    title: "Scafell Pike: Routes, Parking and What to Bring",
    excerpt: "Before you walk Scafell Pike: the Wasdale, Langdale and Corridor routes, where to park, what to bring, and the one mistake most people make on England's highest mountain.",
    categorySlug: "walks",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    imageAlt: "Two walkers with rucksacks on a mountain path below snow-capped peaks",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "where-to-stay-windermere",
    title: "Where to Stay in Windermere",
    excerpt: "Hotels, B&Bs and self-catering in Windermere and Bowness, and how the two places differ as a base.",
    categorySlug: "where-to-stay",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "grasmere-vs-ambleside",
    title: "Grasmere vs Ambleside: Where to Base Yourself",
    excerpt: "Two different bases four miles apart. Grasmere is quieter, with Dove Cottage and the central fells on the doorstep. Ambleside is a town with more to do on a rainy day. Which one suits you?",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "best-family-days-out-lake-district",
    title: "Family Days Out in the Lake District",
    excerpt: "Family days out in the Lakes: an easy tarn walk, boat and steam train trips, waterfalls, and indoor options for wet days, with postcodes and winter opening notes.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "autumn-in-the-lake-district",
    title: "Autumn in the Lake District",
    excerpt: "October and November in the Lakes: autumn colour, the red deer rut in Martindale, shorter days on the fells, and pubs with open fires.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "the-open-2026-staying-lake-district",
    title: "The Open 2026: Staying in the Lake District",
    excerpt: "Written before The Open at Royal Birkdale in July 2026: how the southern Lakes worked as a base for the championship. Kept for reference.",
    categorySlug: "events",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    imageAlt: "A valley of pine trees below snow-capped mountains",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "week-itinerary-lake-district",
    title: "One Week in the Lake District: An Itinerary",
    excerpt: "Seven days in the Lakes, day by day: Catbells, Langdale, Grasmere, Helvellyn, Coniston and Ullswater, with boat trips and places to eat along the way.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    imageAlt: "A valley of pine trees below snow-capped mountains",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "wainwrights-beginners-guide",
    title: "The Wainwrights: A Beginner's Guide",
    excerpt: "What the Wainwrights are, which of the 214 fells suit a beginner, how people go about completing them, and the books that describe them.",
    categorySlug: "walks",
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "dog-walking-lake-district",
    title: "Dog Walking in the Lake District",
    excerpt: "Where to walk with dogs, which pubs say dogs are welcome, and the practical things you need to know about sheep, ticks and blue-green algae.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "rainy-day-lake-district-guide",
    title: "Rainy Day in the Lake District",
    excerpt: "It will rain. Here is the plan: museums, indoor options, wet-weather walks and pubs with open fires, with winter opening notes.",
    categorySlug: "local-guides",
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80",
    imageAlt: "A walker sitting on a rock above misty hills at sunrise",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "keswick-market-guide",
    title: "Keswick Market: Days, Stalls and Parking",
    excerpt: "Keswick's street market is on the Market Square every Thursday and Saturday. When it runs, what is sold, and where to park.",
    categorySlug: "shopping",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
    date: "9 Mar 2026",
    author: "damian",
  },
  {
    slug: "ullswater-by-boat",
    title: "Ullswater by Boat",
    excerpt: "Ullswater by boat: the piers, journey times, dogs, winter sailings, and the lakeshore walk from Howtown back to Glenridding.",
    categorySlug: "activities",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
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
