#!/usr/bin/env python3
"""
Generate descriptions for parking listings in SouthportGuide database.

Uses local knowledge + listing metadata to produce concise, useful descriptions
in Terry's voice. Targets 80–150 words for named locations, 50–80 for unnamed.

Run:  python scripts/generate-parking-descriptions.py
Flags:
  --dry-run     Print descriptions without writing to DB
  --limit N     Only process first N listings
  --force       Overwrite existing non-placeholder descriptions
"""

import os, re, sys, math, psycopg2, psycopg2.extras
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv()

DRY_RUN = '--dry-run' in sys.argv
FORCE   = '--force'   in sys.argv
LIMIT   = None
for a in sys.argv:
    if a.startswith('--limit='):
        LIMIT = int(a.split('=')[1])

DATABASE_URL = os.getenv('DATABASE_URL')

# ── Area lookup by postcode prefix ───────────────────────────────────────────

def area_from_postcode(postcode: str) -> str:
    pc = (postcode or '').upper().strip()
    if pc.startswith('L37'):
        return 'Formby'
    if pc.startswith('L39'):
        return 'Ormskirk'
    if pc.startswith('L40'):
        return 'Burscough'
    if pc.startswith('PR8 1'):
        return 'Southport'
    if pc.startswith('PR8 2'):
        return 'Birkdale'
    if pc.startswith('PR8 3'):
        return 'Ainsdale'
    if pc.startswith('PR8 4'):
        return 'Birkdale Village'
    if pc.startswith('PR8 5') or pc.startswith('PR8 6'):
        return 'Southport'
    if pc.startswith('PR9 0'):
        return 'Southport town centre'
    if pc.startswith('PR9 7') or pc.startswith('PR9 8') or pc.startswith('PR9 9'):
        return 'Churchtown'
    return 'Southport'

def area_from_coords(lat: float, lng: float) -> str:
    """Rough area name from coordinates."""
    if lat < 53.60:  return 'south of Formby'
    if lat < 53.62:  return 'Ainsdale'
    if lat < 53.635: return 'Birkdale'
    if lat < 53.655: return 'Southport'
    if lat < 53.672: return 'Churchtown'
    return 'north Southport'

# ── Specific known car parks ──────────────────────────────────────────────────
# These get handwritten descriptions using local knowledge.

KNOWN = {
    'national trust formby: lifeboat road car park': """
The main car park for the National Trust Formby pinewoods and beach. It's on Lifeboat Road and puts you a short walk from the red squirrel trail and the dunes. Pay via the NT app before you get there — signal in the car park is unreliable and there's no paper ticket option. NT members park free. It fills up early on summer weekends; if it's full, try the Victoria Road car park a mile north. Dogs welcome. Postcode L37 2EB gets you here on Google Maps.
""",
    'national trust car park, victoria road': """
The National Trust's Victoria Road car park is the starting point for the woodland walks through Formby pinewoods. Quieter than the Lifeboat Road car park and a good alternative when that one's busy. Access is off Victoria Road in Formby — postcode L37 1YD. Pay via the National Trust app; members free. The red squirrel trail runs from here through the pines towards the beach. Good surfaced paths from the car park, suitable for most pushchairs.
""",
    'national trust car park - victoria road woodland': """
The smaller of the two National Trust car parks off Victoria Road, giving direct access to the pinewoods and dune paths. A bit further from the beach than Lifeboat Road but usually easier to get a space. NT members free; pay via the app for non-members. From here you can walk through to the beach or north towards Freshfield. Postcode L37 1XU.
""",
    'ncp southport promenade': """
Multi-storey NCP on the promenade, a short walk from the beach and Pleasureland. Convenient if you're spending time on the seafront. Paid parking — check current NCP rates before you go as prices vary by time of day and season. Open 24 hours. The promenade, Pleasureland, and the Marine Lake are all walkable from here.
""",
    'ncp southport london street': """
NCP multi-storey on London Street in Southport town centre. Useful for Lord Street shopping and the theatre. Covered parking so good in wet weather. Paid — check the NCP app for current rates. About a 5-minute walk to the main Lord Street shopping strip.
""",
    'tulketh street multi storey car park': """
Multi-storey car park on Tulketh Street, central Southport. Useful for Lord Street and the town centre shops. Paid parking. Covered, which is useful given the weather. A short walk from the main retail area and Chapel Street.
""",
    'esplanade car park southport (sefton council)': """
Sefton Council's large surface car park on the Esplanade, right on the seafront. Ideal if you're heading to the beach, Pleasureland, or the Marine Lake. Pay and display. Gets very busy on sunny days — arrive early in summer or you'll be circling. Direct access to the promenade and beach from the car park.
""",
    'esplanade parking': """
Pay-and-display parking on Southport's Esplanade, steps from the beach and the promenade. One of the most popular car parks on the seafront — gets full quickly on warm weekends. The Marine Lake and Pleasureland are both within easy walking distance.
""",
    'southport marine drive car park': """
Surface car park on Marine Drive, directly behind the sand dunes and beach. Pay and display. Good access to the beach and the coastal path — popular with dog walkers and families. On a sunny Saturday it fills up fast; the Esplanade car parks are an alternative if this one's full.
""",
    'marine drive parking': """
On-street and surface parking on Marine Drive with views towards the beach. Pay and display. Direct access to the promenade and the sand. One of the closer spots to the actual beach — arrives early on busy summer days.
""",
    'birkdale station car park': """
Station car park at Birkdale, on the Merseyrail Northern line to Southport and Liverpool. Pay and display. Useful if you're catching the train or want to leave the car here and walk into Birkdale village. Royal Birkdale Golf Club is roughly 10 minutes on foot.
""",
    'p+r birkdale': """
Park and ride facility at Birkdale station. Leave the car and take the train — it's a short ride into Southport town centre on the Merseyrail Northern line. Good option for avoiding town centre parking on busy days and during events. Free parking with valid rail ticket.
""",
    'ainsdale railway station car park': """
Station car park at Ainsdale on the Merseyrail line. Small car park serving the station — pay and display. Ainsdale village and the beach are within walking distance. The train south to Formby and north to Southport runs frequently.
""",
    'formby station park & ride': """
Station car park and park-and-ride at Formby on the Merseyrail Northern line. A practical option if you're heading into Liverpool or Southport by train. The station is a short walk from Formby village centre. Pay and display. Trains run regularly to both Liverpool Central (around 30 minutes) and Southport (around 15 minutes).
""",
    'freshfield station car park': """
Small car park serving Freshfield station on the Merseyrail Northern line. Quiet compared to the NT car parks a few minutes away. Useful if you're arriving by train or want to walk to the pinewoods — the National Trust Formby estate is roughly a 10-minute walk from the station.
""",
    'rspb marshside': """
Car park for RSPB Marshside nature reserve, on Marshside Road north of Southport. Free to use for RSPB members and visitors to the reserve. The marshes here are excellent for wading birds, wildfowl, and occasional rare sightings. The RSPB visitor centre and hides are accessed directly from the car park.
""",
    'botanic gardens car park': """
Free car park serving Churchtown's Botanic Gardens. The gardens are one of Southport's better free days out — formal gardens, a small zoo, café, and plenty of space for kids. The car park is directly off Churchtown's main road. The surrounding Churchtown village is worth a wander after — a few pubs and cafés nearby.
""",
    'floral hall car park': """
Surface car park adjacent to Southport's Floral Hall and Theatre complex on the promenade. Convenient for events at the theatre or concerts. Paid parking. The seafront, Marine Lake, and Pleasureland are all within short walking distance from here.
""",
    'ormskirk station car park': """
Station car park at Ormskirk, where the Merseyrail line from Liverpool terminates. Also serves the Northern Rail services toward Preston. Paid parking. Ormskirk town centre and market are a short walk. Edge Hill University campus is nearby.
""",
    'the main car park edge hill university': """
The main staff and visitor car park for Edge Hill University in Ormskirk. Visitor parking is available but spaces can be limited — worth checking with the university before visiting if you're a non-student. Paid parking on site.
""",
    'sports direct multi-storey car park': """
Multi-storey car park serving the Sports Direct and Ocean Plaza retail area on the Southport waterfront. Paid parking. Close to the beach, the promenade, and the broader retail park. A useful base if you're spending time at Ocean Plaza or heading to the beach.
""",
    'morrisons car park': """
Free car park for Morrisons supermarket customers in Southport. Time-limited for shoppers. On the edge of the town centre — close enough to walk into Lord Street if you're combining shopping with a visit to town.
""",
    'central 12 car park': """
Car park serving Central 12 retail park in Southport town centre. Covered, paid parking. The retail park has a Primark, restaurants, and a cinema. Convenient for the town centre — Lord Street is a short walk.
""",
    'lord street car park': """
Town centre car park giving direct access to Lord Street, Southport's main shopping boulevard. Paid parking. A short walk to the Wayfarers Arcade, The Atkinson arts centre, and the full length of Lord Street. One of the most central car parks in Southport.
""",
    'andrews lane car park': """
Surface car park on Andrews Lane in Formby village, a short walk from the local shops on Chapel Lane. Free to use. Handy if you're visiting the village rather than the beach or pinewoods.
""",
    'ainsdale beach parking area': """
Pay-and-display car park at Ainsdale Beach, with direct access to the sand and dunes. Busy on summer weekends — arrive early. The beach here is quieter than the main Southport seafront and popular with families and dog walkers. There's also an informal overflow area on the approach road when the main car park is full.
""",
    'formby village': """
Surface car park serving Formby village centre. Short walk to the shops, cafés, and pubs on Chapel Lane and Duke Street. Paid parking. A practical base for the village if you're not heading to the pinewoods or beach.
""",
    'police station': """
Small car park at Formby Police Station. Limited public parking — check signs for any restrictions before leaving your vehicle.
""",
    'coach park': """
Dedicated coach and large vehicle parking in Southport. Check current availability and any permit requirements with Sefton Council before arrival.
""",
    'the cloisters formby car park': """
Car park in the centre of Formby serving The Cloisters retail development. Useful for Formby village shopping. Mixed reviews — the management and ticketing have drawn complaints, so check the signs carefully on arrival.
""",
    'burscough bridge station car park': """
Station car park at Burscough Bridge on the Merseyrail line. Small, paid car park. Burscough village is a short walk — a handful of shops and pubs nearby. The West Lancashire Cycle Way passes through the area.
""",
    'bath street car park': """
Town centre car park in Southport. Paid parking, useful for accessing the northern end of Lord Street and the surrounding streets.
""",
    'wright street car park': """
Surface car park in Southport town centre. Paid parking. A short walk from Lord Street and the Chapel Street area.
""",
    'west street parking': """
On-street and surface parking on West Street in central Southport. Paid. Walking distance to Lord Street and the town centre shops.
""",
    'staff car park (southport hospital)': """
Staff car park at Southport and Ormskirk Hospital. Not intended for general public use. Visitor parking is available elsewhere on the hospital site — follow signs for the main visitor car park on arrival.
""",
}

# ── Parking type descriptions ────────────────────────────────────────────────

TYPE_DESC = {
    'car-park':    'car park',
    'surface':     'surface-level car park',
    'multi-storey':'multi-storey car park',
    'layby':       'layby',
    'informal':    'informal parking area',
    'cycle-parking': 'cycle parking',
    'street-side': 'on-street parking',
}

# ── Generate description ──────────────────────────────────────────────────────

def generate_description(row: dict) -> str:
    name     = row.get('name', '') or ''
    postcode = row.get('postcode', '') or ''
    address  = row.get('address', '') or ''
    tags     = row.get('tags', []) or []
    price    = row.get('priceRange') or row.get('price_range') or ''
    lat      = row.get('lat')
    lng      = row.get('lng')

    # Check known car parks first
    key = name.lower().strip()
    if key in KNOWN:
        return KNOWN[key].strip()

    # Derive useful info from tags / postcode
    is_free   = any('free' in t for t in tags) or (price and 'free' in price.lower())
    is_paid   = any('paid' in t for t in tags) or (price and price.lower() not in ('', 'free', 'unknown'))
    has_ev    = any('ev' in t.lower() for t in tags)
    is_cycle  = any('cycle' in t for t in tags)
    ptype     = 'car-park'
    for t in tags:
        if t in TYPE_DESC:
            ptype = t
            break

    price_str = ''
    if is_free:
        price_str = 'Free to use.'
    elif price and price not in ('unknown', ''):
        price_str = f'Parking costs {price}.'
    elif is_paid:
        price_str = 'Paid parking — check signs on arrival for current charges.'
    else:
        price_str = 'Check signs for current charges.'

    # Area name
    if postcode:
        area = area_from_postcode(postcode)
    elif lat and lng:
        area = area_from_coords(float(lat), float(lng))
    else:
        area = 'the Southport area'

    # EV note
    ev_note = ' EV charging points on site.' if has_ev else ''

    if is_cycle:
        return f"Cycle parking in {area}.{ev_note} Check signs for any time limits."

    # Unnamed/generic "Car Park" entries — use address as the descriptor
    is_generic_name = name.lower().strip() in ('car park', 'car park entrance', 'parking')

    # Named but not in KNOWN
    if name and not name.startswith('Car Park (') and not name.startswith('Car park (') and not is_generic_name:
        ptype_label = TYPE_DESC.get(ptype, 'car park')
        addr_snippet = ''
        if address and address != postcode:
            parts = [p.strip() for p in address.split(',') if p.strip()
                     and p.strip() not in ('United Kingdom', 'UK', 'England')
                     and not p.strip().startswith('PR') and not p.strip().startswith('L3')
                     and not p.strip().startswith('L4') and len(p.strip()) > 4]
            # Only use the address part if it's meaningfully different from the name/area
            name_lower = name.lower()
            area_lower = area.lower()
            # Filter out postcodes, generic city names, and parts matching name/area
            GENERIC = {'southport', 'formby', 'ormskirk', 'burscough', 'ainsdale',
                       'birkdale', 'liverpool', 'lancashire', 'merseyside', 'england',
                       'uk', 'united kingdom'}
            useful = [p for p in parts
                      if p.lower() not in name_lower
                      and p.lower() not in area_lower
                      and area_lower not in p.lower()
                      and name_lower not in p.lower()
                      and not re.match(r'^\d+$', p)
                      and not re.search(r'[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}', p, re.I)  # postcode
                      and p.lower().strip() not in GENERIC]
            if useful:
                addr_snippet = f' on {useful[0]}'

        return (
            f"{name} is a {ptype_label} in {area}"
            f"{addr_snippet}."
            f" {price_str}{ev_note}"
        ).strip()

    # Generic named / unnamed / coordinate-only
    ptype_label = TYPE_DESC.get(ptype, 'car park')

    GENERIC2 = {'southport', 'formby', 'ormskirk', 'burscough', 'ainsdale',
                'birkdale', 'liverpool', 'lancashire', 'merseyside', 'england',
                'uk', 'united kingdom'}
    if is_generic_name and address and address != postcode:
        # Build from address
        parts = [p.strip() for p in address.split(',') if p.strip()
                 and not re.search(r'[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}', p, re.I)
                 and p.strip().lower() not in GENERIC2]
        if parts:
            road = parts[0]
            return f"{ptype_label.capitalize()} on {road}, {area}. {price_str}{ev_note}".strip()

    return (
        f"{ptype_label.capitalize()} in {area}."
        f" {price_str}{ev_note}"
    ).strip()

# ── Database ─────────────────────────────────────────────────────────────────

PLACEHOLDER_PATTERNS = [
    'a car park in the southport area',
    'cycle parking in the southport area',
    'a surface-level car park in the southport area',
    'a multi-storey car park in the southport area',
    'a layby in the southport area',
    'an informal parking area',
    'on-street parking',
]

def is_placeholder(desc: str) -> bool:
    if not desc:
        return True
    d = desc.lower().strip()
    return any(p in d for p in PLACEHOLDER_PATTERNS)

def connect_db():
    p = urlparse(DATABASE_URL)
    return psycopg2.connect(
        host=p.hostname, port=p.port or 5432,
        database=p.path.lstrip('/'),
        user=p.username, password=p.password,
        sslmode='require'
    )

def main():
    conn = connect_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        SELECT b.id, b.name, b.postcode, b.address, b.tags,
               b."priceRange", b.lat, b.lng, b.description
        FROM "Business" b
        JOIN "Category" c ON b."categoryId" = c.id
        WHERE c.slug = 'parking'
        ORDER BY b.name
    """)
    rows = cur.fetchall()

    if LIMIT:
        rows = rows[:LIMIT]

    print(f"Parking listings: {len(rows)}")
    print(f"Mode: {'DRY RUN' if DRY_RUN else 'WRITE'} | force={FORCE}\n")

    updated = skipped = 0

    for row in rows:
        row = dict(row)
        existing = row.get('description') or ''

        if existing and not is_placeholder(existing) and not FORCE:
            skipped += 1
            continue

        desc = generate_description(row)

        if DRY_RUN:
            print(f"{'='*60}")
            print(f"NAME:  {row['name']}")
            print(f"PC:    {row['postcode']} | TAGS: {row['tags']}")
            print(f"DESC:  {desc}")
            print()
        else:
            try:
                write_cur = conn.cursor()
                write_cur.execute(
                    'UPDATE "Business" SET description = %s, "shortDescription" = %s WHERE id = %s',
                    (desc, desc[:160], row['id'])
                )
                conn.commit()
                updated += 1
                if updated % 50 == 0 or updated <= 5:
                    name = row['name'][:45]
                    print(f"  [{updated:4d}] {name}")
            except Exception as e:
                conn.rollback()
                print(f"  ERROR {row['name']}: {e}")

    conn.close()

    if not DRY_RUN:
        print(f"\nDone. Updated: {updated} | Skipped (already had desc): {skipped}")

if __name__ == '__main__':
    main()
