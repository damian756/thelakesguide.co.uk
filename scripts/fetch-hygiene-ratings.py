"""
Fetch Food Hygiene Ratings from the Food Standards Agency (FSA) free public API.
Matches each business by name + postcode and stores the rating.
Run: python scripts/fetch-hygiene-ratings.py

No API key required – FSA API is fully public.
"""

import os
import sys
import time
import json
import re
import psycopg2
import requests
from dotenv import load_dotenv
from difflib import SequenceMatcher

load_dotenv()
load_dotenv(".env")

DB_URL = os.environ.get("DATABASE_URL", "")
FSA_BASE = "https://api.ratings.food.gov.uk"
FSA_HEADERS = {"x-api-version": "2", "Accept": "application/json"}

# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------
def get_connection():
    # Use verify-full with system trust store for Neon
    url = DB_URL.replace("sslmode=verify-full", "sslmode=verify-full&sslrootcert=system")
    return psycopg2.connect(url)

def get_businesses(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, name, postcode, address
            FROM "Business"
            WHERE postcode IS NOT NULL AND postcode != ''
            ORDER BY name
        """)
        return cur.fetchall()

def update_business(conn, business_id, rating, rating_date):
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE "Business"
            SET "hygieneRating" = %s,
                "hygieneRatingDate" = %s,
                "updatedAt" = NOW()
            WHERE id = %s
        """, (rating, rating_date, business_id))
    conn.commit()

# ---------------------------------------------------------------------------
# FSA API helpers
# ---------------------------------------------------------------------------
def clean_postcode(postcode: str) -> str:
    return postcode.strip().upper().replace(" ", "")

def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def extract_street_number(name: str) -> str:
    """Strip common business suffixes to improve matching."""
    cleaned = re.sub(r'\b(ltd|limited|plc|co\.?|uk|restaurant|bar|hotel|cafe|coffee|the|&)\b', '', name.lower())
    return cleaned.strip()

def search_fsa(name: str, postcode: str):
    """Search FSA API by postcode first, then name-match."""
    pc = clean_postcode(postcode)
    
    # Strategy 1: search by postcode + partial name
    short_name = name[:20]  # FSA fuzzy matches on partial names
    try:
        resp = requests.get(
            f"{FSA_BASE}/Establishments",
            params={
                "name": short_name,
                "address": pc,
                "pageSize": 10,
                "sortOptionKey": "alpha",
            },
            headers=FSA_HEADERS,
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            establishments = data.get("establishments", [])
            if establishments:
                # Pick best name match
                best = max(establishments, key=lambda e: similarity(name, e.get("BusinessName", "")))
                sim = similarity(name, best.get("BusinessName", ""))
                if sim > 0.4:
                    return best

    except Exception as e:
        pass

    # Strategy 2: search by postcode only
    try:
        resp = requests.get(
            f"{FSA_BASE}/Establishments",
            params={
                "address": pc,
                "pageSize": 20,
            },
            headers=FSA_HEADERS,
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            establishments = data.get("establishments", [])
            if establishments:
                best = max(establishments, key=lambda e: similarity(name, e.get("BusinessName", "")))
                sim = similarity(name, best.get("BusinessName", ""))
                if sim > 0.45:
                    return best
    except Exception:
        pass

    return None

def parse_rating(establishment: dict) -> tuple:
    """Extract rating value and date from FSA establishment record."""
    rating_value = establishment.get("RatingValue", "")
    rating_date_str = establishment.get("RatingDate", "")
    
    # Normalise rating value
    if rating_value in ["5", "4", "3", "2", "1", "0"]:
        rating = rating_value
    elif rating_value and "Exempt" in str(rating_value):
        rating = "Exempt"
    elif rating_value and "Awaiting" in str(rating_value):
        rating = "AwaitingInspection"
    elif str(rating_value).isdigit():
        rating = str(int(rating_value))
    else:
        rating = None

    # Parse date
    rating_date = None
    if rating_date_str:
        try:
            from datetime import datetime
            # FSA returns dates as "2023-06-01T00:00:00" or "2023-06-01"
            if "T" in rating_date_str:
                rating_date = datetime.fromisoformat(rating_date_str.split("T")[0])
            else:
                rating_date = datetime.fromisoformat(rating_date_str[:10])
        except Exception:
            pass

    return rating, rating_date

# ---------------------------------------------------------------------------
# Progress file
# ---------------------------------------------------------------------------
PROGRESS_FILE = "hygiene-progress.json"

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return set(json.load(f))
    return set()

def save_progress(done_ids):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(list(done_ids), f)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    print("Fetching Food Hygiene Ratings from FSA API...")
    print()

    conn = get_connection()
    businesses = get_businesses(conn)
    total = len(businesses)
    print(f"Found {total} businesses to process\n")

    done_ids = load_progress()
    remaining = [b for b in businesses if b[0] not in done_ids]
    print(f"Resuming: {len(done_ids)} already done, {len(remaining)} remaining\n")

    matched = 0
    not_found = 0
    errors = 0

    for i, (bid, name, postcode, address) in enumerate(remaining, 1):
        try:
            name_safe = name.encode("ascii", "replace").decode()
            est = search_fsa(name, postcode)

            if est:
                rating, rating_date = parse_rating(est)
                if rating is not None:
                    update_business(conn, bid, rating, rating_date)
                    matched += 1
                    fsa_name = est.get("BusinessName", "").encode("ascii", "replace").decode()
                    print(f"  [{i}/{len(remaining)}] {name_safe[:40]:<42} -> {rating} (matched: {fsa_name[:35]})")
                else:
                    not_found += 1
                    print(f"  [{i}/{len(remaining)}] {name_safe[:40]:<42} -> no rating data")
            else:
                not_found += 1
                if i % 20 == 0:
                    print(f"  [{i}/{len(remaining)}] ... {not_found} not found so far")

        except Exception as e:
            errors += 1
            print(f"  ERROR on {name}: {e}")

        done_ids.add(bid)

        # Save progress every 25 businesses
        if i % 25 == 0:
            save_progress(done_ids)
            print(f"    Progress saved ({i}/{len(remaining)})")

        # Be polite to the FSA API - small delay
        time.sleep(0.3)

    save_progress(done_ids)
    conn.close()

    print(f"\n{'='*50}")
    print(f"Complete!")
    print(f"  Matched with hygiene rating: {matched}")
    print(f"  Not found / no rating:       {not_found}")
    print(f"  Errors:                      {errors}")
    print(f"  Total processed:             {matched + not_found + errors}")

if __name__ == "__main__":
    main()
