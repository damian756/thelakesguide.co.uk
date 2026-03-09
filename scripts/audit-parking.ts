import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.findFirst({ where: { slug: "parking" } });
  if (!cat) { console.log("No parking category found"); return; }

  const all = await prisma.business.findMany({
    where: { categoryId: cat.id },
    select: { id: true, slug: true, name: true, address: true, postcode: true, tags: true, description: true, lat: true, lng: true },
    orderBy: { name: "asc" },
  });

  console.log(`\n=== TOTAL PARKING LISTINGS: ${all.length} ===\n`);

  // Coordinate-named
  const coordPattern = /^Car Park \([-\d.]+,\s*[-\d.]+\)$/;
  const coord = all.filter(b => coordPattern.test(b.name));
  console.log(`\n--- COORDINATE-NAMED (${coord.length}) ---`);
  coord.slice(0, 20).forEach(b => console.log(`  ${b.name} | addr: ${b.address.split(",")[0]} | postcode: ${b.postcode}`));
  if (coord.length > 20) console.log(`  ... and ${coord.length - 20} more`);

  // YourParkingSpace
  const yps = all.filter(b => b.name.toLowerCase().includes("yourparkingspace") || b.name.toLowerCase().includes("your parking space"));
  console.log(`\n--- YOURPARKINGSPACE (${yps.length}) ---`);
  yps.forEach(b => console.log(`  ${b.name} | addr: ${b.address.split(",")[0]}`));

  // Irrelevant patterns
  const irrelevantPatterns = [
    /driving test/i, /drop.?off/i, /pick.?up/i, /staff car park/i, /staff parking/i,
    /nhs parking/i, /smedley/i, /cycle.?parking/i, /cycle rack/i, /motorcycle/i,
    /residents.? only/i, /permit only/i, /private/i, /disabled.?bay/i,
  ];
  const irrelevant = all.filter(b => irrelevantPatterns.some(p => p.test(b.name)));
  console.log(`\n--- IRRELEVANT/RESTRICTED (${irrelevant.length}) ---`);
  irrelevant.forEach(b => console.log(`  ${b.name} | addr: ${b.address.split(",")[0]}`));

  // Cycle parking by tag
  const cycleParkingByTag = all.filter(b => (b.tags as string[]).includes("cycle-parking"));
  console.log(`\n--- CYCLE PARKING BY TAG (${cycleParkingByTag.length}) ---`);
  cycleParkingByTag.forEach(b => console.log(`  ${b.name}`));

  // Listings with very short/generic descriptions
  const thinDesc = all.filter(b => !b.description || b.description.length < 80);
  console.log(`\n--- THIN/NO DESCRIPTION (${thinDesc.length}) ---`);

  // What would remain as "good" listings
  const badSlugs = new Set([
    ...coord.map(b => b.slug),
    ...yps.map(b => b.slug),
    ...irrelevant.map(b => b.slug),
    ...cycleParkingByTag.map(b => b.slug),
  ]);
  const good = all.filter(b => !badSlugs.has(b.slug));
  console.log(`\n--- GOOD LISTINGS (${good.length}) ---`);
  good.forEach(b => console.log(`  ${b.name} | ${b.postcode}`));

  // Potential duplicates — same postcode or within close name similarity
  const nameGroups: Record<string, typeof all> = {};
  for (const b of all) {
    const key = b.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
    if (!nameGroups[key]) nameGroups[key] = [];
    nameGroups[key].push(b);
  }
  const dupeGroups = Object.entries(nameGroups).filter(([, v]) => v.length > 1);
  console.log(`\n--- POTENTIAL DUPLICATES (${dupeGroups.length} groups) ---`);
  dupeGroups.forEach(([key, items]) => {
    console.log(`  Group "${key}":`);
    items.forEach(b => console.log(`    ${b.name} | ${b.slug} | ${b.postcode}`));
  });

  console.log("\n=== SUMMARY ===");
  console.log(`  Total:         ${all.length}`);
  console.log(`  Coord-named:   ${coord.length}`);
  console.log(`  YourParkingSpace: ${yps.length}`);
  console.log(`  Irrelevant:    ${irrelevant.length}`);
  console.log(`  Cycle-tagged:  ${cycleParkingByTag.length}`);
  console.log(`  Would keep:    ${good.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
