import pg from 'pg';
const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const r = await client.query(
  `UPDATE "Business" SET images = $1, "updatedAt" = NOW() WHERE slug = 'the-sandgrounder' RETURNING id, name, images`,
  [['https://www.thelakesguide.co.uk/images/dashboard/sandgrounder-listing.jpg']]
);
console.log(r.rows);
await client.end();
