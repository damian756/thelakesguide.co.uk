import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.findFirst({ where: { slug: "parking" } });
  if (!cat) return;
  const yps = await prisma.business.findMany({
    where: { categoryId: cat.id, name: { contains: "YourParkingSpace" } },
    select: { slug: true, name: true, address: true, postcode: true, lat: true, lng: true },
    orderBy: { slug: "asc" },
  });
  yps.forEach(b => console.log(`${b.slug} | "${b.address}" | ${b.postcode}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
