import type { Metadata } from "next";
import ContactClient from "./ContactClient";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Contact Us | The Lakes Guide",
  description: "Get in touch with The Lakes Guide team. List your business, enquire about advertising, report an issue, or just say hello.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact Us | The Lakes Guide",
    description: "Get in touch with The Lakes Guide team. List your business, enquire about advertising, or just say hello.",
    url: `${BASE_URL}/contact`,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
