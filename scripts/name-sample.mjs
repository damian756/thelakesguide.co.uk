import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Show all pub/bar names + addresses to spot dog-friendly candidates
const pubs = await prisma.business.findMany({
  where: { category: { slug: "bars-nightlife" } },
  select: { name: true, address: true, tags: true },
  orderBy: { name: "asc" },
});
console.log("\n=== BARS & NIGHTLIFE ===\n");
pubs.forEach(b => console.log(`  ${b.name} | ${b.address} | [${b.tags.join(",")}]`));

// Show attractions + beaches-parks
const attr = await prisma.business.findMany({
  where: { category: { slug: { in: ["attractions", "beaches-parks", "activities"] } } },
  select: { name: true, address: true, tags: true, category: { select: { slug: true } } },
  orderBy: { name: "asc" },
});
console.log("\n=== ATTRACTIONS / BEACHES / ACTIVITIES ===\n");
attr.forEach(b => console.log(`  [${b.category.slug}] ${b.name} | ${b.tags.join(",")}`));

await prisma.$disconnect();
