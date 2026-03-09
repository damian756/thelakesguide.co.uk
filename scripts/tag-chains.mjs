/**
 * Tag well-known family-friendly and dog-friendly chains by name.
 * Safe to re-run — only adds tags.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Rules: name patterns → tags to apply ──────────────────────────────────────
const NAME_RULES = [
  // Family-friendly chains (all have kids menus, highchairs)
  { pattern: /mcdonald/i,          tags: ["family-friendly", "late-night"] },
  { pattern: /burger\s*king/i,     tags: ["family-friendly"] },
  { pattern: /kfc/i,               tags: ["family-friendly"] },
  { pattern: /nando/i,             tags: ["family-friendly"] },
  { pattern: /pizza\s*hut/i,       tags: ["family-friendly"] },
  { pattern: /pizza\s*express/i,   tags: ["family-friendly"] },
  { pattern: /prezzo/i,            tags: ["family-friendly"] },
  { pattern: /frankie/i,           tags: ["family-friendly"] },
  { pattern: /tgi\s*friday/i,      tags: ["family-friendly"] },
  { pattern: /harvester/i,         tags: ["family-friendly", "dog-friendly"] },
  { pattern: /toby\s*carvery/i,    tags: ["family-friendly"] },
  { pattern: /brewers\s*fayre/i,   tags: ["family-friendly"] },
  { pattern: /beefeater/i,         tags: ["family-friendly", "dog-friendly"] },
  { pattern: /wetherspoon/i,       tags: ["family-friendly"] },
  { pattern: /costa\b/i,           tags: ["family-friendly"] },
  { pattern: /starbucks/i,         tags: ["family-friendly"] },
  { pattern: /subway\b/i,          tags: ["family-friendly"] },
  { pattern: /greggs/i,            tags: ["family-friendly"] },
  { pattern: /dominos/i,           tags: ["family-friendly"] },
  { pattern: /papa\s*johns/i,      tags: ["family-friendly"] },
  { pattern: /five\s*guys/i,       tags: ["family-friendly"] },

  // Dog-friendly chains / pub brands
  { pattern: /marstons/i,          tags: ["dog-friendly", "family-friendly"] },
  { pattern: /marston/i,           tags: ["dog-friendly", "family-friendly"] },
  { pattern: /hungry\s*horse/i,    tags: ["dog-friendly", "family-friendly"] },
  { pattern: /ember\s*inn/i,       tags: ["dog-friendly", "family-friendly"] },
  { pattern: /sizzling\s*pub/i,    tags: ["dog-friendly", "family-friendly"] },
  { pattern: /milestone/i,         tags: ["dog-friendly"] },

  // Late-night
  { pattern: /kebab/i,             tags: ["late-night"] },
  { pattern: /shisha/i,            tags: ["late-night"] },

  // Afternoon tea — known Southport hotels/venues
  { pattern: /scarisbrick\s*hotel/i, tags: ["afternoon-tea"] },
  { pattern: /prince\s*of\s*wales/i, tags: ["afternoon-tea"] },
  { pattern: /vincent\s*hotel/i,    tags: ["afternoon-tea"] },
  { pattern: /grand.*southport/i,   tags: ["afternoon-tea"] },
];

const businesses = await prisma.business.findMany({
  select: { id: true, name: true, tags: true },
});

console.log(`\nProcessing ${businesses.length} businesses against ${NAME_RULES.length} chain rules...\n`);

let updated = 0;
const summary = {};

for (const b of businesses) {
  const toAdd = new Set();

  for (const rule of NAME_RULES) {
    if (rule.pattern.test(b.name)) {
      rule.tags.forEach((t) => toAdd.add(t));
    }
  }

  if (toAdd.size === 0) continue;

  const existing = new Set(b.tags ?? []);
  const newTags = [...toAdd].filter((t) => !existing.has(t));
  if (newTags.length === 0) continue;

  const merged = [...existing, ...newTags];
  await prisma.business.update({ where: { id: b.id }, data: { tags: merged } });
  updated++;

  newTags.forEach((t) => { summary[t] = (summary[t] ?? 0) + 1; });
  console.log(`  ${b.name} → +[${newTags.join(", ")}]`);
}

console.log(`\nUpdated ${updated} businesses.\n`);
if (Object.keys(summary).length > 0) {
  console.log("New tags applied:");
  Object.entries(summary).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => console.log(`  ${t.padEnd(20)} +${c}`));
}

await prisma.$disconnect();
