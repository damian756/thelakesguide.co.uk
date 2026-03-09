import type { Metadata } from "next";
import ClaimListingClient from "./ClaimListingClient";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Claim Your Business Listing | The Lakes Guide",
  description: "Is your Lake District business on our guide? Claim your free listing to update your details, opening hours, and get more visibility for visitors.",
  alternates: { canonical: `${BASE_URL}/claim-listing` },
  openGraph: {
    title: "Claim Your Business Listing | The Lakes Guide",
    description: "Claim your free Lake District business listing. Update your details, opening hours, and upgrade for featured placement.",
    url: `${BASE_URL}/claim-listing`,
  },
};

export default function ClaimListingPage() {
  return <ClaimListingClient />;
}
