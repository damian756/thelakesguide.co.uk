// ── Collection Pages Config ───────────────────────────────────────────────────
// Programmatic tag-filtered listing pages at /collections/[slug].
// Each entry queries the DB for businesses matching the given tags + categories.
// Pages with fewer than MIN_LISTINGS results are served noindex automatically.

export const MIN_LISTINGS = 4;

export interface Collection {
  slug: string;
  /** H1 and page title */
  title: string;
  /** Meta description */
  metaDescription: string;
  /** Short intro — 60–100 words, shown above the listings */
  intro: string;
  /** Tags to match (business must have ALL of these) */
  tags: string[];
  /** Category slugs to filter by (business must be in ONE of these) */
  categorySlugs: string[];
  /** Emoji shown in the hero */
  emoji: string;
  /** Sitemap priority */
  priority: number;
}

export const COLLECTIONS: Collection[] = [
  // ── Dog-friendly ──────────────────────────────────────────────────────────
  {
    slug: "dog-friendly-restaurants-lake-district",
    title: "Dog-Friendly Restaurants in the Lake District",
    metaDescription:
      "Dog-friendly restaurants in the Lake District: places that welcome dogs inside.",
    intro:
      "Restaurants in the Lake District that welcome dogs inside. Dog policies can differ between the bar and the dining room, so phone ahead for evening visits.",
    tags: ["dog-friendly"],
    categorySlugs: ["restaurants"],
    emoji: "🐾",
    priority: 0.8,
  },
  {
    slug: "dog-friendly-pubs-lake-district",
    title: "Dog-Friendly Pubs in the Lake District",
    metaDescription:
      "Dog-friendly pubs in the Lake District: post-walk pubs that welcome dogs.",
    intro:
      "Lake District pubs that welcome dogs. Rules can differ between the bar and the dining room, so ask when you arrive.",
    tags: ["dog-friendly"],
    categorySlugs: ["pubs"],
    emoji: "🐶",
    priority: 0.8,
  },
  {
    slug: "dog-friendly-cafes-lake-district",
    title: "Dog-Friendly Cafés in the Lake District",
    metaDescription:
      "Dog-friendly cafés in the Lake District. Independent coffee shops and tea rooms that welcome dogs.",
    intro:
      "Lake District cafés and tea rooms that welcome dogs.",
    tags: ["dog-friendly"],
    categorySlugs: ["cafes"],
    emoji: "☕",
    priority: 0.75,
  },

  // ── Family-friendly ────────────────────────────────────────────────────────
  {
    slug: "family-friendly-restaurants-lake-district",
    title: "Family-Friendly Restaurants in the Lake District",
    metaDescription:
      "Family-friendly restaurants in the Lake District. Places with kids' menus and space for families.",
    intro:
      "Lake District restaurants with children's menus and space for families.",
    tags: ["family-friendly"],
    categorySlugs: ["restaurants"],
    emoji: "👨‍👩‍👧‍👦",
    priority: 0.8,
  },
  {
    slug: "family-friendly-activities-lake-district",
    title: "Family-Friendly Things to Do in the Lake District",
    metaDescription:
      "Family-friendly activities in the Lake District. Walks, attractions, and things to do with kids.",
    intro:
      "Activities in the Lake District that suit families with children.",
    tags: ["family-friendly"],
    categorySlugs: ["activities", "walks"],
    emoji: "🎡",
    priority: 0.8,
  },

  // ── Lakeside ───────────────────────────────────────────────────────────────
  {
    slug: "lakeside-pubs-lake-district",
    title: "Lakeside Pubs in the Lake District",
    metaDescription:
      "Pubs with lake views in the Lake District. Post-walk drinks by the water.",
    intro:
      "Lake District pubs with a view of the water.",
    tags: ["lakeside"],
    categorySlugs: ["pubs"],
    emoji: "🏞️",
    priority: 0.8,
  },
  {
    slug: "lakeside-restaurants-lake-district",
    title: "Restaurants with Views in the Lake District",
    metaDescription:
      "Restaurants with lake views in the Lake District. Dining by the water.",
    intro:
      "Restaurants with a view of the water. Book ahead at weekends.",
    tags: ["lakeside"],
    categorySlugs: ["restaurants"],
    emoji: "🍽️",
    priority: 0.78,
  },
  {
    slug: "cafes-with-views-lake-district",
    title: "Cafés with Views in the Lake District",
    metaDescription:
      "Cafés and tea rooms with lake views in the Lake District. Coffee with a view.",
    intro:
      "Lake District cafés where you can sit with a coffee and look at the water.",
    tags: ["lake-views"],
    categorySlugs: ["cafes"],
    emoji: "☕",
    priority: 0.75,
  },
  {
    slug: "pubs-after-a-walk-lake-district",
    title: "Pubs After a Walk in the Lake District",
    metaDescription:
      "Post-walk pubs in the Lake District that welcome walkers.",
    intro:
      "Lake District pubs that welcome walkers after a day on the fells.",
    tags: ["post-walk"],
    categorySlugs: ["pubs"],
    emoji: "🥾",
    priority: 0.8,
  },
  {
    slug: "fine-dining-lake-district",
    title: "Fine Dining in the Lake District",
    metaDescription:
      "Fine dining restaurants in the Lake District. Michelin and high-end dining.",
    intro:
      "Fine dining restaurants in the Lake District. Book ahead; dress codes vary.",
    tags: ["fine-dining"],
    categorySlugs: ["restaurants"],
    emoji: "✨",
    priority: 0.78,
  },

  // ── Accommodation ─────────────────────────────────────────────────────────
  {
    slug: "accommodation-with-parking-lake-district",
    title: "Accommodation with Parking in the Lake District",
    metaDescription:
      "Places to stay with parking in the Lake District. B&Bs, hotels, and holiday lets with on-site parking.",
    intro:
      "Places to stay in the Lake District with their own parking or a car park close by.",
    tags: ["parking"],
    categorySlugs: ["accommodation"],
    emoji: "🏨",
    priority: 0.8,
  },
  {
    slug: "budget-accommodation-lake-district",
    title: "Budget Accommodation in the Lake District",
    metaDescription:
      "Budget accommodation in the Lake District. Affordable places to stay.",
    intro:
      "Affordable places to stay in the Lake District.",
    tags: ["budget"],
    categorySlugs: ["accommodation"],
    emoji: "💷",
    priority: 0.78,
  },
  {
    slug: "accommodation-near-windermere",
    title: "Accommodation Near Windermere",
    metaDescription:
      "Places to stay near Windermere. B&Bs, hotels, and holiday lets in Windermere, Bowness, and the surrounding area.",
    intro:
      "Places to stay in Windermere and Bowness, near the lake, the station and the boats.",
    tags: ["windermere"],
    categorySlugs: ["accommodation"],
    emoji: "🏨",
    priority: 0.85,
  },
  {
    slug: "accommodation-near-keswick",
    title: "Accommodation Near Keswick",
    metaDescription:
      "Places to stay near Keswick. B&Bs, hotels, and holiday lets for the northern fells.",
    intro:
      "Places to stay in and around Keswick, for walking from the door to Skiddaw, Blencathra and Catbells.",
    tags: ["keswick"],
    categorySlugs: ["accommodation"],
    emoji: "🏔️",
    priority: 0.85,
  },

  // ── Free / budget-friendly ────────────────────────────────────────────────
  {
    slug: "free-things-to-do-lake-district",
    title: "Free Things to Do in the Lake District",
    metaDescription:
      "Free things to do in the Lake District. Walks, views, and attractions that cost nothing.",
    intro:
      "Free things to do in the Lake District: the fells, the lake shores and the views.",
    tags: ["free"],
    categorySlugs: ["walks", "activities"],
    emoji: "🎟️",
    priority: 0.82,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getAllCollectionSlugs(): string[] {
  return COLLECTIONS.map((c) => c.slug);
}
