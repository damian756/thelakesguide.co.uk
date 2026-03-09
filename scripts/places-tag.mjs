/**
 * Pull Google Places attributes for every business and apply tags.
 * Uses the Google Places API (New) — fieldMask keeps cost low (~$0.017/call).
 * Run with: node scripts/places-tag.mjs
 *
 * Estimated cost: 999 businesses × $0.017 ≈ $17 one-time.
 * Safe to re-run — only ADDS tags, never removes.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) { console.error("GOOGLE_PLACES_API_KEY not set"); process.exit(1); }

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Fields to request from Google ─────────────────────────────────────────────
// Only request what we need — keeps cost at the Basic SKU rate.
const FIELD_MASK = [
  "id",
  "allowsDogs",
  "outdoorSeating",
  "liveMusic",
  "goodForChildren",
  "goodForGroups",
  "servesBrunch",
  "servesBreakfast",
  "goodForWatchingSports",
  "restroom",
  "parkingOptions",
  "accessibilityOptions",
].join(",");

// ── Tag mapping from Google attributes ────────────────────────────────────────
function tagsFromPlaceData(place) {
  const tags = [];
  if (place.allowsDogs)                           tags.push("dog-friendly");
  if (place.outdoorSeating)                       tags.push("outdoor-seating");
  if (place.liveMusic)                            tags.push("live-music");
  if (place.goodForChildren)                      tags.push("family-friendly");
  if (place.goodForGroups)                        tags.push("family-friendly"); // overlap is fine
  if (place.servesBrunch)                         tags.push("serves-brunch");
  if (place.goodForWatchingSports)                tags.push("sports");
  if (
    place.parkingOptions?.freeParkingLot ||
    place.parkingOptions?.freeStreetParking ||
    place.parkingOptions?.paidParkingLot
  ) {
    tags.push("parking");
  }
  return [...new Set(tags)];
}

// ── Fetch a single place ───────────────────────────────────────────────────────
async function fetchPlace(placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeId}?key=${API_KEY}&fields=${FIELD_MASK}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────

const businesses = await prisma.business.findMany({
  where: { placeId: { not: null } },
  select: { id: true, name: true, placeId: true, tags: true },
  orderBy: { name: "asc" },
});

console.log(`\nProcessing ${businesses.length} businesses with placeIds...\n`);

const tagCounts = {};
let updated = 0;
let errors = 0;
let noChange = 0;

// Rate limit: 10 requests per second (well within Google's quota)
const BATCH_SIZE = 10;
const DELAY_MS = 1100;

for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
  const batch = businesses.slice(i, i + BATCH_SIZE);

  await Promise.all(
    batch.map(async (b) => {
      try {
        const place = await fetchPlace(b.placeId);
        const newTags = tagsFromPlaceData(place);

        if (newTags.length === 0) return;

        const existingTags = new Set(b.tags ?? []);
        const merged = [...new Set([...existingTags, ...newTags])];
        const changed = merged.some((t) => !existingTags.has(t));

        if (changed) {
          await prisma.business.update({
            where: { id: b.id },
            data: { tags: merged },
          });
          updated++;
          newTags.forEach((t) => {
            tagCounts[t] = (tagCounts[t] ?? 0) + 1;
          });
        } else {
          noChange++;
        }
      } catch (err) {
        errors++;
        console.error(`  ✗ ${b.name}: ${err.message}`);
      }
    })
  );

  const done = Math.min(i + BATCH_SIZE, businesses.length);
  process.stdout.write(`\r  ${done}/${businesses.length} processed...`);

  if (i + BATCH_SIZE < businesses.length) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

console.log(`\n\nDone.`);
console.log(`  Updated:   ${updated}`);
console.log(`  No change: ${noChange}`);
console.log(`  Errors:    ${errors}\n`);

if (Object.keys(tagCounts).length > 0) {
  console.log("=== NEW TAGS APPLIED ===\n");
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => console.log(`  ${tag.padEnd(24)} ${count}`));
  console.log("");
}

await prisma.$disconnect();
