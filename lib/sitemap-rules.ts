// Which listing-driven pages go in the sitemap. No imports, so
// tests/sitemap-rules.test.mjs can load this file directly.
//
// Decision (11 Nov 2026): pages that have nothing to list stay out of the
// sitemap and come back by themselves once they have listings. The counts come
// from lib/listing-presence.ts, which uses the same queries that fill the pages.

/** Category pages that are only a list of businesses (no guide text of their own). */
export const LISTING_ONLY_CATEGORY_SLUGS: readonly string[] = ["walks", "villages"];

/** A category page is in the sitemap unless it is listing-only and has no listings. */
export function includeCategoryPage(slug: string, listingCount: number): boolean {
  return !LISTING_ONLY_CATEGORY_SLUGS.includes(slug) || listingCount > 0;
}

/**
 * A collection page is in the sitemap once it has enough listings to be indexed
 * (the page itself serves noindex below minListings, so the two always agree).
 */
export function includeCollectionPage(listingCount: number, minListings: number): boolean {
  return listingCount >= minListings;
}
