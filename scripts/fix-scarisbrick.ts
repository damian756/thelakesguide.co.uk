import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check the main candidates in detail
  const slugsToCheck = ["scarisbrick-hotel", "scarisbrick-hotel-southport", "the-scarisbrick-hotel-southport"];
  const results = await prisma.business.findMany({
    where: { slug: { in: slugsToCheck } },
    select: { id: true, name: true, slug: true, address: true, postcode: true, shortDescription: true, rating: true, reviewCount: true, website: true, phone: true, listingTier: true },
  });
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
