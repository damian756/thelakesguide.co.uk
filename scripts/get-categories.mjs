import pg from 'pg';
const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const r = await client.query('SELECT id, slug, name FROM "Category" ORDER BY name');
console.log(JSON.stringify(r.rows, null, 2));
await client.end();
