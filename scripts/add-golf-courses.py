#!/usr/bin/env python3
"""Add Southport-area golf courses back to the database."""
import os
import json
import requests
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

conn_parsed = urlparse(DATABASE_URL)
conn = psycopg2.connect(
    host=conn_parsed.hostname, port=conn_parsed.port or 5432,
    database=conn_parsed.path.lstrip('/'),
    user=conn_parsed.username, password=conn_parsed.password,
    sslmode='require'
)

# Get golf category ID
with conn.cursor() as cur:
    cur.execute("SELECT id FROM \"Category\" WHERE slug = 'golf'")
    golf_cat_id = cur.fetchone()[0]

GOLF_COURSES = [
    "Royal Birkdale Golf Club Southport",
    "Southport and Ainsdale Golf Club",
    "Hesketh Golf Club Southport",
    "Hillside Golf Club Southport",
    "Southport Old Links Golf Club",
    "Southport Municipal Golf Course",
    "Formby Golf Club",
    "Formby Ladies Golf Club",
    "Formby Hall Golf Resort",
    "Hurlston Hall Golf Club",
    "Ormskirk Golf Club",
    "Scarisbrick Park Golf Club",
    "Beacon Park Golf Club",
]

def slugify(name):
    import re
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

def find_place(query):
    url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    params = {
        'input': query,
        'inputtype': 'textquery',
        'fields': 'place_id,name,formatted_address,geometry',
        'locationbias': 'circle:15000@53.6476,-3.0052',
        'key': API_KEY
    }
    resp = requests.get(url, params=params, timeout=10)
    data = resp.json()
    if data.get('status') == 'OK' and data.get('candidates'):
        return data['candidates'][0]
    return None

def get_details(place_id):
    url = 'https://maps.googleapis.com/maps/api/place/details/json'
    params = {
        'place_id': place_id,
        'fields': 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,editorial_summary',
        'key': API_KEY
    }
    resp = requests.get(url, params=params, timeout=10)
    data = resp.json()
    if data.get('status') == 'OK':
        return data.get('result', {})
    return None

import re
def extract_postcode(addr):
    m = re.search(r'[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}', addr or '', re.IGNORECASE)
    return m.group().upper().strip() if m else ''

added = 0
for query in GOLF_COURSES:
    print(f"\nSearching: {query}")
    place = find_place(query)
    if not place:
        print(f"  Not found!")
        continue
    
    place_id = place['place_id']
    name = place['name']
    address = place.get('formatted_address', '')
    lat = place.get('geometry', {}).get('location', {}).get('lat')
    lng = place.get('geometry', {}).get('location', {}).get('lng')
    
    details = get_details(place_id) or {}
    phone = details.get('formatted_phone_number')
    website = details.get('website')
    rating = details.get('rating')
    review_count = details.get('user_ratings_total')
    postcode = extract_postcode(address)
    description = (details.get('editorial_summary') or {}).get('overview')
    
    opening_hours = None
    if details.get('opening_hours'):
        oh = details['opening_hours']
        opening_hours = json.dumps({
            'weekdayText': oh.get('weekday_text', []),
            'periods': oh.get('periods', [])
        })
    
    slug = slugify(name)
    
    with conn.cursor() as cur:
        # Check if already exists
        cur.execute('SELECT id FROM "Business" WHERE slug = %s', (slug,))
        if cur.fetchone():
            print(f"  Already exists: {name}")
            continue
        
        cur.execute('''
            INSERT INTO "Business" (id, slug, name, "categoryId", address, postcode, lat, lng,
                                    phone, website, "shortDescription", "placeId", rating, "reviewCount",
                                    "openingHours", images, "listingTier", claimed, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, '{}', 'free', false, NOW(), NOW())
        ''', (slug, name, golf_cat_id, address, postcode, lat, lng,
              phone, website, description, place_id, rating, review_count,
              opening_hours))
        
    conn.commit()
    safe_name = name.encode('ascii', 'replace').decode('ascii')
    print(f"  Added: {safe_name} | {rating}/5 ({review_count} reviews) | {postcode}")
    added += 1

print(f"\nAdded {added} golf courses")

# Final count
with conn.cursor() as cur:
    cur.execute("SELECT COUNT(*) FROM \"Business\" WHERE \"categoryId\" = %s", (golf_cat_id,))
    print(f"Total golf courses: {cur.fetchone()[0]}")

conn.close()
