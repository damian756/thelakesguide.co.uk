import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanCountPath, isBotUserAgent, isCrossSiteRequest, isKnownPath, type KnownRoutes } from "@/lib/page-count";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/lakes-data";
import { CATEGORIES } from "@/lib/config";
import { COLLECTIONS } from "@/lib/collections-config";
import { GUIDES } from "@/lib/guides-config";

// Adds one to today's count for a page. Sent by components/PageCountBeacon.tsx.
// Stores the path, the day and the number only. No cookies, no visitor data.
// Separate from the old PageView table and app/api/p, which are left as they are.

const KNOWN: KnownRoutes = {
  blogSlugs: new Set(BLOG_POSTS.map((p) => p.slug)),
  blogCategorySlugs: new Set(BLOG_CATEGORIES.map((c) => c.slug)),
  categorySlugs: new Set(CATEGORIES.map((c) => c.slug)),
  collectionSlugs: new Set(COLLECTIONS.map((c) => c.slug)),
  guideSlugs: new Set(GUIDES.map((g) => g.slug)),
};

function done() {
  return new Response(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  // Only the live site counts: local dev and preview deployments never write.
  if (process.env.VERCEL_ENV !== "production") return done();

  // The beacon is same-origin; a request another site makes is dropped.
  if (isCrossSiteRequest(req.headers.get("sec-fetch-site"))) return done();

  // Read to leave out bots; never stored.
  if (isBotUserAgent(req.headers.get("user-agent"))) return done();

  let body = "";
  try {
    body = await req.text();
  } catch {
    return done();
  }
  if (body.length > 600) return done();

  // Only pages the site actually has.
  const path = cleanCountPath(body);
  if (!path || !isKnownPath(path, KNOWN)) return done();

  try {
    await prisma.$executeRaw`
      INSERT INTO "PageCount" ("path", "day", "count")
      VALUES (${path}, CURRENT_DATE, 1)
      ON CONFLICT ("path", "day") DO UPDATE SET "count" = "PageCount"."count" + 1
    `;
  } catch {
    // A failed count must never affect the visitor.
  }
  return done();
}
