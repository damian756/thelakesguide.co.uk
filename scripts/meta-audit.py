import psycopg2, os, sys
sys.path.insert(0, '.')

from dotenv import load_dotenv
load_dotenv('.env.local')

conn = psycopg2.connect(os.environ['DATABASE_URL'], sslmode='require')
cur = conn.cursor()

# Per-category breakdown
cur.execute("""
SELECT 
  c.slug,
  COUNT(*) as total,
  COUNT(b.description) as has_desc,
  COUNT(b."shortDescription") as has_short,
  COUNT(CASE WHEN b.description IS NULL AND b."shortDescription" IS NULL THEN 1 END) as has_neither,
  ROUND(AVG(LENGTH(b.description))) as avg_desc_len,
  COUNT(b.rating) as has_rating
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
GROUP BY c.slug
ORDER BY c.slug
""")
rows = cur.fetchall()
print("=== PER-CATEGORY META CONTENT QUALITY ===")
print(f"{'slug':<20} {'total':>6} {'has_desc':>9} {'has_short':>10} {'has_neither':>12} {'avg_desc_len':>13} {'has_rating':>11}")
for r in rows:
    slug, total, has_desc, has_short, has_neither, avg_desc_len, has_rating = r
    print(f"{slug:<20} {total:>6} {has_desc:>9} {has_short:>10} {has_neither:>12} {str(avg_desc_len):>13} {has_rating:>11}")

# Sample some listings with long descriptions being sliced badly
print("\n=== SAMPLE: Description lengths (restaurants, first 10) ===")
cur.execute("""
SELECT b.name, LENGTH(b.description) as dlen, LEFT(b.description, 200)
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
WHERE c.slug = 'restaurants' AND b.description IS NOT NULL
ORDER BY LENGTH(b.description) DESC
LIMIT 10
""")
for r in cur.fetchall():
    name, dlen, snippet = r
    print(f"  [{dlen} chars] {name}: {repr(snippet[:100])}")

# Sample listings with NO description - what is their fallback?
print("\n=== SAMPLE: Listings with NO description, NO shortDescription (all cats) ===")
cur.execute("""
SELECT c.slug, b.name, b."shortDescription", b.rating, b."reviewCount"
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
WHERE b.description IS NULL AND b."shortDescription" IS NULL
ORDER BY c.slug, b.name
LIMIT 30
""")
for r in cur.fetchall():
    cslug, name, short, rating, reviews = r
    print(f"  [{cslug}] {name} | rating={rating} | reviews={reviews}")

# Check for any title length problems (names over 35 chars)
print("\n=== SAMPLE: Very long business names (>35 chars) ===")
cur.execute("""
SELECT c.slug, b.name, LENGTH(b.name) as nlen
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
WHERE LENGTH(b.name) > 35
ORDER BY LENGTH(b.name) DESC
LIMIT 20
""")
for r in cur.fetchall():
    cslug, name, nlen = r
    print(f"  [{cslug}] ({nlen} chars) {name}")

# Check shortDescription quality samples
print("\n=== SAMPLE: shortDescriptions (10 per category) ===")
cur.execute("""
SELECT c.slug, b.name, b."shortDescription"
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
WHERE b."shortDescription" IS NOT NULL
ORDER BY c.slug, b.name
LIMIT 40
""")
for r in cur.fetchall():
    cslug, name, short = r
    print(f"  [{cslug}] {name}: {repr(short[:120])}")

conn.close()
