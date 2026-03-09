/**
 * Boost the last 7 days of clicks for The Sandgrounder demo account
 * so that "this week vs last week" shows green +% on the home page stat cards.
 *
 * Run ONCE: node scripts/boost-recent-clicks.mjs
 * Re-run safe — checks total count first and skips if already > 800 for current week.
 */

import pg from 'pg';
import { randomUUID } from 'crypto';

const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const DB = process.env.DATABASE_URL;

const client = new Client({ connectionString: DB });
await client.connect();

// Find The Sandgrounder
const bizResult = await client.query(
  'SELECT id FROM "Business" WHERE slug = $1',
  ['the-sandgrounder']
);
if (bizResult.rowCount === 0) {
  console.error('Demo business not found. Run seed-demo.mjs first.');
  await client.end();
  process.exit(1);
}
const businessId = bizResult.rows[0].id;

// Check current week clicks (Mon–now)
const now = new Date();
const day = now.getDay();
const mondayOffset = day === 0 ? -6 : 1 - day;
const thisMonday = new Date(now);
thisMonday.setDate(now.getDate() + mondayOffset);
thisMonday.setHours(0, 0, 0, 0);

const currentWeekCheck = await client.query(
  'SELECT COUNT(*) FROM "BusinessClick" WHERE "businessId" = $1 AND "createdAt" >= $2',
  [businessId, thisMonday.toISOString()]
);
const currentWeekCount = parseInt(currentWeekCheck.rows[0].count);

if (currentWeekCount >= 120) {
  console.log(`This week already has ${currentWeekCount} clicks — skipping boost.`);
  await client.end();
  process.exit(0);
}

console.log(`Current week has ${currentWeekCount} clicks. Boosting last 7 days...`);

// Add extra clicks for each of last 7 days (today + 6 days back)
// Weight: more today/yesterday, decent for earlier days
const types = ['view', 'view', 'view', 'view', 'view', 'website', 'phone', 'directions'];
const rows = [];

for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);

  // Extra clicks: taper from today (most) to 6 days ago (fewer)
  const extra = Math.round(18 + (6 - daysAgo) * 2 + Math.random() * 8);

  for (let i = 0; i < extra; i++) {
    const hour = 11 + Math.floor(Math.random() * 11); // 11am–10pm
    const min = Math.floor(Math.random() * 60);
    const ts = new Date(date);
    ts.setHours(hour, min, Math.floor(Math.random() * 60), 0);
    const type = types[Math.floor(Math.random() * types.length)];
    rows.push([randomUUID(), businessId, type, ts.toISOString()]);
  }
}

// Batch insert
for (let i = 0; i < rows.length; i += 500) {
  const chunk = rows.slice(i, i + 500);
  const values = chunk.map((r, idx) => {
    const base = idx * 4;
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
  }).join(', ');
  await client.query(
    `INSERT INTO "BusinessClick" (id, "businessId", type, "createdAt") VALUES ${values}`,
    chunk.flat()
  );
}

await client.end();
console.log(`✅ Added ${rows.length} extra clicks for last 7 days.`);
console.log('   The home page stat cards should now show green % vs last week.');
