/**
 * Query OpenStreetMap (Overpass API) for businesses in the Southport area
 * with specific tags, then fuzzy-match against our DB and apply tags.
 *
 * Run with: node scripts/osm-tag.mjs
 * Free, legal, no API key needed.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Southport bounding box ────────────────────────────────────────────────────
// Covers Southport + Ainsdale + Churchtown + Birkdale + Banks + Crossens
// Southport is ~53.64°N, 3.01°W — longitude is NEGATIVE (west of meridian)
const BBOX = "53.56,-3.10,53.69,-2.90"; // south,west,north,east

// ── OSM tag queries we care about ─────────────────────────────────────────────
const OSM_QUERIES = [
  { osmTag: 'dog="yes"',           dbTag: "dog-friendly"    },
  { osmTag: 'dog="leashed"',       dbTag: "dog-friendly"    },
  { osmTag: 'outdoor_seating="yes"', dbTag: "outdoor-seating" },
  { osmTag: 'live_music="yes"',    dbTag: "live-music"      },
  { osmTag: 'opening_hours~"00:00"', dbTag: "late-night"    }, // open past midnight
  { osmTag: 'amenity="nightclub"', dbTag: "late-night"      },
];

// ── Overpass query builder ────────────────────────────────────────────────────
function buildQuery(osmTag) {
  return `
[out:json][timeout:30];
(
  node[${osmTag}](${BBOX});
  way[${osmTag}](${BBOX});
  relation[${osmTag}](${BBOX});
);
out center;
`.trim();
}

async function queryOverpass(osmTag) {
  const body = `data=${encodeURIComponent(buildQuery(osmTag))}`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
  const json = await res.json();
  return json.elements ?? [];
}

// ── Name similarity ────────────────────────────────────────────────────────────
function normalise(s) {
  return s
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Returns 0–1 similarity using token overlap
function similarity(a, b) {
  const ta = new Set(normalise(a).split(" ").filter((w) => w.length > 2));
  const tb = new Set(normalise(b).split(" ").filter((w) => w.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap / Math.max(ta.size, tb.size);
}

// Haversine distance in metres
function distM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Load our businesses ───────────────────────────────────────────────────────
const businesses = await prisma.business.findMany({
  select: { id: true, name: true, address: true, lat: true, lng: true, tags: true },
});
const withLatLng = businesses.filter((b) => b.lat != null && b.lng != null);
const withoutLatLng = businesses.filter((b) => b.lat == null || b.lng == null);
console.log(`\nDB: ${businesses.length} total | ${withLatLng.length} with lat/lng | ${withoutLatLng.length} without\n`);

// ── Match an OSM element to a DB business ─────────────────────────────────────
const NAME_THRESHOLD = 0.5;
const DIST_THRESHOLD_M = 150;

function matchToBusiness(osmEl) {
  const osmName = osmEl.tags?.name;
  if (!osmName) return null;

  const lat = osmEl.lat ?? osmEl.center?.lat;
  const lon = osmEl.lon ?? osmEl.center?.lon;
  const hasCoords = lat != null && lon != null;

  let bestScore = -1;
  let bestBusiness = null;

  const pool = hasCoords ? withLatLng : businesses;

  for (const b of pool) {
    const nameSim = similarity(osmName, b.name);
    if (nameSim < NAME_THRESHOLD) continue;

    let score = nameSim;

    if (hasCoords && b.lat != null && b.lng != null) {
      const dist = distM(lat, lon, b.lat, b.lng);
      if (dist > DIST_THRESHOLD_M) continue; // too far — skip
      score += Math.max(0, 1 - dist / DIST_THRESHOLD_M); // bonus for proximity
    }

    if (score > bestScore) {
      bestScore = score;
      bestBusiness = b;
    }
  }

  return bestBusiness ? { business: bestBusiness, score: bestScore } : null;
}

// ── Main loop ─────────────────────────────────────────────────────────────────
const tagUpdates = {}; // businessId → Set of tags to add

let osmTotal = 0;
let matchedTotal = 0;

for (const { osmTag, dbTag } of OSM_QUERIES) {
  console.log(`Querying OSM for [${osmTag}]...`);
  let elements;
  try {
    elements = await queryOverpass(osmTag);
  } catch (err) {
    console.error(`  ✗ Overpass error: ${err.message}`);
    continue;
  }
  console.log(`  Found ${elements.length} OSM elements`);
  osmTotal += elements.length;

  let matched = 0;
  for (const el of elements) {
    const result = matchToBusiness(el);
    if (!result) continue;
    matched++;
    matchedTotal++;
    if (!tagUpdates[result.business.id]) {
      tagUpdates[result.business.id] = { business: result.business, tags: new Set() };
    }
    tagUpdates[result.business.id].tags.add(dbTag);
    console.log(`  ✓ ${el.tags?.name} → "${result.business.name}" [+${dbTag}] (score ${result.score.toFixed(2)})`);
  }
  console.log(`  Matched: ${matched}/${elements.length}\n`);

  // Be polite to Overpass — 3 seconds between queries to avoid rate limiting
  await new Promise((r) => setTimeout(r, 3000));
}

console.log(`\nOSM total: ${osmTotal} elements | Matched: ${matchedTotal} businesses\n`);

// ── Apply updates to DB ───────────────────────────────────────────────────────
if (Object.keys(tagUpdates).length === 0) {
  console.log("No matches found — nothing to update.\n");
} else {
  console.log(`Updating ${Object.keys(tagUpdates).length} businesses...\n`);
  let written = 0;
  for (const { business, tags } of Object.values(tagUpdates)) {
    const existing = new Set(business.tags ?? []);
    const merged = [...new Set([...existing, ...tags])];
    const changed = merged.some((t) => !existing.has(t));
    if (changed) {
      await prisma.business.update({ where: { id: business.id }, data: { tags: merged } });
      written++;
      console.log(`  Updated: ${business.name} → [${merged.join(", ")}]`);
    }
  }
  console.log(`\nWrote ${written} updates to DB.\n`);
}

// ── Final tag summary ─────────────────────────────────────────────────────────
const result = await prisma.$queryRaw`
  SELECT tag, COUNT(*)::int AS businesses
  FROM "Business", unnest(tags) AS tag
  GROUP BY tag ORDER BY businesses DESC
`;
console.log("=== CURRENT TAG TOTALS ===\n");
result.forEach((r) => console.log(`  ${r.tag.padEnd(24)} ${r.businesses}`));
console.log("");

await prisma.$disconnect();
