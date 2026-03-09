import psycopg2, os, sys
from dotenv import load_dotenv

# Force UTF-8 output
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

load_dotenv('.env.local')

conn = psycopg2.connect(os.environ['DATABASE_URL'], sslmode='require')
cur = conn.cursor()

cur.execute("""
SELECT c.slug, b.name
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
ORDER BY c.slug, b.name
""")
all_rows = cur.fetchall()
print("Names with non-ASCII (detected in Python):")
count = 0
non_ascii_names = []
for slug, name in all_rows:
    if any(ord(ch) > 127 for ch in name):
        print(f"  [{slug}] {name}")
        count += 1
        non_ascii_names.append((slug, name))
print(f"Total names with non-ASCII: {count}")

# Check descriptions too
cur.execute("""
SELECT c.slug, b.name, LEFT(b.description, 200)
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
WHERE b.description IS NOT NULL
ORDER BY c.slug, b.name
""")
desc_rows = cur.fetchall()
desc_issues = 0
for slug, name, desc in desc_rows:
    if desc and any(ord(ch) > 127 for ch in desc):
        desc_issues += 1
print(f"\nDescriptions with non-ASCII (in first 200 chars): {desc_issues}")

# Title budget analysis
print("\n=== TITLE LENGTH ANALYSIS ===")
cur.execute("""
SELECT 
  c.slug,
  COUNT(*) as total,
  COUNT(CASE WHEN LENGTH(b.name) > 45 THEN 1 END) as long_name
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
GROUP BY c.slug
ORDER BY c.slug
""")
for slug, total, long_name in cur.fetchall():
    pct = round(long_name/total*100) if total else 0
    print(f"  {slug}: {long_name}/{total} ({pct}%) names > 45 chars")

# Check first-sentence extractability
print("\n=== FIRST SENTENCE FIT WITHIN 155 CHARS ===")
cur.execute("""
SELECT 
  c.slug,
  COUNT(*) as total,
  COUNT(CASE WHEN STRPOS(description, '. ') > 0 
             AND STRPOS(description, '. ') <= 155 THEN 1 END) as has_early_end
FROM "Business" b
JOIN "Category" c ON c.id = b."categoryId"
WHERE b.description IS NOT NULL AND c.slug != 'parking'
GROUP BY c.slug
ORDER BY c.slug
""")
for slug, total, clean in cur.fetchall():
    pct = round(clean/total*100) if total else 0
    print(f"  {slug}: {clean}/{total} ({pct}%) have '. ' before char 155")

conn.close()
