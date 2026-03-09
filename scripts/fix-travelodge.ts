import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Update the real Travelodge with a better description
  await prisma.business.update({
    where: { slug: "travelodge-southport" },
    data: {
      shortDescription:
        "Budget hotel on Garrick Parade, a short walk from Lord Street and the seafront. 4 stars on Google, 1,000+ reviews. Victorian-style property with modern Travelodge rooms. Well-located for the town centre, seafront, and Open Championship at Royal Birkdale.",
    },
  });
  console.log("Updated travelodge-southport");

  // Delete the duplicate I created
  await prisma.business.delete({ where: { slug: "travelodge-southport-central" } });
  console.log("Deleted travelodge-southport-central (duplicate)");

  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
