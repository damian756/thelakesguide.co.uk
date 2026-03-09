#!/usr/bin/env python3
"""
Import parking locations from all sources into the SouthportGuide database.

Reads:
  parking-google.csv     — Google Places scrape
  parking-osm.csv        — OpenStreetMap Overpass scrape
  parking-manual.csv     — Manual entries (optional, created by hand)

Process:
  1. Load all three CSVs
  2. Deduplicate across sources by proximity (within 50m = same location)
     Google wins over OSM wins over manual for field values when merging
  3. Upsert into Business table with category = parking
  4. Skip any with business_status = CLOSED_PERMANENTLY
  5. Generates slug from name (deduplicates with suffix if needed)

Usage: python scripts/import-parking.py
Requires: pip install psycopg2-binary python-dotenv

Manual CSV format (parking-manual.csv):
  name,address,postcode,lat,lng,notes,price_manual,opening_hours
"""

import os
import csv
import json
import math
import re
import time
import uuid
import psycopg2
import psycopg2.extras
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("Error: DATABASE_URL not set in .env.local or .env")
    exit(1)

GOOGLE_CSV = 'parking-google.csv'
OSM_CSV = 'parking-osm.csv'
MANUAL_CSV = 'parking-manual.csv'

# Car parks within this distance (metres) are considered the same location
DEDUP_RADIUS_M = 50

PARKING_CATEGORY_SLUG = 'parking'
LISTING_TIER = 'free'
TAGS_BASE = ['parking', 'car-park']


def haversine_m(lat1, lng1, lat2, lng2):
    """Distance between two points in metres."""
    R = 6371000
    dlat = math.radians(float(lat2) - float(lat1))
    dlng = math.radians(float(lng2) - float(lng1))
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(float(lat1))) *
         math.cos(math.radians(float(lat2))) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def slugify(text):
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug or 'parking'


def connect_db():
    parsed = urlparse(DATABASE_URL)
    return psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path.lstrip('/'),
        user=parsed.username,
        password=parsed.password,
        sslmode='require'
    )


def get_or_create_category(conn):
    """Get parking category ID, create it if it doesn't exist."""
    with conn.cursor() as cur:
        cur.execute('SELECT id FROM "Category" WHERE slug = %s', (PARKING_CATEGORY_SLUG,))
        row = cur.fetchone()
        if row:
            return row[0]

        # Create parking category
        cat_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO "Category" (id, slug, name, description, "sortOrder", "createdAt", "updatedAt")
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        """, (
            cat_id,
            PARKING_CATEGORY_SLUG,
            'Parking',
            'Car parks, laybys, and parking areas across Southport and the Sefton coast.',
            99,
        ))
        conn.commit()
        print(f"  Created 'parking' category (id: {cat_id})")
        return cat_id


def get_existing_slugs(conn):
    """Return set of existing Business slugs."""
    with conn.cursor() as cur:
        cur.execute('SELECT slug FROM "Business"')
        return {row[0] for row in cur.fetchall()}


def get_existing_place_ids(conn):
    """Return set of existing Google place_ids already in DB."""
    with conn.cursor() as cur:
        cur.execute('SELECT "placeId" FROM "Business" WHERE "placeId" IS NOT NULL')
        return {row[0] for row in cur.fetchall()}


def unique_slug(base_slug, existing_slugs):
    slug = base_slug
    counter = 2
    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def load_csv(path):
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def deduplicate(records):
    """
    Deduplicate records by proximity.
    Google > OSM > manual for field priority.
    Returns merged list.
    """
    source_priority = {'google': 0, 'osm': 1, 'manual': 2}
    # Sort so Google records come first
    records.sort(key=lambda r: source_priority.get(r.get('source', 'manual'), 2))

    merged = []
    for rec in records:
        lat = rec.get('lat')
        lng = rec.get('lng')
        if not lat or not lng:
            continue
        try:
            lat_f, lng_f = float(lat), float(lng)
        except ValueError:
            continue

        # Check if close to any already-merged record
        matched = None
        for existing in merged:
            try:
                dist = haversine_m(lat_f, lng_f, float(existing['lat']), float(existing['lng']))
                if dist <= DEDUP_RADIUS_M:
                    matched = existing
                    break
            except Exception:
                continue

        if matched:
            # Merge: prefer current source if it's higher priority (lower number)
            cur_pri = source_priority.get(rec.get('source', 'manual'), 2)
            match_pri = source_priority.get(matched.get('source', 'manual'), 2)

            # Fill in missing fields from lower-priority source
            for key in rec:
                if not matched.get(key) and rec.get(key):
                    matched[key] = rec[key]

            # Carry forward notes and manual price from any source
            if rec.get('notes') and not matched.get('notes'):
                matched['notes'] = rec['notes']
            if rec.get('price_manual') and not matched.get('price_manual'):
                matched['price_manual'] = rec['price_manual']

            # Enrich OSM tags onto Google record
            if rec.get('parking_type') and not matched.get('parking_type'):
                matched['parking_type'] = rec['parking_type']
            if rec.get('capacity') and not matched.get('capacity'):
                matched['capacity'] = rec['capacity']
            if rec.get('ev_charging') and not matched.get('ev_charging'):
                matched['ev_charging'] = rec['ev_charging']
            if rec.get('disabled_bays') and not matched.get('disabled_bays'):
                matched['disabled_bays'] = rec['disabled_bays']
            matched['sources'] = matched.get('sources', matched.get('source', '')) + f',{rec["source"]}'
        else:
            rec['sources'] = rec.get('source', 'unknown')
            merged.append(rec)

    return merged


def build_tags(rec):
    """Build tags array for a parking record."""
    tags = list(TAGS_BASE)

    ptype = rec.get('parking_type', '')
    if ptype == 'layby':
        tags.append('layby')
    elif ptype == 'informal':
        tags.append('informal-parking')
    elif ptype == 'multi-storey':
        tags.append('multi-storey')
    elif ptype == 'cycle-parking':
        tags = ['parking', 'cycle-parking']

    fee = rec.get('fee', '') or rec.get('price_manual', '')
    if fee.lower() in ('free', 'no', ''):
        tags.append('free-parking')
    elif fee:
        tags.append('pay-and-display')

    if rec.get('ev_charging') == 'yes':
        tags.append('ev-charging')

    disabled = rec.get('disabled_bays', '')
    if disabled and disabled not in ('0', ''):
        tags.append('disabled-bays')

    access = rec.get('access', '')
    if access == 'customers':
        tags.append('customers-only')

    return list(dict.fromkeys(tags))  # deduplicate preserving order


def build_opening_hours(rec):
    """Build JSON opening hours from various source formats."""
    oh_text = rec.get('opening_hours', '')
    if not oh_text:
        return None

    # Google format: pipe-separated weekday_text lines
    if '|' in oh_text:
        lines = [l.strip() for l in oh_text.split('|') if l.strip()]
        return json.dumps({'weekdayText': lines, 'openNow': None, 'periods': []})

    # OSM format: "Mo-Fr 08:00-18:00" etc
    return json.dumps({'weekdayText': [oh_text], 'openNow': None, 'periods': []})


def build_description(rec):
    """
    Build a short description from available data.
    This is a placeholder — generate-parking-descriptions.py enriches these later.
    """
    parts = []
    ptype = rec.get('parking_type', 'car-park')
    name = rec.get('name', '')

    type_labels = {
        'layby': 'A roadside layby',
        'informal': 'An informal parking area',
        'surface': 'A surface-level car park',
        'multi-storey': 'A multi-storey car park',
        'street-side': 'Street-side parking',
        'cycle-parking': 'Cycle parking',
        'car-park': 'A car park',
    }
    label = type_labels.get(ptype, 'Parking')
    parts.append(f"{label} in the Southport area.")

    fee = rec.get('fee', '') or rec.get('price_manual', '')
    if fee.lower() in ('free', 'no'):
        parts.append("Free to use.")
    elif fee:
        parts.append(f"Charges apply: {fee}.")

    cap = rec.get('capacity', '')
    if cap:
        parts.append(f"Capacity: approximately {cap} spaces.")

    notes = rec.get('notes', '')
    if notes:
        parts.append(notes)

    return ' '.join(parts) if parts else None


def insert_parking(conn, rec, category_id, existing_slugs, existing_place_ids):
    """Insert a single parking record into Business table."""
    place_id = rec.get('place_id', '') or None

    # Skip permanently closed Google listings
    if rec.get('business_status') == 'CLOSED_PERMANENTLY':
        return False, 'closed'

    # Skip if Google place_id already in DB
    if place_id and place_id in existing_place_ids:
        return False, 'duplicate_placeid'

    name = rec.get('name', '').strip() or 'Car Park'
    base_slug = slugify(name)

    # Append postcode to slug if it would otherwise clash
    postcode = (rec.get('postcode') or '').strip().replace(' ', '-').lower()
    if not postcode:
        # Use truncated coords as unique suffix
        try:
            postcode = f"{float(rec['lat']):.3f}-{abs(float(rec['lng'])):.3f}"
        except Exception:
            postcode = ''

    full_slug = unique_slug(f"parking-{base_slug}" if not base_slug.startswith('parking') else base_slug, existing_slugs)
    existing_slugs.add(full_slug)

    lat = rec.get('lat')
    lng = rec.get('lng')
    try:
        lat = float(lat) if lat else None
        lng = float(lng) if lng else None
    except ValueError:
        lat = lng = None

    address = rec.get('address', '').strip() or ''
    real_postcode = (rec.get('postcode') or '').strip().upper() or ''

    rating = rec.get('rating', '')
    try:
        rating = float(rating) if rating else None
    except ValueError:
        rating = None

    review_count = rec.get('review_count', '')
    try:
        review_count = int(float(review_count)) if review_count else None
    except ValueError:
        review_count = None

    # Images: Street View URL if available
    images = []
    sv = rec.get('streetview_url', '').strip()
    if sv:
        images.append(sv)

    tags = build_tags(rec)
    opening_hours = build_opening_hours(rec)
    description = build_description(rec)

    short_desc_parts = [name]
    if rec.get('fee', '') == 'Free' or rec.get('price_manual', '').lower() == 'free':
        short_desc_parts.append('Free parking.')
    elif rec.get('price_manual'):
        short_desc_parts.append(rec['price_manual'])

    short_description = ' — '.join(short_desc_parts[:2]) if len(short_desc_parts) > 1 else None

    rec_id = str(uuid.uuid4())

    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO "Business" (
                id, slug, name, "categoryId", address, postcode, lat, lng,
                description, "shortDescription", images, tags,
                "openingHours", "listingTier", claimed, featured,
                "placeId", rating, "reviewCount",
                "hubTier", "weeklyEmailEnabled", "boostCredits",
                "createdAt", "updatedAt"
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s::jsonb, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                NOW(), NOW()
            )
        """, (
            rec_id, full_slug, name, category_id,
            address, real_postcode, lat, lng,
            description, short_description,
            images, tags,
            opening_hours, LISTING_TIER, False, False,
            place_id, rating, review_count,
            'free', False, 0,
        ))

    conn.commit()
    return True, full_slug


def main():
    print("Parking Import — SouthportGuide Database")
    print("=" * 60)

    # Load CSVs
    google_rows = load_csv(GOOGLE_CSV)
    osm_rows = load_csv(OSM_CSV)
    manual_rows = load_csv(MANUAL_CSV)

    print(f"Loaded: {len(google_rows)} Google | {len(osm_rows)} OSM | {len(manual_rows)} Manual")

    if not google_rows and not osm_rows and not manual_rows:
        print("\nNo data found. Run scrape-parking-google.py and scrape-parking-osm.py first.")
        exit(1)

    # Tag sources
    for r in google_rows:
        r.setdefault('source', 'google')
    for r in osm_rows:
        r.setdefault('source', 'osm')
    for r in manual_rows:
        r.setdefault('source', 'manual')

    all_records = google_rows + osm_rows + manual_rows
    print(f"Total before dedup: {len(all_records)}")

    # Deduplicate
    merged = deduplicate(all_records)
    print(f"After deduplication (50m radius): {len(merged)}")

    # Connect
    conn = connect_db()
    print("Connected to database")

    category_id = get_or_create_category(conn)
    print(f"Parking category ID: {category_id}")

    existing_slugs = get_existing_slugs(conn)
    existing_place_ids = get_existing_place_ids(conn)
    print(f"Existing slugs in DB: {len(existing_slugs)}")
    print(f"Existing place_ids:   {len(existing_place_ids)}")

    print(f"\nImporting {len(merged)} parking locations...")
    print("-" * 60)

    inserted = 0
    skipped_closed = 0
    skipped_dup = 0
    errors = 0

    for idx, rec in enumerate(merged, 1):
        try:
            ok, result = insert_parking(conn, rec, category_id, existing_slugs, existing_place_ids)
        except Exception as e:
            errors += 1
            try:
                print(f"  [{idx:3d}] ERROR: {rec.get('name', '?')} - {str(e)[:80]}")
            except Exception:
                print(f"  [{idx:3d}] ERROR (unprintable)")
            conn.rollback()
            continue

        if ok:
            inserted += 1
            try:
                name = rec.get('name', '')[:40]
                postcode = rec.get('postcode', '') or 'no postcode'
                src = rec.get('sources', rec.get('source', '?'))
                if idx % 20 == 0 or idx <= 5:
                    print(f"  [{idx:3d}] OK {name:<40s} {postcode:<10s} [{src}]")
            except Exception:
                pass
        elif result == 'closed':
            skipped_closed += 1
        elif result == 'duplicate_placeid':
            skipped_dup += 1

    print(f"\n{'=' * 60}")
    print(f"IMPORT COMPLETE")
    print(f"  Inserted:          {inserted}")
    print(f"  Skipped (closed):  {skipped_closed}")
    print(f"  Skipped (dup ID):  {skipped_dup}")
    print(f"  Errors:            {errors}")
    print(f"\nNext steps:")
    print(f"  1. Review parking-google.csv — add prices to 'price_manual' column for known car parks")
    print(f"  2. Run: python scripts/generate-parking-descriptions.py")
    print(f"  3. Add lib/config.ts 'parking' category entry")
    print(f"  4. Build /parking listing page and /parking/[slug] detail page")

    conn.close()


if __name__ == '__main__':
    main()
