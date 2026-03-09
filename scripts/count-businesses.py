#!/usr/bin/env python3
"""Quick count of business records for email scrape context."""
import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
load_dotenv('.env.local')

p = urlparse(os.getenv('DATABASE_URL'))
conn = psycopg2.connect(
    host=p.hostname,
    port=p.port or 5432,
    database=p.path.lstrip('/'),
    user=p.username,
    password=p.password,
    sslmode='require'
)

cur = conn.cursor()

cur.execute('SELECT COUNT(*) FROM "Business"')
total = cur.fetchone()[0]

cur.execute('SELECT COUNT(*) FROM "Business" WHERE website IS NOT NULL AND website != \'\'')
with_website = cur.fetchone()[0]

cur.execute('SELECT COUNT(*) FROM "Business" WHERE email IS NOT NULL AND email != \'\'')
with_email = cur.fetchone()[0]

cur.execute('''SELECT COUNT(*) FROM "Business"
    WHERE website IS NOT NULL AND website != ''
    AND (email IS NULL OR email = '')''')
scrape_pool = cur.fetchone()[0]

cur.execute('''SELECT COUNT(*) FROM "Business"
    WHERE website IS NULL OR website = \'\'''')
no_website = cur.fetchone()[0]

conn.close()

print("=== Business counts ===")
print(f"Total businesses:           {total}")
print(f"With website:               {with_website}")
print(f"Without website:            {no_website}")
print(f"With email (already):       {with_email}")
print(f"Scrape pool (website, no email): {scrape_pool}")
