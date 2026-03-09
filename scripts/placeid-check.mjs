import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const total = await prisma.business.count();
const withPlaceId = await prisma.business.count({ where: { placeId: { not: null } } });
const sample = await prisma.business.findMany({
  where: { placeId: { not: null } },
  select: { name: true, placeId: true, category: { select: { slug: true } } },
  take: 5,
});

console.log(`\nTotal businesses: ${total}`);
console.log(`With placeId: ${withPlaceId} (${Math.round(withPlaceId/total*100)}%)\n`);
console.log("Sample:");
sample.forEach((b) => console.log(`  ${b.name} [${b.category.slug}] — ${b.placeId}`));

await prisma.$disconnect();
