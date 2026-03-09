/**
 * Bulk-tag all businesses based on address and description keyword matching.
 * Run with: node scripts/bulk-tag.mjs
 * Safe to re-run — it only ADDS tags, never removes existing ones.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { console.error("DATABASE_URL not set"); process.exit(1); }

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Tagging rules ──────────────────────────────────────────────────────────────
// Each rule: { tag, test(business) → boolean }
// address/postcode checks are exact; description checks are case-insensitive.

function haystack(b) {
  return [
    b.name,
    b.shortDescription,
    b.description,
    b.address,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const RULES = [
  // ── Location tags ───────────────────────────────────────────────────────────
  {
    tag: "lord-street",
    // addresses use "Lord St" and "Lord Street" interchangeably
    test: (b) => /lord\s+st/i.test(b.address ?? ""),
  },
  {
    tag: "birkdale",
    test: (b) => /birkdale/i.test(b.address ?? "") || /birkdale/i.test(b.name ?? ""),
  },
  {
    tag: "churchtown",
    test: (b) =>
      /churchtown/i.test(b.address ?? "") ||
      /churchtown/i.test(b.name ?? "") ||
      /botanic\s+garden/i.test(b.address ?? ""),
  },
  {
    tag: "seafront",
    test: (b) =>
      /marine\s+drive/i.test(b.address ?? "") ||
      /promenade/i.test(b.address ?? "") ||
      /seafront/i.test(b.address ?? "") ||
      /esplanade/i.test(b.address ?? ""),
  },

  // ── Feature tags (description-based) ────────────────────────────────────────
  {
    tag: "dog-friendly",
    test: (b) => {
      const h = haystack(b);
      return (
        /dog[- ]friendly/i.test(h) ||
        /dogs\s+welcome/i.test(h) ||
        /dogs\s+allowed/i.test(h) ||
        /well[- ]behaved\s+dogs/i.test(h) ||
        /four[- ]legged/i.test(h) ||
        /dog\s+bowl/i.test(h) ||
        /canine/i.test(h)
      );
    },
  },
  {
    tag: "outdoor-seating",
    test: (b) => {
      const h = haystack(b);
      return (
        /outdoor\s+seating/i.test(h) ||
        /outside\s+seating/i.test(h) ||
        /beer\s+garden/i.test(h) ||
        /garden\s+seating/i.test(h) ||
        /terrace/i.test(h) ||
        /al\s+fresco/i.test(h) ||
        /patio/i.test(h) ||
        /courtyard/i.test(h)
      );
    },
  },
  {
    tag: "family-friendly",
    test: (b) => {
      const h = haystack(b);
      return (
        /family[- ]friendly/i.test(h) ||
        /families\s+welcome/i.test(h) ||
        /children\s+welcome/i.test(h) ||
        /kids\s+(menu|welcome|eat)/i.test(h) ||
        /highchair/i.test(h) ||
        /children['']?s\s+menu/i.test(h) ||
        /family\s+pub/i.test(h) ||
        /suitable\s+for\s+(families|children)/i.test(h)
      );
    },
  },
  {
    tag: "parking",
    test: (b) => {
      const h = haystack(b);
      return (
        /free\s+parking/i.test(h) ||
        /on[- ]site\s+parking/i.test(h) ||
        /private\s+parking/i.test(h) ||
        /car\s+park/i.test(h) ||
        /ample\s+parking/i.test(h) ||
        /parking\s+available/i.test(h) ||
        /parking\s+on[- ]site/i.test(h)
      );
    },
  },
  {
    tag: "free",
    test: (b) => {
      const h = haystack(b);
      return (
        /free\s+entry/i.test(h) ||
        /free\s+admission/i.test(h) ||
        /no\s+(entry\s+)?charge/i.test(h) ||
        /admission\s+free/i.test(h) ||
        /free\s+to\s+(visit|enter|attend)/i.test(h)
      );
    },
  },
  {
    tag: "live-music",
    test: (b) => {
      const h = haystack(b);
      return (
        /live\s+music/i.test(h) ||
        /live\s+entertainment/i.test(h) ||
        /live\s+band/i.test(h) ||
        /live\s+acts/i.test(h) ||
        /live\s+act\b/i.test(h) ||
        /open\s+mic/i.test(h)
      );
    },
  },
  {
    tag: "late-night",
    test: (b) => {
      const h = haystack(b);
      return (
        /late\s+night/i.test(h) ||
        /open\s+until\s+(midnight|1am|2am|3am)/i.test(h) ||
        /nightclub/i.test(h) ||
        /open\s+late/i.test(h) ||
        /club\s+night/i.test(h)
      );
    },
  },
  {
    tag: "afternoon-tea",
    test: (b) => {
      const h = haystack(b);
      return /afternoon\s+tea/i.test(h);
    },
  },
  {
    tag: "bottomless-brunch",
    test: (b) => {
      const h = haystack(b);
      return (
        /bottomless\s+brunch/i.test(h) ||
        /bottomless\s+prosecco/i.test(h) ||
        /unlimited\s+brunch/i.test(h)
      );
    },
  },
  {
    tag: "budget",
    test: (b) => {
      const h = haystack(b);
      return (
        /budget\s+(hotel|accommodation|stay)/i.test(h) ||
        /affordable\s+(hotel|accommodation|rooms)/i.test(h) ||
        /cheap\s+(hotel|accommodation|rooms)/i.test(h) ||
        b.priceRange === "£"
      );
    },
  },
  {
    tag: "indoor",
    test: (b) => {
      const h = haystack(b);
      return (
        /indoor/i.test(h) ||
        /all[- ]weather/i.test(h) ||
        /rainy\s+day/i.test(h)
      );
    },
  },
  {
    tag: "beach",
    test: (b) => {
      const h = haystack(b);
      return (
        /beach/i.test(b.address ?? "") ||
        /marine\s+lake/i.test(h) ||
        /marine\s+drive/i.test(b.address ?? "")
      );
    },
  },
  {
    tag: "spa",
    test: (b) => {
      const h = haystack(b);
      return /\bspa\b/i.test(h);
    },
  },
  {
    tag: "golf",
    test: (b) => {
      const h = haystack(b);
      return /\bgolf\b/i.test(h) || /royal\s+birkdale/i.test(h);
    },
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────

const businesses = await prisma.business.findMany({
  select: {
    id: true,
    name: true,
    shortDescription: true,
    description: true,
    address: true,
    postcode: true,
    priceRange: true,
    tags: true,
  },
});

console.log(`\nProcessing ${businesses.length} businesses...\n`);

const tagCounts = {};
let updatedCount = 0;

for (const b of businesses) {
  const newTags = new Set(b.tags ?? []);

  for (const rule of RULES) {
    if (rule.test(b)) {
      newTags.add(rule.tag);
      tagCounts[rule.tag] = (tagCounts[rule.tag] ?? 0) + 1;
    }
  }

  const tagsArray = [...newTags];
  const changed = tagsArray.length !== (b.tags?.length ?? 0) ||
    tagsArray.some((t) => !(b.tags ?? []).includes(t));

  if (changed) {
    await prisma.business.update({
      where: { id: b.id },
      data: { tags: tagsArray },
    });
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} / ${businesses.length} businesses.\n`);
console.log("=== TAG COUNTS ===\n");
const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
for (const [tag, count] of sorted) {
  console.log(`  ${tag.padEnd(24)} ${count}`);
}
console.log("");

await prisma.$disconnect();
