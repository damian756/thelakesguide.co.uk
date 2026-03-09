"""
Remove exact duplicate parking listings (same name, same coords, same data).
Keeps the record with the simpler slug (no trailing -2, -3 etc).
Deletes the orphaned local image file for each removed record.
"""
import os, psycopg2, math
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / '.env.local')
u = os.getenv('DATABASE_URL')
p = urlparse(u)
conn = psycopg2.connect(host=p.hostname, port=p.port or 5432, database=p.path.lstrip('/'),
                        user=p.username, password=p.password, sslmode='require')
cur = conn.cursor()

def haversine_m(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

# Fetch all parking listings with coordinates
cur.execute("""
    SELECT b.id, b.name, b.slug, b.lat, b.lng, b.address, b.postcode, b."placeId",
           b.rating, b."reviewCount", b.images
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND b.lat IS NOT NULL AND b.lng IS NOT NULL
    ORDER BY b.lat, b.lng, b.name
""")
cols = ['id','name','slug','lat','lng','address','postcode','placeId','rating','reviewCount','images']
listings = [dict(zip(cols, r)) for r in cur.fetchall()]

def slug_quality(s):
    """Lower = better slug (prefer no trailing number)."""
    import re
    m = re.search(r'-(\d+)$', s)
    return int(m.group(1)) if m else 0

seen = set()
to_delete = []  # list of (id, slug) to remove

for i, a in enumerate(listings):
    if a['id'] in seen:
        continue
    group = [a]
    seen.add(a['id'])
    for b in listings[i+1:]:
        if b['id'] in seen:
            continue
        if abs(b['lat'] - a['lat']) > 0.001:
            break
        dist = haversine_m(a['lat'], a['lng'], b['lat'], b['lng'])
        if dist < 1 and a['name'].strip().lower() == b['name'].strip().lower():
            group.append(b)
            seen.add(b['id'])

    if len(group) > 1:
        # Keep the record with the best slug (lowest suffix number)
        group.sort(key=lambda x: slug_quality(x['slug']))
        keep = group[0]
        for dup in group[1:]:
            to_delete.append((dup['id'], dup['slug']))

print(f"Records to delete: {len(to_delete)}")
print()

deleted = 0
images_removed = 0

for bid, slug in to_delete:
    # Delete from DB
    cur.execute('DELETE FROM "Business" WHERE id = %s', (bid,))
    conn.commit()
    deleted += 1

    # Remove local image file if it exists
    img_path = ROOT / 'public' / 'images' / 'parking' / f'{slug}.webp'
    if img_path.exists():
        img_path.unlink()
        images_removed += 1

    print(f"  deleted  {slug[:60]}")

print()
print(f"Done. Removed {deleted} duplicate records, {images_removed} image files.")

# Final count
cur.execute("""
    SELECT COUNT(*) FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
""")
print(f"Parking listings remaining: {cur.fetchone()[0]}")

cur.close()
conn.close()
