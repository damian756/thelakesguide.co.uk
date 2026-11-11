import type { Metadata } from "next";
import ClaimListingClient from "./ClaimListingClient";
import { pageOpenGraph } from "@/lib/seo";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "List Your Business",
  description: "List your Lake District business on The Lakes Guide. The directory is opening: ask to be listed through the contact form.",
  alternates: { canonical: `${BASE_URL}/claim-listing` },
  openGraph: pageOpenGraph({
    title: "List Your Business | The Lakes Guide",
    description: "List your Lake District business on The Lakes Guide. The directory is opening, and businesses can ask to be listed through the contact form.",
    url: `${BASE_URL}/claim-listing`,
  }),
};

export default function ClaimListingPage() {
  return <ClaimListingClient />;
}
