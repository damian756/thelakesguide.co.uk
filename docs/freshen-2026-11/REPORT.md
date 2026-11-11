# The Lakes Guide freshen-up, November 2026

**Standing rule** (Damian, 11 Nov 2026): "their only goal is to drive traffic, we dont need to focus much on conversion, but just raw numbers. Having high traffic is what will sell the advert space locally". Every choice below is judged by visits from search; see "Traffic: what to do next".

Internal report. Work done on 11 Nov 2026 on `main`. Screenshots are in `docs/freshen-2026-11/screens/`: JPEG, scaled to 720 px wide (shot at 1440) and 312 px wide (shot at 390). Sources are in `docs/freshen-2026-11/sources/`: `fc-` files are fact checks, `biz-` files are businesses' own websites, and the rest are post sources. The playbook is `docs/GUIDE-SITES-PLAYBOOK-2026-11.md`, section 9 for the Lakes sites.

**Stage 1** (live): `e5095d0` contact address on privacy and terms; `3a7d68d` the contact form delivers to damian@churchtownmedia.co.uk, with no email address shown anywhere.

**Hub mail and security** (pushed):
- `addb8bf`: hub mail sends from the verified stand-in sender, every send checked, every typed value escaped.
- `6ca2865`: password reset email sends; the answer is the same whether or not the address exists.
- `5886597` and `72f6d1f`: review cards and the hub reviews page send only the fields a card shows (no reviewer email, tokens, IP, receipt or full surname). Nothing had been exposed: the database has no reviews.
- `78251f8`: dependencies (section 11).

**Stage 2** (pushed; hashes after the rebase onto the hub-mail work):
- `6d5c8fe` page counts, Ahrefs only, footer duplicate key fixed
- `0d16049` pages
- `e5a85c0` posts and home, two new posts
- `d9dde78` town pages and calls to action
- `64a0b7d` screenshots and source captures

**Review round** (pushed):
- `e1fed51` sitemap rules and page counts
- `42308f2` review fixes
- `c25930e` reset link fallback; no cron for a route that does not exist
- `543c1cf` search fixes
- `1323845` en-GB, preconnects, Hike link
- `1a980aa` screenshots
- `c8a0ee5` and `9a0b3fb` privacy (last in that push)

**Tonight** (on origin `9a0b3fb`):
- `77f6de0` recheck follow-ups
- `9688a35` advertising, stage B (section 7)
- `b8bc309` advertising screenshots
- `333923c` illustrations (section 12)
- `4d325e5` illustration screenshots
- `e191239` final review fixes (section 4)
- `ac5bd70` server code in London (`"regions": ["lhr1"]` in `vercel.json`; crons unchanged). Live responses had shown `lhr1::iad1`: the visitor reached London but the server code ran in Washington, while the database is in London. After the deploy a dynamic route such as `/api/count` should answer `lhr1::lhr1`; if it does not, revert that line.
- review-fix screenshots `fix-*`, then this report with the playbook and `AGENTS.md` (documents only)
- privacy: the full Ahrefs sentence
- terms: 5.2 says Pro is not on sale yet (last)

The SEO pass (section 14) follows as its own push once this is live.

## 1. What was found (ranked)

### 1. Wrong visitor facts
These were in the posts, the town pages, the things-to-do, kids, dog-friendly, rainy-day, walks and wildlife pages, and the category intros.

**Museums and leisure**
- Keswick Museum was called "free" in four places. It charges £8.50 for adults, closes from 24 Dec 2026 to 31 Jan 2027, and its postcode is CA12 4NF, not CA12 5NJ.
- The Derwent Pencil Museum was recommended in six places but is closed while it moves.
- "Keswick leisure centre... 25m pool": Everyone Active now runs only a gym there.

**Wildlife**
- "RSPB Haweswater: ospreys, reintroduced 2010, free hide." The RSPB and Wild Haweswater pages say none of this, and say there are no public hides or viewpoints.
- Dodd Wood "nest visible from the viewpoint": the National Park says the ospreys now nest somewhere less visible.

**Boats**
- Ullswater:
  - The site said "Victorian steam-powered" and "SS Raven"; the boats were converted to diesel in the 1930s.
  - The site said dogs travel "at no extra charge"; dogs pay £1.50.
  - The site gave the season as "Easter to October"; the boats sail 363 days a year.
  - The Aira Force pier is shut until 2027.
- "Waterhead pier is a 20-minute walk from Windermere town": Waterhead is at Ambleside.
- "Windermere Steamers": the operator is Windermere Lake Cruises.

**Transport**
- "Penrith 30 min" and "554 from Penrith": the bus is the X4/X5 and takes 45 minutes.
- "Direct train" from London to Windermere: you change at Oxenholme.

**Postcodes**
- Jetty Museum: LA23 1BN.
- Tarn Hows main car park: LA22 0PW.
- Old Dungeon Ghyll: LA22 9JY.
- Grasmere car park: LA22 9SW.
- Glenridding (Beckside car park): CA11 0PD.
- Waterhead: LA22 0EY.
- Keswick market: CA12 5JR.
- Eight business postcodes were also wrong.

**Distances and places**
- Tarn Hows "1.5 miles, flat": the National Park gives 3.29 km, with slopes up to 1 in 5.
- Brockhole was described as the National Park's visitor centre with free grounds. The Park leased the site out in 2025, BeWILDerwood is listed as coming soon, and parking is charged.

**Rules and safety**
- "Wild camping legal": it needs the landowner's permission.
- Scafell Pike gave an unsourced 310-degree compass bearing for the descent. That is dangerous if wrong, so it was removed.

**Other**
- Castle Crag was called a "100-metre outcrop"; it is 290 m.
- The current Wainwright guidebooks are published by Frances Lincoln (Quarto).
- Rheged has no "climbing wall".

### 2. Named businesses ranked or criticised
- **Titles and badges:**
  - The posts "Best Restaurants in Keswick", "Best Pubs in Ambleside" and "Best Family Days Out".
  - "Best restaurant", "Best pub" and "Most characterful" badges on all five town pages.
  - Three placeholder guides titled "Best Restaurants/Cafés/Pubs".
- **Judgements:** "the gold standard", "the best museum building", "None of them are cheap", "better than the Bowness equivalents".
- **Closed, renamed or misplaced businesses:**
  - Morrels: closed.
  - Derwentwater Independent Hostel: now Barrow House, reopening 2027.
  - The Porthole: now Porto.
  - Glenridding Hotel: now The Ullswater Inn.
  - Fish Inn: renamed.
  - Rowan Tree: not found.
  - Fellpack: listed in Ambleside but is in Keswick.
  - The Mortal Man (Troutbeck): was heading the Keswick list.

### 3. Unprovable claims
- **Titles:** "The Complete Visitor Guide" in every page title, and "Your definitive guide".
- **Who writes it:** "updated regularly by people who live here", "Written by locals", "walked the fells for decades".
- **Freshness:** "Updated Daily" with a pulsing dot, "Updated weekly", "New guides added every week".
- **Standing:** "fastest-growing", "Verified by Google", "the guide the tourism boards don't write".
- **Money:** "We may also earn affiliate commissions".
- **About page:** the badges "Ex-army · Fell walker · 20+ years in the Lakes", and the line "If somewhere is overpriced, we mention it".

### 4. Analytics and privacy
The privacy page named Plausible, but the site loaded Ahrefs and Vercel Web Analytics. It also described Booking.com affiliate cookies that the site never set.

### 5. Stale
- The 2026 events calendar, and an empty "Coming up" box on the home page.
- "Book now" on the Open 2026 page and post.
- The Open promoted on the accommodation intro.
- The sitemap date was 2 March.

### 6. Console error
A duplicate React key, `/activities`, on every page, from the footer in `app/layout.tsx`.

### 7. Emoji used as icons
On the home page, nav, events, guides, blog, things-to-do (35), walks, category and collections pages.

### 8. Stock photos
See suggestion 1.

### Affiliate links
There were none in the code. I searched for `aid=`, `awin`, `affiliate`, `partner`, `tag=`, `ref=`, `pid=`, `utm_`, `sponsored`, Booking.com, Viator, GetYourGuide, Amazon, OS Maps, Skimlinks, LateRooms, Sykes and Go Ape.

Changes made:
- About page: "We may also earn affiliate commissions from some booking links. These are disclosed where they appear." Removed.
- Privacy page: the affiliate sentence, the "Marketing / Affiliate" row and the Booking.com footnote. Removed.
- Dog-friendly page: "Cottages through Sykes Cottages, Hoseasons, and direct local letting agencies often accept dogs without the supplement" became "Many holiday cottages accept dogs; check the dog policy and any charge when you book."

`app/api/out` adds no affiliate tag: it records the click and redirects to the business's own URL.

## 2. What changed

| Change | Screenshots |
|---|---|
| The facts in section 1, item 1 corrected from the sources, or the sentence removed | `after-keswick-*`, `after-rainy-day-lake-district-*`, `after-things-to-do-*` |
| The two ranking posts reframed with their URLs kept; "Best" removed from the family post and three guides; town cards describe each place from its own site | `before/after-blog-best-restaurants-keswick-*`, `after-blog-best-pubs-ambleside-*`, `before/after-windermere-*`, `before/after-grasmere-*` |
| Rankings and criticism removed from the FAQs, the kids, dog and rainy-day pages, and the category intros | `after-dog-friendly-lake-district-*` |
| Claims rewritten; the about page uses "What we stand for" (Independent, Checked, Useful, Focused) | `before/after-about-*`, `before/after-home-*` |
| Home: no "Updated Daily"; the events box is hidden when nothing is upcoming; the newest three posts by date; "Highly Rated on Google" without rank badges; the business call to action goes to `/contact` | `after-home-*` |
| Events: no 2026 in headings or meta; past events removed from the JSON-LD; hero copy for when nothing is upcoming | `before/after-events-*` |
| The Open 2026 page and post marked as past; sitemap date 11 Nov 2026 | `after-the-open-2026-*` |
| Footer keyed by label; the Wildlife link goes to `/lake-district-wildlife` | console |
| Emoji icons removed, using lucide icons where the file already had them | `after-things-to-do-*` |
| Alt text corrected: a barista photo was called "Windermere lake" and the Dolomites "Dove Cottage". The Taj Mahal photo on the Easedale card swapped for an existing walking photo | |
| Empty directory: category pages carry guide text and "the directory is opening"; collections say there are no businesses yet; `/parking` lists seven car parks checked today; calls to action go to `/contact`; the `/advertise` and `/claim-listing` wording made true (section 7) | `after-restaurants-*`, `after-collections-*`, `after-parking-*`, `after-claim-listing-*`, `after-advertise-*` |
| Vercel Web Analytics removed; page counts added (section 8) | |
| Weekly report email: one em dash reworded | |
| Privacy page (last commit) | `after-privacy-*` |

### Privacy page, before and after
The terms page is unchanged: it has no analytics, affiliate or cookie wording.

| Before | After |
|---|---|
| "Last updated: 18 February 2026" | "Last updated: 11 November 2026" |
| "Privacy-friendly, cookieless page view analytics via Plausible. No personal data or IP addresses are collected or stored." | "Ahrefs Web Analytics: page view statistics without cookies. It records the page address (including any query string), the referring page, your browser, operating system and device, screen size and language, and when a link is clicked or a form is sent. It uses your IP address to work out your approximate location (city level) and a daily visitor ID that cannot be linked across days; the IP address itself is discarded, not stored." (Damian's wording, checked against Ahrefs' help page, `02afcc1`; it replaces a shorter first version) |
| (none) | Page counts: "We also count page views ourselves. For each page we store the page address, the day and a running count. Nothing about you is stored: no IP address, cookie, browser or device details." |
| (none) | Maps and photos: "Business listing pages show a Google map, and some listing photos are loaded from Google. Category pages show maps made from OpenStreetMap tiles. When your browser loads these, Google or OpenStreetMap receives your IP address, and Google may set its own cookies." |
| "Analytics data: aggregated, no personal data retained (Plausible Analytics)" | "Page counts: the page, the day and a count only, with nothing about the visitor" |
| Third parties: "Plausible (Analytics)" | "Ahrefs (Analytics)" with the wording above, plus "Google and OpenStreetMap (maps and listing photos)" |
| Cookie table: "Essential / Analytics (Plausible)" | Rows for `next-auth.session-token`, `next-auth.csrf-token` and `next-auth.callback-url` (hub sign-in only), and "Analytics (Ahrefs Web Analytics): No cookies set" |
| "No advertising or cross-site tracking cookies are used." | "The sign-in cookies are set only when a business owner signs in to the Business Hub; on the live site their names start with __Secure- or __Host-. The Business Hub also keeps one flag in your browser's session storage after an upgrade, to show a confirmation once. The site sets no advertising or tracking cookies. Google may set its own cookies when its maps load on listing pages." |
| "We use cookies and similar tracking technologies to operate the site and support affiliate revenue when you click through to partner booking sites. Plausible Analytics is cookieless..." | "The site sets cookies only to keep business owners signed in to the Business Hub. Ahrefs Web Analytics does not use cookies, and our own page counts store nothing about you." |
| Section 8 table: a "Marketing / Affiliate (Booking.com)" row | Row removed; the analytics row uses the Ahrefs wording |
| "Affiliate cookies are set by partner sites (e.g. Booking.com)..." | "Google may set its own cookies when its maps load on business listing pages. You can control cookies via your browser settings." |
| (none) | Reviews: "If you write a review of a listed business, we keep your first and last name, the name you choose to show, your email address (to confirm the review), your rating and words, any photos you add (published with the review), and any receipt image you upload to show you visited (not published). We also record your IP address to prevent abuse, and replace it with a one-way hash after 30 days." (`9a0b3fb`) |
| (none) | Resend named as the email provider: contact form messages to us, emails about listing claims and reviews, and password resets (`9a0b3fb`, `77f6de0`) |
| Vercel: "Website hosting infrastructure." | "Website hosting infrastructure, and storage for review photos and receipt images." |
| Titles "Privacy Policy \| The Lakes Guide" | "Privacy Policy" and "Terms & Conditions" (the layout adds the site name once) |

The IP hashing sentence is true only while the `hash-review-ips` cron runs, which needs `CRON_SECRET`. Damian added it at 20:16 UTC on 11 Nov; the first run is due at 03:00 UTC on 12 Nov. Read Vercel's cron log after the first review exists.

## 3. The two new posts

### The Lake District in Winter: What to Expect from December to February
- **Slug:** `lake-district-in-winter`
- **Live URL:** https://www.thelakesguide.co.uk/blog/lake-district-in-winter
- **Search term:** "lake district in winter". No existing title, slug or heading covers winter; the autumn post stops at November.
- **Internal links:** `/blog/ullswater-by-boat`, `/blog/lake-district-without-a-car`, `/rainy-day-lake-district`, `/lake-district-walks`.
- **Image:** `photo-1519681393784` (stock, not the Lakes), alt text "Snow-covered mountain ridges under a starry night sky".

**Sources** (all fetched 11 Nov 2026):
- **LDNPA Weatherline and weather page:** Fell Top Assessors climb Helvellyn daily from December 2026; what the reports contain; snow from November to March; about 20 snow days and 200 rain days a year in the valleys.
- **LDNPA Fell Top Assessors:** ice axe and crampons, four-season boots, goggles, map and compass, a spare hat and gloves, turn back if in doubt.
- **LDNPA what-to-pack:** 1 °C colder for every 150 m. **LDNPA plan-your-winter-visit:** it gets dark early in the valleys.
- **LDNPA walking safety:** 999 or 112, ask for the police then mountain rescue; text "register" to 999.
- **LDNPA Winter Skills courses:** December to April, 08:30 at Glenridding, £125, kit hire £15.
- **AdventureSmart:** carry a head torch; it gets dark sooner under cloud.
- **Met Office mountain forecast** (hazards above 300 m, freezing level) and **MWIS** (meteorologists, 365 days a year).
- **US Naval Observatory sun tables for Keswick** (timeanddate was blocked): sunrise and sunset 08:33 and 15:48 on 21 Dec; 08:02 and 16:51 on 1 Feb.
- **Windermere Lake Cruises:** every day except Christmas Day; 48 Hour Freedom ticket £35.
- **Ullswater 'Steamers':** 363 days a year; the Aira Force pier is shut until 2027.
- **Keswick Launch:** closed in December and January.
- **Westmorland and Furness and Cumberland councils:** winter gritting; the 2023 pass closures.
- **LDNPA getting around:** winter buses.
- **Keswick Museum and Brantwood:** winter opening hours.

### The Lake District Without a Car: Trains, Buses and Boats
- **Slug:** `lake-district-without-a-car`
- **Live URL:** https://www.thelakesguide.co.uk/blog/lake-district-without-a-car
- **Search term:** "lake district without a car". Before this, only short FAQs on three town pages touched it.
- **Internal links:** `/blog/ullswater-by-boat`, `/windermere`, `/keswick`, `/things-to-do`.
- **Image:** `photo-1501785888041` (stock), alt text "A rowing boat on a clear green lake below steep wooded mountains".

**Sources** (all fetched 11 Nov 2026):
- **Northern news, 18 Jun 2026:** the Lakes Line stops; the Cumbria Travel Pass is £40 a day or £99 for three days.
- **LDNPA getting around:** main-line stations, direct trains from Manchester, Traveline. Also the LDNPA's Ullswater and Langdale pages (buses 508 and 516) and its Cat Bells page (78; 77/77A).
- **Cumbria Tourism:** London Euston to Oxenholme in about 2 h 45.
- **Stagecoach:**
  - 555: hourly from 7am, 97 minutes from Kendal to Keswick.
  - X4/X5: daily except Christmas Day and New Year's Day, 45 minutes.
  - 599: hourly.
  - North West Explorer: £12.50 a day, £28 for three days.
  - Concessionary passes free from 09:30.
- **Westmorland and Furness bus routes:** 505 (38 minutes from Ambleside to Coniston) and 508.
- **GOV.UK:** the £3 fare cap runs to the end of 2026, then £2 from 1 Jan 2027; Stagecoach Cumbria routes are included.
- **Boat operators:** Windermere Lake Cruises piers, the Keswick Launch's seven jetties, the Ullswater piers.
- **Westmorland and Furness, Windermere ferry:** Ferry Nab to Far Sawrey in about 10 minutes; first crossings 6.50am (Sundays 8.50am); £1.50, £2.70 or £8 by card; no crossings on 25 or 26 Dec.

**Both posts:**
- They keep the "damian" byline, are written in the second person, and contain no invented visits or quotes.
- They are registered in `BLOG_POSTS` and `BLOG_CONTENT`, so they reach the sitemap, the blog index, the home page and the feed.
- Screenshots: `post-blog-*-1440`, `-390`.

## 4. Reviewer's findings and what was done

### First review (stage 2, `6d5c8fe..64a0b7d`)
The reviewer changed nothing. `test:contact` 15/15, tests 24/24, tsc clean. All 28 transport, fare and key sources were fetched again: no fact used had changed.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Must | The about page said every paid listing is labelled Featured and paying does not buy a mention; in code Pro sets only `hubTier`, which no page reads | The about page says only what the code does (`42308f2`); since stage B it says businesses can advertise and every advert is labelled |
| 2 | Must | Surviving claims: "The honest local list", "Field-tested", "Practical and honest", "I have walked in the Lakes in every season" and others | Removed |
| 3 | Should | Winter post: "you can text 999" applies only to people with hearing or speech difficulties | Fixed, with "register first" |
| 4 | Should | Facts: Armitt postcode, Brockhole lease, Coniston Launch "all year", eight bot-block captures, Bridge House tours, autumn sunset, Abbot Hall closure | Armitt LA22 9BL; Brockhole "agreed to market a lease"; Coniston Launch kept (the National Park's Southern Lakes page says it "sails all year round", fewer sailings November to February); captures deleted; tours line gone; sunset 4.18pm; Abbot Hall closures added |
| 5 | Should | Wording implied listings exist ("Claim your listing", a search over an empty directory, a Featured badge promise) | "List Your Business"; the empty search says there are no listings yet and offers the contact form; promises gone |
| 6 | Should | Category pages showed the editorial text twice on phones when empty | Fixed |
| 7 | Should | Page counts accepted any `/<category>/<slug>` | Listing slugs no longer counted; test updated |
| 8 | Should | Privacy gaps: review data, Resend, the about headshot loaded from another site | Closed in the privacy commits; headshot served from the site |
| 9 | Should | Emoji in the nav; pill tags on town pages | Removed |
| 10 | Should | Five Unsplash images returned 404 | Replaced with photos the site already uses, alt describing them |
| 11 | Should | The RSS feed was titled "SouthportGuide.co.uk" with em dashes | "The Lakes Guide: Blog", Lake District description |
| 12 | Note | Titles ended "\| The Lakes Guide \| The Lakes Guide" | Fixed |
| 13 | Note | Winter post: AdventureSmart credit, Honister wording, own additions, 77/77A and the fare cap | Fixed |
| 14 | Note | PricingFAQ and /pricing promised Featured placement and sold a Southport boost | Handled in stage B (section 7) |
| 15 | Note | Reframed posts lacked imageAlt; loose excerpts | Fixed |
| 16 | Note | `/events` returned 500 without a database | Fixed (improvement 5) |

**Sitemap** (coordinating chat's decision): the 15 empty collections, `/walks` and `/villages` are left out until they have listings. A collection rejoins at 4 listings, where its noindex stops. The counts use the same queries that fill the pages, and the sitemap revalidates hourly. `tests/sitemap-rules.test.mjs` covers it.

### Recheck (`77f6de0`)
Coniston's steam yacht Gondola now "sails to a seasonal timetable", from the National Trust page (which says it is closed for winter and reopens in spring 2027). The Ambleside hero overlay and kicker colour pass contrast. The Armitt is described as "A museum and library with exhibitions, including Beatrix Potter and Kurt Schwitters." The Abbot Hall car park is closed 9 Nov to 1 Dec. The contact page link reads "Ask to Be Listed". The privacy page's Resend line names every email the site sends.

### Final review (`9a0b3fb..02afcc1`)
An independent reviewer read the range, checked the advertising against the binding spec on all 82 built pages, and checked the illustrations, privacy and terms. tsc clean, `test:contact` 16/16, tests 42/42. Recheck follow-ups met; prices, plus VAT, founding offer, null sponsors, `rel="sponsored noopener"`, one advert per page and the banned pages all met; the illustrations are one style, never presented as photographs, with readable hero text; the Ahrefs sentence appears word for word in all three places; Stripe, checkout, webhook, auth, hub, env, Prisma and the contact API are untouched.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Must | PricingFAQ "Can I cancel anytime?" "Yes." read as covering adverts (3-month minimum); the featured placement answer promised a badge nothing can buy | "Can I cancel Pro at any time?" "Yes. Pro ends when you cancel. Adverts have the minimum term shown on the advertise page." Featured placement: "Part of Pro, once it opens… Pro is not on sale yet." |
| 2 | Must | Terms 5.2 (older text) described monthly billing, cancellation at period end and suspension after 14 days; the code has a yearly price, ends Pro at once and handles no failed payment | 5.2 now: "Pro, the paid Business Hub plan, is not on sale yet. Its terms will be published here before it opens" and "Advertising is agreed by email and paid by invoice, with the minimum term shown on the advertise page" (terms commit, last). The same false line is in hub code (`SettingsClient.tsx:129`, `UpgradePageClient.tsx:27`): fix before Pro opens (section 7) |
| 3 | Should | Stock photos with alt text naming Derwentwater, Friars Crag and Orrest Head | Alt describes the photos. Replacing the town photos with real, credited ones stays Damian's (section 5) |
| 4 | Should | Related-post thumbnails used the post title as alt (90 illustration images) | `alt=""` inside the labelled links |
| 5 | Should | Contact box: "Upgrade anytime for more visibility" | "A listing is free. Our advertising options are on the advertise page." |
| 6 | Should | End-of-post advert on three posts that name places to eat and stay | Only on "The Lake District Without a Car" (plus the winter post's own space) |
| 7 | Should | The hub login page (reached from "Go to Business Hub") says "Final testing in progress… launches in a few days", with an em dash | Hub code: left for when Pro opens (section 7) |
| 8 | Note | Pubs post header illustration could be taken for a named inn | Left: flat, generic, alt "Illustration of…" |
| 9 | Note | Keswick, Windermere and Coniston kickers hard to read at 390 | Same overlay and kicker colour as Ambleside on Keswick, Windermere, Coniston and Grasmere (`fix-keswick-*` and others) |
| 10 | Note | "paying does not change what we write" beside sponsored articles "written with you" | "…what we write in our own guides and posts" on about, advertise and the options |
| 11 | Note | Gondola copy says "check the National Trust's page" with no link | Left: the Trust's site blocks automated checks, so a link could not be verified tonight |
| 12 | Note | Privacy legal basis "Performance of a contract (your listing agreement)" against terms 5.1 (a free listing is not a contract); both older | For Damian: the privacy wording is his to approve |
| 13 | Note | Em dashes in listing and parking page titles (shown once listings exist) | Colons and commas |

## 5. Bigger suggestions for Damian

Decided since this list was written: the directory stays empty and businesses come to us (no import or seeding unless Damian says so); the sitemap leaves out empty pages (section 4); the stock post photos, the site hero and the home cards are now illustrations (section 12); the review-IP sentence is on the privacy page. The town pages still use stock photos (113 remain), which item 1 still covers.

1. **Replace the stock photos.** They are not the Lake District: the Alps, Patagonia, the Dolomites, a scuba diver and a barista. Five image URLs also return 404. This needs real photos. (`idea-windermere-hero-*`, `idea-walks-stock-photos-*`)
2. **Biography.** These lines were removed: "Ex-army · 20+ years", "fished the tarns, brought the kids", "20-year web and SEO professional", "Southport-based. Regular Lakes visitor for decades". Restore any that are true. (`after-about-1440`)
3. **The Open 2026 page:** redirect it to the Open post or to `/guides`. (`after-the-open-2026-1440`)
4. **Events:** add 2027 dates as organisers publish them. (`after-events-1440`)
5. **Facts left unconfirmed.** The National Trust site blocks automated requests, and some businesses had no page to check. Left as they were:
   - Hill Top;
   - the Gondola's start date;
   - dog and season details for Wasdale Head and Kirkstone;
   - food at the Sun in Coniston;
   - George Fisher's dates;
   - the heights of Helm Crag and Silver How;
   - the Grasmere circuit length (both 3.5 and 4 miles appear).
6. **Empty directory:** build a "List your business" page in place of the claim search, and give each category page fuller guide text. (`idea-claim-listing-*`, `idea-restaurants-directory-opening-*`)
7. **Reviews** store the reviewer's IP address, which a cron hashes later. The privacy page does not say so.
8. **Sitemap.** Leave these out until they have listings:
   - the 15 collection pages (they render noindex while empty);
   - `/walks` and `/villages`, which duplicate `/lake-district-walks` and the town pages.

   Keep the other category pages and `/parking`, which now carry guide content.

## 6. Checks run

**Final round (`e191239` to the terms commit):** tsc 0 errors; eslint shows no new problem in any changed file (the one error in `[category]/[slug]` predates it); `test:contact` 16/16; `tests/*.test.mjs` 42/42; `next build` passes; served build: home, the four town pages, /pricing, /contact, /advertise, /terms, /privacy and two posts answer 200; the itinerary post has no advert and the car-free post has one; screenshots `fix-*` (Keswick, Windermere, Coniston, /pricing, /contact, /terms) at four widths; no em dash in any changed customer-facing string.

**Stage 2:**
- **tsc:** 0 errors before and after.
- **eslint:** 41 errors and 44 warnings before; 32 errors and 44 warnings after; no new problem in any file.
- **Tests:** `npm run test:contact` passes 15/15; `node --test tests/page-count.test.mjs` passes 9/9.
- **Console:** checked on the home page, Keswick, restaurants and both new posts; the duplicate-key error is gone.
- **Screenshots:** taken in headless Edge, with `/api/hub/view`, `/api/p`, `/api/count` and `/api/out` stubbed so no page load wrote to the database.
- **Em dashes:** none left in customer-facing strings in any changed file.

## 7. Advertising (stage B, approved by Damian: "Yes, go with it")

**Before:** `/advertise` promised Featured placement ("42% more clicks"), homepage rotation and event packages, none of which an empty directory can deliver. `/pricing` sold Pro with benchmarks and Featured placement, and boosts including Southport's "Open 2026, Royal Birkdale".

**Now, https://www.thelakesguide.co.uk/advertise**, every price plus VAT:

| Option | Price |
|---|---|
| Home page card | £39 a month, 3 months minimum |
| Sponsor a guide (Keswick, Ambleside, Windermere, Grasmere, Coniston, Things to Do, Rainy Days, With Kids, Dog-friendly, Walks, Parking) | £35 a month, 3 months minimum |
| Sponsored article | £125, one-off, live for 12 months |
| Winter package (winter guide sponsor plus the home card in December) | £99, December to February |
| Lakes network bundle (a home card on all three sites plus one sponsorship on each) | £99 a month, 3 months minimum |

The page also has "A listing in the guide: free, on request", the founding offer word for word ("For the first ten advertisers across the Lakes network sites: half price for your first three months, and your monthly price held for twelve months."), How it works (contact form, invoice, live once paid) and Where adverts never appear. Two by two cards with a full-width bundle card. No traffic or audience figures. `?space=<id>` names the space asked about.

**https://www.thelakesguide.co.uk/pricing** (as mocked): "Today" offers a free listing and advertising from £35 a month plus VAT. "Once your listing is live", marked Opens later, shows the Business Hub (free with the listing) and Pro at £39 a month or £390 a year (hub prices as printed, no "plus VAT"). The boosts, the Open 2026 boost, the "£468" comparison and the feature table are gone. "Go to Business Hub" stays. PricingFAQ: the two boost questions removed; "Can I cancel Pro at any time?" "Yes. Pro ends when you cancel. Adverts have the minimum term shown on the advertise page."; featured placement described as part of Pro once it opens. No Stripe, checkout or hub code changed.

**Spaces** (at most one per page, all empty today, each linking to `/advertise?space=<id>#<option>`):
- the home card, before "Explore the Lake District";
- one sponsor card at the end of each of the 11 guides (before Explore Nearby on the town pages);
- an end-of-post card on "The Lake District Without a Car" only, sold under Sponsor a guide (the itinerary, Grasmere vs Ambleside and autumn posts name places to eat and stay, so they carry none);
- the winter post's own space, sold as the winter package.

**No adverts on:** listings, reviews, the two business posts (Eating Out in Keswick, Pubs in and around Ambleside), walk posts, category pages and collections (the "ask to be listed" invitation stays), about, privacy, terms, contact, claim-listing, advertise, pricing, the 404, the dashboard or admin.

**To put an advert live** (after the invoice is paid): set `sponsor` on the slot in `lib/ad-slots.ts` (name, url, up to 30 words, optional image under /public and `until` date) and deploy. Pages with a space regenerate hourly, so an expired sponsor drops off on its own. Filled cards say Advertisement (home) or Sponsor; links carry `rel="sponsored noopener"` and open in a new tab; a sponsored article's byline is "Sponsored by X" with no author box, and it is labelled Sponsored on blog cards and in the feed. `/contact?type=advertising` and `?type=listing` preselect the enquiry type. `tests/ads.test.mjs` (13 tests) fails if a sponsor is committed, a price lacks "plus VAT", or a space lands on a no-advert page.

**About page:** "Churchtown Media Ltd pays for the guide, and local businesses can advertise on it. Every advert, sponsor and sponsored article is labelled on the page, and paying for a space does not change what we write."

**Before Pro opens, three things must be true:**
1. Pro must set the Featured badge. Today the Stripe webhook sets only `hubTier: "pro"`, which no public page reads; the badge keys off the admin-set `listingTier`.
2. `lib/boost-config.ts` still holds Southport's boosts (Flower Show, Air Show, Open 2026). Replace them with Lakes boosts, or leave boosts out (they are no longer on /pricing).
3. Add the Stripe keys in Vercel; none are set.
Also before Pro opens: the hub settings and upgrade pages say Pro continues to the end of the billing period, but the cancel route ends it at once (make them agree, then publish Pro's terms in terms 5.2); and the hub login page still says "Final testing in progress… launches in a few days" (with an em dash).

**Price recheck:** look at all advertising prices again in three months (mid-February 2027), against what has sold and how much of the founding offer has been used.

**Screenshots:** `ads-*` (the advertise page, a named space, /pricing, every space type empty, the home card with a temporary example sponsor that was set back to `null` before commit), at 1440, 1024, 768 and 390.

## 8. Visit counts
- **The table.** `PageCount` (path, day, count) was created by `prisma/sql/2026-11-page-count.sql` with `prisma db execute`, on `ep-little-dawn-abo6kv4s-pooler.eu-west-2.aws.neon.tech`. The model is in `schema.prisma`, and `prisma generate` was run.
- **Read-back.** Columns: `path` text not null, `day` date not null, `count` integer not null default 0. Primary key `PageCount_pkey`. `count(*)` = 0.
- **How it counts.** `components/PageCountBeacon.tsx` in the root layout sends the page's path to `/api/count`. The route writes only in production. It drops cross-site requests, bots, unknown paths, and `/api`, `/admin`, `/dashboard` and `/_next`. It stores the path, the day and a count, nothing else. `PageView` and `app/api/p` are untouched.
- **Analytics.** Vercel Web Analytics is no longer loaded. `@vercel/analytics` is unused but still in `package.json`.

## 9. Keeping it fresh
**Rhythm:** one post every two weeks, each checked against official pages. Every quarter, recheck the seasonal facts the site repeats: boat timetables, closures, buses and fare caps.

**The next six posts** (none duplicates an existing post):

| Post | Search term |
|---|---|
| Windermere boat trips | "windermere boat trips" |
| Derwentwater and the Keswick Launch | "keswick launch derwentwater" |
| The Tarn Hows walk | "tarn hows walk" |
| Aira Force | "aira force walk" |
| Castlerigg Stone Circle | "castlerigg stone circle" |
| The Lake District in spring | "lake district in spring" |

## 10. Sign-in and the site's settings

- **Sign-in returned 500** because `NEXTAUTH_SECRET` was missing. Damian added `NEXTAUTH_SECRET` and `NEXTAUTH_URL` at 19:53 UTC on 11 Nov. No auth code was changed.
- **`CRON_SECRET`** added at 20:16 UTC on 11 Nov (Production). It lets the crons in `vercel.json` run: weekly email (Mondays 08:00), review check (daily 09:00), monthly credits (1st, 09:00) and `hash-review-ips` (daily 03:00 UTC, first run 12 Nov). The `eventbrite-sync` cron is gone from `vercel.json` (`c25930e`): it pointed at a route that does not exist.
- **The project's settings now** (names only): `COMMAND_CENTRE_API_KEY`, `CRON_SECRET`, `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY`. No Stripe keys.
- **Password reset link** falls back to the site address if `NEXTAUTH_URL` is ever missing (test: it cannot start with "undefined").
- **The database** (`ep-little-dawn`) has no businesses, users, claims or reviews. A test visit at 20:31:33 UTC on 11 Nov wrote one `PageCount` row for "/", which confirms production counting.

## 11. Dependencies (`78251f8`)

Next 16.4.6 and `npm audit fix`, with no `--force` and no major upgrade. Production audit: 0 critical and 0 high (was 4 critical and 12 high). The two critical advisories came through next-auth's optional peer `@auth/core` 0.34.3: the unused `@auth/prisma-adapter` was removed and `overrides` pins `@auth/core` 0.41.3. Sign-in was checked after the upgrade.

## 12. Illustrations (`333923c`, Damian: generated images allowed where the site has no adequate real picture)

The site had no real Lake District photography: the hero was the Alps, and post and card photos included Patagonia, the Dolomites, a scuba diver and a barista. One generated set in one style (Recraft, the site's palette) now replaces:
- **the site hero**, on 13 pages (home, blog, events, things to do, every category page, collections, contact, claim-listing, about, parking, wildlife, the Open 2026), cropped to show the fells and lake, with the overlay darkened at the top so the small orange labels stay readable;
- **the 17 post headers**, from 10 themed images: winter fells (the winter post); bus and train (Without a Car, The Open 2026); village street (Eating Out in Keswick, Grasmere vs Ambleside, Keswick Market); pub (Pubs in and around Ambleside); fell walk (Helvellyn, Scafell Pike, Wainwrights); lake boat (Where to Stay in Windermere, One Week Itinerary, Ullswater by Boat); family by a lake (Family Days Out); autumn woodland (Autumn); dog walk (Dog Walking); rainy day (Rainy Day). Each has "Illustration of…" alt text;
- **the 8 home category cards** (decorative; each card's link carries its label).

None is presented as a photograph of a named place or business. The about page says: "Illustrations on this site are computer-generated." The second sentence first proposed ("Photographs of places and wildlife are credited to their photographers where shown") was left out because it would be untrue: 113 stock photos remain on the town and guide pages, uncredited. **For Damian:** replace those with real, credited photos (as Hike The Lakes did with its Catbells hero), then add that sentence.

Screenshots `illus-*` (home, Keswick, blog index, the winter post, the Ambleside pubs post) at four widths.

## 13. Improvements (Damian, 11 Nov: "anything extra that's needed"), ranked

| # | Item | Effort | State |
|---|---|---|---|
| 1 | The site name was doubled in about 20 titles | 20 min | Done `543c1cf` (/pricing too, in stage B) |
| 2 | robots.txt blocked the CSS and JS needed to render | 5 min | Done `543c1cf` |
| 3 | Broken images | 20 min | Done `42308f2` |
| 4 | Internal links went through temporary redirects; things to do linked a missing /hotels | 15 min | Done `543c1cf` |
| 5 | /events failed when the database was unreachable, and its JSON-LD named The Lakes Guide as every event's organiser | 10 min | Done |
| 6 | No Open Graph data on posts | 10 min | Done `543c1cf` |
| 7 | en-GB, hub icon name, post-hero overlap, unneeded Google Fonts preconnects, a link to Hike The Lakes from the walks page | 20 min | Done `1323845` |
| 8 | Real Lake District photography | days | Partly: illustrations (section 12); town pages still stock |
| 9 | A day of sourced guide text per category page while the directory is empty | days | Proposal (`idea-restaurants-directory-opening-*`) |
| 10 | `images.qualities` in next.config; redirect /the-open-2026; canonical on /claim-listing/activate (hub code) | 30 min | Proposal |

## 14. SEO pass

To follow as its own push once this is live, by an agent that did not write the pages (brief: `lakes-seo-pass-brief.md` in the coordinating notes). It adds its findings, the sitemap count, the URLs for Damian to submit and "Traffic: what to do next" here.
