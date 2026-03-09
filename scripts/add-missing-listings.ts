import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const MISSING_BUSINESSES = [
  {
    slug: "travelodge-southport-central",
    name: "Travelodge Southport Central",
    categorySlug: "hotels",
    address: "Cumberland Place, Southport",
    postcode: "PR8 1NZ",
    phone: "0871 984 6272",
    website: "https://www.travelodge.co.uk/hotels/southport",
    shortDescription:
      "Budget hotel in central Southport, a short walk from Lord Street and the seafront. 102 rooms. Standard Travelodge — what you expect: clean, functional, well-located.",
    priceRange: "£",
    listingTier: "free" as const,
  },
  {
    slug: "the-scarisbrick-hotel-southport",
    name: "The Scarisbrick Hotel",
    categorySlug: "hotels",
    address: "239 Lord Street, Southport",
    postcode: "PR8 1NZ",
    phone: "01704 543000",
    website: "https://www.thescarisbrick.co.uk",
    shortDescription:
      "Victorian hotel on Lord Street, Southport's most historic accommodation. Character rooms, bar and restaurant, and a Lord Street location that puts you in the middle of everything. The building dates from 1878.",
    priceRange: "£££",
    listingTier: "free" as const,
  },
  {
    slug: "coast-birkdale",
    name: "Coast",
    categorySlug: "restaurants",
    address: "68 Liverpool Road, Birkdale, Southport",
    postcode: "PR8 4AP",
    phone: "01704 568067",
    website: "",
    shortDescription:
      "Independent restaurant in Birkdale Village with a menu focused on fresh, locally sourced food. Popular with locals — gets busy at weekends. Worth booking ahead.",
    priceRange: "£££",
    listingTier: "free" as const,
  },
  {
    slug: "the-grapevine-churchtown-southport",
    name: "The Grapevine",
    categorySlug: "bars-nightlife",
    address: "3 Cambridge Road, Churchtown, Southport",
    postcode: "PR9 7TN",
    phone: "01704 228055",
    website: "",
    shortDescription:
      "Village wine bar and bistro in Churchtown, Southport. Long-standing local favourite for wine, small plates, and a relaxed evening. Quieter and more neighbourhood-feel than the town centre.",
    priceRange: "££–£££",
    listingTier: "free" as const,
  },
  {
    slug: "portland-hall-spa-southport",
    name: "Portland Hall Spa",
    categorySlug: "wellness",
    address: "Portland Hall, Portland Street, Southport",
    postcode: "PR8 1LA",
    phone: "01704 534234",
    website: "",
    shortDescription:
      "Day spa and beauty treatment centre in Southport. Offers a range of treatments including massage, facials, and body wraps. Check directly for current availability and pricing.",
    priceRange: "£££",
    listingTier: "free" as const,
  },
];

async function main() {
  console.log("Checking categories...");
  const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  console.log("Available categories:", Object.keys(catMap).join(", "));

  for (const biz of MISSING_BUSINESSES) {
    const catId = catMap[biz.categorySlug];
    if (!catId) {
      console.error(`Category not found: ${biz.categorySlug} for ${biz.name}`);
      continue;
    }

    // Check if already exists
    const existing = await prisma.business.findUnique({ where: { slug: biz.slug } });
    if (existing) {
      console.log(`SKIP (exists): ${biz.name}`);
      continue;
    }

    const { categorySlug, ...rest } = biz;
    await prisma.business.create({
      data: {
        ...rest,
        categoryId: catId,
        priceRange: rest.priceRange || null,
      },
    });
    console.log(`CREATED: ${biz.name} (${biz.slug})`);
  }

  console.log("\nDone.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
