import os, psycopg2, math
from urllib.parse import urlparse
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))
u = os.getenv('DATABASE_URL')
p = urlparse(u)
conn = psycopg2.connect(host=p.hostname, port=p.port or 5432, database=p.path.lstrip('/'), user=p.username, password=p.password, sslmode='require')
cur = conn.cursor()

# ── 1. Exact name duplicates ───────────────────────────────────────────────────
cur.execute("""
    SELECT b.name, COUNT(*) as cnt
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    GROUP BY b.name
    HAVING COUNT(*) > 1
    ORDER BY cnt DESC, b.name
""")
name_dups = cur.fetchall()
print(f"Names appearing more than once: {len(name_dups)}")
print(f"Extra records from name dups:   {sum(cnt - 1 for _, cnt in name_dups)}")
print()
print("Top duplicated names:")
for name, cnt in name_dups[:20]:
    print(f"  x{cnt}  {name[:60]}")

# ── 2. Coordinate proximity duplicates (within 60m) ───────────────────────────
print()
cur.execute("""
    SELECT b.id, b.name, b.lat, b.lng, b.slug
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND b.lat IS NOT NULL AND b.lng IS NOT NULL
    ORDER BY b.lat, b.lng
""")
all_listings = cur.fetchall()

def haversine_m(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

seen = set()
proximity_pairs = []
for i, (id1, n1, lat1, lng1, slug1) in enumerate(all_listings):
    if id1 in seen:
        continue
    for id2, n2, lat2, lng2, slug2 in all_listings[i+1:]:
        if id2 in seen:
            continue
        if abs(lat2 - lat1) > 0.001:  # ~111m latitude diff — quick filter
            break
        dist = haversine_m(lat1, lng1, lat2, lng2)
        if dist < 60:
            proximity_pairs.append((dist, n1, n2, slug1, slug2))
            seen.add(id2)

print(f"Coordinate-proximity duplicates (within 60m): {len(proximity_pairs)}")
print()
print("Sample proximity pairs:")
for dist, n1, n2, s1, s2 in sorted(proximity_pairs)[:15]:
    print(f"  {dist:5.1f}m  '{n1[:35]}'  /  '{n2[:35]}'")

# ── 3. Total summary ──────────────────────────────────────────────────────────
print()
cur.execute("""SELECT COUNT(*) FROM "Business" b JOIN "Category" c ON b."categoryId" = c.id WHERE c.slug = 'parking'""")
total = cur.fetchone()[0]
estimated_unique = total - len(proximity_pairs) - sum(max(cnt-1,0) for _, cnt in name_dups if cnt > 2)
print(f"Total listings:          {total}")
print(f"Proximity dupes:         {len(proximity_pairs)}")
print(f"Estimated unique:        ~{total - len(proximity_pairs)}")

conn.close()
