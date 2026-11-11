// Empty listing pages stay out of the sitemap and come back by themselves when
// they have listings, using the same data that fills the pages. Pure rules from
// lib/sitemap-rules.ts plus static reads: no database, nothing written.
// Run: node --test tests/sitemap-rules.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { LISTING_ONLY_CATEGORY_SLUGS, includeCategoryPage, includeCollectionPage } from "../lib/sitemap-rules.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/\r\n/g, "\n");

test("walks and villages leave the sitemap while empty and return with listings", () => {
  assert.deepEqual([...LISTING_ONLY_CATEGORY_SLUGS].sort(), ["villages", "walks"]);
  for (const slug of LISTING_ONLY_CATEGORY_SLUGS) {
    assert.equal(includeCategoryPage(slug, 0), false, `${slug} with no listings`);
    assert.equal(includeCategoryPage(slug, 1), true, `${slug} with a listing`);
  }
});

test("the other category pages stay in the sitemap whatever their listings", () => {
  for (const slug of ["restaurants", "cafes", "pubs", "activities", "attractions", "accommodation", "shopping"]) {
    assert.equal(includeCategoryPage(slug, 0), true, slug);
  }
});

test("a collection joins exactly when its page stops being noindex", () => {
  assert.equal(includeCollectionPage(0, 4), false);
  assert.equal(includeCollectionPage(3, 4), false);
  assert.equal(includeCollectionPage(4, 4), true);
  const page = read("app/collections/[slug]/page.tsx");
  assert.match(page, /const isIndexable = count >= MIN_LISTINGS;/, "the page's noindex rule uses MIN_LISTINGS");
});

test("the sitemap counts with the same queries that fill the pages", () => {
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /countCategoryBusinesses\(slug\)/);
  assert.match(sitemap, /countCollectionBusinesses\(c\)/);
  assert.match(sitemap, /includeCategoryPage\(c\.slug/);
  assert.match(sitemap, /includeCollectionPage\(collectionCounts\[i\], MIN_LISTINGS\)/);
  assert.match(sitemap, /export const revalidate = \d+;/, "the sitemap is rebuilt, so pages return by themselves");

  // Collections: the page and the count share collectionWhere().
  const page = read("app/collections/[slug]/page.tsx");
  assert.match(page, /where: collectionWhere\(collection\)/);
  const presence = read("lib/listing-presence.ts");
  assert.match(presence, /prisma\.business\.count\(\{ where: collectionWhere\(collection\) \}\)/);

  // Categories: the count uses the same condition as the category page's queries.
  const condition = 'WHERE "categoryId" = ${catId} OR ${catId} = ANY("secondaryCategoryIds")';
  assert.ok(presence.includes(condition), "listing-presence uses the category condition");
  const categoryPage = read("app/[category]/page.tsx");
  assert.ok(categoryPage.includes(condition), "the category page uses the same condition");
});
