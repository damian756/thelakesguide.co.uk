import os, psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))
u = os.getenv('DATABASE_URL')
p = urlparse(u)
conn = psycopg2.connect(host=p.hostname, port=p.port or 5432, database=p.path.lstrip('/'), user=p.username, password=p.password, sslmode='require')
cur = conn.cursor()

cur.execute("""
    SELECT b.id, b.name, b.postcode, b.address, b.lat, b.lng, b.slug
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND (
        b.postcode LIKE 'FY%%'
        OR b.postcode LIKE 'WN%%'
        OR b.postcode LIKE 'BL%%'
        OR b.postcode LIKE 'BB%%'
        OR b.postcode LIKE 'PR5%%'
        OR b.postcode LIKE 'PR6%%'
        OR b.postcode LIKE 'PR7%%'
        OR b.address ILIKE '%%lytham%%'
        OR b.address ILIKE '%%blackpool%%'
        OR b.address ILIKE '%%wigan%%'
        OR b.address ILIKE '%%bolton%%'
        OR b.address ILIKE '%%st annes%%'
        OR b.address ILIKE '%%saint annes%%'
        OR (b.lat IS NOT NULL AND (b.lat < 53.50 OR b.lat > 53.75))
        OR (b.lng IS NOT NULL AND (b.lng < -3.25 OR b.lng > -2.75))
    )
    ORDER BY b.postcode, b.name
""")
rows = cur.fetchall()
print(f"Out-of-area parking listings: {len(rows)}")
for bid, name, pc, addr, lat, lng, slug in rows:
    print(f"  [{bid[:8]}] {name[:45]:<47} {(pc or 'no pc'):<12} {(addr or '')[:45]}")

conn.close()
