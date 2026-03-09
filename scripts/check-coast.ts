import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const results = await prisma.business.findMany({
    where: { name: { contains: "Coast", mode: "insensitive" } },
    select: { name: true, slug: true, address: true, postcode: true, categoryId: true, shortDescription: true },
    take: 10,
  });
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
