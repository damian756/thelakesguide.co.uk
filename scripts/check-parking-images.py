import os, psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))
u = os.getenv('DATABASE_URL')
p = urlparse(u)
conn = psycopg2.connect(host=p.hostname, port=p.port or 5432, database=p.path.lstrip('/'), user=p.username, password=p.password, sslmode='require')
cur = conn.cursor()

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND (b.images = '{}' OR b.images IS NULL)
    AND b."placeId" IS NOT NULL AND b."placeId" != ''
""")
print('No image but has placeId:', cur.fetchone()[0])

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND array_length(b.images, 1) > 0
""")
print('Already has image:       ', cur.fetchone()[0])

cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND (b.images = '{}' OR b.images IS NULL)
    AND (b."placeId" IS NULL OR b."placeId" = '')
""")
print('No image, no placeId:    ', cur.fetchone()[0])

conn.close()
