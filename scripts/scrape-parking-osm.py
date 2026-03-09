#!/usr/bin/env python3
"""
Scrape parking locations from OpenStreetMap via Overpass API.
Captures informal, surface, layby, and unofficial parking that Google misses.

OSM tags targeted:
  amenity=parking           (standard car parks)
  amenity=parking_space     (individual designated spaces — filtered for named ones)
  amenity=parking_entrance  (entrance points — skipped, just metadata)
  parking=surface           (surface-level lots)
  parking=multi-storey      (multi-storey — supplement to Google)
  parking=layby             (laybys / roadside pull-ins)
  parking=informal          (the spots people use but aren't officially car parks)
  parking=street_side       (recognised street-side parking areas)

Bounding box covers: Southport, Ainsdale, Birkdale, Churchtown, Formby, Crosby fringe
  South: 53.58, West: -3.15, North: 53.72, East: -2.90

Output: parking-osm.csv
No API key required. Free. No rate limits beyond reasonable use (1 req/s max).

Usage: python scripts/scrape-parking-osm.py
Requires: pip install requests
"""

import csv
import json
import math
import time
import re
import requests

# ── Bounding box (lat_min, lng_min, lat_max, lng_max) ───────────────────────
# Covers full 12km radius from Southport centre conservatively
BBOX = "53.58,-3.15,53.72,-2.90"
CENTER_LAT = 53.6476
CENTER_LNG = -3.0052
MAX_RADIUS_KM = 12

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]
OUTPUT_FILE = "parking-osm.csv"
DELAY = 1.5  # Be a good OSM citizen

# ── Tags we want to capture ──────────────────────────────────────────────────
# Each query is a separate Overpass filter; combined into one request

OVERPASS_QUERY = f"""
[out:json][timeout:90];
(
  node["amenity"="parking"]({BBOX});
  way["amenity"="parking"]({BBOX});
  relation["amenity"="parking"]({BBOX});

  node["parking"="surface"]({BBOX});
  way["parking"="surface"]({BBOX});

  node["parking"="multi-storey"]({BBOX});
  way["parking"="multi-storey"]({BBOX});

  node["parking"="layby"]({BBOX});
  way["parking"="layby"]({BBOX});

  node["parking"="informal"]({BBOX});
  way["parking"="informal"]({BBOX});

  node["parking"="street_side"]({BBOX});
  way["parking"="street_side"]({BBOX});

  node["amenity"="bicycle_parking"]({BBOX});
  way["amenity"="bicycle_parking"]({BBOX});
);
out center tags;
"""


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def fetch_osm():
    """Fetch all parking data from Overpass API with fallback servers."""
    print("Querying OpenStreetMap Overpass API...")
    print(f"Bounding box: {BBOX}")

    for url in OVERPASS_URLS:
        print(f"  Trying: {url}")
        try:
            r = requests.post(
                url,
                data={'data': OVERPASS_QUERY},
                timeout=90,
                headers={'User-Agent': 'SouthportGuide-ParkingScraper/1.0 (thelakesguide.co.uk)'}
            )
            r.raise_for_status()
            print(f"  Success from: {url}")
            return r.json()
        except requests.exceptions.Timeout:
            print(f"  Timeout on {url}, trying next...")
        except Exception as e:
            print(f"  Failed ({url}): {e}, trying next...")
        time.sleep(3)

    print("ERROR: All Overpass API servers failed. Try again in a few minutes.")
    exit(1)


def get_center(element):
    """Get lat/lng from either a node or a way (uses 'center' from out center)."""
    if element.get('type') == 'node':
        return element.get('lat'), element.get('lon')
    elif 'center' in element:
        return element['center'].get('lat'), element['center'].get('lon')
    return None, None


def classify_parking_type(tags):
    """Return a human-readable parking type from OSM tags."""
    amenity = tags.get('amenity', '')
    parking = tags.get('parking', '')
    access = tags.get('access', 'yes')

    if parking == 'layby':
        return 'layby'
    if parking == 'informal':
        return 'informal'
    if parking == 'surface':
        return 'surface'
    if parking == 'multi-storey':
        return 'multi-storey'
    if parking == 'street_side':
        return 'street-side'
    if amenity == 'bicycle_parking':
        return 'cycle-parking'
    if amenity == 'parking':
        return 'car-park'
    return 'parking'


def parse_fee(tags):
    """Extract fee info from OSM tags."""
    fee = tags.get('fee', '')
    charge = tags.get('charge', '')
    if fee.lower() == 'no':
        return 'Free'
    if fee.lower() == 'yes':
        return charge if charge else 'Paid'
    return ''


def parse_capacity(tags):
    """Extract capacity from OSM tags."""
    cap = tags.get('capacity', '')
    if cap:
        try:
            return int(cap)
        except ValueError:
            return ''
    return ''


def parse_access(tags):
    """Determine access type."""
    access = tags.get('access', '')
    if access in ('private', 'no'):
        return 'private'
    if access in ('permissive', 'yes', 'public', ''):
        return 'public'
    if access == 'customers':
        return 'customers'
    return access


def build_opening_hours(tags):
    """Extract opening hours string."""
    return tags.get('opening_hours', '')


def infer_name(tags, lat, lng):
    """Generate a name if OSM doesn't have one."""
    osm_name = tags.get('name', '') or tags.get('description', '')
    if osm_name:
        return osm_name

    ptype = classify_parking_type(tags)
    operator = tags.get('operator', '')

    if operator:
        return f"{operator} Parking"
    if ptype == 'layby':
        return f"Layby ({lat:.4f}, {lng:.4f})"
    if ptype == 'informal':
        return f"Informal Parking ({lat:.4f}, {lng:.4f})"
    return f"Car Park ({lat:.4f}, {lng:.4f})"


def main():
    data = fetch_osm()
    elements = data.get('elements', [])
    print(f"Raw OSM elements returned: {len(elements)}")

    rows = []
    skipped_private = 0
    skipped_distant = 0
    osm_ids_seen = set()

    for el in elements:
        osm_id = f"{el.get('type', 'x')}/{el.get('id', 0)}"
        if osm_id in osm_ids_seen:
            continue
        osm_ids_seen.add(osm_id)

        tags = el.get('tags', {})
        lat, lng = get_center(el)

        if lat is None or lng is None:
            continue

        # Distance filter — only within our coverage radius
        dist = haversine_km(CENTER_LAT, CENTER_LNG, lat, lng)
        if dist > MAX_RADIUS_KM:
            skipped_distant += 1
            continue

        # Skip purely private with no public benefit
        access = parse_access(tags)
        if access == 'private':
            skipped_private += 1
            continue

        name = infer_name(tags, lat, lng)
        parking_type = classify_parking_type(tags)
        fee = parse_fee(tags)
        capacity = parse_capacity(tags)
        opening_hours = build_opening_hours(tags)

        row = {
            'source': 'osm',
            'osm_id': osm_id,
            'name': name,
            'address': tags.get('addr:street', ''),
            'postcode': tags.get('addr:postcode', ''),
            'lat': lat,
            'lng': lng,
            'parking_type': parking_type,
            'access': access,
            'fee': fee,
            'capacity': capacity,
            'opening_hours': opening_hours,
            'operator': tags.get('operator', ''),
            'surface': tags.get('surface', ''),
            'lit': tags.get('lit', ''),
            'covered': tags.get('covered', ''),
            'disabled_bays': tags.get('capacity:disabled', ''),
            'ev_charging': 'yes' if tags.get('amenity') == 'charging_station' or tags.get('socket:type2') else '',
            'max_stay': tags.get('maxstay', ''),
            'supervised': tags.get('supervised', ''),
            'osm_tags_raw': json.dumps(tags),
            'price_manual': '',   # Fill manually after scrape
            'notes': '',          # For local knowledge
        }

        rows.append(row)

    # Sort by parking_type so informal/laybys are clearly visible
    type_order = ['car-park', 'surface', 'multi-storey', 'layby', 'informal', 'street-side', 'cycle-parking']
    rows.sort(key=lambda r: (type_order.index(r['parking_type']) if r['parking_type'] in type_order else 99, r['name']))

    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        if rows:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)

    # Summary by type
    type_counts = {}
    for r in rows:
        t = r['parking_type']
        type_counts[t] = type_counts.get(t, 0) + 1

    print(f"\n{'=' * 60}")
    print(f"OSM SCRAPE COMPLETE")
    print(f"  Total locations: {len(rows)}")
    print(f"  Skipped (private): {skipped_private}")
    print(f"  Skipped (out of range): {skipped_distant}")
    print(f"\n  By type:")
    for t, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"    {t:20s}: {count}")
    print(f"\n  Output: {OUTPUT_FILE}")
    print(f"\nNext: python scripts/import-parking.py")


if __name__ == '__main__':
    main()
