/**
 * tag-fix.mjs — targeted fixes for empty/thin collection pages.
 *
 * Fixes:
 *  1. birkdale — adds PR8 postcode matching so hotels/restaurants in
 *     Birkdale village get tagged even if "Birkdale" isn't in the address.
 *  2. budget hotels — widens matching to guest houses, B&Bs, and
 *     cheaper chains that don't use the word "budget" in their listing.
 *  3. parking hotels — catches additional hotel name patterns.
 *  4. afternoon-tea — adds more known Southport hotel patterns.
 *  5. family-friendly — catches family-friendly hotel patterns.
 *
 * Safe to re-run — only adds tags, never removes.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const businesses = await prisma.business.findMany({
  select: {
    id: true,
    name: true,
    address: true,
    postcode: true,
    priceRange: true,
    tags: true,
    category: { select: { slug: true } },
  },
});

console.log(`\nProcessing ${businesses.length} businesses...\n`);

const updates = {}; // id → Set<tag>
function add(b, ...tags) {
  if (!updates[b.id]) updates[b.id] = { b, tags: new Set() };
  tags.forEach((t) => {
    if (!(b.tags ?? []).includes(t)) updates[b.id].tags.add(t);
  });
}

for (const b of businesses) {
  const name    = (b.name ?? "").toLowerCase();
  const addr    = (b.address ?? "").toLowerCase();
  const pc      = (b.postcode ?? "").toUpperCase().replace(/\s+/g, "");
  const cat     = b.category.slug;
  const price   = b.priceRange ?? "";

  // ── 1. BIRKDALE — only PR8 2xx and PR8 5xx are the Birkdale village area ──
  // PR8 2 = Birkdale village / Royal Birkdale Golf Club (PR8 2LX)
  // PR8 5 = upper Birkdale / Ainsdale border
  // PR8 1/3/4/6 = Southport town centre, Ainsdale, Scarisbrick — NOT Birkdale
  const isBirkdalePostcode = pc.startsWith("PR82") || pc.startsWith("PR85");

  if (isBirkdalePostcode || /birkdale/i.test(addr) || /birkdale/i.test(name)) {
    add(b, "birkdale");
  }

  // ── 2. BUDGET HOTELS — widen beyond "budget" keyword ─────────────────────
  if (cat === "hotels") {
    const isBudgetByPrice = price === "£" || price === "£/££";
    const isBudgetByName  =
      /\bb\s*&\s*b\b/i.test(name) ||
      /\bbed\s+and\s+breakfast\b/i.test(name) ||
      /\bguest\s*house\b/i.test(name) ||
      /\bguesthouse\b/i.test(name) ||
      /\blodge\b/i.test(name) ||
      /travelodge/i.test(name) ||
      /premier\s+inn/i.test(name) ||
      /holiday\s+inn\s+express/i.test(name) ||
      /\bibis\b/i.test(name) ||
      /\bhostel\b/i.test(name) ||
      /\bapartment/i.test(name) ||
      /\bself[- ]catering\b/i.test(name);

    if (isBudgetByPrice || isBudgetByName) {
      add(b, "budget");
    }

    // ── 3. PARKING HOTELS — widen beyond tag-extended coverage ──────────────
    const hasParkingByName =
      /\blodge\b/i.test(name) ||
      /travelodge/i.test(name) ||
      /premier\s+inn/i.test(name) ||
      /holiday\s+inn/i.test(name) ||
      /\bibis\b/i.test(name) ||
      /\bmotel\b/i.test(name) ||
      /\bholiday\s+park\b/i.test(name) ||
      /\bcaravan\s+park\b/i.test(name);

    if (hasParkingByName) {
      add(b, "parking");
    }

    // ── 4. AFTERNOON TEA — more Southport hotels/venues ─────────────────────
    const isAfternoonTeaHotel =
      /royal\s+clifton/i.test(name) ||
      /clifton\s+hotel/i.test(name) ||
      /scarisbrick/i.test(name) ||
      /prince\s+of\s+wales/i.test(name) ||
      /vincent\s+hotel/i.test(name) ||
      /grand.*southport/i.test(name) ||
      /southport\s+grand/i.test(name) ||
      /\bhotel\s+victoria\b/i.test(name) ||
      /\bthornton\s+hall\b/i.test(name);

    if (isAfternoonTeaHotel) {
      add(b, "afternoon-tea");
    }

    // ── 5. FAMILY-FRIENDLY HOTELS ─────────────────────────────────────────
    const isFamilyHotel =
      /premier\s+inn/i.test(name) ||
      /holiday\s+inn/i.test(name) ||
      /travelodge/i.test(name) ||
      /\bholiday\s+park\b/i.test(name) ||
      /\bcaravan\s+park\b/i.test(name);

    if (isFamilyHotel) {
      add(b, "family-friendly");
    }
  }
}

// ── Apply updates ─────────────────────────────────────────────────────────────
const toUpdate = Object.values(updates).filter((u) => u.tags.size > 0);
console.log(`Found ${toUpdate.length} businesses to update.\n`);

const summary = {};
let written = 0;

for (const { b, tags } of toUpdate) {
  const merged = [...new Set([...(b.tags ?? []), ...tags])];
  await prisma.business.update({ where: { id: b.id }, data: { tags: merged } });
  written++;
  for (const t of tags) {
    summary[t] = (summary[t] ?? 0) + 1;
    console.log(`  ${b.name} [${b.category.slug}] → +${t}`);
  }
}

console.log(`\n✓ Updated ${written} businesses.\n`);
console.log("=== TAGS APPLIED ===\n");
Object.entries(summary)
  .sort((a, b) => b[1] - a[1])
  .forEach(([t, c]) => console.log(`  ${t.padEnd(24)} +${c}`));

// Print final totals for all tags
const totals = await prisma.$queryRaw`
  SELECT tag, COUNT(*)::int AS businesses
  FROM "Business", unnest(tags) AS tag
  GROUP BY tag ORDER BY businesses DESC
`;
console.log("\n=== ALL TAG TOTALS NOW ===\n");
totals.forEach((r) => console.log(`  ${r.tag.padEnd(24)} ${r.businesses}`));

await prisma.$disconnect();
