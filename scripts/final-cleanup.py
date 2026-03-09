#!/usr/bin/env python3
"""
Final cleanup pass:
1. Remove remaining non-visitor businesses
2. Fix miscategorized businesses (move to correct category)
3. Delete the broken golf car park entry
"""
import os
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

# ---- STEP 1: Delete remaining non-visitor businesses ----
DELETE_NAMES = [
    # B2B / Professional still in restaurants
    "Helen J Guest Accounting",
    "Harrowden Turf Ltd",
    "Imageroom Studios",
    "Smithy Mushrooms Ltd",
    "Flavourfresh Salads Ltd",
    "ProTree Professional Arborists",
    "STORE CARD PPI",
    "See Through Window Cleaning",
    "Southport Alarms",
    "Southport Business Network",
    "Kitchen Colours",
    "Rockwave Fireworks",
    "Cornelius Coco Alasu",
    "Arden College Southport",
    "Star of Hope",
    "green tree world",
    
    # Wrong type entirely
    "Bescar Lane Train Station (BES) - Station managed by NORTHERN",
    "Crossens Community Association",
    "Elixir Skin Clinic Ltd",
    "JKLavish Beauty& Aesthtics",
    "Burscough Heritage Group",
    
    # Non-visitor from shopping
    "A-base Computers",
    "Abbingdon Global Ltd",
    "Active AV Ltd",
    "Aftercare",
    "All Cars & Vans Wanted Nationwide",
    "Alison Paul Designs",
    "Alison Paul Designs Ltd",
    "Amplifon Hearing Centre Southport",
    "Art Boxing Co.",
    "Artisanal Studio Co",
    "B H Autos",
    "Becky Blinds",
    "Beeline Products Ltd",
    "Betta Living Southport",
    "Bloom Baby Classes (Banks)",
    "Body Mech",
    "Booker Southport",
    "Capital Workwear and Site Supplies",
    "Chorley Group Ormskirk Hyundai",
    "Chorley Group Ormskirk Peugeot",
    "Churchtown Carpets",
    "Claire Williams BA Hons DipMus CertEd",
    "Classic Upholstery",
    "Company Mobiles",
    "Connard & Son Ltd",
    "Cosy Beds and Bedrooms",
    "Crafts and Quilts",
    "Craftsman Interiors",
    "C.D. Berry TV",
    "CHVRCH motorcycles",
    "Checkers Discount D I Y Ltd",
    "Kfit Bathrooms",
    "Kitchen Fitter Southport",
    "Kitchen Services Southport Ltd",
    "Kutchentechnik Designer Kitchens and Bedrooms Southport Merseyside",
    "Northcrown Computers Ltd",
    "One Stop Signs and Graphix",
    "PRINT'n'GIFT UK",
    "Preloved mobility shop ltd",
    "Red Lion Caravan Centre",
    "SCC Southport Ltd, Ecig Shop on the Bridge",
    "Sophie & Anna Maddocks Dressmakers, Bridal Designers, Clothing Repairs & Alterations",
    "Southport Market Blinds Ltd",
    "Streets Workshop",
    "The Carpet Shop Southport",
    "The Fitted Bedroom Specialists",
    "Thomas Bathrooms",
    "Thomas Howie Kitchens and Bedrooms LTD",
    "V & B Bathrooms",
    "Wedding Dress Alterations Liverpool",
    "Blazes Fireplace Centres",
    "Birkdale Stained Glass",
    
    # Transport non-visitor (valeting, detailing, staff car parks)
    "AutoSpa Mobile Valeting & Detailing",
    "Wright Detail (detailing & valeting)",
    "Wright Motor",
    "Staff car park (Southport Hospital)",
    "Smedley Hydro - Staff Car Park Entrance",
    "Tesco Automatic Car Wash",
    "Asda Scarisbrick Express Petrol",
    "Morrisons Petrol Station",
    "Tesco Petrol Station",

    # Activities that are not activities  
    "Horse Drawn Carriages North West Ltd",
    "White Swan Lancashire",
    
    # Golf wrong entry
    "Birkdale Station Car Park",
    "Birch Contracting Services Ltd",
    "Birchall Blackburn Law",
    
    # Still remaining non-visitor
    "Ainsdale Home, Garden & Diy",
    "Albany buildings",
    "Alec Robertshaw",
    "Alex Calveley",
    "D H Williams Agencies",
    "Amlb ltd",
    "Auto-Mobile Valeting",
    "Autopoint service station",
    "Concierge Claims Management Limited",
    "Southport Dogs Superstore",
    "Southport Golf Academy",  # keep only if actual golf range
    "Motorsport Travel",
    "Southport Meols Cop Argos (Inside Sainsbury's)",
    "Tesco Esso Express",
    "Harrison Leisure",
    "Southport K&B",
    
    # Misc that shouldn't be on a visitor guide
    "Empowered Bumps Antenatal, Hypnobirthing & Pregnancy Classes, Baby Massage & Baby Yoga",
    "Hair Loss Laser Group",
    "Recover Room Southport",
    "Cherry Tree Clinic, Treatment Rooms",
    "Southport Bowen Therapy",
    "Southport Hypno-health",
    "Pain Clinic Plus",
    "accu-health",
    "Lose Weight Hypnotherapy",
    "National Stop Smoking Centres",
    "Home Instead West Lancashire & Chorley | Home Care & Personal Care",
]

# ---- STEP 2: Fix categories (move to correct category) ----
RECATEGORIZE = {
    # Hotels currently in restaurants
    "hotels": [
        "Premier Inn Southport (Ormskirk) hotel",
        "Premier Inn Southport Central hotel",
        "Prince of Wales Hotel Southport",
        "Royal Clifton Hotel Southport",
        "Scarisbrick Hotel Southport",
        "Dukes Folly Hotel",
        "Old Hollow Cottage - Holiday Home",
        "Pontins Southport Holiday Park",
        "Formby Hall Golf Resort & Spa",
        "Freshfield Caravan Park",
    ],
    # Attractions currently in restaurants
    "attractions": [
        "Southport Air Show",
        "Southport Eco Centre",
        "Eden Play",
        "Freshfield Dune Heath Nature Reserve",
        "FUNdamental Football (Birkdale)",
        "WACA Recreation Centre",
        "H2o Zon Swimming Pool",
        "Shirdley Hill Activity Centre",
        "Rev2race",
        "Big Wheel Southport",
        "Gifts & Things Within Vincents Garden Centre",
        "Betfred",
        "Halsall West End Cricket Club",
        "SOUTHPORT ARGYLE LAWN TENNIS CLUB",
        "Sephton Farm Fisheries",
        "Dobbies Garden Centre Southport",
        "John Nolan Antiques",
    ],
    # Activities currently in restaurants
    "activities": [
        "Southport Boat Angling Club",
        "Southport Sailing Club",
        "Halsall Riding & Livery Centre",
    ],
    # Bars currently in restaurants
    "bars-nightlife": [
        "Taylors Continental Beer and Wine Bar",
        "The Conservatory Bar",
        "The Pines Bar",
        "Tipple Bar",
        "Union club",
        "The Lakeside (on tour)",
        "Sandon Crown",
        "The Imperial",
        "The Richmond",
        "The Dolphin",
        "The Kicking Donkey",
        "The Legh Arms",
        "The Mount Pleasant",
        "The Marsh Harrier",
        "The Thatch and Thistle",
        "Bold Arms",
    ],
    # Cafes currently in restaurants
    "cafes": [
        "Joarr Emporium Cafe & Takeaway",
        "Westminster Tea Rooms",
        "The Tearoom at Scarisbrick Marina",
        "Harbour Cafe . Bar",
        "Remedy Churchtown",
        "Langberry's Sandwich & Coffee Shop",
    ],
    # Transport currently in restaurants
    "transport": [
        "Mere Brow Taxis",
        "Central Cabs",
    ],
    # Beaches/parks
    "beaches-parks": [
        "Wild Root",
        "Ainsdale Village Park",
    ],
    # Shopping currently in restaurants
    "shopping": [
        "Barton Butchers (W. Barton & Sons Ltd)",
        "The Lions Shop",
        "The Pet Hut",
        "Penelope's Birkdale",
        "Wheelwrights Shop",
        "Scott Drive Superstore",
        "SPAR G & E Ormskirk",
        "One Stop",
        "One Stop Rufford Road Crossens",
        "Lidl",
        "Co-op Food - Banks - Hoole Lane",
    ],
}

# Execute deletions
with conn.cursor() as cur:
    deleted = 0
    for name in DELETE_NAMES:
        cur.execute('DELETE FROM "Business" WHERE name = %s', (name,))
        if cur.rowcount > 0:
            deleted += cur.rowcount
    conn.commit()
    print(f"Deleted {deleted} non-visitor businesses")

# Execute recategorizations
with conn.cursor() as cur:
    moved = 0
    for target_cat, names in RECATEGORIZE.items():
        # Get target category ID
        cur.execute('SELECT id FROM "Category" WHERE slug = %s', (target_cat,))
        row = cur.fetchone()
        if not row:
            print(f"  WARNING: Category '{target_cat}' not found!")
            continue
        cat_id = row[0]
        
        for name in names:
            cur.execute('UPDATE "Business" SET "categoryId" = %s WHERE name = %s', (cat_id, name))
            if cur.rowcount > 0:
                moved += cur.rowcount
                safe = name.encode('ascii', 'replace').decode('ascii')
                print(f"  Moved '{safe}' -> {target_cat}")
    conn.commit()
    print(f"\nRecategorized {moved} businesses")

# Final count
with conn.cursor() as cur:
    cur.execute('SELECT COUNT(*) FROM "Business"')
    total = cur.fetchone()[0]
    
    cur.execute('''
        SELECT c.slug, c.name, COUNT(b.id) 
        FROM "Category" c 
        LEFT JOIN "Business" b ON b."categoryId" = c.id 
        GROUP BY c.slug, c.name 
        ORDER BY COUNT(b.id) DESC
    ''')
    cats = cur.fetchall()

print(f"\n{'='*50}")
print(f"FINAL TOTALS: {total} businesses")
print(f"{'='*50}")
for slug, name, count in cats:
    print(f"  {name:25} {count:4}")

conn.close()
