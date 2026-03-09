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

# Known false positives — not actual parking facilities
FALSE_POSITIVES = [
    'Crystalgleam Waterless Valeting',  # car valet service
    'Motoloc',                           # vehicle tracking company
    'H X Car Park Management Ltd',       # management company office, not a car park
    'Total Car Parks',                   # management company
    'Carpark Management Services',       # management company
]

cur.execute("""
    SELECT b.name, b.postcode
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND b.name = ANY(%s)
    ORDER BY b.name
""", (FALSE_POSITIVES,))
rows = cur.fetchall()
print(f"False positives to remove ({len(rows)}):")
for name, pc in rows:
    print(f"  {name:<50} {pc or 'no postcode'}")

cur.execute("""
    DELETE FROM "Business" b
    USING "Category" c
    WHERE b."categoryId" = c.id
    AND c.slug = 'parking'
    AND b.name = ANY(%s)
""", (FALSE_POSITIVES,))
deleted = cur.rowcount
conn.commit()
print(f"\nDeleted {deleted} false positive entries.")

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
""")
print(f"Parking listings remaining: {cur.fetchone()[0]}")
conn.close()
