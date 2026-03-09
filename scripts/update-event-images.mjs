/**
 * Set featuredImage on Event records for the dashboard events page.
 * Run: node scripts/update-event-images.mjs
 */

import pg from 'pg';

const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const DB = process.env.DATABASE_URL;

const IMAGES = {
  'southport-spring-market-2026':  '/images/dashboard/event-market.jpg',
  'southport-easter-weekend-2026': '/images/dashboard/event-market.jpg',
  'southport-food-festival-2026':  '/images/dashboard/event-market.jpg',
  'the-open-royal-birkdale-2026':  '/images/dashboard/event-the-open.jpg',
  'southport-airshow-2026':        '/images/dashboard/event-airshow.jpg',
  'southport-flower-show-2026':    '/images/dashboard/event-flower-show.jpg',
};

const client = new Client({ connectionString: DB });
await client.connect();

for (const [slug, image] of Object.entries(IMAGES)) {
  const res = await client.query(
    'UPDATE "Event" SET "featuredImage" = $1, "updatedAt" = NOW() WHERE slug = $2',
    [image, slug]
  );
  console.log(`${slug}: ${res.rowCount} row updated → ${image}`);
}

await client.end();
console.log('\n✅ Event images updated.');
