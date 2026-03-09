import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Sample restaurants - check address format and description quality
const rests = await prisma.business.findMany({
  where: { category: { slug: "restaurants" } },
  select: { name: true, address: true, shortDescription: true, description: true, tags: true },
  take: 15,
  orderBy: { name: "asc" },
});
console.log("\n=== RESTAURANT SAMPLE (address | shortDesc) ===\n");
rests.forEach((r) => {
  console.log(`${r.name}`);
  console.log(`  addr: ${r.address}`);
  console.log(`  short: ${r.shortDescription?.slice(0, 80) ?? "(null)"}`);
  console.log(`  desc: ${r.description?.slice(0, 80) ?? "(null)"}`);
  console.log(`  tags: ${JSON.stringify(r.tags)}`);
  console.log("");
});

// Check how many businesses have non-null descriptions
const withDesc = await prisma.business.count({ where: { description: { not: null } } });
const withShort = await prisma.business.count({ where: { shortDescription: { not: null } } });
const total = await prisma.business.count();
console.log(`\nTotal: ${total} | With description: ${withDesc} | With shortDescription: ${withShort}`);

// Check lord street address variants
const ls = await prisma.$queryRaw`
  SELECT name, address FROM "Business"
  WHERE address ILIKE '%lord%' OR address ILIKE '%lord st%'
  LIMIT 10
`;
console.log("\n=== LORD STREET ADDRESS VARIANTS ===\n");
ls.forEach((b) => console.log(`  ${b.name} | ${b.address}`));

await prisma.$disconnect();
