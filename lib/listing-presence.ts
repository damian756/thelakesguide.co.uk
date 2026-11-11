import { prisma } from "@/lib/prisma";
import type { Collection } from "@/lib/collections-config";

// How many businesses a listing page would show. Used by app/sitemap.ts so a
// page joins the sitemap as soon as it has listings. The conditions are the
// same ones the pages use: collectionWhere() is also the where-clause of
// app/collections/[slug]/page.tsx, and the category condition matches the
// raw queries in app/[category]/page.tsx (tests/sitemap-rules.test.mjs checks both).

/** The businesses a collection page lists. */
export function collectionWhere(collection: Pick<Collection, "categorySlugs" | "tags">) {
  return {
    category: { slug: { in: collection.categorySlugs } },
    tags: { hasEvery: collection.tags },
  };
}

export async function countCollectionBusinesses(collection: Pick<Collection, "categorySlugs" | "tags">): Promise<number> {
  try {
    return await prisma.business.count({ where: collectionWhere(collection) });
  } catch {
    return 0;
  }
}

export async function countCategoryBusinesses(slug: string): Promise<number> {
  try {
    const categoryRecord = await prisma.category.findFirst({ where: { slug } });
    if (!categoryRecord) return 0;
    const catId = categoryRecord.id;
    const rows = await prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM "Business"
      WHERE "categoryId" = ${catId} OR ${catId} = ANY("secondaryCategoryIds")
    `;
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}
