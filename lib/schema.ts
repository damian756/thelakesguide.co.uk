import { SITE_NAME, SITE_URL } from "./seo";

// JSON-LD identities shared by every page. The WebSite and Organization are described
// in full on the home page (the Organization also on /about); other pages refer to them
// by @id, so no page repeats them with different data.
//
// Hike The Lakes, The Lakes Wildlife and thelakes.network are sister sites, not profiles
// of this organisation, so they are not in sameAs: the footer links to them instead.
// Churchtown Media Ltd publishes the guide: it is the parentOrganization, with the @id
// churchtownmedia.co.uk uses for itself.

export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const PUBLISHER_ID = "https://www.churchtownmedia.co.uk/#organization";
export const FOUNDER_ID = "https://www.churchtownmedia.co.uk/about#founder";

/** The Lakes Guide, by reference (author or publisher of a page). */
export const ORG_REF = { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL };

export const CHURCHTOWN_MEDIA = {
  "@type": "Organization",
  "@id": PUBLISHER_ID,
  name: "Churchtown Media",
  legalName: "Churchtown Media Ltd",
  url: "https://www.churchtownmedia.co.uk",
  // Company No. 16960442, as the about page says.
  sameAs: ["https://find-and-update.company-information.service.gov.uk/company/16960442"],
};

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 },
  parentOrganization: { "@id": PUBLISHER_ID },
};

export const WEBSITE = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: "A guide to the Lake District: restaurants, pubs, walks, villages and things to do.",
  publisher: { "@id": ORG_ID },
  inLanguage: "en-GB",
};

/** Damian Roche, the byline on the posts and the editor named on /about. */
export const FOUNDER = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Damian Roche",
  jobTitle: "Founder, Churchtown Media",
  url: "https://www.churchtownmedia.co.uk/about",
  worksFor: { "@id": PUBLISHER_ID },
  sameAs: ["https://www.linkedin.com/in/damian-roche-7ba8293a5/"],
};

/** A BreadcrumbList for the trail a page shows: [name, absolute URL] from Home onwards. */
export function breadcrumbList(trail: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
  };
}
