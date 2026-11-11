// Advertising options shown on /advertise (stage B, approved by Damian on 11 Nov 2026).
// No imports, so tests/ads.test.mjs can load this file directly.
// Every advert price is shown "plus VAT". Paid by invoice after an enquiry through
// the contact form; nothing is sold by checkout.

export type AdOption = {
  /** Stable id: the anchor on /advertise and the `option` of a slot in lib/ad-slots.ts. */
  id: string;
  name: string;
  /** The price as printed, without VAT wording (added where it is shown). */
  price: string;
  /** What the price covers: "a month", "one-off", "December to February". */
  per: string;
  /** Minimum term or note. */
  term: string;
  points: string[];
  /** The price line on an empty "advertise here" card, including "plus VAT". */
  cardPrice: string;
};

export const AD_OPTIONS: AdOption[] = [
  {
    id: "home-card",
    name: "Home page card",
    price: "£39",
    per: "a month",
    term: "3 months minimum",
    points: [
      "One business on The Lakes Guide home page, labelled Advertisement",
      "Your photo, a line about you and a link to your site",
      "Change the photo and line once a month if you like",
    ],
    cardPrice: "From £39 a month plus VAT",
  },
  {
    id: "guide-sponsor",
    name: "Sponsor a guide",
    price: "£35",
    per: "a month",
    term: "3 months minimum",
    points: [
      "One sponsor per guide: Keswick, Ambleside, Windermere, Grasmere, Coniston, Things to Do, Rainy Days, With Kids, Dog-friendly, Walks or Parking",
      "Or one sponsor for the end of our travel and seasonal posts",
      "Your card shown once at the end, labelled Sponsor",
      "Never inside the text, and paying does not change what we write",
    ],
    cardPrice: "From £35 a month plus VAT",
  },
  {
    id: "sponsored-article",
    name: "Sponsored article",
    price: "£125",
    per: "one-off",
    term: "live for 12 months",
    points: [
      "A useful post about something you run: an event, a walk, a seasonal menu",
      "Written with you and checked for facts",
      "Labelled Sponsored at the top, with the byline “Sponsored\u00a0by” your business",
      "Never presented as a review",
    ],
    cardPrice: "£125 one-off plus VAT",
  },
  {
    id: "winter-package",
    name: "Winter package",
    price: "£99",
    per: "December to February",
    term: "one payment",
    points: [
      "Sponsor of our Lake District in Winter guide, December to February",
      "Plus the home page card in December",
    ],
    cardPrice: "£99 for December to February plus VAT",
  },
  {
    id: "network-bundle",
    name: "Lakes network bundle",
    price: "£99",
    per: "a month",
    term: "3 months minimum",
    points: [
      "A home page card on The Lakes Guide, Hike The Lakes and The Lakes Wildlife",
      "Plus one guide, area or section sponsorship on each site",
      "About £220 a month plus VAT if bought separately",
    ],
    cardPrice: "From £99 a month plus VAT",
  },
];

/** The founding offer, in Damian's approved words. Never print how many places are left. */
export const FOUNDING_OFFER =
  "For the first ten advertisers across the Lakes network sites: half price for your first three months, and your monthly price held for twelve months.";

export function getAdOption(id: string): AdOption | undefined {
  return AD_OPTIONS.find((o) => o.id === id);
}
