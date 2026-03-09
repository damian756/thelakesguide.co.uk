"""
Backfill images for parking listings that have no images.

Strategy (in order):
  1. Street View Static API (radius=300m) — real photo of nearby road
  2. Google Maps Static API satellite — aerial view of the exact location
     (always works for any coordinate on Earth)

Both use the same GOOGLE_PLACES_API_KEY.
"""

import os
import sys
import time
import requests
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
DB_URL  = os.getenv('DATABASE_URL')

if not API_KEY:
    print("ERROR: GOOGLE_PLACES_API_KEY not set in .env.local")
    sys.exit(1)
if not DB_URL:
    print("ERROR: DATABASE_URL not set in .env.local")
    sys.exit(1)

# ── Helpers ────────────────────────────────────────────────────────────────────

def connect_db():
    p = urlparse(DB_URL)
    return psycopg2.connect(
        host=p.hostname,
        port=p.port or 5432,
        database=p.path.lstrip('/'),
        user=p.username,
        password=p.password,
        sslmode='require',
    )

def streetview_check(lat, lng):
    """Returns Street View image URL if imagery exists within 300m, else None."""
    meta_url = 'https://maps.googleapis.com/maps/api/streetview/metadata'
    r = requests.get(meta_url, params={
        'location': f'{lat},{lng}',
        'radius': 300,
        'key': API_KEY,
    }, timeout=10)
    if r.status_code == 200 and r.json().get('status') == 'OK':
        return (
            f"https://maps.googleapis.com/maps/api/streetview"
            f"?size=1200x800&location={lat},{lng}&radius=300&fov=90&key={API_KEY}"
        )
    return None

def satellite_url(lat, lng):
    """Google Maps Static API satellite — always returns an image."""
    return (
        f"https://maps.googleapis.com/maps/api/staticmap"
        f"?center={lat},{lng}&zoom=18&size=1200x800&maptype=satellite"
        f"&markers=color:blue%7C{lat},{lng}"
        f"&key={API_KEY}"
    )

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT b.id, b.name, b.lat, b.lng
        FROM "Business" b
        JOIN "Category" c ON b."categoryId" = c.id
        WHERE c.slug = 'parking'
          AND (b.images = '{}' OR b.images IS NULL)
          AND b.lat IS NOT NULL
          AND b.lng IS NOT NULL
        ORDER BY b.name
    """)
    rows = cur.fetchall()
    total = len(rows)
    print(f"Parking listings without images: {total}")
    print()

    sv_count  = 0
    sat_count = 0
    errors    = 0

    for i, (bid, name, lat, lng) in enumerate(rows, 1):
        sys.stdout.write(f"[{i:>4}/{total}] {name[:45]:<47}")
        sys.stdout.flush()

        try:
            img_url = streetview_check(lat, lng)
            source = 'streetview'
            if not img_url:
                img_url = satellite_url(lat, lng)
                source = 'satellite'

            cur.execute(
                'UPDATE "Business" SET images = %s WHERE id = %s',
                ([img_url], bid),
            )
            conn.commit()
            print(source)
            if source == 'streetview':
                sv_count += 1
            else:
                sat_count += 1

        except Exception as e:
            conn.rollback()
            print(f"ERROR: {e}")
            errors += 1

        time.sleep(0.12)

    print()
    print(f"Done. Street View: {sv_count}  |  Satellite: {sat_count}  |  Errors: {errors}")
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
