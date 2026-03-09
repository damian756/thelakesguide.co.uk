/**
 * Retry the rate-limited OSM queries: live_music + nightclub
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const BBOX = "53.56,-3.10,53.69,-2.90";

const OSM_QUERIES = [
  { osmTag: 'live_music="yes"',    dbTag: "live-music"  },
  { osmTag: 'amenity="nightclub"', dbTag: "late-night"  },
  { osmTag: 'dog="yes"',           dbTag: "dog-friendly" }, // also log unmatched so we can see names
];

function normalise(s) {
  return s.toLowerCase().replace(/[''`]/g, "").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}
function similarity(a, b) {
  const ta = new Set(normalise(a).split(" ").filter((w) => w.length > 2));
  const tb = new Set(normalise(b).split(" ").filter((w) => w.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap / Math.max(ta.size, tb.size);
}
function distM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const businesses = await prisma.business.findMany({
  select: { id: true, name: true, lat: true, lng: true, tags: true },
});
const withLatLng = businesses.filter((b) => b.lat != null && b.lng != null);

function matchToBusiness(osmEl) {
  const osmName = osmEl.tags?.name;
  if (!osmName) return null;
  const lat = osmEl.lat ?? osmEl.center?.lat;
  const lon = osmEl.lon ?? osmEl.center?.lon;
  const hasCoords = lat != null && lon != null;
  let bestScore = -1, bestBusiness = null;
  const pool = hasCoords ? withLatLng : businesses;
  for (const b of pool) {
    const nameSim = similarity(osmName, b.name);
    if (nameSim < 0.5) continue;
    let score = nameSim;
    if (hasCoords && b.lat != null && b.lng != null) {
      const dist = distM(lat, lon, b.lat, b.lng);
      if (dist > 150) continue;
      score += Math.max(0, 1 - dist / 150);
    }
    if (score > bestScore) { bestScore = score; bestBusiness = b; }
  }
  return bestBusiness ? { business: bestBusiness, score: bestScore } : null;
}

async function queryOverpass(osmTag) {
  const query = `[out:json][timeout:30];\n(\n  node[${osmTag}](${BBOX});\n  way[${osmTag}](${BBOX});\n  relation[${osmTag}](${BBOX});\n);\nout center;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).elements ?? [];
}

const tagUpdates = {};

for (const { osmTag, dbTag } of OSM_QUERIES) {
  console.log(`\nQuerying OSM for [${osmTag}]...`);
  let elements;
  try {
    elements = await queryOverpass(osmTag);
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
    await new Promise((r) => setTimeout(r, 5000));
    continue;
  }
  console.log(`  Found ${elements.length} elements`);

  for (const el of elements) {
    const osmName = el.tags?.name ?? "(no name)";
    const result = matchToBusiness(el);
    if (result) {
      console.log(`  ✓ "${osmName}" → "${result.business.name}" [+${dbTag}]`);
      if (!tagUpdates[result.business.id]) tagUpdates[result.business.id] = { business: result.business, tags: new Set() };
      tagUpdates[result.business.id].tags.add(dbTag);
    } else {
      console.log(`  ✗ "${osmName}" — no DB match`);
    }
  }

  await new Promise((r) => setTimeout(r, 5000));
}

if (Object.keys(tagUpdates).length > 0) {
  console.log(`\nUpdating ${Object.keys(tagUpdates).length} businesses...`);
  for (const { business, tags } of Object.values(tagUpdates)) {
    const existing = new Set(business.tags ?? []);
    const merged = [...new Set([...existing, ...tags])];
    if (merged.some((t) => !existing.has(t))) {
      await prisma.business.update({ where: { id: business.id }, data: { tags: merged } });
      console.log(`  → ${business.name}: [${merged.join(", ")}]`);
    }
  }
} else {
  console.log("\nNo new matches.");
}

await prisma.$disconnect();
