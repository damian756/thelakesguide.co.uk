/**
 * Seed upcoming events for the Southport Guide dashboard demo.
 * Run: node scripts/seed-events.mjs
 * Safe to re-run — skips events that already exist by slug.
 */

import pg from 'pg';
import { randomUUID } from 'crypto';

const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const DB = process.env.DATABASE_URL;

const client = new Client({ connectionString: DB });
await client.connect();

const now = new Date();

function daysFromNow(n) {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  d.setHours(10, 0, 0, 0);
  return d;
}

const events = [
  {
    slug: 'southport-spring-market-2026',
    name: 'Southport Spring Market',
    description: 'Southport town centre spring market with local food, crafts, and live music along Lord Street.',
    dateStart: daysFromNow(9),
    dateEnd: daysFromNow(11),
    category: 'market',
    featured: true,
  },
  {
    slug: 'southport-easter-weekend-2026',
    name: 'Easter Bank Holiday Weekend',
    description: 'Easter weekend brings a surge of day-trippers and families to Southport beach and the town centre.',
    dateStart: daysFromNow(51),
    dateEnd: daysFromNow(54),
    category: 'bank-holiday',
    featured: false,
  },
  {
    slug: 'southport-food-festival-2026',
    name: 'Southport Food & Drink Festival',
    description: 'Two-day outdoor food festival celebrating the best of Southport and Merseyside food and drink.',
    dateStart: daysFromNow(65),
    dateEnd: daysFromNow(66),
    category: 'festival',
    featured: true,
  },
  {
    slug: 'the-open-royal-birkdale-2026',
    name: 'The Open — Royal Birkdale 2026',
    description: 'The 155th Open Championship returns to Royal Birkdale. Tens of thousands of golf fans descend on Southport.',
    dateStart: daysFromNow(138),
    dateEnd: daysFromNow(144),
    category: 'sport',
    featured: true,
  },
  {
    slug: 'southport-airshow-2026',
    name: 'Southport Air Show 2026',
    description: 'Southport\'s annual air show draws over 100,000 visitors to the seafront over two days.',
    dateStart: daysFromNow(149),
    dateEnd: daysFromNow(150),
    category: 'entertainment',
    featured: true,
  },
  {
    slug: 'southport-flower-show-2026',
    name: 'Southport Flower Show 2026',
    description: 'One of the UK\'s largest horticultural shows, held at Victoria Park. Four days of gardens, food, and entertainment.',
    dateStart: daysFromNow(175),
    dateEnd: daysFromNow(178),
    category: 'show',
    featured: true,
  },
];

let inserted = 0;
let skipped = 0;

for (const ev of events) {
  const existing = await client.query(
    'SELECT id FROM "Event" WHERE slug = $1',
    [ev.slug]
  );
  if (existing.rowCount > 0) {
    console.log(`Skipped (exists): ${ev.name}`);
    skipped++;
    continue;
  }

  await client.query(
    `INSERT INTO "Event" (id, slug, name, description, "dateStart", "dateEnd", category, featured, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
    [
      randomUUID(),
      ev.slug,
      ev.name,
      ev.description,
      ev.dateStart.toISOString(),
      ev.dateEnd?.toISOString() ?? null,
      ev.category,
      ev.featured,
    ]
  );
  console.log(`Inserted: ${ev.name} (${ev.dateStart.toDateString()})`);
  inserted++;
}

await client.end();
console.log(`\n✅ Events done — ${inserted} inserted, ${skipped} skipped.`);
