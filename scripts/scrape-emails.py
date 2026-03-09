#!/usr/bin/env python3
"""
Scrape email addresses from business websites.
Fetches homepage and contact pages, extracts emails from mailto: links and page text.
Outputs to email-scrape-results.csv. Use --write-db to update the database.

Saves progress to email-scrape-progress.json so it can resume if interrupted.
Usage: python scripts/scrape-emails.py [--write-db] [--fast]
"""

import argparse
import csv
import json
import os
import re
import time
from urllib.parse import urljoin, urlparse

import psycopg2
import psycopg2.extras
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
load_dotenv('.env.local')

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("Error: DATABASE_URL not set (check .env or .env.local)")
    exit(1)

PROGRESS_FILE = 'email-scrape-progress.json'
RESULTS_CSV = 'email-scrape-results.csv'
TIMEOUT = 8
DELAY = 0.5
DELAY_FAST = 0.1
TIMEOUT_FAST = 5

# Emails to skip (junk / generic / not business contact)
SKIP_EMAIL_PATTERNS = [
    r'noreply',
    r'no-reply',
    r'privacy@',
    r'support@(wordpress|wix|squarespace)',
    r'@(wix|squarespace|wordpress)\.',
    r'example\.com',
    r'mail\.example',
    r'@.*\.(png|jpg|gif|svg|woff|woff2)\b',  # image/asset in regex
    r'sentry@',
    r'hello@mail\.',  # generic mailers
]

# Prefer these local-part prefixes when picking "best" email
PREFERRED_PREFIXES = ['info', 'hello', 'contact', 'enquiries', 'enquiry', 'bookings', 'booking']


def connect_db():
    """Connect to Neon Postgres."""
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


def normalize_website(url):
    """Ensure URL has scheme and is ready for requests."""
    if not url or not url.strip():
        return None
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url.rstrip('/')


def get_base_url(url):
    """Get base URL for constructing contact page paths."""
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


def is_junk_email(email):
    """Return True if email should be skipped."""
    email_lower = email.lower()
    for pattern in SKIP_EMAIL_PATTERNS:
        if re.search(pattern, email_lower):
            return True
    # Skip very long or suspicious local-parts
    local, _, domain = email.partition('@')
    if len(local) > 50 or not domain or '.' not in domain:
        return True
    return False


def pick_best_email(emails):
    """From a set of valid emails, pick the best one for business contact."""
    valid = [e for e in emails if not is_junk_email(e)]
    if not valid:
        return None
    if len(valid) == 1:
        return valid[0]
    # Prefer info@, hello@, contact@, etc.
    for prefix in PREFERRED_PREFIXES:
        for e in valid:
            if e.lower().startswith(prefix + '@'):
                return e
    return valid[0]


def extract_emails_from_html(html, page_url):
    """Extract emails from HTML: mailto links first, then regex on text."""
    emails = set()
    if not html:
        return emails

    try:
        soup = BeautifulSoup(html, 'html.parser')
    except Exception:
        return emails

    # 1. mailto: links (most reliable)
    for a in soup.find_all('a', href=True):
        href = a.get('href', '').strip()
        if href.startswith('mailto:'):
            addr = href[7:].split('?')[0].strip().lower()
            if addr and '@' in addr:
                emails.add(addr)

    # 2. Regex on visible text and common email-like strings
    pattern = re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}')
    text = soup.get_text()
    for match in pattern.finditer(text):
        addr = match.group().lower()
        # Avoid matching image filenames etc
        if not re.search(r'\.(png|jpg|jpeg|gif|svg|woff|woff2)$', addr.split('@')[0]):
            emails.add(addr)

    return emails


def fetch_url(url, timeout, session):
    """Fetch URL, return (html, final_url) or (None, None) on error."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; LakesGuide/1.0; +https://thelakesguide.co.uk)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-GB,en;q=0.9',
    }
    try:
        r = session.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        r.raise_for_status()
        return (r.text, r.url)
    except Exception as e:
        return (None, None)


def scrape_emails_for_website(website, timeout, session):
    """
    Scrape emails from website: homepage first, then /contact, /contact-us.
    Returns (email_found, source_url) or (None, None).
    """
    base = normalize_website(website)
    if not base:
        return (None, None)

    base_url = get_base_url(base)
    pages_to_try = [
        base,
        urljoin(base_url, '/contact'),
        urljoin(base_url, '/contact-us'),
        urljoin(base_url, '/about'),
    ]

    all_emails = set()
    for page_url in pages_to_try[:4]:  # max 4 pages
        html, _ = fetch_url(page_url, timeout, session)
        if html:
            all_emails.update(extract_emails_from_html(html, page_url))
            if all_emails:
                best = pick_best_email(all_emails)
                if best:
                    return (best, page_url)

    best = pick_best_email(all_emails)
    if best:
        return (best, pages_to_try[0])
    return (None, None)


def init_results_csv(path):
    """Write CSV header if file is new."""
    if not os.path.exists(path):
        with open(path, 'w', newline='', encoding='utf-8') as f:
            w = csv.writer(f)
            w.writerow(['id', 'name', 'category', 'website', 'email_found', 'source_url'])


def append_result_csv(path, row):
    """Append a result row to CSV."""
    with open(path, 'a', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(row)


def update_business_email(conn, business_id, email):
    """Update business record with scraped email."""
    with conn.cursor() as cur:
        cur.execute('''
            UPDATE "Business" SET "email" = %s, "updatedAt" = NOW()
            WHERE "id" = %s
        ''', (email, business_id))
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description='Scrape emails from business websites')
    parser.add_argument('--write-db', action='store_true', help='Write found emails back to database')
    parser.add_argument('--fast', action='store_true', help='Faster scraping (shorter delay, shorter timeout)')
    args = parser.parse_args()

    delay = DELAY_FAST if args.fast else DELAY
    timeout = TIMEOUT_FAST if args.fast else TIMEOUT

    print("Scraping emails from business websites")
    print("=" * 60)
    print(f"Output: {RESULTS_CSV}")
    if args.write_db:
        print("Mode: WILL update database with found emails")
    else:
        print("Mode: CSV only (use --write-db to update database)")
    print(f"Timing: delay={delay}s, timeout={timeout}s")
    print("=" * 60)

    progress = load_progress()
    processed_ids = set(progress.get('processed', []))
    failed_ids = set(progress.get('failed', []))

    print(f"Previously processed: {len(processed_ids)}")
    print(f"Previously failed: {len(failed_ids)}")

    conn = connect_db()
    print("Connected to database")

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("""
            SELECT b.id, b.name, b.website, c.name as category_name
            FROM "Business" b
            JOIN "Category" c ON c.id = b."categoryId"
            WHERE b.website IS NOT NULL AND b.website != ''
              AND (b.email IS NULL OR b.email = '')
            ORDER BY b.name
        """)
        businesses = cur.fetchall()

    total = len(businesses)
    to_process = [b for b in businesses if b['id'] not in processed_ids]

    print(f"Total with website, no email: {total}")
    print(f"To process: {len(to_process)}")
    print("=" * 60)

    init_results_csv(RESULTS_CSV)

    start_time = time.time()
    found_count = 0
    failed_count = 0
    session = requests.Session()

    for i, business in enumerate(to_process):
        biz_id = business['id']
        biz_name = business['name']
        website = business['website']
        category = business['category_name'] or ''

        safe_name = biz_name.encode('ascii', 'replace').decode('ascii')
        print(f"\n[{i+1}/{len(to_process)}] {safe_name}")

        email, source_url = scrape_emails_for_website(website, timeout, session)

        if email:
            print(f"  Found: {email}")
            found_count += 1
            append_result_csv(RESULTS_CSV, [biz_id, biz_name, category, website, email, source_url or website])
            if args.write_db:
                try:
                    update_business_email(conn, biz_id, email)
                except Exception as e:
                    print(f"  DB update error: {e}")
                    conn.rollback()
        else:
            print(f"  No email found")
            append_result_csv(RESULTS_CSV, [biz_id, biz_name, category, website, '', ''])

        processed_ids.add(biz_id)
        progress['processed'] = list(processed_ids)
        save_progress(progress)

        time.sleep(delay)

        if (i + 1) % 10 == 0:
            elapsed = time.time() - start_time
            rate = (i + 1) / elapsed if elapsed > 0 else 0
            remaining = (len(to_process) - i - 1) / rate if rate > 0 else 0
            print(f"\n  Progress: {i+1}/{len(to_process)} | Found: {found_count} | Elapsed: {elapsed:.0f}s | ETA: {remaining:.0f}s")

    conn.close()

    elapsed = time.time() - start_time
    print(f"\n{'=' * 60}")
    print(f"COMPLETE in {elapsed:.0f}s")
    print(f"  Emails found: {found_count}/{len(to_process)}")
    print(f"  Results saved to: {RESULTS_CSV}")


if __name__ == '__main__':
    main()
