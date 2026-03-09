import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Fix Coast Birkdale - update address and description
  const updated = await prisma.business.update({
    where: { slug: "coast-birkdale" },
    data: {
      address: "68 Liverpool Road, Birkdale, Southport",
      postcode: "PR8 4AP",
      phone: "01704 568067",
      shortDescription:
        "Independent restaurant in Birkdale Village with a menu focused on fresh, locally sourced food. Popular with locals for dinner — worth booking at weekends.",
      priceRange: "£££",
    },
  });
  console.log("Updated:", updated.name, "|", updated.address);

  // Also update Scarisbrick Hotel if there's an existing one with wrong data
  const scarisbrick = await prisma.business.findMany({
    where: { name: { contains: "Scarisbrick", mode: "insensitive" } },
    select: { name: true, slug: true, address: true },
  });
  console.log("Scarisbrick listings:", JSON.stringify(scarisbrick, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
