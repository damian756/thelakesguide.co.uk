import psycopg2, os
from dotenv import load_dotenv
load_dotenv('.env.local')

conn = psycopg2.connect(os.environ['DATABASE_URL'], sslmode='require')
cur = conn.cursor()

AREAS = ["Birkdale","Ainsdale","Churchtown","Crossens","Marshside","Formby","Ormskirk","Scarisbrick","Banks","Halsall","Burscough"]
SHORT_CAT = {
    'restaurants':'Restaurant','hotels':'Hotel','bars-nightlife':'Bar & Pub',
    'cafes':'Cafe','attractions':'Attraction','beaches-parks':'Park',
    'shopping':'Shop','golf':'Golf','wellness':'Spa & Wellness',
    'activities':'Activity','transport':'Transport','parking':'Car Park'
}

def extract_area(addr):
    for a in AREAS:
        if a in addr:
            return a
    return "Southport"

def build_title(name, cat_slug, area):
    cat = SHORT_CAT.get(cat_slug, cat_slug)
    location = "Southport" if area == "Southport" else f"{area}, Southport"
    full = f"{name} — {cat}, {location}"
    if len(full) <= 60:
        return full
    return f"{name} — {location}"

def build_meta(name, cat_name, area, description, short_desc, rating, reviews):
    if description:
        stripped = description.replace('\n', ' ').strip()
        return stripped[:152] + '…' if len(stripped) > 155 else stripped
    if short_desc:
        base = f"{name} – {short_desc} {'Rated ' + str(rating) + '/5' if rating else ''} {'in ' + area + ', Southport' if area != 'Southport' else 'in Southport'}. Find address, opening hours & more on SouthportGuide.co.uk"
        return base[:160]
    base = f"{name} – {cat_name} in {''.join([area+', ']) if area != 'Southport' else ''}Southport. {'Rated ' + str(round(rating,1)) + '/5 by ' + str(reviews) + ' Google reviewers. ' if rating and reviews else ''}Find opening hours, directions and contact details on SouthportGuide.co.uk"
    return base[:160]

cats = ['restaurants','wellness','shopping','hotels','cafes','bars-nightlife','activities','attractions','transport','golf','beaches-parks']
for cat in cats:
    cur.execute("""
    SELECT b.name, b.description, b."shortDescription", b.rating, b."reviewCount", b.address, b.postcode
    FROM "Business" b
    JOIN "Category" c ON c.id = b."categoryId"
    WHERE c.slug = %s AND b.description IS NOT NULL
    ORDER BY b.name
    LIMIT 3
    """, (cat,))
    rows = cur.fetchall()
    cat_name_map = {'restaurants':'Restaurants','wellness':'Wellness','shopping':'Shopping','hotels':'Hotels','cafes':'Cafes','bars-nightlife':'Bars & Nightlife','activities':'Activities','attractions':'Attractions','transport':'Transport','golf':'Golf','beaches-parks':'Beaches & Parks'}
    cat_name = cat_name_map.get(cat, cat)
    print(f"\n=== {cat.upper()} ===")
    for name, desc, short, rating, reviews, addr, pc in rows:
        area = extract_area(addr)
        title = build_title(name, cat, area)
        meta = build_meta(name, cat_name, area, desc, short, rating, reviews)
        # Simulate template: "%s | SouthportGuide.co.uk"
        full_title_tag = f"{title} | SouthportGuide.co.uk"
        print(f"  Name: {name}")
        print(f"  <title> ({len(full_title_tag)} chars): {full_title_tag}")
        print(f"  <desc>  ({len(meta)} chars): {meta}")
        # Flag issues
        issues = []
        if len(full_title_tag) > 70:
            issues.append("TITLE TOO LONG")
        if len(full_title_tag) < 30:
            issues.append("TITLE TOO SHORT")
        if 'Southport' not in meta:
            issues.append("NO LOCATION IN DESC")
        if meta.endswith('…') and len(desc or '') > 10:
            issues.append("DESC SLICED MID-SENTENCE")
        if len(meta) < 80:
            issues.append("DESC TOO SHORT")
        # Check for encoding artifacts
        for ch in ['\\ufffd', '\\u25fe', '\\u2019', '\\u00e2']:
            if ch in repr(meta):
                issues.append("ENCODING ARTIFACT")
                break
        if issues:
            print(f"  ISSUES: {', '.join(issues)}")
        print()

conn.close()
