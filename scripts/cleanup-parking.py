import os, psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.getenv('DATABASE_URL')
p = urlparse(url)
conn = psycopg2.connect(
    host=p.hostname,
    port=p.port or 5432,
    database=p.path.lstrip('/'),
    user=p.username,
    password=p.password,
    sslmode='require'
)
cur = conn.cursor()

# Preview what will be removed
cur.execute("""
    SELECT b.name, b.postcode
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND b.postcode LIKE 'FY%'
    ORDER BY b.postcode, b.name
""")
rows = cur.fetchall()
print(f"FY8 entries to remove ({len(rows)}):")
for name, pc in rows:
    print(f"  {name[:50]:<52} {pc}")

cur.execute("""
    DELETE FROM "Business" b
    USING "Category" c
    WHERE b."categoryId" = c.id
    AND c.slug = 'parking'
    AND b.postcode LIKE 'FY%'
""")
deleted = cur.rowcount
conn.commit()
print(f"\nDeleted {deleted} FY8 entries.")

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
""")
print(f"Parking listings remaining: {cur.fetchone()[0]}")
conn.close()
