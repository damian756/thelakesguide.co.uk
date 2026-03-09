import pg from 'pg';
const { Client } = pg;
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const r = await client.query('SELECT email, role FROM "User" WHERE email IN ($1, $2)', ['damian@churchtownmedia.co.uk', 'demo@thelakesguide.co.uk']);
console.log(r.rows);
await client.end();
