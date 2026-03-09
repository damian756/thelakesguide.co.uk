#!/usr/bin/env python3
"""
Clean scraped emails in email-results.txt.
Fixes: trailing junk after TLD, leading digit prefixes, URL encoding.
Removes: known platform/placeholder/wrong-business emails.
Outputs: email-results-clean.txt with count summary.
"""

import re

INPUT_FILE  = 'email-results.txt'
OUTPUT_FILE = 'email-results-clean.txt'

# Emails that belong to the wrong business entirely
WRONG_BUSINESS = {
    'jay@discoversouthport.co.uk',   # DiscoverSouthport directory listings
    'partners@vio.com',              # Booking platform
    'info@phorest.fi',               # Booking platform
    'support@snaptrip.com',          # Booking platform
    'news@emails.britanniahotels.com', # Britannia Hotels mass mailer (4 hotels share this)
}

# Placeholder / dummy emails
PLACEHOLDERS = {
    'email@address.com',
    'mymail@mailservice.com',
}

# Unrecoverable malformed (can't determine real address)
UNRECOVERABLE = {
    'community_southport@asda.ukhave',
    '544419reception@lakesidechurch.ukmon',
    '9.30pmliverpool@trattoria51.com',
    'filler@godaddy.comhomehistorythe',
}

ALL_DELETE = WRONG_BUSINESS | PLACEHOLDERS | UNRECOVERABLE

# Compound TLDs to recognise (order: longer first)
COMPOUND_TLDS = ['co.uk', 'org.uk', 'gov.uk', 'me.uk', 'net.uk', 'hotmail.com',
                 'hotmail.co.uk', 'gmail.com', 'yahoo.co.uk', 'yahoo.com',
                 'aol.com', 'outlook.com', 'btconnect.com', 'talktalk.net']

# Simple TLDs
SIMPLE_TLDS = {'com', 'net', 'org', 'uk', 'info', 'biz', 'io',
               'kitchen', 'fi', 'fr', 'de', 'eu', 'us', 'ca', 'au', 'co'}


def clean_domain(domain_str):
    """Strip trailing junk from a domain string."""
    d = domain_str.lower()

    # Check compound TLDs first (e.g. co.uk, org.uk)
    for ctld in COMPOUND_TLDS:
        needle = '.' + ctld
        idx = d.find(needle)
        if idx != -1:
            return d[:idx + len(needle)]

    # Simple TLD: find last dot, check if what follows is TLD+junk
    last_dot = d.rfind('.')
    if last_dot == -1:
        return None
    tld_part = d[last_dot + 1:]

    # Exact match
    if tld_part in SIMPLE_TLDS:
        return d

    # Starts with a known TLD followed by junk
    for tld in sorted(SIMPLE_TLDS, key=len, reverse=True):
        if tld_part.startswith(tld) and len(tld_part) > len(tld):
            return d[:last_dot + 1 + len(tld)]

    return d  # Return as-is if nothing matched


def clean_email(raw):
    """
    Takes a raw (possibly noisy) email string and returns a clean email or None.
    """
    if not raw or '@' not in raw:
        return None

    raw = raw.strip()

    # Decode URL encoding
    raw = raw.replace('%20', '').strip()

    # If multiple emails on one line (e.g. Gusto), take the first
    parts = raw.split()
    if len(parts) > 1:
        raw = parts[0]

    raw_lower = raw.lower()

    # Delete known junk (check before cleaning so full-string patterns match)
    if raw_lower in ALL_DELETE:
        return None
    if raw_lower.startswith('filler@godaddy.'):
        return None

    at = raw.rfind('@')
    local = raw[:at]
    domain_raw = raw[at + 1:]

    # --- Fix local part ---
    # 1. Strip leading digits (e.g. 530214info -> info, 500084hanoihouse8 -> hanoihouse8)
    local = re.sub(r'^\d+', '', local)

    # 2. Strip leading noise like "3hw" before a hyphen-prefixed local
    #    Pattern: 1 digit + 2-3 lowercase letters + followed by the real local
    local = re.sub(r'^\d[a-z]{1,3}(?=[a-z])', '', local)

    if not local:
        return None

    # Validate local part contains only allowed chars
    if not re.match(r'^[a-zA-Z0-9._%+\-]+$', local):
        return None

    # --- Fix domain part ---
    domain_clean = clean_domain(domain_raw)
    if not domain_clean:
        return None

    # Basic sanity: domain must have at least one dot and only valid chars
    if '.' not in domain_clean or not re.match(r'^[a-zA-Z0-9.\-]+$', domain_clean):
        return None

    email = f"{local}@{domain_clean}"

    # Final delete check (catches things that were malformed but cleaned into a junk address)
    if email.lower() in ALL_DELETE:
        return None

    return email


def main():
    with open(INPUT_FILE, encoding='utf-8') as f:
        lines = f.readlines()

    results = []
    removed = []

    for line in lines:
        line = line.rstrip('\n')

        # Skip header lines
        if not line or line.startswith('SOUTHPORT') or line.startswith('===') or line.startswith('309') or line[0].isdigit() and 'emails' in line:
            continue

        if ':' not in line:
            continue

        # Split on first colon — everything after is the raw email
        colon = line.index(':')
        business = line[:colon].strip()
        raw_email = line[colon + 1:].strip()

        clean = clean_email(raw_email)

        if clean:
            results.append((business, clean))
        else:
            removed.append((business, raw_email))

    # Sort alphabetically by business name
    results.sort(key=lambda x: x[0].lower())

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(f'SOUTHPORT GUIDE — SCRAPED EMAILS (CLEANED)\n')
        f.write(f'{len(results)} usable emails\n')
        f.write('=' * 50 + '\n\n')
        for business, email in results:
            f.write(f'{business}: {email}\n')

    print(f'Clean emails written to {OUTPUT_FILE}: {len(results)} entries')
    print(f'Removed/invalid: {len(removed)}')
    print('\nRemoved entries:')
    for b, e in sorted(removed, key=lambda x: x[0].lower()):
        print(f'  {b}: {e}')


if __name__ == '__main__':
    main()
