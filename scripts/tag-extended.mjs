/**
 * Extended tagging — targets remaining empty collections using:
 *  - Name pattern matching (UK pub culture, known venue types)
 *  - Category-aware rules (parks/nature = free, etc.)
 *  - Address-based rules (seafront/beach = outdoor seating likely)
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
    tags: true,
    category: { select: { slug: true } },
  },
});

console.log(`\nProcessing ${businesses.length} businesses...\n`);

function haystack(b) {
  return `${b.name} ${b.address ?? ""}`.toLowerCase();
}

const updates = {}; // id → Set of new tags

function add(b, ...tags) {
  if (!updates[b.id]) updates[b.id] = { b, tags: new Set() };
  tags.forEach((t) => {
    if (!(b.tags ?? []).includes(t)) updates[b.id].tags.add(t);
  });
}

for (const b of businesses) {
  const name = b.name.toLowerCase();
  const cat = b.category.slug;
  const h = haystack(b);

  // ── FREE THINGS TO DO ─────────────────────────────────────────────────────
  // beaches-parks category = free to visit (overwhelmingly true for Southport)
  if (cat === "beaches-parks") {
    add(b, "free", "family-friendly");
  }
  // Specific named free attractions
  if (
    /botanic\s+garden/i.test(name) ||
    /hesketh\s+park/i.test(name) ||
    /victoria\s+park/i.test(name) ||
    /nature\s+reserve/i.test(name) ||
    /\bnnr\b/i.test(name) ||
    /ainsdale\s+(beach|dunes|pine|sand)/i.test(name) ||
    /freshfield\s+dune/i.test(name) ||
    /southport\s+pier/i.test(name) ||
    /junction\s+pool/i.test(name) ||
    /banks\s+marsh/i.test(name) ||
    /martin\s+mere/i.test(name) ||
    /marshside/i.test(name)
  ) {
    add(b, "free");
  }
  // Another Place sculpture (already tagged but belt-and-braces)
  if (/another\s+place/i.test(name) || /antony\s+gormley/i.test(name)) {
    add(b, "free");
  }

  // ── FAMILY-FRIENDLY ───────────────────────────────────────────────────────
  if (
    /splash\s*world/i.test(name) ||
    /adventure\s+coast/i.test(name) ||
    /viking\s+golf/i.test(name) ||
    /silcock/i.test(name) ||
    /amusement/i.test(name) ||
    /\bcinema\b/i.test(name) ||
    /\bvue\b/i.test(name) ||
    /swimming\s+pool/i.test(name) ||
    /\bh2o\b/i.test(name) ||
    /eden\s+play/i.test(name) ||
    /indoor\s+play/i.test(name) ||
    /play\s+centre/i.test(name) ||
    /softplay/i.test(name) ||
    /soft\s+play/i.test(name) ||
    /tree\s+top\s+towers/i.test(name) ||
    /model\s+railway/i.test(name) ||
    /lawnmower\s+museum/i.test(name) ||
    /bowling/i.test(name) ||
    /laser\s+(tag|quest)/i.test(name) ||
    /go\s*kart/i.test(name) ||
    /funland/i.test(name) ||
    /pleasureland/i.test(name) ||
    /\bzoo\b/i.test(name)
  ) {
    add(b, "family-friendly");
  }
  // Parks/nature areas already covered above by beaches-parks category

  // ── DOG-FRIENDLY ──────────────────────────────────────────────────────────
  // UK pub name patterns: Arms, Inn, Tavern, Anchor, Crown, Horse, Lion, Eagle,
  // Swan, Plough, Dog etc. — the majority of traditional British pubs welcome dogs.
  // Restricting to bars-nightlife category to avoid over-tagging.
  if (cat === "bars-nightlife") {
    if (
      /\barms\b/i.test(name) ||
      /\binn\b/i.test(name) ||
      /\btavern\b/i.test(name) ||
      /\banchor\b/i.test(name) ||
      /\bcrown\b/i.test(name) ||
      /\bplough\b/i.test(name) ||
      /\bearl\b/i.test(name) ||
      /\byew\s+tree\b/i.test(name) ||
      /\bthatch\b/i.test(name) ||
      /\bsettler/i.test(name) ||
      /\bsettle\s+inn\b/i.test(name) ||
      /\bpub\b.*\bbotanic/i.test(name) ||
      /botanic.*\bpub\b/i.test(name) ||
      /\bfarmhouse\b/i.test(name) ||
      /heatons\s+bridge/i.test(name) ||
      /\bbold\s+arms\b/i.test(name) ||
      /\bblue\s+anchor\b/i.test(name) ||
      /\bsaracen/i.test(name) ||
      /\bkicking\s+donkey\b/i.test(name) ||
      /\blegh\s+arms\b/i.test(name) ||
      /\brabbit\s+inn\b/i.test(name) ||
      /\bsettle\s+inn\b/i.test(name) ||
      /ralph.?s\s+wife/i.test(name) ||
      /riverside\s+bar/i.test(name) ||
      /lakeside\s+(bar|inn)/i.test(name) ||
      /\bbeach\s+(bar|hut)\b/i.test(name) ||
      /marine\s+lake/i.test(name)
    ) {
      add(b, "dog-friendly");
    }
  }
  // Dog-friendly cafes — cafes near beach/seafront/parks are usually dog-welcoming
  if (cat === "cafes") {
    if (
      /beach/i.test(h) ||
      /seafront/i.test(h) ||
      /promenade/i.test(h) ||
      /marine\s+drive/i.test(h) ||
      /botanic/i.test(h) ||
      /\bpark\b/i.test(h) ||
      /\bnature\b/i.test(h) ||
      /dog/i.test(name)
    ) {
      add(b, "dog-friendly");
    }
  }
  // Dog-friendly restaurants near beach/park
  if (cat === "restaurants") {
    if (
      /\bdog\b/i.test(name) ||
      /dog.?friendly/i.test(name) ||
      /beach/i.test(b.address ?? "") ||
      /marine\s+drive/i.test(b.address ?? "") ||
      /promenade/i.test(b.address ?? "")
    ) {
      add(b, "dog-friendly");
    }
  }

  // ── OUTDOOR SEATING ───────────────────────────────────────────────────────
  // Traditional pubs in bars-nightlife — vast majority have a beer garden
  if (cat === "bars-nightlife") {
    if (
      /\barms\b/i.test(name) ||
      /\binn\b/i.test(name) ||
      /\btavern\b/i.test(name) ||
      /\bplough\b/i.test(name) ||
      /\byew\s+tree\b/i.test(name) ||
      /\bthatch\b/i.test(name) ||
      /heatons\s+bridge/i.test(name) ||
      /\bkicking\s+donkey\b/i.test(name) ||
      /\blegh\s+arms\b/i.test(name) ||
      /\bsaracen/i.test(name) ||
      /lakeside/i.test(name) ||
      /beach\s+(bar|hut)/i.test(name) ||
      /marine\s+lake/i.test(name) ||
      /\briverside\b/i.test(name) ||
      /rooftop/i.test(name) ||
      /terrace/i.test(name) ||
      /beer\s+garden/i.test(name) ||
      /wetherspoon/i.test(name)
    ) {
      add(b, "outdoor-seating");
    }
  }
  // Restaurants on seafront/beach addresses likely have outdoor seating
  if (cat === "restaurants") {
    if (
      /promenade/i.test(b.address ?? "") ||
      /marine\s+drive/i.test(b.address ?? "") ||
      /esplanade/i.test(b.address ?? "") ||
      /rooftop/i.test(name) ||
      /terrace/i.test(name) ||
      /beer\s+garden/i.test(name)
    ) {
      add(b, "outdoor-seating");
    }
  }
  // Wetherspoons chain — always has outdoor seating
  if (/wetherspoon/i.test(name)) {
    add(b, "outdoor-seating", "family-friendly");
  }

  // ── LIVE MUSIC ────────────────────────────────────────────────────────────
  if (cat === "bars-nightlife" || cat === "restaurants") {
    if (
      /irish\s+pub/i.test(name) ||
      /connolly/i.test(name) ||         // Irish pubs traditionally have live music
      /o'.*bar/i.test(name) ||
      /cuban/i.test(name) ||
      /latin\s+lounge/i.test(name) ||
      /jazz/i.test(name) ||
      /blues/i.test(name) ||
      /\bkaraoke\b/i.test(name) ||
      /\blive\b.*\bmusic\b/i.test(name) ||
      /\btribut/i.test(name) ||
      /music\s+(bar|venue|lounge)/i.test(name) ||
      /\bthe\s+atkinson\b/i.test(name) ||
      /floral\s+hall/i.test(name) ||
      /chatsworth\s+lounge/i.test(name) || // known for entertainment
      /lakeside\s+inn/i.test(name) ||      // known for live music events
      /\btithe\s+barn\b/i.test(name) ||    // events venue
      /1881\s+lounge/i.test(name)          // events venue at stadium
    ) {
      add(b, "live-music");
    }
  }
  // The Atkinson (arts centre — live music/events)
  if (/atkinson/i.test(name) && cat === "attractions") {
    add(b, "live-music", "family-friendly");
  }

  // ── LATE NIGHT ───────────────────────────────────────────────────────────
  if (cat === "bars-nightlife") {
    if (
      /nightclub/i.test(name) ||
      /\bclub\b/i.test(name) ||
      /lounge\s+bar/i.test(name) ||
      /\bbar\s+thirteen\b/i.test(name) ||  // known late night
      /\bcloud\s+9\b/i.test(name) ||
      /\bmaverisk/i.test(name) ||
      /\bnolls\b/i.test(name) ||
      /\ble\s+moose\b/i.test(name) ||
      /\bmedhito\b/i.test(name) ||          // Cuban lounge, late night
      /\bskies\s+lounge\b/i.test(name) ||
      /\bthe\s+1881\b/i.test(name) ||
      /\btwelve\s+fusion\b/i.test(name) ||
      /\bra\s+bar\b/i.test(name) ||
      /\bcorridor\s+bar\b/i.test(name) ||
      /\bgingers\s+bar\b/i.test(name)
    ) {
      add(b, "late-night");
    }
  }

  // ── AFTERNOON TEA ────────────────────────────────────────────────────────
  if (
    /afternoon\s+tea/i.test(name) ||
    /tea\s+room/i.test(name) ||
    /tearoom/i.test(name) ||
    /the\s+beefeater/i.test(name) ||  // some Beefeaters do afternoon tea
    /floral\s+hall/i.test(name)
  ) {
    add(b, "afternoon-tea");
  }
  // Hotels known for afternoon tea not yet tagged
  if (
    /royal\s+clifton/i.test(name) ||
    /clifton\s+hotel/i.test(name)
  ) {
    add(b, "afternoon-tea");
  }

  // ── BOTTOMLESS BRUNCH ────────────────────────────────────────────────────
  // Very hard to detect from name — tag places specifically known for it
  if (
    /bottomless/i.test(name) ||
    /prosecco\s+brunch/i.test(name) ||
    /unlimited\s+brunch/i.test(name) ||
    // Bar/restaurants known for brunch culture
    /\bgusto\b/i.test(name) ||           // Gusto Trattoria — does bottomless brunch
    /\bauberge\b/i.test(name) ||         // Auberge Brasserie — events programme
    /twelve\s+fusion/i.test(name) ||
    /\bcinema\b/i.test(name) && cat === "bars-nightlife"  // Vue Southport bar does brunch
  ) {
    add(b, "bottomless-brunch");
  }

  // ── HOTELS WITH PARKING ──────────────────────────────────────────────────
  // Hotels with "lodge", "motor", "travel" in name typically have parking
  if (cat === "hotels") {
    if (
      /\blodge\b/i.test(name) ||
      /\bmotor\b/i.test(name) ||
      /travelodge/i.test(name) ||
      /premier\s+inn/i.test(name) ||
      /holiday\s+inn/i.test(name) ||
      /\bholiday\s+park\b/i.test(name) ||
      /\bcaravan\s+park\b/i.test(name) ||
      /\bholiday\s+let\b/i.test(name) ||
      /ibis/i.test(name)
    ) {
      add(b, "parking");
    }
  }
}

// ── Apply to DB ────────────────────────────────────────────────────────────────
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

// Final totals
const totals = await prisma.$queryRaw`
  SELECT tag, COUNT(*)::int AS businesses
  FROM "Business", unnest(tags) AS tag
  GROUP BY tag ORDER BY businesses DESC
`;
console.log("\n=== ALL TAG TOTALS NOW ===\n");
totals.forEach((r) => console.log(`  ${r.tag.padEnd(24)} ${r.businesses}`));

await prisma.$disconnect();
