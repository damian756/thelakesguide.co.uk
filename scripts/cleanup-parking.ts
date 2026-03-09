/**
 * Parking directory cleanup
 *
 * Operations:
 * 1. Delete 172 coordinate-named listings (no address/postcode data, unsalvageable)
 * 2. Delete 5 irrelevant listings (staff, NHS, drop-off, test centre)
 * 3. Delete 2 cycle-rack entries masquerading as car parks (Ainsdale, Southport cycle racks)
 * 4. Delete NHS Trust parking entry
 * 5. Delete 3 exact duplicates (keep better record of each pair)
 * 6. Rename 12 YourParkingSpace listings to their actual location names
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.findFirst({ where: { slug: "parking" } });
  if (!cat) throw new Error("Parking category not found");

  let deleted = 0;
  let renamed = 0;

  // ── 1. Delete all coordinate-named listings ────────────────────────────────
  // Pattern: "Car Park (53.xxxx, -x.xxxx)"
  console.log("\n[1] Deleting coordinate-named listings...");
  const coordResult = await prisma.business.deleteMany({
    where: {
      categoryId: cat.id,
      name: { startsWith: "Car Park (" },
    },
  });
  deleted += coordResult.count;
  console.log(`    Deleted ${coordResult.count} coordinate-named listings`);

  // ── 2. Delete irrelevant / restricted listings ─────────────────────────────
  console.log("\n[2] Deleting irrelevant/restricted listings...");
  const irrelevantNames = [
    "Driving Test Candidates",
    "Drop Off/Pick Up",
    "NHS Parking",
    "Smedley Hydro - Staff Car Park Entrance",
    "Staff car park (Southport Hospital)",
    "UK Parking Control LTD on behalf of MWLTH NHS Trust Parking",
  ];
  for (const name of irrelevantNames) {
    const r = await prisma.business.deleteMany({ where: { categoryId: cat.id, name } });
    if (r.count > 0) { console.log(`    Deleted "${name}"`); deleted += r.count; }
    else console.log(`    Not found (already gone?): "${name}"`);
  }

  // ── 3. Delete cycle-rack entries (Ainsdale + Southport cycle parking spots) ─
  // These have tags: ["cycle-parking"] and very generic names — not car parks
  console.log("\n[3] Deleting cycle-rack entries...");
  const cycleRackSlugs = ["parking-ainsdale", "parking-southport"];
  for (const slug of cycleRackSlugs) {
    const r = await prisma.business.deleteMany({
      where: { categoryId: cat.id, slug, tags: { has: "cycle-parking" } },
    });
    if (r.count > 0) { console.log(`    Deleted cycle rack: ${slug}`); deleted += r.count; }
    else console.log(`    Not found or not cycle-tagged: ${slug}`);
  }

  // ── 4. Delete duplicate records (keep better one in each pair) ─────────────
  console.log("\n[4] Deleting duplicates...");
  const dupesToDelete = [
    // Keep "Bushbys Park", delete "Bushby's Park" (apostrophe version)
    "parking-bushby-s-park",
    // Keep Freshfield Station Car Park -2 (has postcode L37 7DD), delete no-postcode one
    "parking-freshfield-station-car-park",
    // Keep King George V College Parking (original), delete -2 duplicate
    "parking-king-george-v-college-parking-2",
  ];
  for (const slug of dupesToDelete) {
    const r = await prisma.business.deleteMany({ where: { slug } });
    if (r.count > 0) { console.log(`    Deleted duplicate: ${slug}`); deleted += r.count; }
    else console.log(`    Not found: ${slug}`);
  }

  // ── 5. Rename YourParkingSpace listings to proper location names ────────────
  console.log("\n[5] Renaming YourParkingSpace listings...");
  const ypsRenames = [
    {
      slug: "parking-yourparkingspace",
      name: "Waitrose Car Park, Formby",
      shortDescription: "Car park at Waitrose Formby on Liverpool Road. Free while shopping.",
    },
    {
      slug: "parking-yourparkingspace-10",
      name: "Sainsbury's Car Park, Southport",
      shortDescription: "Car park at Sainsbury's Southport. Free for customers.",
    },
    {
      slug: "parking-yourparkingspace-11",
      name: "Premier Inn Car Park, Southport Central",
      shortDescription: "Car park at Premier Inn Southport Central. Town centre location.",
    },
    {
      slug: "parking-yourparkingspace-12",
      name: "Ocean Plaza Car Park, Southport",
      shortDescription: "Car park at Ocean Plaza retail and leisure complex, Marine Drive. Free parking for customers.",
    },
    {
      slug: "parking-yourparkingspace-2",
      name: "Tesco Car Park, Formby",
      shortDescription: "Car park at Tesco Formby. Free for customers while shopping.",
    },
    {
      slug: "parking-yourparkingspace-3",
      name: "Co-op Car Park, Ainsdale",
      shortDescription: "Car park at Co-op Food Ainsdale. Free for customers.",
    },
    {
      slug: "parking-yourparkingspace-4",
      name: "Premier Inn Car Park, Scarisbrick",
      shortDescription: "Car park at Premier Inn near Scarisbrick. Ormskirk / South Sefton area.",
    },
    {
      slug: "parking-yourparkingspace-5",
      name: "Tesco Car Park, Burscough",
      shortDescription: "Car park at Tesco Burscough. Free for customers while shopping.",
    },
    {
      slug: "parking-yourparkingspace-6",
      name: "Town Lane Car Park, Kew",
      shortDescription: "Car park off Town Lane, Kew, Southport.",
    },
    {
      slug: "parking-yourparkingspace-7",
      name: "Tesco Extra Car Park, Southport",
      shortDescription: "Car park at Tesco Extra Southport. Large free customer car park.",
    },
    {
      slug: "parking-yourparkingspace-8",
      name: "B&Q Car Park, Southport",
      shortDescription: "Car park at B&Q Southport. Free for customers.",
    },
    {
      slug: "parking-yourparkingspace-9",
      name: "Central 12 Retail Park Car Park",
      shortDescription: "Car park at Central 12 retail park, Southport town centre. Free for shoppers.",
    },
  ];

  for (const { slug, name, shortDescription } of ypsRenames) {
    const r = await prisma.business.updateMany({
      where: { slug },
      data: { name, shortDescription },
    });
    if (r.count > 0) { console.log(`    Renamed ${slug} → "${name}"`); renamed++; }
    else console.log(`    Not found: ${slug}`);
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n=== CLEANUP COMPLETE ===");
  console.log(`  Deleted:  ${deleted}`);
  console.log(`  Renamed:  ${renamed}`);

  // Final count
  const finalCount = await prisma.business.count({ where: { categoryId: cat.id } });
  console.log(`  Remaining: ${finalCount} parking listings`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
