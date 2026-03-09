import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const testCases = [
  { label: "Lord Street Restaurants", tags: ["lord-street"], categorySlugs: ["restaurants"] },
  { label: "Dog-Friendly Restaurants", tags: ["dog-friendly"], categorySlugs: ["restaurants"] },
  { label: "Dog-Friendly Pubs", tags: ["dog-friendly"], categorySlugs: ["bars-nightlife"] },
  { label: "Hotels Near Birkdale", tags: ["birkdale"], categorySlugs: ["hotels"] },
  { label: "Hotels with Parking", tags: ["parking"], categorySlugs: ["hotels"] },
  { label: "Free Things to Do", tags: ["free"], categorySlugs: ["attractions", "beaches-parks", "activities"] },
  { label: "Family-Friendly Restaurants", tags: ["family-friendly"], categorySlugs: ["restaurants"] },
  { label: "Outdoor Seating Restaurants", tags: ["outdoor-seating"], categorySlugs: ["restaurants"] },
  { label: "Afternoon Tea", tags: ["afternoon-tea"], categorySlugs: ["restaurants", "cafes", "hotels"] },
  { label: "Live Music Bars", tags: ["live-music"], categorySlugs: ["bars-nightlife"] },
  { label: "Late Night Bars", tags: ["late-night"], categorySlugs: ["bars-nightlife"] },
  { label: "Budget Hotels", tags: ["budget"], categorySlugs: ["hotels"] },
  { label: "Lord Street Cafes", tags: ["lord-street"], categorySlugs: ["cafes"] },
  { label: "Birkdale Restaurants", tags: ["birkdale"], categorySlugs: ["restaurants"] },
  { label: "Dog-Friendly Cafes", tags: ["dog-friendly"], categorySlugs: ["cafes"] },
  { label: "Bottomless Brunch", tags: ["bottomless-brunch"], categorySlugs: ["restaurants", "bars-nightlife"] },
  { label: "Family Things to Do", tags: ["family-friendly"], categorySlugs: ["attractions", "activities"] },
];

console.log("\n=== COLLECTION QUERY TEST (Prisma Client) ===\n");

for (const tc of testCases) {
  const count = await prisma.business.count({
    where: {
      category: { slug: { in: tc.categorySlugs } },
      tags: { hasEvery: tc.tags },
    },
  });
  const status = count >= 4 ? "OK" : count > 0 ? "LOW" : "EMPTY";
  console.log(`  [${status.padEnd(5)}] ${tc.label.padEnd(35)} ${count} listings`);
}

await prisma.$disconnect();
