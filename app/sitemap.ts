import { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/config";
import { BLOG_POSTS } from "@/lib/lakes-data";
import { GUIDES } from "@/lib/guides-config";
import { COLLECTIONS, MIN_LISTINGS } from "@/lib/collections-config";
import { countCategoryBusinesses, countCollectionBusinesses } from "@/lib/listing-presence";
import { LISTING_ONLY_CATEGORY_SLUGS, includeCategoryPage, includeCollectionPage } from "@/lib/sitemap-rules";

// Rebuilt hourly, so a page that gains listings rejoins the sitemap by itself.
export const revalidate = 3600;

const BASE = "https://www.thelakesguide.co.uk";

// Blog posts store dates as "D Mon YYYY" e.g. "15 Feb 2026"
const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};
function parsePostDate(dateStr: string): Date {
  const [day, mon, year] = dateStr.split(" ");
  const iso = `${year}-${MONTHS[mon] ?? "01"}-${day.padStart(2, "0")}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? new Date("2026-02-01") : d;
}

// Stable reference dates — update these when the relevant pages change meaningfully
const D = {
  today:    new Date("2026-11-11"), // last deploy / significant update
  feb26:    new Date("2026-02-26"),
  feb20:    new Date("2026-02-20"),
  feb15:    new Date("2026-02-15"),
  feb01:    new Date("2026-02-01"),
  jan01:    new Date("2026-01-01"),
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static / editorial pages ────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                           lastModified: D.today,  changeFrequency: "weekly",   priority: 1.0 },
    { url: `${BASE}/events`,               lastModified: D.today,  changeFrequency: "daily",    priority: 0.9 },
    { url: `${BASE}/blog`,                 lastModified: D.today,  changeFrequency: "weekly",   priority: 0.9 },
    { url: `${BASE}/things-to-do`,         lastModified: D.today,  changeFrequency: "monthly",  priority: 0.95 },
    { url: `${BASE}/claim-listing`,        lastModified: D.feb01,  changeFrequency: "monthly",  priority: 0.8  },
    { url: `${BASE}/advertise`,            lastModified: D.feb01,  changeFrequency: "monthly",  priority: 0.75 },
    { url: `${BASE}/pricing`,              lastModified: D.feb01,  changeFrequency: "monthly",  priority: 0.75 },
    { url: `${BASE}/windermere`,           lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/keswick`,              lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/ambleside`,            lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/grasmere`,             lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/coniston`,             lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/lake-district-walks`,       lastModified: D.today,  changeFrequency: "monthly",  priority: 0.9  },
    { url: `${BASE}/dog-friendly-lake-district`, lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/lake-district-with-kids`,    lastModified: D.today,  changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/rainy-day-lake-district`,    lastModified: D.today,  changeFrequency: "monthly",  priority: 0.82 },
    { url: `${BASE}/guides`,               lastModified: D.feb15,  changeFrequency: "monthly",  priority: 0.90 },
    { url: `${BASE}/about`,                lastModified: D.feb01,  changeFrequency: "monthly",  priority: 0.5  },
    { url: `${BASE}/contact`,              lastModified: D.feb01,  changeFrequency: "monthly",  priority: 0.5  },
    { url: `${BASE}/privacy`,              lastModified: D.jan01,  changeFrequency: "yearly",   priority: 0.2  },
    { url: `${BASE}/terms`,                lastModified: D.jan01,  changeFrequency: "yearly",   priority: 0.2  },
    { url: `${BASE}/the-open-2026`,        lastModified: D.today,  changeFrequency: "yearly",   priority: 0.3  },
    { url: `${BASE}/lake-district-wildlife`, lastModified: D.today, changeFrequency: "monthly",  priority: 0.85 },
    { url: `${BASE}/parking`,              lastModified: D.today,  changeFrequency: "weekly",   priority: 0.85 },
  ];

  // ── Guide pages (generated from config) ─────────────────────
  const guidePages: MetadataRoute.Sitemap = GUIDES.filter((g) => g.status === "published").map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.dateUpdated),
    changeFrequency: (g.tags.includes("events") ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: g.seoPriority,
  }));

  // ── Category listing pages ───────────────────────────────────
  // Listing-only categories (walks, villages) join once they have listings.
  const categoryCounts = new Map<string, number>();
  for (const slug of LISTING_ONLY_CATEGORY_SLUGS) categoryCounts.set(slug, await countCategoryBusinesses(slug));
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES
    .filter((c) => includeCategoryPage(c.slug, categoryCounts.get(c.slug) ?? 0))
    .map((c) => ({
      url: `${BASE}/${c.slug}`,
      lastModified: D.feb15,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  // ── Blog posts ───────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: parsePostDate(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // ── Individual business pages ────────────────────────────────
  let businessPages: MetadataRoute.Sitemap = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    const businesses = await prisma.business.findMany({
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    businessPages = businesses.map((b) => ({
      url: `${BASE}/${b.category.slug}/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));
  } catch {
    // DB unavailable at build time
  }

  // ── Collection pages ─────────────────────────────────────────
  const collectionIndexPage: MetadataRoute.Sitemap = [
    { url: `${BASE}/collections`, lastModified: D.feb15, changeFrequency: "weekly" as const, priority: 0.8 },
  ];
  // A collection joins once it has enough listings to be indexed (the page is noindex below that).
  const collectionCounts = await Promise.all(COLLECTIONS.map((c) => countCollectionBusinesses(c)));
  const collectionPages: MetadataRoute.Sitemap = COLLECTIONS
    .filter((_, i) => includeCollectionPage(collectionCounts[i], MIN_LISTINGS))
    .map((c) => ({
      url: `${BASE}/collections/${c.slug}`,
      lastModified: D.feb15,
      changeFrequency: "monthly" as const,
      priority: c.priority,
    }));

  return [...staticPages, ...guidePages, ...categoryPages, ...blogPages, ...businessPages, ...collectionIndexPage, ...collectionPages];
}
