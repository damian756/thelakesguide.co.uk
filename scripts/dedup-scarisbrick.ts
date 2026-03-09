import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Update the canonical Scarisbrick Hotel (with real data) to have a better description
  await prisma.business.update({
    where: { slug: "scarisbrick-hotel" },
    data: {
      name: "The Scarisbrick Hotel",
      shortDescription:
        "Victorian landmark hotel on Lord Street. 1,400+ Google reviews. Restaurant, multiple bars, indoor pool, and central Lord Street location. The building dates from 1878 and is Southport's most recognisable hotel facade.",
    },
  });
  console.log("Updated scarisbrick-hotel");

  // Delete the duplicates
  await prisma.business.delete({ where: { slug: "scarisbrick-hotel-southport" } });
  console.log("Deleted scarisbrick-hotel-southport (duplicate)");

  await prisma.business.delete({ where: { slug: "the-scarisbrick-hotel-southport" } });
  console.log("Deleted the-scarisbrick-hotel-southport (my new duplicate)");

  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
