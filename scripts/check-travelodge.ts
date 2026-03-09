import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const results = await prisma.business.findMany({
    where: { name: { contains: "Travelodge", mode: "insensitive" } },
    select: { id: true, name: true, slug: true, address: true, postcode: true, shortDescription: true, rating: true, reviewCount: true, listingTier: true },
  });
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
