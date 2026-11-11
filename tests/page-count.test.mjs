// /api/count counts only pages the site has, only same-origin, only on the
// live site, and stores the path, the day and a number. Pure helpers from
// lib/page-count.ts plus static reads: no route is called, nothing is written.
// Run: node --test tests/page-count.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_PATHS, cleanCountPath, isBotUserAgent, isCrossSiteRequest, isKnownPath } from "../lib/page-count.ts";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../lib/lakes-data.ts";
import { CATEGORIES } from "../lib/config.ts";
import { COLLECTIONS } from "../lib/collections-config.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFileSync(join(ROOT, p), "utf8");

// lib/guides-config.ts imports without a file extension, so read its slugs.
const GUIDE_SLUGS = [...read("lib/guides-config.ts").matchAll(/^\s{4}slug: "([a-z0-9-]+)",/gm)].map((m) => m[1]);

const KNOWN = {
  blogSlugs: new Set(BLOG_POSTS.map((p) => p.slug)),
  blogCategorySlugs: new Set(BLOG_CATEGORIES.map((c) => c.slug)),
  categorySlugs: new Set(CATEGORIES.map((c) => c.slug)),
  collectionSlugs: new Set(COLLECTIONS.map((c) => c.slug)),
  guideSlugs: new Set(GUIDE_SLUGS),
};

/** Every app/.../page.tsx with no [segment] in its folder path, as a URL path. */
function staticPagesOnDisk() {
  const out = [];
  const go = (dir) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const p = join(dir, name);
      if (statSync(join(ROOT, p)).isDirectory()) {
        if (name.startsWith("[") || name.startsWith("_") || name.startsWith("(")) continue;
        if (["api", "dashboard", "admin"].includes(name) && dir === "app") continue;
        go(p);
      } else if (name === "page.tsx") {
        const rel = dir.split(/[\\/]/).slice(1).join("/");
        out.push(rel ? `/${rel}` : "/");
      }
    }
  };
  go("app");
  return out.sort();
}

test("STATIC_PATHS lists exactly the site's fixed pages", () => {
  assert.deepEqual([...STATIC_PATHS].sort(), staticPagesOnDisk());
});

test("known pages are counted", () => {
  for (const p of ["/", "/about", "/blog", "/keswick", "/things-to-do", "/the-open-2026"]) {
    assert.equal(isKnownPath(p, KNOWN), true, p);
  }
  assert.ok(GUIDE_SLUGS.length > 5, "guide slugs were read");
  assert.equal(isKnownPath(`/blog/${BLOG_POSTS[0].slug}`, KNOWN), true, "a blog post");
  assert.equal(isKnownPath(`/blog/category/${BLOG_CATEGORIES[0].slug}`, KNOWN), true, "a blog category");
  assert.equal(isKnownPath("/restaurants", KNOWN), true, "a category");
  assert.equal(isKnownPath("/restaurants/some-place-keswick", KNOWN), true, "a listing under a real category");
  assert.equal(isKnownPath("/parking/some-car-park", KNOWN), true, "a car park");
  assert.equal(isKnownPath(`/collections/${COLLECTIONS[0].slug}`, KNOWN), true, "a collection");
  assert.equal(isKnownPath(`/guides/${GUIDE_SLUGS[0]}`, KNOWN), true, "a guide");
});

test("made-up paths are not counted", () => {
  for (const p of [
    "/made-up-page",
    "/blog/not-a-real-post",
    "/blog/category/not-a-category",
    "/collections/not-a-collection",
    "/not-a-category/some-place",
    "/restaurants/Some-Place",
    "/restaurants/a/b",
    "/guides/not-a-guide",
    "/the-open-2026/not-a-page",
    "/restaurants/" + "a".repeat(151),
  ]) {
    assert.equal(isKnownPath(p, KNOWN), false, p);
  }
});

test("cleanCountPath keeps the path only and refuses non-site paths", () => {
  assert.equal(cleanCountPath("/about?x=1#y"), "/about");
  for (const bad of ["about", "//evil.example", "/api/count", "/admin", "/dashboard/home", "/_next/static/x", "/" + "a".repeat(300), "/a b"]) {
    assert.equal(cleanCountPath(bad), null, bad);
  }
});

test("requests from another site are refused; same-origin and no header are allowed", () => {
  assert.equal(isCrossSiteRequest("same-origin"), false);
  assert.equal(isCrossSiteRequest(null), false);
  assert.equal(isCrossSiteRequest(undefined), false);
  for (const v of ["cross-site", "same-site", "none", ""]) assert.equal(isCrossSiteRequest(v), true, v);
});

test("bots and empty user agents are left out", () => {
  for (const ua of ["Mozilla/5.0 (compatible; Googlebot/2.1)", "Mozilla/5.0 (compatible; bingbot/2.0)", "facebookexternalhit/1.1", "LinkedInBot/1.0", ""]) {
    assert.equal(isBotUserAgent(ua), true, ua);
  }
  assert.equal(isBotUserAgent(null), true);
  assert.equal(isBotUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0 Safari/537.36"), false);
});

test("the count route: production only, same-origin, bots out, known paths, path/day/count only", () => {
  const src = read("app/api/count/route.ts");
  assert.match(src, /if \(process\.env\.VERCEL_ENV !== "production"\) return done\(\);/);
  assert.match(src, /if \(isCrossSiteRequest\(req\.headers\.get\("sec-fetch-site"\)\)\) return done\(\);/);
  assert.match(src, /if \(isBotUserAgent\(req\.headers\.get\("user-agent"\)\)\) return done\(\);/);
  assert.match(src, /if \(!path \|\| !isKnownPath\(path, KNOWN\)\) return done\(\);/);
  assert.match(src, /INSERT INTO "PageCount" \("path", "day", "count"\)\s+VALUES \(\$\{path\}, CURRENT_DATE, 1\)/);
  assert.equal((src.match(/INSERT INTO/g) ?? []).length, 1, "one write only");
  assert.doesNotMatch(src, /x-forwarded-for|x-real-ip|referer|cookies\(|\.ip\b/i, "nothing else about the visitor is read");
  assert.equal((src.match(/user-agent/g) ?? []).length, 1, "the user agent is read once, to filter");
});

test("the beacon is in the root layout and sends the path only, with no storage", () => {
  const layout = read("app/layout.tsx");
  assert.match(layout, /<PageCountBeacon \/>/);
  const beacon = read("components/PageCountBeacon.tsx");
  assert.match(beacon, /navigator\.sendBeacon\("\/api\/count", pathname\)/);
  assert.doesNotMatch(beacon, /localStorage|sessionStorage|document\.cookie|searchParams/);
});

test("the old PageView route is left alone and nothing calls it", () => {
  const files = [];
  const go = (dir) => {
    for (const name of readdirSync(join(ROOT, dir))) {
      const p = join(dir, name);
      if (statSync(join(ROOT, p)).isDirectory()) go(p);
      else if (/\.(tsx?|mjs)$/.test(name)) files.push(p);
    }
  };
  go("app");
  go("components");
  go("lib");
  for (const f of files) {
    if (f.replace(/\\/g, "/").startsWith("app/api/p/")) continue;
    assert.doesNotMatch(read(f), /["'`]\/api\/p["'`?]/, f);
  }
});
