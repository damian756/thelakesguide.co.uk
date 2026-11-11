import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { AD_OPTIONS, FOUNDING_OFFER, type AdOption } from "@/lib/ad-options";
import { getAdSlot } from "@/lib/ad-slots";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description:
    "Advertising on The Lakes Guide: a home page card, guide sponsorships, sponsored articles, a winter package and a Lakes network bundle. Prices plus VAT, paid by invoice.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/advertise" },
};

function OptionCard({ o, active, wide = false }: { o: AdOption; active: boolean; wide?: boolean }) {
  return (
    <div
      id={o.id}
      className={`scroll-mt-24 bg-white rounded-2xl border p-6 flex flex-col ${
        active ? "border-[#C4782A] ring-2 ring-[#C4782A]/30" : "border-gray-200"
      } ${wide ? "md:flex-row md:items-start md:gap-10" : ""}`}
    >
      <div className={wide ? "md:w-72 md:flex-none" : ""}>
        <h2 className="font-display text-2xl font-bold text-[#14231C] mb-2">{o.name}</h2>
        <p className="mb-1">
          <span className="text-3xl font-bold text-[#A35F1C]">{o.price}</span>{" "}
          <span className="text-[#14231C]/70 text-sm">{o.per}, plus VAT</span>
        </p>
        <p className="text-[#14231C]/60 text-sm mb-4">{o.term}</p>
      </div>
      <div className={`flex flex-col flex-1 ${wide ? "md:pt-1" : ""}`}>
        <ul className="space-y-2 text-sm text-[#14231C]/80 mb-6 flex-1">
          {o.points.map((pt) => (
            <li key={pt} className="flex gap-2">
              <Check className="w-4 h-4 text-[#245E3F] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/contact?type=advertising"
          className="self-start bg-[#14231C] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#245E3F] transition-colors"
        >
          Ask about this
        </Link>
      </div>
    </div>
  );
}

export default async function AdvertisePage({
  searchParams,
}: {
  searchParams: Promise<{ space?: string | string[] }>;
}) {
  const { space } = await searchParams;
  const slot = typeof space === "string" ? getAdSlot(space) : undefined;
  const activeOption = slot?.option;
  const main = AD_OPTIONS.filter((o) => o.id !== "network-bundle");
  const bundle = AD_OPTIONS.find((o) => o.id === "network-bundle");

  return (
    <div className="min-h-screen bg-[#EAEDE8] text-pretty">
      <div className="bg-[#14231C] text-white">
        <div className="container mx-auto px-4 max-w-5xl py-14">
          <p className="text-[#E8B87A] text-xs font-bold uppercase tracking-widest mb-3">Advertising</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Advertise on The Lakes Guide</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Simple options at local prices. Every advert is labelled on the page, and paying for a space does not change
            what we write in our own guides and posts.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        {slot && (
          <div className="rounded-2xl bg-[#14231C]/5 border border-[#14231C]/10 px-6 py-4 mb-8 text-[#14231C]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8A5418] mb-1">You asked about</p>
            <p className="font-display text-xl font-bold">{slot.title}</p>
            <p className="text-sm text-[#14231C]/70 mt-1">The option that covers it is highlighted below.</p>
          </div>
        )}

        <div className="rounded-2xl border border-[#C4782A]/40 bg-white p-6 mb-10">
          <p className="font-display text-xl font-bold text-[#14231C] mb-1">Founding advertisers</p>
          <p className="text-[#14231C]/75 text-sm leading-relaxed">{FOUNDING_OFFER}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {main.map((o) => (
            <OptionCard key={o.id} o={o} active={o.id === activeOption} />
          ))}
        </div>
        {bundle && (
          <div className="mt-6">
            <OptionCard o={bundle} active={bundle.id === activeOption} wide />
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-1">A listing in the guide: free, on request</h2>
            <p className="text-sm text-[#14231C]/75">
              Your business added to its category, with the details checked with you first. Ask through the contact
              form, with &ldquo;Claim my listing&rdquo; as the enquiry type.
            </p>
          </div>
          <Link
            href="/contact?type=listing"
            className="self-start sm:self-center flex-none bg-[#245E3F] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#14231C] transition-colors"
          >
            Ask to be listed
          </Link>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm text-[#14231C]/80">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-3">How it works</h2>
            <p className="mb-2">
              Tell us which option you would like through the contact form, with &ldquo;Advertise / Featured
              listing&rdquo; as the enquiry type. We reply by email, agree the wording and photo with you, and send an
              invoice. Your advert goes live once it is paid.
            </p>
            <p>No checkout, and no contract beyond the minimum term.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-3">Where adverts never appear</h2>
            <p>
              Not on business listings, reviews or category pages, the posts that describe businesses (Eating Out in
              Keswick, and Pubs in and around Ambleside), or the about, contact, privacy, terms, pricing and claim your
              listing pages. Never inside the text of a guide or post, and never more than one advert on a page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
