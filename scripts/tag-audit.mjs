import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// Category breakdown
const cats = await prisma.$queryRaw`
  SELECT c.slug, c.name, COUNT(b.id)::int AS businesses
  FROM "Category" c
  LEFT JOIN "Business" b ON b."categoryId" = c.id
  GROUP BY c.slug, c.name
  ORDER BY businesses DESC
`;
console.log("\n=== CATEGORY BREAKDOWN ===\n");
console.table(cats);

// Check if tags column exists
const cols = await prisma.$queryRaw`
  SELECT column_name::text FROM information_schema.columns
  WHERE table_name = 'Business' AND column_name = 'tags'
`;
const hasTags = cols.length > 0;
console.log(`\n'tags' column exists in DB: ${hasTags}`);

if (hasTags) {
  const result = await prisma.$queryRaw`
    SELECT tag, COUNT(*)::int AS businesses
    FROM "Business", unnest(tags) AS tag
    GROUP BY tag
    ORDER BY businesses DESC
  `;
  console.log("\n=== TAG AUDIT ===\n");
  console.table(result);

  const empty = await prisma.$queryRaw`SELECT COUNT(*)::int AS c FROM "Business" WHERE array_length(tags,1) IS NULL`;
  const total = await prisma.$queryRaw`SELECT COUNT(*)::int AS c FROM "Business"`;
  console.log(`\nBusinesses with no tags: ${empty[0].c} / ${total[0].c} total\n`);
}

await prisma.$disconnect();
