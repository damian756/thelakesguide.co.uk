"""
Generate, optimise and store parking images locally using OpenStreetMap tiles.

For every parking listing with a maps.googleapis.com image URL (or any
listing with lat/lng and no local image):
  1. Renders a 1200×630 map image centred on the car park using OSM tiles
  2. Saves as WebP at 82% quality to public/images/parking/{slug}.webp
  3. Updates the DB images column to ['/images/parking/{slug}.webp']

No API key required — uses free OpenStreetMap tile data.

Run from the project root:  python scripts/download-parking-images.py
"""

import os
import sys
import time
import io
import psycopg2
from urllib.parse import urlparse
from pathlib import Path
from PIL import Image, ImageDraw
from staticmap import StaticMap, CircleMarker
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / '.env.local')

DB_URL  = os.getenv('DATABASE_URL')
OUT_DIR = ROOT / 'public' / 'images' / 'parking'
OUT_DIR.mkdir(parents=True, exist_ok=True)

IMG_W, IMG_H = 1200, 630
WEBP_QUALITY = 82
MAP_ZOOM     = 17   # zoom 17 shows ~400m radius — good for car park context

# ── DB ─────────────────────────────────────────────────────────────────────────

def connect():
    p = urlparse(DB_URL)
    return psycopg2.connect(
        host=p.hostname, port=p.port or 5432,
        database=p.path.lstrip('/'),
        user=p.username, password=p.password,
        sslmode='require',
    )

# ── Map generation ─────────────────────────────────────────────────────────────

def render_map(lat: float, lng: float, out_path: Path) -> bool:
    try:
        m = StaticMap(
            IMG_W, IMG_H,
            url_template='https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            headers={'User-Agent': 'SouthportGuide/1.0 parking-image-generator'},
        )
        # Blue dot marker for the car park location
        m.add_marker(CircleMarker((lng, lat), '#1d4ed8', 14))
        m.add_marker(CircleMarker((lng, lat), '#ffffff', 6))

        img = m.render(zoom=MAP_ZOOM, center=[lng, lat])

        # Convert to WebP
        buf = io.BytesIO()
        img.save(buf, 'WEBP', quality=WEBP_QUALITY, method=6)
        buf.seek(0)

        # Save
        with open(out_path, 'wb') as f:
            f.write(buf.read())
        return True
    except Exception as e:
        print(f'  render error: {e}')
        return False

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    conn = connect()
    cur  = conn.cursor()

    # All parking listings that still have a Google URL OR have no image at all
    cur.execute("""
        SELECT b.id, b.slug, b.lat, b.lng, b.images
        FROM "Business" b
        JOIN "Category" c ON b."categoryId" = c.id
        WHERE c.slug = 'parking'
          AND b.lat IS NOT NULL
          AND b.lng IS NOT NULL
          AND (
            (array_length(b.images, 1) > 0 AND b.images[1] LIKE '%maps.googleapis.com%')
            OR (b.images = '{}' OR b.images IS NULL)
          )
        ORDER BY b.slug
    """)
    rows = cur.fetchall()
    total = len(rows)
    print(f"Parking listings to process: {total}")
    print(f"Output: {OUT_DIR}\n")

    done = skipped = errors = 0

    for i, (bid, slug, lat, lng, images) in enumerate(rows, 1):
        out_path  = OUT_DIR / f'{slug}.webp'
        local_url = f'/images/parking/{slug}.webp'

        sys.stdout.write(f'[{i:>4}/{total}] {slug[:52]:<54}')
        sys.stdout.flush()

        # Already downloaded in a previous run
        if out_path.exists():
            cur.execute('UPDATE "Business" SET images = %s WHERE id = %s', ([local_url], bid))
            conn.commit()
            print('skip (exists)')
            skipped += 1
            continue

        if not render_map(lat, lng, out_path):
            errors += 1
            time.sleep(1)
            continue

        kb = out_path.stat().st_size // 1024
        cur.execute('UPDATE "Business" SET images = %s WHERE id = %s', ([local_url], bid))
        conn.commit()
        print(f'OK  {kb}KB')
        done += 1

        # Polite pacing — OSM tile servers ask for reasonable delays
        time.sleep(0.3)

    print()
    print(f"Done. Generated: {done}  |  Skipped (cached): {skipped}  |  Errors: {errors}")
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
