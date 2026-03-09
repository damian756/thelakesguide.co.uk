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

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
""")
total = cur.fetchone()[0]
print(f"Total parking listings: {total}")

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking' AND b.postcode != ''
""")
with_postcode = cur.fetchone()[0]
print(f"With postcode:          {with_postcode}")

cur.execute("""
    SELECT b.name, b.postcode, b.address
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    ORDER BY b."createdAt" DESC
    LIMIT 10
""")
print("\nLatest 10 inserted:")
for row in cur.fetchall():
    print(f"  {row[0][:40]:<42} {row[1] or 'no postcode'}")

conn.close()
