import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get all categories
  const categories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));

  // Get all businesses with their primary category and current secondary categories
  const businesses = await prisma.business.findMany({
    select: {
      id: true,
      name: true,
      categoryId: true,
      description: true,
      shortDescription: true,
      secondaryCategoryIds: true,
    },
  });

  console.log(`\nTotal businesses: ${businesses.length}`);
  console.log("\nPrimary category breakdown:");
  const counts: Record<string, number> = {};
  for (const b of businesses) {
    const cat = catById[b.categoryId]?.slug ?? "unknown";
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  for (const [slug, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${slug}: ${count}`);
  }

  // Rules for secondary category assignment
  // keyword patterns → additional category slugs
  const RULES: Array<{ test: (name: string, desc: string, primarySlug: string) => boolean; addSlug: string }> = [
    // Hotels that serve food → restaurants
    {
      test: (_, desc, primary) =>
        primary === "hotels" &&
        /restaurant|dining|dinner|lunch|breakfast|food|brasserie|bistro|café|cafe/i.test(desc),
      addSlug: "restaurants",
    },
    // Pubs/bars that serve food → restaurants
    {
      test: (_, desc, primary) =>
        primary === "bars-nightlife" &&
        /food|menu|dining|restaurant|kitchen|lunch|dinner|eat|meal|carvery|bistro/i.test(desc),
      addSlug: "restaurants",
    },
    // Restaurants that are clearly also a bar/pub → bars-nightlife
    {
      test: (name, desc, primary) =>
        primary === "restaurants" &&
        /\bpub\b|bar|inn\b|tavern|ale|beer|cocktail|nightlife/i.test(name + " " + desc),
      addSlug: "bars-nightlife",
    },
    // Cafes that serve full meals → restaurants
    {
      test: (_, desc, primary) =>
        primary === "cafes" &&
        /full menu|dinner|evening meal|restaurant|à la carte|a la carte/i.test(desc),
      addSlug: "restaurants",
    },
    // Hotels that also appear to be B&Bs/guesthouses (small) — keep as hotels, no change needed
    // Attractions with food → restaurants
    {
      test: (_, desc, primary) =>
        primary === "attractions" &&
        /restaurant|dining|café|cafe|food|eat|bistro/i.test(desc),
      addSlug: "restaurants",
    },
    // Golf clubs with food/bar → bars-nightlife
    {
      test: (_, desc, primary) =>
        primary === "golf" &&
        /bar|restaurant|dining|food|clubhouse/i.test(desc),
      addSlug: "bars-nightlife",
    },
  ];

  const updates: Array<{ id: string; name: string; primarySlug: string; addSlugs: string[] }> = [];

  for (const b of businesses) {
    const primarySlug = catById[b.categoryId]?.slug ?? "";
    const desc = ((b.description ?? "") + " " + (b.shortDescription ?? "")).trim();
    const addSlugs: string[] = [];

    for (const rule of RULES) {
      const targetSlug = rule.addSlug;
      // Don't add if it's already the primary category
      if (targetSlug === primarySlug) continue;
      // Don't add if already assigned
      if (b.secondaryCategoryIds.includes(catBySlug[targetSlug]?.id ?? "")) continue;
      if (rule.test(b.name, desc, primarySlug)) {
        addSlugs.push(targetSlug);
      }
    }

    if (addSlugs.length > 0) {
      updates.push({ id: b.id, name: b.name, primarySlug, addSlugs });
    }
  }

  console.log(`\nBusinesses to receive secondary categories: ${updates.length}`);
  for (const u of updates) {
    console.log(`  [${u.primarySlug}] ${u.name} → also: ${u.addSlugs.join(", ")}`);
  }

  // Apply updates
  console.log("\nApplying updates...");
  let applied = 0;
  for (const u of updates) {
    const currentBiz = businesses.find((b) => b.id === u.id)!;
    const newSecondaryIds = [...new Set([
      ...currentBiz.secondaryCategoryIds,
      ...u.addSlugs.map((slug) => catBySlug[slug]?.id).filter(Boolean) as string[],
    ])];
    await prisma.business.update({
      where: { id: u.id },
      data: { secondaryCategoryIds: newSecondaryIds },
    });
    applied++;
  }

  console.log(`\nDone. Applied secondary categories to ${applied} businesses.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
