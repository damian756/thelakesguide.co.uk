#!/usr/bin/env python3
"""
Audit businesses in the database - flag ones that don't belong in a visitor guide.
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

# Patterns that indicate NON-visitor businesses
EXCLUDE_PATTERNS = [
    # Airbnb / holiday rental listings (not actual businesses)
    r'^\d+\s+bed(room)?\s+',
    r'bedroom\s+(house|flat|apartment|accommodation|beachside|cottage)',
    r'sleeps\s+\d+',
    r'two-bedroom|three-bedroom|one-bedroom',
    r'cosy\s+(family\s+)?home',
    r'lovely\s+\d+\s+bed',
    r'private\s+(patio|garden|parking)',
    r'holiday\s+(let|home|cottage|rental)',
    r'self[- ]catering',

    # Parking
    r'parking\s*(lot|space|area)?$',
    r'^\d+\s+\w+\s+(ln|lane|st|street|rd|road)\s+parking',
    r'car\s+park$',

    # Medical / dental / health services (not visitor)
    r'dental|dentist',
    r'surgery$',
    r'physiotherap',
    r'chiropract',
    r'osteopath',
    r'optician',
    r'pharmacy$',
    r'medical\s+centre',
    r'health\s+centre',
    r'doctors?$',
    r'gp\s+surgery',
    r'veterinar|vets?$',

    # B2B / trades / non-visitor services
    r'alarm\s+tech',
    r'landscape|landscaping',
    r'accountant|solicitor|lawyer',
    r'plumber|plumbing|electrician|roofing',
    r'insurance',
    r'funeral',
    r'estate\s+agent',
    r'lettings?\s+agent',
    r'recruitment',
    r'printing|print\s+shop',

    # Car dealers / garages
    r'car\s+dealer',
    r'(hyundai|suzuki|ford|vauxhall|toyota|honda|kia|bmw|audi|mg|omoda|jaecoo)\s+(southport|formby|birkdale)',
    r'chapelhouse\s+(mg|suzuki|omoda|ford|hyundai)',
    r'mot\s+centre',
    r'tyres?\s+(and|&)',
    r'autocentre|auto\s+centre',

    # Churches / religious buildings (not visitor attractions unless notable)
    r'methodist\s+church',
    r'baptist\s+church',
    r'kingdom\s+hall',

    # Post offices / council offices
    r'post\s+office$',
    r'council\s+office',
    r'job\s*centre',

    # Schools / education
    r'school$|academy$|college$|nursery$|childminder',
    r'pre[- ]school',

    # Storage / industrial
    r'self\s+storage|storage\s+unit',
    r'skip\s+hire',
    r'waste\s+disposal',

    # Generic addresses (not real business names)
    r'^\d+\s+\w+\s+(lane|road|street|avenue|drive|close|way)$',
]

# Keywords in name suggesting visitor-relevant (override excludes)
KEEP_PATTERNS = [
    r'hotel|inn$|b\s*&\s*b|guest\s*house',
    r'restaurant|bistro|brasserie|grill|kitchen',
    r'bar$|pub$|lounge|cocktail|tapas',
    r'cafe|coffee|tea\s+room',
    r'museum|gallery|theatre|theater|cinema',
    r'beach|park$|garden|pier|promenade',
    r'golf|bowling|leisure|spa|gym|fitness',
    r'shop|boutique|store|market',
    r'salon|barber|beauty|nails',
    r'takeaway|pizza|kebab|chinese|indian|thai|fish\s+&\s+chips',
    r'bakery|patisserie|deli',
    r'campsite|caravan|holiday park',
    r'travel\s+agent|tours?$',
    r'taxi|bus\s+station|train\s+station|ferry',
]

compiled_exclude = [re.compile(p, re.IGNORECASE) for p in EXCLUDE_PATTERNS]
compiled_keep = [re.compile(p, re.IGNORECASE) for p in KEEP_PATTERNS]

with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
    cur.execute('SELECT id, name, address, "shortDescription" FROM "Business" ORDER BY name')
    businesses = cur.fetchall()

flagged = []
airbnb_count = 0
medical_count = 0
b2b_count = 0
car_count = 0
other_count = 0

for b in businesses:
    name = b['name'] or ''

    # Check if it should be kept (visitor relevant)
    keep = False
    for pattern in compiled_keep:
        if pattern.search(name):
            keep = True
            break

    if keep:
        continue

    # Check if it matches exclude patterns
    for pattern in compiled_exclude:
        if pattern.search(name):
            reason = pattern.pattern
            flagged.append({'id': b['id'], 'name': name, 'address': b['address'], 'reason': reason})
            
            if 'bed' in reason or 'sleep' in reason or 'home' in reason or 'holiday' in reason or 'patio' in reason or 'self' in reason or 'lovely' in reason or 'bedroom' in reason:
                airbnb_count += 1
            elif 'dental' in reason or 'surgery' in reason or 'physio' in reason or 'optician' in reason or 'medical' in reason or 'doctor' in reason or 'vet' in reason or 'pharmacy' in reason:
                medical_count += 1
            elif 'alarm' in reason or 'landscape' in reason or 'accountant' in reason or 'plumber' in reason or 'insurance' in reason or 'funeral' in reason or 'estate' in reason or 'recruit' in reason or 'print' in reason:
                b2b_count += 1
            elif 'hyundai' in reason or 'suzuki' in reason or 'chapelhouse' in reason or 'mot' in reason or 'tyre' in reason or 'auto' in reason or 'ford' in reason:
                car_count += 1
            else:
                other_count += 1
            break

print(f"Total businesses: {len(businesses)}")
print(f"Flagged for removal: {len(flagged)}")
print(f"  Airbnb/holiday lets: {airbnb_count}")
print(f"  Medical/dental: {medical_count}")
print(f"  B2B/trades: {b2b_count}")
print(f"  Car dealers/garages: {car_count}")
print(f"  Other: {other_count}")
print(f"\nKept (visitor-relevant): {len(businesses) - len(flagged)}")
print(f"\n--- FLAGGED BUSINESSES ---")
for f in flagged:
    print(f"  [{f['reason'][:30]:30}] {f['name']}")

conn.close()
