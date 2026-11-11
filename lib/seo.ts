import type { Metadata } from "next";

// Open Graph tags for one page. Next.js replaces the root layout's openGraph object
// whole when a page sets its own, so every page builds its tags here: og:url is the
// page's canonical address, with the site name, locale and default image kept.

export const SITE_URL = "https://www.thelakesguide.co.uk";
export const SITE_NAME = "The Lakes Guide";
export const DEFAULT_OG_IMAGE = { url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: SITE_NAME };

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export function pageOpenGraph(og: {
  url: string;
  title: string;
  description: string;
  type?: "website" | "article";
  images?: OpenGraph["images"];
}): OpenGraph {
  return {
    type: og.type ?? "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: og.url,
    title: og.title,
    description: og.description,
    images: og.images ?? [DEFAULT_OG_IMAGE],
  };
}
