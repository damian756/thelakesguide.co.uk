// Plain page counts: the page, the day and a number. Nothing about the visitor
// is stored: no IP address, cookie, user agent, referrer or device.
// No imports, so tests/page-count.test.mjs can load this file directly.

// Known bots, crawlers, link previewers, monitors and scripted clients. The
// user agent is read only to leave these out; it is never stored. Covers the
// site's existing list in app/api/p/route.ts (bot, crawler, spider, Googlebot,
// Bingbot, Slurp, DuckDuckBot, Baiduspider, YandexBot, facebookexternalhit,
// Twitterbot, LinkedInBot) and adds the common ones that list lets through.
const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python|java\/|okhttp|go-http|node-fetch|axios|httpclient|libwww|scrapy|phantomjs|selenium|puppeteer|playwright|ahrefs|semrush|mj12|petal|bytespider|gptbot|ccbot|claude|anthropic|perplexity|applebot|duckduck|baidu|yandex|sogou|exabot|seznam|vercel/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || !ua.trim()) return true;
  return BOT_UA.test(ua);
}

const EXCLUDED_PREFIXES = ["/api", "/admin", "/dashboard", "/_next"];
const SAFE_PATH = /^\/[A-Za-z0-9\-._~%/]*$/;

/** The page path to count, or null if it is not a site page. */
export function cleanCountPath(raw: string): string | null {
  const path = raw.trim().split(/[?#]/)[0];
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.length > 300) return null;
  if (!SAFE_PATH.test(path)) return null;
  if (EXCLUDED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  return path;
}

/**
 * The site's fixed pages (every app/.../page.tsx without a [segment], outside
 * app/dashboard and app/admin). tests/page-count.test.mjs checks this list
 * against the app folder.
 */
export const STATIC_PATHS: readonly string[] = [
  "/",
  "/about",
  "/advertise",
  "/ambleside",
  "/blog",
  "/claim-listing",
  "/claim-listing/activate",
  "/collections",
  "/coniston",
  "/contact",
  "/dog-friendly-lake-district",
  "/events",
  "/grasmere",
  "/guides",
  "/keswick",
  "/lake-district-walks",
  "/lake-district-wildlife",
  "/lake-district-with-kids",
  "/parking",
  "/pricing",
  "/privacy",
  "/rainy-day-lake-district",
  "/terms",
  "/the-open-2026",
  "/things-to-do",
  "/windermere",
];

const STATIC_SET = new Set(STATIC_PATHS);

/** A business slug as the importers make them. */
const LISTING_SLUG = /^[a-z0-9_-]{1,150}$/;

export type KnownRoutes = {
  /** Slugs from BLOG_POSTS (lib/lakes-data.ts). */
  blogSlugs: ReadonlySet<string>;
  /** Slugs from BLOG_CATEGORIES (lib/lakes-data.ts). */
  blogCategorySlugs: ReadonlySet<string>;
  /** Slugs from CATEGORIES (lib/config.ts). */
  categorySlugs: ReadonlySet<string>;
  /** Slugs from COLLECTIONS (lib/collections-config.ts). */
  collectionSlugs: ReadonlySet<string>;
  /** Slugs from GUIDES (lib/guides-config.ts). */
  guideSlugs: ReadonlySet<string>;
};

/**
 * True only for a page the site has: a fixed page, a blog post or blog
 * category, a category, a collection, a guide, a car park, or
 * /<category>/<listing-slug> under a real category. Anything else is not
 * counted, so made-up paths cannot fill the table.
 */
export function isKnownPath(path: string, known: KnownRoutes): boolean {
  if (STATIC_SET.has(path)) return true;
  const parts = path.split("/").slice(1);
  if (parts.length === 1) return known.categorySlugs.has(parts[0]);
  if (parts.length === 3) {
    return parts[0] === "blog" && parts[1] === "category" && known.blogCategorySlugs.has(parts[2]);
  }
  if (parts.length !== 2) return false;
  const [first, second] = parts;
  if (first === "blog") return known.blogSlugs.has(second);
  if (first === "collections") return known.collectionSlugs.has(second);
  if (first === "guides") return known.guideSlugs.has(second);
  if (first === "parking") return LISTING_SLUG.test(second);
  return known.categorySlugs.has(first) && LISTING_SLUG.test(second);
}

/**
 * True when the browser says the request came from another site. The beacon
 * always sends same-origin; a request with no Sec-Fetch-Site header (older
 * browsers) is allowed.
 */
export function isCrossSiteRequest(secFetchSite: string | null | undefined): boolean {
  return secFetchSite != null && secFetchSite !== "same-origin";
}
