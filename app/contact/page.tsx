import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { pageOpenGraph } from "@/lib/seo";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Lakes Guide team. List your business, enquire about advertising, report an issue, or just say hello.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: pageOpenGraph({
    title: "Contact Us | The Lakes Guide",
    description: "Get in touch with The Lakes Guide team. List your business, enquire about advertising, or just say hello.",
    url: `${BASE_URL}/contact`,
  }),
};

// /contact?type=advertising or ?type=listing opens the form with that enquiry
// type chosen (the links on /advertise and /pricing). Anything else: the default.
const PRESET_TYPES: Record<string, string> = {
  advertising: "Advertise / Featured listing",
  listing: "Claim my listing",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const { type } = await searchParams;
  const preset = typeof type === "string" && Object.hasOwn(PRESET_TYPES, type) ? PRESET_TYPES[type] : undefined;
  return <ContactClient initialSubject={preset} />;
}
