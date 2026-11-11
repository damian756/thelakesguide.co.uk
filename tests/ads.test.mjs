// Advertising (stage B, approved by Damian on 11 Nov 2026): the slot config,
// where the spaces are placed, the advertise and pricing copy, and paid links.
// Pure data from lib/ad-options.ts and lib/ad-slots.ts plus static reads of the
// page files: no server, no database, nothing written.
// Run: node --test tests/ads.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { AD_OPTIONS, FOUNDING_OFFER, getAdOption } from "../lib/ad-options.ts";
import {
  AD_SLOTS,
  NO_AD_POST_SLUGS,
  POST_END_SLUGS,
  WINTER_POST_SLUG,
  activeSponsor,
  getAdSlot,
  slotForPost,
} from "../lib/ad-slots.ts";
import { BLOG_POSTS } from "../lib/lakes-data.ts";
import { ENQUIRY_TYPES } from "../lib/contact.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/\r\n/g, "\n");
const walk = (dir) =>
  readdirSync(join(ROOT, dir)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(join(ROOT, rel)).isDirectory() ? walk(rel) : [rel];
  });
/** Source without whole-line // comments, so notes for developers are not read as copy. */
const copyOf = (p) => read(p).replace(/^\s*\/\/.*$/gm, "");

// The files a visitor reads on the advertise and pricing pages and in the cards.
const AD_COPY_FILES = [
  "app/advertise/page.tsx",
  "app/pricing/page.tsx",
  "app/pricing/PricingFAQ.tsx",
  "components/AdSlot.tsx",
  "lib/ad-options.ts",
  "lib/ad-slots.ts",
];

// Where each space is placed: page file -> the slot id it renders.
const PLACED = {
  "app/page.tsx": "home-card",
  "app/keswick/page.tsx": "guide-keswick",
  "app/ambleside/page.tsx": "guide-ambleside",
  "app/windermere/page.tsx": "guide-windermere",
  "app/grasmere/page.tsx": "guide-grasmere",
  "app/coniston/page.tsx": "guide-coniston",
  "app/things-to-do/page.tsx": "guide-things-to-do",
  "app/rainy-day-lake-district/page.tsx": "guide-rainy-day-lake-district",
  "app/lake-district-with-kids/page.tsx": "guide-lake-district-with-kids",
  "app/dog-friendly-lake-district/page.tsx": "guide-dog-friendly-lake-district",
  "app/lake-district-walks/page.tsx": "guide-lake-district-walks",
  "app/parking/page.tsx": "guide-parking",
  // Blog posts: the slot comes from slotForPost(), checked below.
  "app/blog/[slug]/page.tsx": null,
};

// Pages that must never carry an advert (spec: the no-advert list).
const NO_ADVERT_PAGES = [
  "app/about/page.tsx",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/contact/page.tsx",
  "app/contact/ContactClient.tsx",
  "app/advertise/page.tsx",
  "app/pricing/page.tsx",
  "app/not-found.tsx",
  "app/[category]/page.tsx",
  "app/[category]/[slug]/page.tsx",
  "app/parking/[slug]/page.tsx",
  "app/components/GuideLayout.tsx",
];
const NO_ADVERT_DIRS = ["app/claim-listing", "app/dashboard", "app/admin", "app/[category]", "app/parking/[slug]"];

const pageFiles = walk("app").filter((f) => /\.(tsx|ts)$/.test(f));
const usesAdSlot = (src) => (src.match(/<AdSlot\b/g) ?? []).length;

test("every slot's sponsor is null at commit", () => {
  for (const [id, slot] of Object.entries(AD_SLOTS)) {
    assert.equal(slot.sponsor, null, `${id} has a sponsor: set it back to null before committing`);
  }
});

test("every option a slot names exists on the advertise page", () => {
  const ids = new Set(AD_OPTIONS.map((o) => o.id));
  assert.equal(ids.size, AD_OPTIONS.length, "option ids are unique");
  for (const [id, slot] of Object.entries(AD_SLOTS)) {
    assert.ok(ids.has(slot.option), `${id} names option ${slot.option}, which /advertise does not have`);
    assert.ok(getAdOption(slot.option));
    assert.ok(["home", "guide", "post"].includes(slot.kind), `${id} kind`);
    assert.ok(slot.title.trim().length > 0, `${id} title`);
  }
  // The page renders every option, each as an anchor named by its id.
  const page = read("app/advertise/page.tsx");
  assert.match(page, /id=\{o\.id\}/, "each option card carries its id as the anchor");
  assert.match(page, /AD_OPTIONS\.filter\(\(o\) => o\.id !== "network-bundle"\)/);
  assert.match(page, /AD_OPTIONS\.find\(\(o\) => o\.id === "network-bundle"\)/);
  // The empty card links to /advertise?space=<id>#<option> and the page names the space.
  assert.match(read("components/AdSlot.tsx"), /href=\{`\/advertise\?space=\$\{id\}#\$\{slot\.option\}`\}/);
  assert.match(page, /getAdSlot\(space\)/);
  assert.match(page, /\{slot\.title\}/);
});

test("the options and prices are the approved ones", () => {
  const got = AD_OPTIONS.map((o) => [o.id, o.price, o.per, o.term]);
  assert.deepEqual(got, [
    ["home-card", "£39", "a month", "3 months minimum"],
    ["guide-sponsor", "£35", "a month", "3 months minimum"],
    ["sponsored-article", "£125", "one-off", "live for 12 months"],
    ["winter-package", "£99", "December to February", "one payment"],
    ["network-bundle", "£99", "a month", "3 months minimum"],
  ]);
  assert.equal(
    FOUNDING_OFFER,
    "For the first ten advertisers across the Lakes network sites: half price for your first three months, and your monthly price held for twelve months.",
  );
});

test("each space is placed once, on its own page, and never on a no-advert page", () => {
  const found = {};
  for (const f of pageFiles) {
    const n = usesAdSlot(read(f));
    if (n === 0) continue;
    found[f] = n;
    assert.equal(n, 1, `${f}: at most one advert on any page`);
  }
  assert.deepEqual(Object.keys(found).sort(), Object.keys(PLACED).sort(), "the pages with a space");

  for (const [f, id] of Object.entries(PLACED)) {
    const src = read(f);
    if (id) assert.match(src, new RegExp(`<AdSlot id="${id}"`), `${f} renders ${id}`);
    // Static pages are regenerated so an advert past its "until" date drops off.
    assert.match(src, /export const revalidate = \d+;/, `${f} must be regenerated (revalidate)`);
  }
  for (const f of NO_ADVERT_PAGES) {
    assert.equal(usesAdSlot(read(f)), 0, `${f} must not carry an advert`);
  }
  for (const f of pageFiles.filter((p) => NO_ADVERT_DIRS.some((d) => p.startsWith(d + "/")))) {
    assert.equal(usesAdSlot(read(f)), 0, `${f} must not carry an advert`);
  }

  // Every slot in the config is reachable from a page.
  const reachable = new Set(Object.values(PLACED).filter(Boolean));
  for (const p of BLOG_POSTS) {
    const s = slotForPost(p.slug, false);
    if (s) reachable.add(s);
  }
  assert.deepEqual([...reachable].sort(), Object.keys(AD_SLOTS).sort(), "every slot is placed, and nothing else");
});

test("blog posts: travel and seasonal only, never the two business posts or a sponsored post", () => {
  const slugs = new Set(BLOG_POSTS.map((p) => p.slug));
  for (const s of [...POST_END_SLUGS, ...NO_AD_POST_SLUGS, WINTER_POST_SLUG]) assert.ok(slugs.has(s), `${s} is a post`);
  assert.deepEqual([...NO_AD_POST_SLUGS].sort(), ["best-pubs-ambleside", "best-restaurants-keswick"]);
  for (const s of NO_AD_POST_SLUGS) {
    assert.ok(!POST_END_SLUGS.includes(s), `${s} must not be a post-end post`);
    assert.equal(slotForPost(s, false), null, `${s} carries no advert`);
  }
  for (const p of BLOG_POSTS) {
    assert.equal(slotForPost(p.slug, true), null, `${p.slug}: a sponsored post carries no other advert`);
    const slot = slotForPost(p.slug, false);
    if (slot) {
      // Travel and seasonal: the local-guides posts only.
      assert.equal(p.categorySlug, "local-guides", `${p.slug} is not a travel or seasonal post`);
    }
  }
  assert.equal(slotForPost(WINTER_POST_SLUG, false), "guide-lake-district-in-winter");
  assert.equal(getAdSlot("guide-lake-district-in-winter").option, "winter-package");
  for (const s of POST_END_SLUGS) assert.equal(slotForPost(s, false), "post-end");
  // The template asks for the slot with the post's sponsor flag.
  assert.match(read("app/blog/[slug]/page.tsx"), /slotForPost\(slug, Boolean\(sponsor\)\)/);
});

test("no traffic or audience claims in the advertising copy", () => {
  for (const f of AD_COPY_FILES) {
    const src = copyOf(f);
    assert.doesNotMatch(src, /\d[\d,.]*\s*k?\+?\s*(?:monthly\s+|a month\s+)?(?:visitors|views|readers)/i, `${f}: traffic figure`);
    assert.doesNotMatch(src, /\b(?:growing|popular|high-intent|affluent)\b/i, `${f}: audience claim`);
  }
});

test("every advert price says plus VAT; hub prices stay as printed", () => {
  for (const o of AD_OPTIONS) {
    assert.match(o.cardPrice, /plus VAT$/, `${o.id} card price`);
    for (const pt of o.points) if (pt.includes("£")) assert.match(pt, /plus VAT/, `${o.id}: ${pt}`);
  }
  const advertise = read("app/advertise/page.tsx");
  assert.ok(!advertise.includes("£"), "advertise page prices come from lib/ad-options.ts");
  assert.match(advertise, /\{o\.price\}[\s\S]{0,160}\{o\.per\}, plus VAT/, "each option shows its price plus VAT");

  const pricing = read("app/pricing/page.tsx");
  // Every £ price on the page is followed by "plus VAT" (in its sentence or the
  // next span), except Pro, the hub price, which is shown as printed.
  const PRO = "Pro, £39 a month or £390 a year";
  const pricingCopy = copyOf("app/pricing/page.tsx").replaceAll(PRO, "");
  const prices = [...pricingCopy.matchAll(/£\d+/g)];
  assert.ok(prices.length >= 2);
  for (const m of prices) {
    const after = pricingCopy.slice(m.index, m.index + 160);
    assert.match(after, /^£\d+[^.£]*?plus VAT/, `pricing: ${after.slice(0, 80)}`);
  }
  // "from £35" is the cheapest monthly advert.
  const monthly = AD_OPTIONS.filter((o) => o.per === "a month").map((o) => Number(o.price.slice(1)));
  assert.match(pricing, new RegExp(`from £${Math.min(...monthly)}</span>`));
  assert.match(pricing, /\$\{label\}, \$\{o\.price\}\$\{per\} plus VAT/, "advert lines are built with plus VAT");
  // Pro as the hub prints it, with no VAT wording and no "instead of" comparison.
  const upgrade = read("app/dashboard/(hub)/upgrade/UpgradePageClient.tsx");
  assert.ok(upgrade.includes("£39/month") && upgrade.includes("£390/year"), "hub prints Pro at £39/month, £390/year");
  assert.ok(pricing.includes("Pro, £39 a month or £390 a year"));
  assert.doesNotMatch(pricingCopy, /£468|instead of/);
});

test("pricing: no boosts, no feature table, the Business Hub button stays", () => {
  const pricing = read("app/pricing/page.tsx");
  const faq = read("app/pricing/PricingFAQ.tsx");
  for (const src of [copyOf("app/pricing/page.tsx"), faq]) {
    assert.doesNotMatch(src, /boost/i);
    assert.doesNotMatch(src, /benchmark|competitor|event intelligence|Monday|review alert/i);
    assert.doesNotMatch(src, /The Open 2026|Royal Birkdale/);
  }
  assert.doesNotMatch(pricing, /<table/);
  assert.match(pricing, /href="\/dashboard"[\s\S]{0,300}Go to Business Hub/);
  assert.match(pricing, /Opens later/);
  assert.doesNotMatch(faq, /until the end of the billing period/, "cancelling ends Pro at once in code");
});

test("enquiries go to the contact form, with advertising preselected; no email address", () => {
  const advertise = read("app/advertise/page.tsx");
  const links = [...advertise.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(links.length > 0);
  for (const l of links) assert.match(l, /^\/contact\?type=(advertising|listing)$/, l);
  const contact = read("app/contact/page.tsx");
  assert.match(contact, /advertising: "Advertise \/ Featured listing"/);
  assert.match(contact, /listing: "Claim my listing"/);
  assert.ok(ENQUIRY_TYPES.includes("Advertise / Featured listing"));
  assert.ok(ENQUIRY_TYPES.includes("Claim my listing"));
  for (const f of AD_COPY_FILES) assert.doesNotMatch(read(f), /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]/, `${f}: email address`);
});

test("paid links: sponsored noopener in a new tab; adverts labelled", () => {
  const card = read("components/AdSlot.tsx");
  assert.match(card, /target="_blank"\s+rel="sponsored noopener"/);
  assert.match(card, /slot\.kind === "home" \? "Advertisement" : "Sponsor"/);
  const post = read("app/blog/[slug]/page.tsx");
  assert.match(post, /rel: sponsored \? "sponsored noopener" : "noopener noreferrer"/, "inline links in a sponsored post");
  assert.match(post, /target="_blank" rel="sponsored noopener"/, "the sponsor's byline link");
  assert.match(post, /Sponsored by\{" "\}/, "byline reads Sponsored by X");
  assert.match(post, /\{!sponsor && \(\s*<div className="mt-10 pt-8 border-t/, "no author box on a sponsored post");
  assert.match(post, /isDamian = !sponsor &&/, "a sponsored post is never under Damian's name");
});

test("a sponsor past its until date shows as empty", () => {
  const slot = (until) => ({ option: "home-card", title: "t", kind: "home", sponsor: { name: "n", url: "https://example.org", text: "t", until } });
  const day = new Date("2026-11-11T12:00:00Z");
  assert.equal(activeSponsor(slot("2026-11-10"), day), null);
  assert.ok(activeSponsor(slot("2026-11-11"), day), "shown on its last day");
  assert.ok(activeSponsor(slot(undefined), day));
  assert.equal(activeSponsor({ ...slot(), sponsor: null }, day), null);
  // UK date: 00:30 BST on 1 Jun is still 31 May in UTC, but the UK day is 1 Jun.
  assert.equal(activeSponsor(slot("2026-05-31"), new Date("2026-05-31T23:30:00Z")), null);
  assert.equal(getAdSlot("constructor"), undefined);
  assert.equal(getAdSlot("toString"), undefined);
});

test("the about page says adverts are labelled, and no longer that there are none", () => {
  const about = read("app/about/page.tsx");
  assert.ok(
    about.includes(
      "Every advert, sponsor and sponsored article is labelled on the page, and paying for a space does not change what we write in our own guides and posts.",
    ),
  );
  assert.doesNotMatch(about, /no adverts or paid placements/);
});

test("no em dash in the advertising copy", () => {
  for (const f of AD_COPY_FILES) assert.ok(!read(f).includes("\u2014"), `${f} has an em dash`);
});
