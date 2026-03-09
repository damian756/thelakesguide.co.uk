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
      "Dog-friendly restaurants in the Lake District. Places that welcome dogs inside. Updated local list.",
    intro:
      "Finding a restaurant that genuinely welcomes dogs takes a bit of research. These are the places in the Lake District that actually mean it. Worth phoning ahead for evening visits.",
    tags: ["dog-friendly"],
    categorySlugs: ["restaurants"],
    emoji: "🐾",
    priority: 0.8,
  },
  {
    slug: "dog-friendly-pubs-lake-district",
    title: "Dog-Friendly Pubs in the Lake District",
    metaDescription:
      "Dog-friendly pubs in the Lake District. Post-walk pubs that welcome dogs. The honest local list.",
    intro:
      "Post-walk pub visits with the dog in tow work much better when you know which pubs are genuinely on board. These are the Lake District's most reliably dog-welcoming pubs.",
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
      "A decent coffee after a walk is non-negotiable. These Lake District cafés are the ones that mean it when they say dogs are welcome.",
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
      "Family dining in the Lake District. These are the restaurants that actively cater for families.",
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
      "The Lake District is genuinely good for families. These are the activities that are actually worth the trip with kids in tow.",
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
      "Pubs with a view of the water. These are the Lake District pubs where you can sit outside and look at the lake.",
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
      "Cafés where you can sit with a coffee and look at the water. The Lake District has a few. Worth seeking out.",
    tags: ["lake-views"],
    categorySlugs: ["cafes"],
    emoji: "☕",
    priority: 0.75,
  },
  {
    slug: "pubs-after-a-walk-lake-district",
    title: "Pubs After a Walk in the Lake District",
    metaDescription:
      "Post-walk pubs in the Lake District. Boots-off, beer-in-hand. The honest list.",
    intro:
      "The best part of a day on the fells is the pub afterwards. These Lake District pubs are the ones walkers actually use. Boots off, beer in hand.",
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
      "The Lake District has a handful of serious restaurants. Book ahead. Dress code varies. These are the places for a proper treat.",
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
      "Parking in the Lake District can be a hassle. These places have their own parking or direct access to nearby car parks.",
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
      "The Lake District has a solid range of budget accommodation. These are the affordable options that are still worth staying in.",
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
      "Windermere and Bowness are the busiest bases in the Lakes. Good transport, plenty of options. These are the places to stay if you want to be near the lake.",
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
      "Keswick is the gateway to the northern fells. Skiddaw, Blencathra, Catbells. These are the places to stay if you want to walk from the door.",
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
      "The Lake District has more free things to do than most places. The fells, the lakes, the views. These are the activities that genuinely cost nothing.",
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
