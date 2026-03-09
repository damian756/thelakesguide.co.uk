#!/usr/bin/env python3
"""
Scrape Southport businesses using Google Places API with GRID SEARCH.
Uses multiple overlapping search points to beat the 60-result-per-type cap.
Requires: pip install requests python-dotenv
Usage: python scripts/scrape-businesses.py
"""

import os
import csv
import math
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
if not API_KEY:
    print("Error: GOOGLE_PLACES_API_KEY not found in .env.local or .env")
    print("Get a key from: https://console.cloud.google.com/apis/credentials")
    exit(1)

# Southport coordinates (town center)
CENTER_LAT = 53.6476
CENTER_LNG = -3.0052
COVERAGE_RADIUS_KM = 10  # Overall area to cover
SEARCH_RADIUS_M = 3000   # Each grid point searches 3km radius
GRID_SPACING_KM = 4      # Grid points spaced 4km apart (overlap ensures full coverage)

# Category mapping: Google Places type -> our category slug
CATEGORY_MAP = {
    'restaurant': 'restaurants',
    'cafe': 'cafes',
    'bar': 'bars-nightlife',
    'night_club': 'bars-nightlife',
    'lodging': 'hotels',
    'bed_and_breakfast': 'hotels',
    'guest_house': 'hotels',
    'hotel': 'hotels',
    'motel': 'hotels',
    'resort_hotel': 'hotels',
    'campground': 'hotels',
    'rv_park': 'hotels',
    'tourist_attraction': 'attractions',
    'park': 'beaches-parks',
    'beach': 'beaches-parks',
    'store': 'shopping',
    'shopping_mall': 'shopping',
    'spa': 'wellness',
    'beauty_salon': 'wellness',
    'hair_care': 'wellness',
    'gym': 'wellness',
    'health': 'wellness',
    'physiotherapist': 'wellness',
    'taxi_stand': 'transport',
    'gas_station': 'transport',
    'bicycle_store': 'transport',
    'car_rental': 'transport',
    'car_wash': 'transport',
    'parking': 'transport',
    'golf_course': 'golf',
    'museum': 'attractions',
    'art_gallery': 'attractions',
    'amusement_park': 'attractions',
    'aquarium': 'attractions',
    'zoo': 'attractions',
    'movie_theater': 'attractions',
    'theater': 'attractions',
    'casino': 'attractions',
    'bowling_alley': 'activities',
    'stadium': 'activities',
    'travel_agency': 'activities',
    'bakery': 'cafes',
    'meal_takeaway': 'restaurants',
    'meal_delivery': 'restaurants',
    'food': 'restaurants',
    'department_store': 'shopping',
    'clothing_store': 'shopping',
    'jewelry_store': 'shopping',
    'shoe_store': 'shopping',
    'book_store': 'shopping',
    'florist': 'shopping',
    'gift_shop': 'shopping',
    'home_goods_store': 'shopping',
    'furniture_store': 'shopping',
    'electronics_store': 'shopping',
    'pet_store': 'shopping',
    'toy_store': 'shopping',
    'sporting_goods_store': 'shopping',
}

# High-volume types that benefit most from grid search (hit 60 cap easily)
HIGH_VOLUME_TYPES = [
    'restaurant',
    'cafe',
    'bar',
    'meal_takeaway',
    'food',
    'lodging',
    'hotel',
    'bed_and_breakfast',
    'guest_house',
    'store',
    'clothing_store',
    'beauty_salon',
    'hair_care',
    'gym',
    'health',
    'parking',
    'gift_shop',
    'home_goods_store',
    'furniture_store',
    'toy_store',
    'sporting_goods_store',
    'theater',
    'beach',
    'park',
    'golf_course',
]

# Low-volume types (single center search is enough)
LOW_VOLUME_TYPES = [
    'night_club',
    'bakery',
    'meal_delivery',
    'motel',
    'resort_hotel',
    'campground',
    'rv_park',
    'tourist_attraction',
    'museum',
    'art_gallery',
    'amusement_park',
    'aquarium',
    'zoo',
    'movie_theater',
    'casino',
    'bowling_alley',
    'stadium',
    'travel_agency',
    'shopping_mall',
    'department_store',
    'jewelry_store',
    'shoe_store',
    'book_store',
    'florist',
    'electronics_store',
    'pet_store',
    'spa',
    'physiotherapist',
    'taxi_stand',
    'gas_station',
    'bicycle_store',
    'car_rental',
    'car_wash',
]


def haversine_km(lat1, lng1, lat2, lng2):
    """Distance between two points in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def generate_grid_points():
    """Generate a grid of search points covering the target area."""
    points = []
    
    # At latitude 53.6, 1 degree lat ~ 111km, 1 degree lng ~ 65.7km
    lat_step = GRID_SPACING_KM / 111.0
    lng_step = GRID_SPACING_KM / (111.0 * math.cos(math.radians(CENTER_LAT)))
    
    # Generate grid
    lat_range = COVERAGE_RADIUS_KM / 111.0
    lng_range = COVERAGE_RADIUS_KM / (111.0 * math.cos(math.radians(CENTER_LAT)))
    
    lat = CENTER_LAT - lat_range
    while lat <= CENTER_LAT + lat_range:
        lng = CENTER_LNG - lng_range
        while lng <= CENTER_LNG + lng_range:
            dist = haversine_km(CENTER_LAT, CENTER_LNG, lat, lng)
            if dist <= COVERAGE_RADIUS_KM:
                points.append((lat, lng))
            lng += lng_step
        lat += lat_step
    
    return points


def search_places(lat, lng, place_type, radius):
    """Search for places of a given type at a specific point."""
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    params = {
        'location': f'{lat},{lng}',
        'radius': radius,
        'type': place_type,
        'key': API_KEY
    }
    
    results = []
    while True:
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get('status') not in ('OK', 'ZERO_RESULTS'):
            print(f"    Warning: {place_type} returned {data.get('status')}")
            break
        
        results.extend(data.get('results', []))
        
        next_page_token = data.get('next_page_token')
        if not next_page_token:
            break
        
        time.sleep(2)
        params = {'pagetoken': next_page_token, 'key': API_KEY}
    
    return results


def main():
    grid_points = generate_grid_points()
    
    print(f"Grid Search Scraper for Southport Businesses")
    print(f"=" * 60)
    print(f"Centre: {CENTER_LAT}, {CENTER_LNG}")
    print(f"Coverage: {COVERAGE_RADIUS_KM}km radius")
    print(f"Search radius per point: {SEARCH_RADIUS_M}m")
    print(f"Grid spacing: {GRID_SPACING_KM}km")
    print(f"Grid points: {len(grid_points)}")
    print(f"High-volume types (grid search): {len(HIGH_VOLUME_TYPES)}")
    print(f"Low-volume types (centre only): {len(LOW_VOLUME_TYPES)}")
    print(f"=" * 60)
    
    all_businesses = {}  # Dedupe by place_id
    api_calls = 0
    
    # Phase 1: Grid search for high-volume types
    print(f"\nPHASE 1: Grid search ({len(HIGH_VOLUME_TYPES)} types x {len(grid_points)} points)")
    print(f"-" * 60)
    
    for type_idx, place_type in enumerate(HIGH_VOLUME_TYPES, 1):
        type_count = 0
        print(f"\n[{type_idx}/{len(HIGH_VOLUME_TYPES)}] {place_type}...")
        
        for point_idx, (lat, lng) in enumerate(grid_points):
            places = search_places(lat, lng, place_type, SEARCH_RADIUS_M)
            api_calls += 1 + (len(places) // 20)  # Approximate page count
            
            new_count = 0
            for place in places:
                place_id = place.get('place_id')
                if place_id not in all_businesses:
                    category_slug = CATEGORY_MAP.get(place_type, 'attractions')
                    all_businesses[place_id] = {
                        'name': place.get('name', ''),
                        'category': category_slug,
                        'address': place.get('vicinity', ''),
                        'postcode': '',
                        'lat': place.get('geometry', {}).get('location', {}).get('lat'),
                        'lng': place.get('geometry', {}).get('location', {}).get('lng'),
                        'phone': '',
                        'website': '',
                        'price_range': '',
                    }
                    new_count += 1
            type_count += new_count
        
        print(f"  Total new: {type_count} | Running total: {len(all_businesses)}")
    
    # Phase 2: Single centre search for low-volume types
    print(f"\nPHASE 2: Centre search ({len(LOW_VOLUME_TYPES)} low-volume types)")
    print(f"-" * 60)
    
    for type_idx, place_type in enumerate(LOW_VOLUME_TYPES, 1):
        places = search_places(CENTER_LAT, CENTER_LNG, place_type, COVERAGE_RADIUS_KM * 1000)
        api_calls += 1 + (len(places) // 20)
        
        new_count = 0
        for place in places:
            place_id = place.get('place_id')
            if place_id not in all_businesses:
                category_slug = CATEGORY_MAP.get(place_type, 'attractions')
                all_businesses[place_id] = {
                    'name': place.get('name', ''),
                    'category': category_slug,
                    'address': place.get('vicinity', ''),
                    'postcode': '',
                    'lat': place.get('geometry', {}).get('location', {}).get('lat'),
                    'lng': place.get('geometry', {}).get('location', {}).get('lng'),
                    'phone': '',
                    'website': '',
                    'price_range': '',
                }
                new_count += 1
        
        if new_count > 0:
            print(f"  {place_type}: +{new_count} new")
    
    # Write CSV
    output_file = 'businesses.csv'
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['name', 'category', 'address', 'postcode', 'lat', 'lng', 'phone', 'website', 'price_range']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for business in all_businesses.values():
            writer.writerow(business)
    
    print(f"\n{'=' * 60}")
    print(f"COMPLETE")
    print(f"  Unique businesses: {len(all_businesses)}")
    print(f"  Approximate API calls: {api_calls}")
    print(f"  Estimated cost: ${api_calls * 0.032:.2f}")
    print(f"  Saved to: {output_file}")
    print(f"\nNext: npm run import-businesses")


if __name__ == '__main__':
    main()
