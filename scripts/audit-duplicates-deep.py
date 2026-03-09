import os, psycopg2, math
from urllib.parse import urlparse
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))
u = os.getenv('DATABASE_URL')
p = urlparse(u)
conn = psycopg2.connect(host=p.hostname, port=p.port or 5432, database=p.path.lstrip('/'), user=p.username, password=p.password, sslmode='require')
cur = conn.cursor()

def haversine_m(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlng/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

# Get all parking listings with full detail
cur.execute("""
    SELECT b.id, b.name, b.slug, b.lat, b.lng, b.postcode, b.address,
           b."placeId", b.rating, b."reviewCount", b.description, b.tags
    FROM "Business" b
    JOIN "Category" c ON b."categoryId" = c.id
    WHERE c.slug = 'parking'
    AND b.lat IS NOT NULL AND b.lng IS NOT NULL
    ORDER BY b.lat, b.lng, b.name
""")
rows = cur.fetchall()
cols = ['id','name','slug','lat','lng','postcode','address','placeId','rating','reviewCount','description','tags']
listings = [dict(zip(cols, r)) for r in rows]

# Find proximity groups (within 60m)
seen = set()
groups = []  # each group is a list of listings that are near each other

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
        if dist < 60:
            group.append(b)
            seen.add(b['id'])
    if len(group) > 1:
        groups.append(group)

print(f"Total proximity groups (2+ listings within 60m): {len(groups)}")
print()

# Categorise groups
truly_identical   = []  # same name, same coords (0m), same data
same_name_near    = []  # same name, within 60m but >0m apart
diff_name_near    = []  # different names within 60m (might be legit)

for group in groups:
    names = [g['name'].strip().lower() for g in group]
    all_same_name = len(set(names)) == 1
    coords_identical = all(
        haversine_m(group[0]['lat'], group[0]['lng'], g['lat'], g['lng']) < 1
        for g in group
    )

    if all_same_name and coords_identical:
        truly_identical.append(group)
    elif all_same_name:
        same_name_near.append(group)
    else:
        diff_name_near.append(group)

print(f"=== CATEGORY 1: Truly identical (same name, <1m apart) — SAFE TO DEDUPLICATE ===")
print(f"Groups: {len(truly_identical)}  |  Extra records: {sum(len(g)-1 for g in truly_identical)}")
print()

print(f"=== CATEGORY 2: Same name, within 60m but >1m apart — REVIEW NEEDED ===")
print(f"Groups: {len(same_name_near)}")
for group in same_name_near:
    print(f"  '{group[0]['name'][:40]}'  ({len(group)} entries)")
    for g in group:
        dist = haversine_m(group[0]['lat'], group[0]['lng'], g['lat'], g['lng'])
        print(f"    {dist:6.1f}m  {g['slug'][:55]}  pc={g['postcode'] or 'none'}  placeId={'yes' if g['placeId'] else 'no'}")
print()

print(f"=== CATEGORY 3: Different names within 60m — LIKELY LEGITIMATE (keep all) ===")
print(f"Groups: {len(diff_name_near)}")
for group in diff_name_near[:20]:
    print(f"  Within 60m cluster:")
    for g in group:
        dist = haversine_m(group[0]['lat'], group[0]['lng'], g['lat'], g['lng'])
        print(f"    {dist:6.1f}m  '{g['name'][:45]}'  {g['postcode'] or ''}")
print()

# Show a few truly identical examples to confirm they are genuinely the same
print("=== SAMPLE of truly identical pairs (spot check) ===")
for group in truly_identical[:10]:
    a, b = group[0], group[1]
    dist = haversine_m(a['lat'], a['lng'], b['lat'], b['lng'])
    same_desc = (a['description'] or '')[:80] == (b['description'] or '')[:80]
    same_addr = a['address'] == b['address']
    same_pc   = a['postcode'] == b['postcode']
    print(f"  '{a['name'][:40]}'")
    print(f"    dist={dist:.1f}m  same_addr={same_addr}  same_pc={same_pc}  same_desc={same_desc}")
    print(f"    slugs: {a['slug'][:45]} / {b['slug'][:45]}")
    print()

conn.close()
