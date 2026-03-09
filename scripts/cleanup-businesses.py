#!/usr/bin/env python3
"""
Remove non-visitor-economy businesses from the database.
Per the brief: INCLUDE restaurants, hotels, bars, cafes, attractions,
beaches, shopping, golf, activities, wellness, transport.
EXCLUDE plumbers, solicitors, B2B services, medical.
"""
import os
import re
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
conn_parsed = urlparse(DATABASE_URL)
conn = psycopg2.connect(
    host=conn_parsed.hostname, port=conn_parsed.port or 5432,
    database=conn_parsed.path.lstrip('/'),
    user=conn_parsed.username, password=conn_parsed.password,
    sslmode='require'
)

# ---- BUSINESSES TO DELETE (exact or near-exact name matches) ----
DELETE_NAMES = [
    # Airbnb / individual holiday lets (not actual businesses)
    "1 bedroom accommodation in Churchtown, near Southport",
    "2 Bed in Formby 90263",
    "2 bedroom accommodation in Halsall, near Ormskirk",
    "23 Eden - Lovely 2 bed apartment with free onsite parking - Two-Bedroom Apartment",
    "6 Bed in Ainsdale oc-w33455 - Six-Bedroom House",
    "88 The Bungalow - One-Bedroom House",
    "Amazing Two Bedroom Apartment - SR - Two-Bedroom Apartment",
    "Another Place - One-Bedroom House",
    "Barn 1 - Three-Bedroom House",
    "Cosy 4 bedroom house - Four-Bedroom House",
    "Cosy Family Home in the Heart of Birkdale",
    "Cosy Family Home near Southport Beach and Lord St - Three-Bedroom House",
    "EXCLUSIVE Holiday Home - Three-Bedroom Apartment",
    "Formby Point - One-Bedroom House",
    "Lakeside View - One-Bedroom Apartment",
    "Lakeview Apartment, central location, Sea and Lake view, free parking WiFi - One-Bedroom Apartment",
    "Lakeview Court, Sea and Lake view, free parking",
    "Let It Be - Two-Bedroom House",
    "Lovely 4 Bedroom Private Apartment - Apartment",
    "Rural Family Farmhouse with Countryside views - Six-Bedroom House",
    "Santiago 4 - Free Parking Wi-Fi - One-Bedroom Apartment",
    "Santiago Suite 4 - A Beautiful Duplex Flat - One-Bedroom Apartment",
    "STAY - at Southport Holiday Home",
    "STAY - at Southport Holiday Home - sleeps 6 - Three-Bedroom House",
    "Strawberry Fields - Three-Bedroom House",
    "The Hideaway - One-Bedroom Apartment",
    "The Hideaway Southport - Two-Bedroom House",
    "The Little Bear Apartment Birkdale Village - Two-Bedroom Apartment",
    "The Santiago Suite - sleeps 10",
    "Twin One bedroom apartment Sleep 2",
    "Woodland Escapes Glamping - Lake View - One-Bedroom Apartment",
    "Rooms@ Remedy 2 bedroom (sleeps 5) apartment",
    "Rooms@ Remedy 2 bedroom (sleeps 5) apartment - Two-Bedroom Apartment",
    "2 Bedroom Beachside House Sleeps 4 - Private Patio",

    # Parking lots (not visitor businesses)
    "113 School Ln Parking",
    "Esplanade Parking",
    "Foul Ln Parking",
    "Marine Drive Parking",
    "MARTLANDS PARKING",
    "West Street Parking",
    "100 Segars Lane Ainsdale",

    # Medical / dental / health services
    "10Dental",
    "Ainsdale Medical Centre",
    "Ainsdale Physiotherapy",
    "Birkdale Physiotherapy Centre",
    "Dr R N A Wood - Ainsdale Medical Centre",
    "MBody Physiotherapy UK",
    "National Dental Supplies Ltd",
    "North Meols Medical Centre",
    "RENPHYS PHYSIOTHERAPY",
    "Remedi Physiotherapy",
    "Southport & Tarleton Physiotherapy Services",
    "Southport Physiotherapy",
    "The Village Dental & Implant Practice",
    "Andrew Willetts Opticians",
    "David H Myers Opticians Churchtown",
    "Vision Express Opticians at Tesco - Southport Town",
    "iview Opticians",

    # Pharmacies
    "Cambridge Road Pharmacy",
    "Rowlands Out Patients Pharmacy",
    "St Marks Pharmacy",
    "Sedem Pharmacy",
    "Tesco Pharmacy",
    "Woolleys Internet Pharmacy",

    # Plumbers / trades / B2B
    "AMS Plumbers Merchants Southport",
    "Alan Francis Landscapes",
    "Alarm Technology Co",
    "Creative Landscapes - Landscaping Services Southport",
    "Crossens Plumbing & Heating",
    "Daves Tyres and Exhausts",
    "Dyson's Bathrooms and Plumbing Supplies",
    "Gmac Plumbing & Gas Services",
    "Gregs heating and plumbing",
    "JSD Plumbing and Property Maintenance",
    "John Wilson Roofing & Property Services",
    "K B Decking & Landscaping",
    "Kelly's Plumbing Services",
    "MAL Plumbing And Heating",
    "Mr Clutch Autocentres",
    "P.Berry Trees & Landscapes",
    "Preston City Accountants",
    "Southport Heating and Plumbing Services",
    "Tag Building & Landscaping Services",
    "Vision Landscapes",
    "plumbers in southport",
    "Karen Potter The Estate Agent",

    # Car dealers
    "Chapelhouse MG Southport",
    "Chapelhouse OMODA & JAECOO Southport",
    "Chapelhouse Suzuki Southport",
    "Group 1 Toyota Southport",

    # Funeral directors
    "Howard's Funeral Directors",
    "Moisters, Co-op Funeralcare",

    # Schools / nurseries / education
    "Banks St Stephen's Church of England Primary School",
    "Chatterbox Private Day Nursery",
    "Halsall St Cuthbert's Church of England Primary School",
    "Into the Ark Forest School",
    "New Lane Pace Nursery",
    "Password Driving School",
    "Pinfold Primary School",
    "Scarisbrick Hall School",
    "Shoreside County Primary School",
    "Southport College",
    "Tarleton Mere Brow Church of England Primary School",
    "by New Lane Pace Nursery",

    # Churches (non-attraction)
    "Bescar Lane Methodist Church",
    "Bescar Methodist Church",
    "Russell Road Methodist Church",

    # Post offices
    "Banks Post Office",
    "Bescar Post Office",
    "Birkdale Post Office",
]

# Now find more via patterns that are clearly non-visitor
PATTERN_DELETE = [
    # Names that are just addresses
    r'^\d+\s+\w+\s+(lane|road|street|avenue|drive|close|way|crescent|terrace|place|court|grove)$',
    # Generic "X bedroom Y" Airbnb listings
    r'^\d+\s+bed(room)?\s+',
    r'-\s+(one|two|three|four|five|six|seven|eight)-bedroom\s+(house|apartment|flat|cottage)$',
]

compiled_patterns = [re.compile(p, re.IGNORECASE) for p in PATTERN_DELETE]

# These should NOT be deleted even if patterns match
PROTECT_NAMES = {
    "The Stamford Southport",       # Wetherspoons pub
    "Pleasureland Motorhome Parking", # At the attraction - remove on second thought
    "Birkdale Holiday Homes",       # Keep if it's an agency
    "Martin Lane Farm Holiday Cottages",  # Legitimate accommodation
    "Martin Lane Farm - Self Catering Holiday Cottages",
    "Tristrams Farm Holiday Cottages",
    "Barford House - 2nd Floor Self-Catering Accommodation Southport",
    "Barford House - Front Self-Catering Apartment Southport",
    "Old Hollow Cottage - Holiday Home",
    "The Coach House - Holiday Home",
    "Cumberland House - Holiday Home",
    "Chase Heys Cottage - Two-Bedroom Holiday Home",
}

# Build full delete set
delete_set = set(DELETE_NAMES)

with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
    cur.execute('SELECT id, name FROM "Business" ORDER BY name')
    businesses = cur.fetchall()

# Add pattern-matched ones
for b in businesses:
    name = b['name'] or ''
    if name in PROTECT_NAMES:
        continue
    if name in delete_set:
        continue
    for pattern in compiled_patterns:
        if pattern.search(name):
            delete_set.add(name)
            break

# Confirm what we're deleting
to_delete = []
for b in businesses:
    if b['name'] in delete_set:
        to_delete.append(b)

print(f"Total businesses in DB: {len(businesses)}")
print(f"Will delete: {len(to_delete)}")
print(f"Will remain: {len(businesses) - len(to_delete)}")
print()

for b in sorted(to_delete, key=lambda x: x['name']):
    print(f"  DELETE: {b['name']}")

print()
confirm = input("Proceed with deletion? (yes/no): ")
if confirm.lower() != 'yes':
    print("Aborted.")
    conn.close()
    exit(0)

# Delete
deleted = 0
for b in to_delete:
    with conn.cursor() as cur:
        cur.execute('DELETE FROM "Business" WHERE id = %s', (b['id'],))
    deleted += 1

conn.commit()
conn.close()

print(f"\nDeleted {deleted} non-visitor businesses.")
print(f"Remaining: {len(businesses) - deleted}")
