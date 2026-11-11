# Guide sites playbook, November 2026

Internal working notes for freshening up the four Churchtown Media guide sites (Formby Guide, Southport Guide, Sefton Links, Sefton Coast Wildlife). Written while doing Formby Guide first, so the other three can be done without re-exploring each repo. Not customer-facing.

**Standing rule for every Lakes and Sefton Coast network site** (Damian, 11 Nov 2026): "their only goal is to drive traffic, we dont need to focus much on conversion, but just raw numbers. Having high traffic is what will sell the advert space locally". Judge every choice by visits from search: keep every page that can rank indexable and in the sitemap; write titles and descriptions for what people search (the fell, lake, place or species plus what the page answers, in plain words); never trade a title or address that ranks for a tidier one; fix anything that stops a page being crawled or indexed; link related pages to each other and across the sites; keep pages fast. No conversion work beyond the agreed advertising (no extra calls to action, pop-ups or funnels). Every site report has a section "Traffic: what to do next", ranked by likely visits gained.

Read this, then read only the files the map below points to. Search with grep; never read a whole repository. Do not open business CSVs, backups, scrape or enrich outputs, progress JSON files or lighthouse reports.

---

## 1. Hard rules (summary of the job brief)

- **No em dash (U+2014) in anything a customer can see**: page copy, titles, `metaTitle`, `metaDescription`, `excerpt`, `alt`, JSON-LD, UI labels, and every string in a data file that renders. Every file you change must be em-dash-free in its customer-facing strings before commit, including em dashes that were there before you touched the file. Replace with a full stop, comma, colon or a rewrite. Code comments may keep them.
- **Facts**: every fact in a new post (dates, times, prices, distances, names, opening hours, species and seasons, tides, parking, event details) is checked against an official or primary page fetched in this job. Nothing from memory. No invented quotes, people, reviews or statistics. If it cannot be confirmed, leave it out. Save each post's sources in the report.
- **Businesses**: do not rank, review or criticise named businesses; do not add or change any listing or business record. Existing copy that criticises a business is reported for Damian's pick, not rewritten.
- **Do not touch**: Stripe or payment code, `.env*`, auth, Prisma schema and migrations, business data, CSVs, scrape/enrich scripts, anything that writes to a database. No DB writes, no email, no scripts that call outside services other than reading public pages.
- **Images**: only images already in the repo, or of a kind the site already uses and is entitled to. No new AI-made images.
- **Scope of freshen-up**: small and safe. Machine-written copy (triads, slogans, filler adjectives, empty claims), emoji used as icons, pill badges, stale years and dates, wrong practical facts, generic sections that say nothing, and design details removable without a redesign. Anything bigger is a written suggestion with a screenshot.
- **Git**: commit by naming files (never `git add .`), no Co-Authored-By line, on the current branch. Do not push.
- **Dev server ports**: 3101 to 3104 only (3000 belongs to another project). Formby used 3101.

---

## 2. Shared architecture: file map

All four are Next.js 16 App Router, Tailwind v4, Prisma (Neon), deployed on Vercel. Blog posts are code, not CMS.

| What | Formby Guide | Southport Guide | Sefton Links | Sefton Coast Wildlife |
|---|---|---|---|---|
| Repo | `C:\Projects\formby-guide` | `C:\Projects\southport-guide` | `C:\Projects\sefton-links` | `C:\Projects\sefton-coast-wildlife` |
| Live domain | www.formbyguide.co.uk | www.southportguide.co.uk | www.seftonlinks.com | www.seftoncoastwildlife.co.uk |
| Post metadata | `lib/blog-posts.ts` (`BLOG_POSTS`, `BLOG_CATEGORIES`) | `lib/southport-data.ts` (search `BLOG_POSTS`) | `lib/blog.ts` (`BlogPost`, `BLOG_CATEGORIES`, author `DAMIAN`) | `content/blog/posts.ts` |
| Post body | one TSX component per post in `app/blog/_content/<slug>.tsx`, registered in `app/blog/_content/index.ts` | `lib/blog-content.ts`: `BLOG_CONTENT[slug]` = array of `ContentBlock` (`p`, `h2`, `h3`, `ul`, `ol`, `callout` with emoji, `quote`, `cta`, `image`, `video`, `hr`, `table`) | `lib/blog.ts` `ContentBlock` arrays | `content/blog/posts.ts` |
| Post route | `app/blog/[slug]/page.tsx` | `app/blog/[slug]/` | `app/[locale]/blog/` (next-intl, 18 locales in `messages/*.json`, routing in `i18n/`) | `app/blog/[slug]/` |
| Blog index | `app/blog/page.tsx` + `BlogClient.tsx` | `app/blog/page.tsx` + `BlogClient.tsx` | `app/[locale]/blog/` | `app/blog/page.tsx` |
| Home | `app/page.tsx` | `app/page.tsx` | `app/[locale]/page.tsx` | `app/page.tsx` |
| Header/footer | `app/layout.tsx` (footer inline), `app/components/NavMenu.tsx` | `app/layout.tsx`, `app/components/` | `app/[locale]/layout.tsx` | `app/layout.tsx` |
| Listing/category | `app/[category]/page.tsx`, `components/CategoryBrowser.tsx` (DB-driven, do not change listings) | `app/[category]/` | `app/[locale]/courses/`, `lib/courses.ts` | `app/birds`, `app/mammals`, `app/insects`, `app/plants`, `content/species` |
| Sitemap | `app/sitemap.ts` (blog entries generated from `BLOG_POSTS`) | `app/sitemap.ts` | `app/sitemap.ts` | `app/sitemap.ts` |
| Byline / persona | "Clare", a disclosed persona (see `app/about/page.tsx`); bio box `app/blog/ClareBio.tsx` | "Terry" persona (comment at top of `lib/blog-content.ts`) | Damian Roche (real person) | check `content/blog/posts.ts` |
| Images | flat in `public/` (`/blog-*.webp`, `/blog-card-*.webp`) | `public/images/blog/<topic>/` | check `public/` | check `public/` |

How a Formby post is put together (other sites differ only in format, check one existing post):
1. Add a `BlogPost` entry to `BLOG_POSTS` in `lib/blog-posts.ts`: `slug`, `title`, `excerpt`, `author`, `date` ("Month D, YYYY"), `readTime`, `categorySlug`, `gradient`, `image`, `metaTitle`, `metaDescription`.
2. Create `app/blog/_content/<slug>.tsx` with: Article JSON-LD, breadcrumb nav, header (category pill, h1, standfirst, hero `Image`, byline line), `prose` body with `h2`s, one tip box, a practical list, internal links block, `<ClareBio />`. Copy the newest post as the template.
3. Register it in `app/blog/_content/index.ts`.
4. Slug rule: no year in the slug unless the post is about one dated event.

---

## 3. Commands

```bash
npx next dev -p 3101          # run in background; 3101-3104 only
npx tsc --noEmit              # type-check
npx eslint .                  # lint (npm run lint is the same)
```

Record a baseline on the clean tree first (`git stash`, run, `git stash pop`), then require **no new** errors. Formby baseline: 15 tsc errors, all in `app/api/command-centre/stats/route.ts`; 43 eslint errors and 6 warnings, all pre-existing.

### Screenshots (headless Microsoft Edge through Playwright)

Tools live in this job's scratch folder (Playwright 1.55 installed there; 1.49 could not launch Edge 138):

`C:\Users\Idree\AppData\Local\Temp\claude\29d5ec94a8bf6c85\d244dd7f-8d28-401f-8351-cb6dd094e91a\scratchpad\shot\`

- `shot.mjs <base> <outDir> <label> <path>...`: full-page PNGs at 1440 and 390 wide, named `<label>-<path>-<width>.png`.
- `tile.py <png> <outDir> [scale]`: cuts a tall PNG into viewable tiles (desktop bands; mobile columns side by side). Look at tiles, not the raw full page.
- `console.mjs <url>...`: console errors, page errors and 4xx/5xx requests.
- `fetchtext.py <url> <outfile>`: saves a public page as plain text for fact checks (run with `python -I`).

In Git Bash, path arguments that start with `/` get mangled. Run with `MSYS_NO_PATHCONV=1` and give the script a Windows path:

```bash
MSYS_NO_PATHCONV=1 node 'C:\...\scratchpad\shot\shot.mjs' http://localhost:3101 docs/freshen-2026-11/screens before / /blog /blog/some-post
```

To rebuild the tools elsewhere: `npm init -y && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright@1.55.0`, then `chromium.launch({ channel: "msedge", headless: true })`. Never use the in-app browser pane for this job.

Save screenshots under `docs/freshen-2026-11/screens/` in each repo (`before-*`, `after-*`, `post-*`, `idea-*`). Check them for orphaned words, headings that wrap needlessly, overflow at 390. Full-page PNGs are big (Formby's first set came to 85 MB): before committing, convert the ones the report uses to JPEG at quality 70 and delete the PNGs; keep the commit under about 15 MB of images.

---

## 4. The look step: pages and what to note

Shoot: home, one category or listing page, blog index, two recent posts, at 1440 and 390. Run `console.mjs` on the same pages (Formby's dev badge turned out to be two duplicate-key errors: a post listed twice in `BLOG_POSTS` and two footer links with the same `href`).

Write a short ranked list, each item with the file that produces it. Rank by what a visitor would act on wrongly first (wrong facts), then what looks stale, then what looks machine-made.

---

## 5. De-AI and staleness checklist (patterns that found things on Formby)

Run each from the repo root. Exclude post bodies first to find site-wide copy, then run on posts.

```bash
# stock AI phrases
P='hidden gem|nestled|boasts|vibrant|whether you.re|look no further|something for everyone|unforgettable|breathtaking|must-visit|delve|tapestry|elevate|seamless|curated|bustling|picturesque|idyllic|treasure trove|second to none|world-class|unrivalled|no fluff|game.changer|in the heart of|ultimate|immerse|embark|rich history|stunning|definitive'
grep -rnoiE "$P" app lib components content --include=*.ts --include=*.tsx | sort | uniq -c | sort -rn

# tics that read as machine-made in this house style
grep -rnoiE "genuinely|honest(ly)?|actually|the reason is simple|here is what|here's what|here's the thing|it is worth|worth noting|significantly" app lib content --include=*.ts --include=*.tsx | awk -F: '{print $1}' | sort | uniq -c | sort -rn | head

# em dashes (customer-facing ones must go)
grep -rn $'\u2014' app lib components content messages

# emoji used as icons (count per file)
PYTHONIOENCODING=utf8 python -c "import re,glob;e=re.compile('[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B50\u2705]');[print(n,f) for f in glob.glob('app/**/*.tsx',recursive=True)+glob.glob('lib/*.ts')+glob.glob('components/**/*.tsx',recursive=True)+glob.glob('content/**/*.ts',recursive=True) for n in [len(e.findall(open(f,encoding='utf8').read()))] if n]"

# stale years and past events outside dated posts
grep -rn "2025\|2026" app components lib --include=*.ts --include=*.tsx | grep -v "datePublished\|dateModified\|lastModified"

# duplicate post slugs (cause duplicate-key errors and duplicate sitemap URLs)
grep -n "slug: \"" lib/blog-posts.ts | awk -F'"' '{print $2}' | sort | uniq -d
```

What Formby turned up, as examples of what to look for:
- **Home "latest posts" hard-coded** to Easter 2026, Open 2026 and an April post, shown in November. Fix: derive the newest three from the post list so it never goes stale again.
- **Wrong practical facts repeated site-wide**: the car park postcode (L37 1YH; the National Trust now says L37 1LJ for Victoria Road and L37 2EB for Lifeboat Road) and "book/pay via the NT app" (NT now uses ANPR, pay machines and the JustPark app). Check every postcode, price, payment method, opening time and "café on site" claim against the official page.
- **Factual slips in slogans**: "Ancient pinewoods" (the pines were planted, mostly from the late 1800s).
- **Emoji as icons** on home tiles, ticker strips, checklists and card headers; a pulsing "live" dot on a static label; emoji badges in the author box. Where lucide-react icons already exist in the file, swap to them; elsewhere just remove the emoji.
- **Slogans and empty claims**: "Your definitive guide", "Skip the tourist traps", "Wide, wild and brilliant", "no fluff", "Real tips, honest reviews".
- **Persona claims that contradict the disclosure**: the post bio says "All tips are based on Clare's personal experience" while the about page says Clare is a persona. Posts disagree on how long she has lived there. Report for Damian; fix only the outright false line.
- **Stale event links** in footers and intros (The Open 2026 was in July 2026).
- **Category intro copy that criticises a named business**: report it, do not rewrite it.
- **Machine-written listing descriptions** from the DB ("Formby's greatest draws are its natural spaces..." repeated across listings): business data, so report only.

---

## 6. Fact-checking notes

- The National Trust site (nationaltrust.org.uk) sits behind a Radware bot check. A plain request sometimes gets the page and sometimes gets "Verifying your browser". Make one plain request per page with `fetchtext.py`; if you get the check page, do not try to get past it. Use other primary sources (council, Natural England, RSPB, Wildlife Trust, university, club or venue's own site) or leave the fact out. WebFetch failed on several sites with ECONNRESET; `fetchtext.py` usually works.
- Save the text of every source you rely on to the scratch `src/` folder while working, and list URL plus date accessed plus the facts taken from it in the report.
- postcodes.io (read-only public API) is handy for checking where a postcode actually is.
- Formby source text already fetched (11 Nov 2026): `scratchpad\src\nt-formby.txt` (NT Formby main page), `scratchpad\src\manchester-footprints.txt` (University of Manchester, Formby footprints, 2022).

---

## 7. New post checklist

Choosing the subject:
- [ ] Not already covered (grep titles, slugs and bodies for the subject's key words).
- [ ] Something a local or visitor would search for in winter 2026 to 2027, or evergreen. Nothing that reads as news about a past event.
- [ ] Fits the site's subject (Formby / Southport / golf on the Sefton coast / wildlife on the Sefton coast).
- [ ] One line on why it was chosen, for the report.

Writing it:
- [ ] Read three or four of the site's best posts first; match length, heading pattern, tip boxes, internal links and image use.
- [ ] Persona sites: keep the byline the site uses, but do not invent first-person experiences, family anecdotes or visits that did not happen. Write in second person and plain statements.
- [ ] UK English. Short sentences. Concrete details with sources. No triads, no "genuinely/honest/actually" tics, no "Here's everything you need to know".
- [ ] Every fact traced to a fetched source; anything unconfirmed removed.
- [ ] No business ranked, reviewed or criticised. Naming a business as a landmark is fine; judging it is not.
- [ ] Image already in the repo and suited to the subject; alt text describes the picture.
- [ ] Two to four internal links to existing pages that exist (check the route).
- [ ] Title, `metaTitle`, `metaDescription`, `excerpt`, JSON-LD and alt text free of em dashes.
- [ ] Registered everywhere the site needs it (metadata list, body/component, index registry); appears in sitemap and blog index.
- [ ] Screenshots of the post at 1440 and 390; no orphans, h1 not wrapping badly.

---

## 8. Report template (`docs/freshen-2026-11/REPORT.md` in each repo)

1. What was found (ranked, with files).
2. What changed, with before/after screenshot paths.
3. The two posts: title, slug, full live URL, why chosen, sources (URL, date accessed, facts used).
4. Reviewer's findings and what was done about each.
5. Bigger suggestions for Damian, each with a screenshot path and one line on what it would take.
6. Checks run: tsc and eslint against baseline, screenshots taken, em dash scan of changed files.

---

## 9. Lakes differences (added 11 Nov 2026, Lakes network job)

Copied from the Sefton playbook in `C:\Projects\formby-guide\docs\`. Everything above applies to the Lakes network except where this section says otherwise.

| What | The Lakes Guide | Hike The Lakes | The Lakes Wildlife | The Lakes Network |
|---|---|---|---|---|
| Repo | `C:\Projects\lakes-guide` | `C:\Projects\hike-the-lakes` | `C:\Projects\lakes-wildlife` | `C:\Projects\thelakes-network-landing` |
| Live domain | www.thelakesguide.co.uk | www.hikethelakes.com | www.thelakeswildlife.co.uk | www.thelakes.network |
| Dev port | 3111 | 3113 | 3112 | 3114 (static; any file server) |
| Post metadata | `lib/lakes-data.ts` (search `BLOG_POSTS`) | `lib/blog.ts` (`BlogPost`, `BLOG_CATEGORIES`, author `DAMIAN`) | `content/blog/posts.ts` (`BLOG_POSTS`) | no blog |
| Post body | `lib/blog-content.ts` (`BLOG_CONTENT[slug]`, `ContentBlock`) | `lib/blog.ts` | `content/blog/posts.ts` | none |
| Post route | `app/blog/[slug]` | `app/[locale]/blog/[slug]` (served at `/blog` only: English is the only routed locale) | `app/blog/[slug]` | none |
| Contact | `lib/contact.ts`, `app/api/contact`, `app/contact/ContactClient.tsx` | `lib/contact.ts`, `lib/contact-types.ts`, `app/api/contact`, `components/ContactForm.tsx` | `lib/contact.ts`, `app/api/contact`, `components/ContactForm.tsx` | `api/contact.js` (Vercel Function) |

- **Ports**: 3111 to 3114 (3000 and 3101 to 3104 belong to other work).
- **Contact and addresses** (stage 1, 11 Nov 2026): no email address of ours appears anywhere a visitor can see on the four sites. Every form delivers to the one constant in `lib/contact.ts` (or `api/contact.js`) and sends from the verified stand-in sender `"<Site name> <noreply@southportguide.co.uk>"`, because no Lakes domain has MX or Resend records. Where a page would give an address, link to the contact form; data protection requests go by the form and by post to Churchtown Media Ltd, Suite RA01, 195-197 Wood Street, London, E17 3NU. `tests/contact.test.mjs` in each repo (`npm run test:contact`, or `node --test tests/contact.test.mjs`) fails if an address of ours is printed or a resend.dev sender appears: keep it passing.
- **Hike The Lakes routes English only** (`i18n/routing.ts`: `locales = ['en']`). `messages/en.json` is the only live message file; the other 17 are unused. The repo was cloned from Sefton Links: golf leftovers remain (`app/[locale]/the-open-2026`, `tee-times`, `scorecard`, `public/hero-golf.jpg`, a `courses` message namespace). Report them; removing whole routes is a suggestion for Damian, not a freshen-up fix.
- **Hike The Lakes writes visits to the production database from a dev server**: `proxy.ts` inserts a `PageView` row for each page load, and the dev server loads `.env.local`. Start it with an empty database URL in the process environment (`DATABASE_URL= npx next dev -p 3113`), never by editing an env file.
- **Visit counts**: the three Next sites have a `PageView` model and an `app/api/p` route, but on The Lakes Guide and The Lakes Wildlife nothing calls `/api/p`, so they record no visits. Hike The Lakes records through `proxy.ts` (path, referrer domain, device). The network site has none (static, Ahrefs only).
- **The Lakes Guide has a Stripe business hub** (`app/dashboard`, `app/pricing`, `app/claim-listing`, `app/api/hub`, `app/api/webhooks/stripe`). Do not touch it, beyond copy that shows an address.
- **Line endings**: some files are CRLF (Formby's are LF). Edit in a way that keeps each file's line endings.
- **Baselines on origin/main, 11 Nov 2026**: `tsc` 0 errors on all three Next sites. `eslint .`: The Lakes Guide 41 errors and 44 warnings; Hike The Lakes 0 errors and 22 warnings; The Lakes Wildlife 23 errors and 4 warnings.
- **Hero photo**: The Lakes Guide and Hike The Lakes use an Unsplash photo of an Alpine range (`photo-1506905925346`) on the contact and other heroes. It is not the Lake District. That is a suggestion, not a fix.
- **Claims pattern**: Damian's approved "What we stand for" wording is on https://www.seftoncoast.network/ (Independent, Checked, Useful, Focused). The Lakes sites say "No sponsored editorial", "Not AI-generated listicles", "Written by someone who walks the fells", "genuinely world-class" and similar. Those go.
- **Traffic first** (Damian, 11 Nov 2026): see the standing rule at the top. On the Lakes sites it means Hike's 193 placeholder fell pages stay indexed and get real facts, the fell guide batches and The Lakes Wildlife's species rewrite are the first traffic work, and each site's SEO pass (brief: `lakes-seo-pass-brief.md` in the coordinating notes folder) is its last step before submitting sitemaps.
- **Named businesses** (Damian, 11 Nov 2026, from the Sefton advertising spec): no ranking and no criticism of a named business anywhere in editorial copy. A page whose premise is a ranking ("best restaurants") is retitled and reframed as a factual guide, with its URL kept.
