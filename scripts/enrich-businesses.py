#!/usr/bin/env python3
"""
Enrich businesses with full Place Details from Google Places API.
Fetches: phone, website, rating, review count, opening hours,
         formatted address (with postcode), business status, editorial summary.

Saves progress to enrich-progress.json so it can resume if interrupted.
Usage: python scripts/enrich-businesses.py
"""

import os
import json
import time
import requests
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

if not API_KEY:
    print("Error: GOOGLE_PLACES_API_KEY not set")
    exit(1)

if not DATABASE_URL:
    print("Error: DATABASE_URL not set")
    exit(1)

PROGRESS_FILE = 'enrich-progress.json'
BATCH_SIZE = 5          # Businesses per batch
DELAY_BETWEEN = 0.3     # Seconds between API calls (conservative rate limit)

# Place Details fields to fetch
DETAIL_FIELDS = ','.join([
    'place_id',
    'name',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'price_level',
    'opening_hours',
    'formatted_address',
    'business_status',
    'editorial_summary',
    'wheelchair_accessible_entrance',
])


def connect_db():
    """Connect to Neon Postgres."""
    # Parse connection string
    parsed = urlparse(DATABASE_URL)
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path.lstrip('/'),
        user=parsed.username,
        password=parsed.password,
        sslmode='require'
    )
    return conn


def load_progress():
    """Load progress from file."""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {'processed': [], 'failed': []}


def save_progress(progress):
    """Save progress to file."""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f)


def find_place(name, lat, lng):
    """Find a place by name near a location. Returns place_id or None."""
    url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    params = {
        'input': f"{name} Southport",
        'inputtype': 'textquery',
        'fields': 'place_id,name',
        'locationbias': f'circle:5000@{lat},{lng}',
        'key': API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if data.get('status') == 'OK' and data.get('candidates'):
            return data['candidates'][0]['place_id']
    except Exception as e:
        print(f"    Find Place error: {e}")
    return None


def get_place_details(place_id):
    """Fetch full details for a place."""
    url = 'https://maps.googleapis.com/maps/api/place/details/json'
    params = {
        'place_id': place_id,
        'fields': DETAIL_FIELDS,
        'key': API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if data.get('status') == 'OK':
            return data.get('result', {})
    except Exception as e:
        print(f"    Place Details error: {e}")
    return None


def price_level_to_gbp(level):
    """Convert Google price_level (0-4) to £ symbols."""
    if level is None:
        return None
    levels = ['Free', '£', '££', '£££', '££££']
    try:
        return levels[int(level)]
    except (IndexError, TypeError):
        return None


def extract_postcode(formatted_address):
    """Extract UK postcode from formatted address."""
    import re
    # UK postcode pattern
    pattern = r'[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}'
    match = re.search(pattern, formatted_address or '', re.IGNORECASE)
    if match:
        return match.group().upper().strip()
    return ''


def update_business(conn, business_id, details, place_id):
    """Update business record with enriched data."""
    result = details

    # Extract values
    phone = result.get('formatted_phone_number') or result.get('international_phone_number') or None
    website = result.get('website') or None
    rating = result.get('rating') or None
    review_count = result.get('user_ratings_total') or None
    price_range = price_level_to_gbp(result.get('price_level'))
    business_status = result.get('business_status') or 'OPERATIONAL'
    formatted_address = result.get('formatted_address') or None
    postcode = extract_postcode(formatted_address) if formatted_address else ''
    editorial_summary = (result.get('editorial_summary') or {}).get('overview') or None

    # Opening hours
    opening_hours = None
    if result.get('opening_hours'):
        oh = result['opening_hours']
        opening_hours = json.dumps({
            'weekdayText': oh.get('weekday_text', []),
            'openNow': oh.get('open_now'),
            'periods': oh.get('periods', [])
        })

    # Build update
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE "Business" SET
                "placeId" = %s,
                "phone" = COALESCE(%s, "phone"),
                "website" = COALESCE(%s, "website"),
                "rating" = %s,
                "reviewCount" = %s,
                "priceRange" = COALESCE(%s, "priceRange"),
                "openingHours" = CASE WHEN %s IS NOT NULL THEN %s::jsonb ELSE "openingHours" END,
                "address" = COALESCE(%s, "address"),
                "postcode" = CASE WHEN %s != '' THEN %s ELSE "postcode" END,
                "shortDescription" = COALESCE(%s, "shortDescription"),
                "updatedAt" = NOW()
            WHERE "id" = %s
        """, (
            place_id,
            phone,
            website,
            rating,
            review_count,
            price_range,
            opening_hours, opening_hours,
            formatted_address,
            postcode, postcode,
            editorial_summary,
            business_id
        ))
    conn.commit()


def main():
    print("Enriching businesses with Google Place Details")
    print("=" * 60)

    # Load progress
    progress = load_progress()
    processed_ids = set(progress.get('processed', []))
    failed_ids = set(progress.get('failed', []))

    print(f"Previously processed: {len(processed_ids)}")
    print(f"Previously failed: {len(failed_ids)}")

    # Connect to DB
    conn = connect_db()
    print("Connected to database")

    # Fetch all businesses
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("""
            SELECT id, name, lat, lng, "placeId"
            FROM "Business"
            ORDER BY name
        """)
        businesses = cur.fetchall()

    total = len(businesses)
    to_process = [b for b in businesses if b['id'] not in processed_ids]

    print(f"Total businesses: {total}")
    print(f"To process: {len(to_process)}")
    print("=" * 60)

    start_time = time.time()
    processed_count = 0
    skipped_count = 0
    failed_count = 0

    for i, business in enumerate(to_process):
        biz_id = business['id']
        biz_name = business['name']
        lat = business['lat'] or 53.6476
        lng = business['lng'] or -3.0052
        existing_place_id = business['placeId']

        safe_name = biz_name.encode('ascii', 'replace').decode('ascii')
        print(f"\n[{i+1}/{len(to_process)}] {safe_name}")

        # Step 1: Get place_id if we don't have one
        place_id = existing_place_id
        if not place_id:
            place_id = find_place(biz_name, lat, lng)
            time.sleep(DELAY_BETWEEN)

            if not place_id:
                print(f"  Could not find place_id - skipping")
                failed_ids.add(biz_id)
                failed_count += 1
                progress['failed'] = list(failed_ids)
                save_progress(progress)
                continue

        # Step 2: Get place details
        details = get_place_details(place_id)
        time.sleep(DELAY_BETWEEN)

        if not details:
            print(f"  Could not get details - skipping")
            failed_ids.add(biz_id)
            failed_count += 1
            progress['failed'] = list(failed_ids)
            save_progress(progress)
            continue

        # Check if business is permanently closed
        if details.get('business_status') == 'CLOSED_PERMANENTLY':
            print(f"  PERMANENTLY CLOSED - removing from DB")
            with conn.cursor() as cur:
                cur.execute('DELETE FROM "Business" WHERE id = %s', (biz_id,))
            conn.commit()
            processed_ids.add(biz_id)
            progress['processed'] = list(processed_ids)
            save_progress(progress)
            continue

        # Step 3: Update business
        try:
            update_business(conn, biz_id, details, place_id)
            rating = details.get('rating', '-')
            reviews = details.get('user_ratings_total', 0)
            phone = details.get('formatted_phone_number', 'no phone')
            safe_phone = str(phone).encode('ascii', 'replace').decode('ascii')
            print(f"  Rating: {rating}/5 ({reviews} reviews) | {safe_phone}")
            processed_count += 1
        except Exception as e:
            print(f"  DB update error: {e}")
            conn.rollback()
            failed_ids.add(biz_id)
            failed_count += 1

        processed_ids.add(biz_id)
        progress['processed'] = list(processed_ids)
        progress['failed'] = list(failed_ids)

        # Save progress every 10 businesses
        if (i + 1) % 10 == 0:
            save_progress(progress)
            elapsed = time.time() - start_time
            rate = (i + 1) / elapsed
            remaining = (len(to_process) - i - 1) / rate if rate > 0 else 0
            print(f"\n  Progress: {i+1}/{len(to_process)} | Elapsed: {elapsed:.0f}s | ETA: {remaining:.0f}s")

    # Final save
    save_progress(progress)
    conn.close()

    elapsed = time.time() - start_time
    print(f"\n{'=' * 60}")
    print(f"COMPLETE in {elapsed:.0f}s")
    print(f"  Enriched: {processed_count}")
    print(f"  Failed/not found: {failed_count}")
    print(f"  Total processed: {len(processed_ids)}")


if __name__ == '__main__':
    main()
