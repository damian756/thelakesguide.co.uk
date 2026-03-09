import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const existing = await p.business.findMany({
    where: {
      OR: [
        { name: { contains: "Travelodge", mode: "insensitive" } },
        { name: { contains: "Scarisbrick", mode: "insensitive" } },
        { name: { contains: "Coast", mode: "insensitive" } },
        { name: { contains: "Grapevine", mode: "insensitive" } },
        { name: { contains: "Portland Hall", mode: "insensitive" } },
      ],
    },
    select: { name: true, slug: true, address: true },
  });
  console.log("Found", existing.length, "matches:");
  existing.forEach((b) => console.log(" -", b.name, "|", b.slug, "|", b.address));

  const cats = await p.category.findMany({ select: { id: true, slug: true, name: true } });
  console.log("\nCategories:");
  cats.forEach((c) => console.log(" -", c.slug, "|", c.id));
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
