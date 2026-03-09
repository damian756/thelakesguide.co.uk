# TheLakesGuide.co.uk

**The definitive local guide and business directory for the Lake District, Cumbria.**

Live site: [thelakesguide.co.uk](https://www.thelakesguide.co.uk)

---

## What This Is

TheLakesGuide is a full editorial directory covering restaurants, cafes, pubs, accommodation, walks, villages, activities and shopping in the Lake District. It includes a business claiming and subscription system, click tracking analytics, and guides for The Open Championship 2026 at Royal Birkdale.

Part of the [Lakes Network](https://thelakes.network), built and operated by Churchtown Media.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Prisma
- **Auth**: NextAuth v4
- **Payments**: Stripe
- **Email**: Resend
- **Maps**: Google Places API, Leaflet
- **Deployment**: Vercel
- **Analytics**: Plausible

## Key Features

- Business listings with Google Places data, ratings, hygiene ratings (FSA), opening hours
- Business claiming flow — owners can claim, verify and manage their listing
- Listing tiers: Free / Standard / Featured / Premium (Stripe subscriptions)
- Click tracking: website visits, phone calls, directions, Google review clicks per listing
- Business Hub dashboard — per-listing analytics for business owners
- The Open 2026 hub: accommodation, restaurants, transport and ticket guides for Royal Birkdale
- Full Schema.org JSON-LD on every page (LocalBusiness, Restaurant, Hotel, BreadcrumbList, FAQPage)
- Food hygiene ratings pulled from FSA API
- Sitemap generation, canonical URLs, OpenGraph on all pages
