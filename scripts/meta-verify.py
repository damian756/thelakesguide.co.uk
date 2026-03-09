"""Verify new meta functions produce clean output."""
import psycopg2, os, re
from dotenv import load_dotenv
load_dotenv('.env.local')

conn = psycopg2.connect(os.environ['DATABASE_URL'], sslmode='require')
cur = conn.cursor()

AREAS = ["Birkdale","Ainsdale","Churchtown","Crossens","Marshside","Formby","Ormskirk","Scarisbrick","Banks","Halsall","Burscough"]
SHORT_CAT = {
    'restaurants':'Restaurant','hotels':'Hotel','bars-nightlife':'Bar & Pub',
    'cafes':'Café','attractions':'Attraction','beaches-parks':'Park',
    'shopping':'Shop','golf':'Golf','wellness':'Wellness',
    'activities':'Activity','transport':'Transport','parking':'Car Park'
}

def sanitize(s):
    s = re.sub(r'[àáâãäå]', lambda m: m.group().upper() if m.group() == m.group().upper() else 'a', s, flags=re.I)
    s = re.sub(r'[àáâãäå]', 'a', s, flags=re.I)
    s = re.sub(r'[èéêë]', 'e', s, flags=re.I)
    s = re.sub(r'[ìíîï]', 'i', s, flags=re.I)
    s = re.sub(r'[òóôõö]', 'o', s, flags=re.I)
    s = re.sub(r'[ùúûü]', 'u', s, flags=re.I)
    s = re.sub(r'[ýÿ]', 'y', s, flags=re.I)
    s = re.sub(r'[ñ]', 'n', s, flags=re.I)
    s = re.sub(r'[ç]', 'c', s, flags=re.I)
    s = s.replace('ß', 'ss')
    s = re.sub(r'[\u2018\u2019\u201A\u201B]', "'", s)
    s = re.sub(r'[\u201C\u201D\u201E\u201F]', '"', s)
    s = re.sub(r'[\u2013\u2014]', '-', s)
    s = re.sub(r'[\u2022\u2023\u2219\u25E6\u2043]', '-', s)
    s = re.sub(r'[^\x00-\x7E]', '', s)
    return s

def extract_area(addr):
    for a in AREAS:
        if a in addr:
            return a
    return "Southport"

def build_title(name, cat_slug, area):
    clean_name = sanitize(name)
    is_beach = 'beach' in clean_name.lower()
    if cat_slug == 'beaches-parks':
        cat_label = 'Beach' if is_beach else 'Park'
    else:
        cat_label = SHORT_CAT.get(cat_slug, cat_slug)
    location = "Southport" if area == "Southport" else f"{area}, Southport"
    with_both = f"{clean_name} \u2014 {cat_label}, {location}"
    if len(with_both) <= 47: return with_both
    cat_only = f"{clean_name} \u2014 {cat_label}"
    if len(cat_only) <= 47: return cat_only
    loc_only = f"{clean_name} \u2014 {location}"
    if len(loc_only) <= 47: return loc_only
    return clean_name if len(clean_name) <= 44 else clean_name[:44] + '...'

def build_meta(name, cat_name, area, description, short_desc, rating, reviews):
    clean_name = sanitize(name)
    loc_label = "Southport" if area == "Southport" else f"{area}, Southport"
    if description:
        stripped = sanitize(description.replace('\n', ' ').strip())
        sentences = re.split(r'(?<=[.!?]) +(?=[A-Z])', stripped)
        result = ''
        for s in sentences:
            candidate = f"{result} {s}".strip() if result else s
            if len(candidate) <= 155:
                result = candidate
            else:
                break
        if not result:
            cut = stripped.rfind(' ', 0, 152)
            result = (stripped[:cut] if cut > 100 else stripped[:152]) + '...'
        if area not in result and 'Southport' not in result:
            suffix = f" {loc_label}."
            if len(result + suffix) <= 160:
                result += suffix
        return result[:160]
    if short_desc:
        rating_part = f" Rated {rating}/5." if rating else ""
        loc_part = f" In {area}, Southport." if area != "Southport" else " In Southport."
        return f"{clean_name} - {sanitize(short_desc)}{rating_part}{loc_part} Find address, opening hours & more on SouthportGuide.co.uk"[:160]
    rating_str = f"Rated {round(rating,1)}/5 by {reviews} reviewers. " if rating and reviews else ""
    return f"{clean_name} - {cat_name} in {loc_label}. {rating_str}Find opening hours, directions and contact details on SouthportGuide.co.uk"[:160]

test_cases = [
    ('restaurants', '2nd Wife charcoal'),
    ('restaurants', '5th Wise Monkey Ltd'),
    ('wellness', 'BB\u2019 Nails'),
    ('cafes', 'Caffè Nero'),
    ('bars-nightlife', "Arthur\u2019s Pub"),
    ('hotels', 'Adelphi Guest House Southport'),
    ('attractions', 'Adventure Coast Southport'),
    ('beaches-parks', 'Ainsdale Sand Dunes'),
    ('shopping', 'ALDI'),
    ('golf', 'Formby Ladies Golf Club'),
    ('activities', 'Broadbent Travel'),
    ('restaurants', 'Miller'),
    ('wellness', 'ManzWorld'),
]

print("=== FINAL META OUTPUT VERIFICATION ===\n")
for cat, biz_name in test_cases:
    cur.execute("""
        SELECT b.name, b.description, b."shortDescription", b.rating, b."reviewCount", b.address
        FROM "Business" b
        JOIN "Category" c ON c.id = b."categoryId"
        WHERE c.slug = %s AND b.name ILIKE %s
        LIMIT 1
    """, (cat, f"%{biz_name}%"))
    row = cur.fetchone()
    if not row:
        print(f"  [{cat}] {biz_name} - NOT FOUND"); continue
    name, desc, short, rating, reviews, addr = row
    area = extract_area(addr)
    title = build_title(name, cat, area)
    full_title = f"{title} | SouthportGuide.co.uk"
    meta = build_meta(name, SHORT_CAT.get(cat, cat), area, desc, short, rating, reviews)
    issues = []
    if len(full_title) > 70: issues.append(f"TITLE LONG ({len(full_title)})")
    if '...' in meta or meta[-1:] == '…': issues.append("SLICED")
    if 'Southport' not in meta and area not in meta: issues.append("NO LOCATION")
    status = "OK" if not issues else " | ".join(issues)
    print(f"  [{cat}] {name}")
    print(f"    title ({len(full_title)}): {full_title}")
    print(f"    desc  ({len(meta)}): {meta}")
    print(f"    => {status}")
    print()

conn.close()
