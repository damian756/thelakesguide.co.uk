import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug: "restaurants", name: "Restaurants", description: "Best restaurants in Southport", sortOrder: 1 },
  { slug: "hotels", name: "Hotels & Accommodation", description: "Where to stay in Southport", sortOrder: 2 },
  { slug: "bars-nightlife", name: "Bars & Nightlife", description: "Pubs and bars in Southport", sortOrder: 3 },
  { slug: "cafes", name: "Cafes & Tea Rooms", description: "Cafes and coffee shops in Southport", sortOrder: 4 },
  { slug: "attractions", name: "Attractions", description: "Things to see and do in Southport", sortOrder: 5 },
  { slug: "beaches-parks", name: "Beaches & Parks", description: "Beaches and parks in Southport", sortOrder: 6 },
  { slug: "shopping", name: "Shopping", description: "Shops and boutiques in Southport", sortOrder: 7 },
  { slug: "golf", name: "Golf", description: "Golf courses in and around Southport", sortOrder: 8 },
  { slug: "activities", name: "Activities", description: "Tours, rentals and activities", sortOrder: 9 },
  { slug: "wellness", name: "Wellness", description: "Spas and salons in Southport", sortOrder: 10 },
  { slug: "transport", name: "Transport", description: "Taxis, parking and bike hire", sortOrder: 11 },
];

const BUSINESSES = [
  { slug: "the-waterfront-southport", name: "The Waterfront", categorySlug: "restaurants", address: "Promenade, Southport", postcode: "PR8 1QX", phone: "01704 123456", website: "https://example.com", shortDescription: "Seaside dining with views over the Marine Lake.", priceRange: "££" },
  { slug: "bistro-pierre-southport", name: "Bistro Pierre", categorySlug: "restaurants", address: "Unit 5, Southport Market, Eastbank Street", postcode: "PR8 1EJ", phone: "01704 234567", shortDescription: "French-inspired bistro in Southport Market.", priceRange: "££" },
  { slug: "the-athenaeum-southport", name: "The Athenaeum", categorySlug: "restaurants", address: "Lord Street, Southport", postcode: "PR8 1DB", shortDescription: "Brasserie and bar on Lord Street.", priceRange: "£££" },
  { slug: "prince-of-wales-hotel", name: "Prince of Wales Hotel", categorySlug: "hotels", address: "Lord Street, Southport", postcode: "PR8 1JS", phone: "01704 536688", website: "https://www.princeofwales-southport.co.uk", shortDescription: "Historic hotel on Lord Street with spa and restaurant.", priceRange: "£££" },
  { slug: "the-bold-hotel", name: "The Bold Hotel", categorySlug: "hotels", address: "601 Lord Street, Southport", postcode: "PR9 0AQ", phone: "01704 533521", shortDescription: "Family-run hotel with bar and restaurant.", priceRange: "££" },
  { slug: "scarisbrick-hotel", name: "Scarisbrick Hotel", categorySlug: "hotels", address: "Lord Street, Southport", postcode: "PR8 1NJ", phone: "01704 534771", shortDescription: "Victorian hotel in the heart of Southport.", priceRange: "£££" },
  { slug: "the-coffee-house-southport", name: "The Coffee House", categorySlug: "cafes", address: "Eastbank Street, Southport", postcode: "PR8 1EJ", shortDescription: "Specialty coffee and light bites.", priceRange: "£" },
  { slug: "palm-court-cafe", name: "Palm Court Café", categorySlug: "cafes", address: "Wayfarers Arcade, Lord Street", postcode: "PR8 1JH", phone: "01704 532123", shortDescription: "Tea room in a Victorian arcade.", priceRange: "£" },
  { slug: "costa-coffee-lord-street", name: "Costa Coffee Lord Street", categorySlug: "cafes", address: "Lord Street, Southport", postcode: "PR8 1DB", shortDescription: "Coffee shop on Southport's main street.", priceRange: "£" },
];

async function main() {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
    });
  }
  console.log("Seeded categories:", CATEGORIES.length);

  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryById = new Map(categories.map((c) => [c.slug, c.id]));

  for (const b of BUSINESSES) {
    const categoryId = categoryById.get(b.categorySlug);
    if (!categoryId) throw new Error(`Category not found: ${b.categorySlug}`);
    const { categorySlug, ...rest } = b;
    await prisma.business.upsert({
      where: { slug: b.slug },
      create: { ...rest, categoryId, images: [] },
      update: { name: rest.name, address: rest.address, postcode: rest.postcode, phone: rest.phone ?? undefined, website: rest.website ?? undefined, shortDescription: rest.shortDescription ?? undefined, priceRange: rest.priceRange ?? undefined },
    });
  }
  console.log("Seeded businesses:", BUSINESSES.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
