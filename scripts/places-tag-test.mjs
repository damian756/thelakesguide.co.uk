/**
 * Test — fetch full Place data to see what attributes Google returns.
 * No DB writes.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fetch restaurants specifically — more likely to have food/drink attributes
const businesses = await prisma.business.findMany({
  where: {
    placeId: { not: null },
    category: { slug: { in: ["restaurants", "bars-nightlife", "hotels"] } },
  },
  select: { id: true, name: true, placeId: true, category: { select: { slug: true } } },
  take: 3,
  orderBy: { reviewCount: "desc" },
});

console.log(`\nTest — raw Google Places data for ${businesses.length} businesses\n`);

for (const b of businesses) {
  // Request ALL attribute-type fields in one go
  const fields = [
    "id",
    "displayName",
    "allowsDogs",
    "outdoorSeating",
    "liveMusic",
    "goodForChildren",
    "goodForGroups",
    "goodForWatchingSports",
    "servesBrunch",
    "servesBreakfast",
    "servesDinner",
    "servesLunch",
    "servesVegetarianFood",
    "reservable",
    "delivery",
    "takeout",
    "dineIn",
    "parkingOptions",
    "accessibilityOptions",
    "priceLevel",
    "primaryType",
  ].join(",");

  const url = `https://places.googleapis.com/v1/places/${b.placeId}?key=${API_KEY}&fields=${fields}`;
  const res = await fetch(url);
  const place = await res.json();

  console.log(`── ${b.name} [${b.category.slug}] ──`);
  if (place.error) {
    console.log(`  ERROR ${place.error.code}: ${place.error.message}`);
  } else {
    // Print all truthy/non-null values
    const interesting = Object.fromEntries(
      Object.entries(place).filter(([k, v]) => v !== null && v !== undefined && k !== "id")
    );
    console.log(JSON.stringify(interesting, null, 2));
  }
  console.log("");
}

await prisma.$disconnect();
