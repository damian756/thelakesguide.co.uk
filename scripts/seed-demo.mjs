/**
 * Demo account seed — The Sandgrounder gastropub
 * Creates: demo user, fake business, 90 days of click/view data,
 * review snapshots, and past boost records.
 *
 * Run: node scripts/seed-demo.mjs
 * Re-runnable: checks for existing records and skips if already present.
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const DB = process.env.DATABASE_URL;

const DEMO_EMAIL    = 'demo@thelakesguide.co.uk';
const DEMO_PASSWORD = 'demo2026';
const CATEGORY_ID   = 'dc9cd60c-409e-473f-b76a-7175cf65fb52'; // bars-nightlife
const CATEGORY_SLUG = 'bars-nightlife';

const client = new Client({ connectionString: DB });
await client.connect();

// ── 1. User ────────────────────────────────────────────────────────────────

let userId;
const existingUser = await client.query('SELECT id FROM "User" WHERE email = $1', [DEMO_EMAIL]);
if (existingUser.rowCount > 0) {
  userId = existingUser.rows[0].id;
  console.log('Demo user already exists:', userId);
} else {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 12);
  userId = randomUUID();
  await client.query(
    `INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, 'user', NOW(), NOW())`,
    [userId, DEMO_EMAIL, hash, 'Demo User']
  );
  console.log('Created demo user:', userId);
}

// ── 2. Business ────────────────────────────────────────────────────────────

let businessId;
const existingBiz = await client.query('SELECT id FROM "Business" WHERE slug = $1', ['the-sandgrounder']);
if (existingBiz.rowCount > 0) {
  businessId = existingBiz.rows[0].id;
  console.log('Demo business already exists:', businessId);
} else {
  businessId = randomUUID();
  await client.query(
    `INSERT INTO "Business" (
      id, slug, name, "categoryId", address, postcode,
      phone, email, website, description, "shortDescription",
      "priceRange", "listingTier", claimed, "hubTier",
      "weeklyEmailEnabled", "boostCredits", "userId",
      rating, "reviewCount", "secondaryCategoryIds",
      "createdAt", "updatedAt"
    ) VALUES (
      $1, 'the-sandgrounder', 'The Sandgrounder', $2,
      '12 Lord Street, Southport', 'PR8 1QJ',
      '01704 555 123', 'hello@thesandgrounder.co.uk', 'https://thesandgrounder.co.uk',
      'A proper Southport gastropub serving local ales, seasonal small plates and Sunday roasts worth writing home about. Named after the locals — we are proud of it.',
      'Southport gastropub — local ales, small plates, Sunday roasts.',
      '££', 'free', true, 'pro',
      true, 2, $3,
      4.4, 187, '{}',
      NOW() - INTERVAL '120 days', NOW()
    )`,
    [businessId, CATEGORY_ID, userId]
  );
  console.log('Created demo business:', businessId);
}

// ── 3. Click/view data — 90 days ───────────────────────────────────────────

const existingClicks = await client.query(
  'SELECT COUNT(*) FROM "BusinessClick" WHERE "businessId" = $1', [businessId]
);
if (parseInt(existingClicks.rows[0].count) > 0) {
  console.log('Click data already seeded, skipping.');
} else {
  console.log('Seeding 90 days of click/view data...');

  const types = ['view', 'view', 'view', 'view', 'view', 'website', 'phone', 'directions', 'google_reviews'];
  const rows = [];
  const now = new Date();

  for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

    // Base volume: weekends higher, Tue–Thu lower
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const baseViews = isWeekend ? 18 : 9;

    // Event spike: Air Show (last weekend of July — approx 60 days ago from late Feb)
    const isEventSpike = daysAgo >= 58 && daysAgo <= 62;
    // Open 2026 awareness spike: ~30 days ago
    const isOpenSpike = daysAgo >= 28 && daysAgo <= 32;

    const multiplier = isEventSpike ? 3.5 : isOpenSpike ? 2.2 : 1;
    const totalEvents = Math.round((baseViews + Math.random() * 6) * multiplier);

    for (let i = 0; i < totalEvents; i++) {
      // Distribute clicks across the day (10am–11pm peak)
      const hour = 10 + Math.floor(Math.random() * 13);
      const min  = Math.floor(Math.random() * 60);
      const ts   = new Date(date);
      ts.setHours(hour, min, Math.floor(Math.random() * 60), 0);

      // Weight towards views
      const type = types[Math.floor(Math.random() * types.length)];
      rows.push([randomUUID(), businessId, type, ts.toISOString()]);
    }
  }

  // Batch insert in chunks of 500
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const values = chunk.map((r, idx) => {
      const base = idx * 4;
      return `($${base+1}, $${base+2}, $${base+3}, $${base+4})`;
    }).join(', ');
    const flat = chunk.flat();
    await client.query(
      `INSERT INTO "BusinessClick" (id, "businessId", type, "createdAt") VALUES ${values}`,
      flat
    );
  }
  console.log(`Inserted ${rows.length} click/view records.`);
}

// ── 4. Review snapshots — weekly for 12 weeks ─────────────────────────────

const existingSnaps = await client.query(
  'SELECT COUNT(*) FROM "ReviewSnapshot" WHERE "businessId" = $1', [businessId]
);
if (parseInt(existingSnaps.rows[0].count) > 0) {
  console.log('Review snapshots already seeded, skipping.');
} else {
  console.log('Seeding review snapshots...');
  // Rating climbs from 4.1 → 4.4, review count grows 142 → 187
  const snapshots = [
    { weeksAgo: 12, rating: 4.1, reviewCount: 142 },
    { weeksAgo: 11, rating: 4.1, reviewCount: 149 },
    { weeksAgo: 10, rating: 4.2, reviewCount: 155 },
    { weeksAgo: 9,  rating: 4.2, reviewCount: 161 },
    { weeksAgo: 8,  rating: 4.2, reviewCount: 164 },
    { weeksAgo: 7,  rating: 4.3, reviewCount: 169 },
    { weeksAgo: 6,  rating: 4.3, reviewCount: 172 },
    { weeksAgo: 5,  rating: 4.3, reviewCount: 175 },
    { weeksAgo: 4,  rating: 4.3, reviewCount: 179 },
    { weeksAgo: 3,  rating: 4.4, reviewCount: 181 },
    { weeksAgo: 2,  rating: 4.4, reviewCount: 184 },
    { weeksAgo: 1,  rating: 4.4, reviewCount: 187 },
  ];
  for (const s of snapshots) {
    const ts = new Date();
    ts.setDate(ts.getDate() - s.weeksAgo * 7);
    await client.query(
      `INSERT INTO "ReviewSnapshot" (id, "businessId", rating, "reviewCount", "snapshotAt")
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), businessId, s.rating, s.reviewCount, ts.toISOString()]
    );
  }
  console.log('Inserted 12 review snapshots.');
}

// ── 5. Past boosts ─────────────────────────────────────────────────────────

const existingBoosts = await client.query(
  'SELECT COUNT(*) FROM "ListingBoost" WHERE "businessId" = $1', [businessId]
);
if (parseInt(existingBoosts.rows[0].count) > 0) {
  console.log('Boost history already seeded, skipping.');
} else {
  console.log('Seeding boost history...');
  const boosts = [
    {
      type: 'air_show', label: 'Air Show Weekend',
      daysAgoStart: 62, daysAgoEnd: 59,
      pricePence: 4900, status: 'expired',
    },
    {
      type: 'weekend', label: null,
      daysAgoStart: 35, daysAgoEnd: 32,
      pricePence: 1000, status: 'expired',
    },
    {
      type: 'standard', label: null,
      daysAgoStart: 14, daysAgoEnd: 7,
      pricePence: 1500, status: 'expired',
    },
  ];
  const now = new Date();
  for (const b of boosts) {
    const startsAt = new Date(now); startsAt.setDate(startsAt.getDate() - b.daysAgoStart);
    const endsAt   = new Date(now); endsAt.setDate(endsAt.getDate()   - b.daysAgoEnd);
    await client.query(
      `INSERT INTO "ListingBoost" (id, "businessId", "categoryId", type, label, "startsAt", "endsAt", "pricePence", status, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [randomUUID(), businessId, CATEGORY_ID, b.type, b.label, startsAt.toISOString(), endsAt.toISOString(), b.pricePence, b.status, startsAt.toISOString()]
    );
  }
  console.log('Inserted 3 past boost records.');
}

await client.end();

console.log('\n✅ Demo seeding complete.');
console.log('   Login: demo@thelakesguide.co.uk / demo2026');
console.log('   Business: The Sandgrounder (bars-nightlife)');
console.log('   Tier: Pro | Boost credits: 2');
