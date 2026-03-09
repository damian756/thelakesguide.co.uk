#!/usr/bin/env python3
"""
Scrape parking locations across Southport/Sefton coast using Google Places API.
Uses a fine grid search to capture all named/commercial parking facilities.

Sources targeted:
  - type=parking        (main parking lots, NCP, council car parks)
  - type=parking_garage (multi-storey)
  - Transit stations    (station car parks via transit_station type)

Also fetches Street View Static API image URL for each location.

Output: parking-google.csv
Progress: parking-google-progress.json (resumable)

Usage: python scripts/scrape-parking-google.py
Requires: pip install requests python-dotenv
"""

import os
import csv
import json
import math
import time
import re
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv()

API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
if not API_KEY:
    print("Error: GOOGLE_PLACES_API_KEY not found in .env.local or .env")
    exit(1)

# ── Coverage area ────────────────────────────────────────────────────────────
# Centre on Southport town centre; 12km radius covers Formby, Ainsdale,
# Birkdale, Churchtown, Maghull fringe, and Crosby.
CENTER_LAT = 53.6476
CENTER_LNG = -3.0052
COVERAGE_RADIUS_KM = 12
SEARCH_RADIUS_M = 2000     # 2km per grid point — tighter grid for denser coverage
GRID_SPACING_KM = 1.5      # 1.5km spacing ensures heavy overlap — nothing missed

# ── Place types to search ────────────────────────────────────────────────────
PARKING_TYPES = [
    'parking',
    # transit_station excluded — grid search returns thousands of bus stops
    # Station car parks added manually via STATION_CAR_PARKS below
]

# ── Station car parks — searched by text query ───────────────────────────────
# Google Places type=transit_station returns bus stops across the whole area.
# Instead we search specifically for the Merseyrail stations with car parks.
STATION_SEARCHES = [
    "Southport Railway Station car park",
    "Birkdale Railway Station",
    "Ainsdale Railway Station",
    "Formby Railway Station",
    "Hillside Railway Station",
    "Freshfield Railway Station",
    "Meols Cop Railway Station",
]

# ── Street View config ───────────────────────────────────────────────────────
STREETVIEW_SIZE = '1200x800'
STREETVIEW_FOV = 90
STREETVIEW_HEADING = 0    # 0 = north-facing; will be auto-adjusted by Google

# ── Detail fields to fetch per place ────────────────────────────────────────
DETAIL_FIELDS = ','.join([
    'place_id',
    'name',
    'formatted_address',
    'geometry',
    'opening_hours',
    'rating',
    'user_ratings_total',
    'photos',
    'business_status',
    'price_level',
    'types',
    'website',
    'editorial_summary',
])

OUTPUT_FILE = 'parking-google.csv'
PROGRESS_FILE = 'parking-google-progress.json'
DELAY = 0.3


def haversine_km(lat1, lng1, lat2, lng2):
    """Distance between two lat/lng points in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def generate_grid_points():
    """Fine grid of search points covering the target radius."""
    lat_step = GRID_SPACING_KM / 111.0
    lng_step = GRID_SPACING_KM / (111.0 * math.cos(math.radians(CENTER_LAT)))
    lat_range = COVERAGE_RADIUS_KM / 111.0
    lng_range = COVERAGE_RADIUS_KM / (111.0 * math.cos(math.radians(CENTER_LAT)))

    points = []
    lat = CENTER_LAT - lat_range
    while lat <= CENTER_LAT + lat_range:
        lng = CENTER_LNG - lng_range
        while lng <= CENTER_LNG + lng_range:
            if haversine_km(CENTER_LAT, CENTER_LNG, lat, lng) <= COVERAGE_RADIUS_KM:
                points.append((round(lat, 6), round(lng, 6)))
            lng += lng_step
        lat += lat_step
    return points


def extract_postcode(address):
    """Extract UK postcode from a formatted address string."""
    if not address:
        return ''
    match = re.search(r'[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}', address, re.IGNORECASE)
    return match.group().upper().strip() if match else ''


def nearby_search(lat, lng, place_type):
    """Paginated Nearby Search for a type at a location."""
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    params = {
        'location': f'{lat},{lng}',
        'radius': SEARCH_RADIUS_M,
        'type': place_type,
        'key': API_KEY,
    }
    results = []
    while True:
        r = requests.get(url, params=params, timeout=15)
        data = r.json()
        status = data.get('status')
        if status not in ('OK', 'ZERO_RESULTS'):
            print(f"    [WARNING] Nearby Search returned: {status}")
            break
        results.extend(data.get('results', []))
        token = data.get('next_page_token')
        if not token:
            break
        time.sleep(2)
        params = {'pagetoken': token, 'key': API_KEY}
    return results


def place_details(place_id):
    """Fetch full Place Details for a place_id."""
    url = 'https://maps.googleapis.com/maps/api/place/details/json'
    params = {
        'place_id': place_id,
        'fields': DETAIL_FIELDS,
        'key': API_KEY,
    }
    try:
        r = requests.get(url, params=params, timeout=15)
        data = r.json()
        if data.get('status') == 'OK':
            return data.get('result', {})
    except Exception as e:
        print(f"    [ERROR] Place Details {place_id}: {e}")
    return None


def streetview_url(lat, lng):
    """Build a Street View Static API image URL (no charge for metadata-only; image counts)."""
    base = 'https://maps.googleapis.com/maps/api/streetview'
    return (
        f"{base}?size={STREETVIEW_SIZE}"
        f"&location={lat},{lng}"
        f"&fov={STREETVIEW_FOV}"
        f"&source=outdoor"
        f"&key={API_KEY}"
    )


def text_search(query):
    """Search for a specific place by text query. Returns list of results."""
    url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    params = {
        'query': query,
        'location': f'{CENTER_LAT},{CENTER_LNG}',
        'radius': COVERAGE_RADIUS_KM * 1000,
        'key': API_KEY,
    }
    try:
        r = requests.get(url, params=params, timeout=15)
        data = r.json()
        if data.get('status') in ('OK', 'ZERO_RESULTS'):
            return data.get('results', [])
    except Exception as e:
        print(f"    [ERROR] Text search '{query}': {e}")
    return []


def is_parking_relevant(types):
    """Keep parking-type results only. Transit stations handled separately."""
    if not types:
        return False
    parking_signals = {'parking', 'parking_garage'}
    return bool(set(types) & parking_signals)


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {'scraped_place_ids': [], 'enriched_place_ids': []}


def save_progress(p):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(p, f)


def main():
    progress = load_progress()
    scraped_ids = set(progress.get('scraped_place_ids', []))
    enriched_ids = set(progress.get('enriched_place_ids', []))

    grid = generate_grid_points()
    print("Southport Parking Scraper — Google Places API")
    print("=" * 60)
    print(f"Centre:           {CENTER_LAT}, {CENTER_LNG}")
    print(f"Coverage radius:  {COVERAGE_RADIUS_KM} km")
    print(f"Search radius:    {SEARCH_RADIUS_M} m per point")
    print(f"Grid spacing:     {GRID_SPACING_KM} km")
    print(f"Grid points:      {len(grid)}")
    print(f"Place types:      {', '.join(PARKING_TYPES)}")
    print(f"Already scraped:  {len(scraped_ids)} place_ids")
    print("=" * 60)

    # ── Phase 1: Collect all place_ids via grid search ────────────────────────
    print("\nPHASE 1 — Nearby Search (collecting place_ids)")
    all_stubs = {}  # place_id -> basic stub

    for type_idx, ptype in enumerate(PARKING_TYPES, 1):
        type_new = 0
        print(f"\n  [{type_idx}/{len(PARKING_TYPES)}] type={ptype} ...")
        for pt_idx, (lat, lng) in enumerate(grid):
            results = nearby_search(lat, lng, ptype)
            time.sleep(DELAY)
            for r in results:
                pid = r.get('place_id')
                if pid and pid not in all_stubs:
                    all_stubs[pid] = {
                        'place_id': pid,
                        'name': r.get('name', ''),
                        'lat': r.get('geometry', {}).get('location', {}).get('lat', ''),
                        'lng': r.get('geometry', {}).get('location', {}).get('lng', ''),
                        'address': r.get('vicinity', ''),
                        'types': ','.join(r.get('types', [])),
                    }
                    type_new += 1
            if (pt_idx + 1) % 20 == 0:
                print(f"    ...{pt_idx + 1}/{len(grid)} points, {len(all_stubs)} unique so far")
        print(f"  type={ptype}: +{type_new} new | Running total: {len(all_stubs)}")

    # Filter out obviously non-parking transit stations
    all_stubs = {
        pid: stub for pid, stub in all_stubs.items()
        if is_parking_relevant(stub['types'].split(','))
    }
    print(f"\nAfter relevance filter: {len(all_stubs)} locations")

    # ── Phase 1b: Add specific station car parks via text search ─────────────
    print("\nPHASE 1b — Station car parks (text search)")
    for query in STATION_SEARCHES:
        results = text_search(query)
        time.sleep(DELAY)
        added = 0
        for r in results[:3]:  # Take top 3 results per query max
            pid = r.get('place_id')
            if pid and pid not in all_stubs:
                all_stubs[pid] = {
                    'place_id': pid,
                    'name': r.get('name', ''),
                    'lat': r.get('geometry', {}).get('location', {}).get('lat', ''),
                    'lng': r.get('geometry', {}).get('location', {}).get('lng', ''),
                    'address': r.get('formatted_address', r.get('vicinity', '')),
                    'types': ','.join(r.get('types', [])),
                }
                added += 1
        if added:
            print(f"  +{added} from: {query}")
    print(f"  Total after stations: {len(all_stubs)}")

    # ── Phase 2: Enrich each place_id with full details ───────────────────────
    print("\nPHASE 2 — Place Details enrichment")
    to_enrich = [pid for pid in all_stubs if pid not in enriched_ids]
    print(f"  To enrich: {len(to_enrich)} (skipping {len(enriched_ids)} already done)")

    enriched_rows = []

    # Load existing enriched rows if output file exists
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                enriched_rows.append(row)

    for idx, pid in enumerate(to_enrich, 1):
        stub = all_stubs[pid]
        details = place_details(pid)
        time.sleep(DELAY)

        if not details:
            print(f"  [{idx}/{len(to_enrich)}] SKIP (no details): {stub['name']}")
            continue

        lat = details.get('geometry', {}).get('location', {}).get('lat', stub['lat'])
        lng = details.get('geometry', {}).get('location', {}).get('lng', stub['lng'])
        formatted_address = details.get('formatted_address', stub['address'])
        postcode = extract_postcode(formatted_address)

        # Opening hours
        oh = details.get('opening_hours', {})
        opening_hours_text = ' | '.join(oh.get('weekday_text', []))

        # Photos (store first photo reference for later fetching if needed)
        photos = details.get('photos', [])
        photo_ref = photos[0].get('photo_reference', '') if photos else ''

        # Street View URL
        sv_url = streetview_url(lat, lng) if lat and lng else ''

        # Types
        place_types = ','.join(details.get('types', stub['types'].split(',')))

        row = {
            'source': 'google',
            'place_id': pid,
            'name': details.get('name', stub['name']),
            'address': formatted_address,
            'postcode': postcode,
            'lat': lat,
            'lng': lng,
            'opening_hours': opening_hours_text,
            'rating': details.get('rating', ''),
            'review_count': details.get('user_ratings_total', ''),
            'price_level': details.get('price_level', ''),
            'business_status': details.get('business_status', 'OPERATIONAL'),
            'website': details.get('website', ''),
            'editorial_summary': (details.get('editorial_summary') or {}).get('overview', ''),
            'photo_reference': photo_ref,
            'streetview_url': sv_url,
            'place_types': place_types,
            'price_manual': '',   # Fill manually after scrape
            'notes': '',          # Fill manually — "fills early", "floods", etc.
        }

        enriched_rows.append(row)
        enriched_ids.add(pid)

        if idx % 10 == 0 or idx == len(to_enrich):
            # Save progress and flush CSV
            progress['scraped_place_ids'] = list(all_stubs.keys())
            progress['enriched_place_ids'] = list(enriched_ids)
            save_progress(progress)

            with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
                if enriched_rows:
                    writer = csv.DictWriter(f, fieldnames=enriched_rows[0].keys())
                    writer.writeheader()
                    writer.writerows(enriched_rows)
            print(f"  [{idx}/{len(to_enrich)}] {stub['name']} — {postcode or 'no postcode'} (saved)")
        else:
            print(f"  [{idx}/{len(to_enrich)}] {stub['name']} — {postcode or 'no postcode'}")

    print(f"\n{'=' * 60}")
    print(f"COMPLETE")
    print(f"  Total locations: {len(enriched_rows)}")
    print(f"  Output: {OUTPUT_FILE}")
    print(f"\nNext: python scripts/scrape-parking-osm.py")
    print(f"Then: python scripts/import-parking.py")


if __name__ == '__main__':
    main()
