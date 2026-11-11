import Link from "next/link";
import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";
import { getAdOption } from "@/lib/ad-options";
import PricingFAQ from "./PricingFAQ";

// /pricing while the directory is opening (stage B, approved by Damian on 11 Nov 2026).
// Today: a free listing on request, and advertising (prices plus VAT, by invoice).
// Once a listing is live: Business Hub and Pro, with Pro's prices exactly as
// checkout charges them. No boosts, no "instead of" comparison, no feature table.

export const metadata: Metadata = {
  title: "Pricing for Businesses",
  description:
    "What a Lake District business can have on The Lakes Guide: a free listing on request, and advertising from £35 a month plus VAT. Business Hub and Pro open once your listing is live.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/pricing" },
};

const LISTING_POINTS = [
  "Your business added to its category: name, what you offer, address, opening times, a link to your site and a map",
  "We check the details with you before it goes live",
  "No card and no account needed to ask",
];

// The advertising options summarised here, in this order, with prices from lib/ad-options.ts.
const ADVERT_LINES: { id: string; label: string }[] = [
  { id: "home-card", label: "Home page card" },
  { id: "guide-sponsor", label: "Sponsor a town or topic guide" },
  { id: "sponsored-article", label: "Sponsored article" },
  { id: "network-bundle", label: "Network bundle across three sites" },
];

function advertLine({ id, label }: { id: string; label: string }): string {
  const o = getAdOption(id);
  if (!o) return label;
  // Non-breaking spaces keep "£35 a month" on one line.
  const per = o.per === "a month" ? "\u00a0a\u00a0month" : "";
  return `${label}, ${o.price}${per} plus VAT`;
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <Check className="w-4 h-4 text-[#245E3F] flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function OpensLater() {
  return (
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14231C]/60 mb-2">
      <Clock className="w-4 h-4" aria-hidden="true" /> Opens later
    </p>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-pretty">
      <div className="bg-[#14231C] text-white">
        <div className="container mx-auto px-4 max-w-5xl py-14">
          <p className="text-[#E8B87A] text-xs font-bold uppercase tracking-widest mb-3">For businesses</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">What your business can have</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            The Lakes Guide is opening its directory. Here is what you can have today, and what opens once your
            listing is live.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12 space-y-12">
        <section>
          <h2 className="font-display text-2xl font-bold text-[#14231C] mb-5">Today</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
              <h3 className="font-display text-xl font-bold text-[#14231C] mb-1">A listing in the guide</h3>
              <p className="mb-4">
                <span className="text-3xl font-bold text-[#245E3F]">Free</span>
              </p>
              <ul className="space-y-2 text-sm text-[#14231C]/80 mb-6 flex-1">
                {LISTING_POINTS.map((t) => (
                  <Point key={t}>{t}</Point>
                ))}
              </ul>
              <Link
                href="/contact?type=listing"
                className="self-start bg-[#245E3F] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#14231C] transition-colors"
              >
                Ask to be listed
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
              <h3 className="font-display text-xl font-bold text-[#14231C] mb-1">Advertising</h3>
              <p className="mb-4">
                <span className="text-3xl font-bold text-[#A35F1C]">from £35</span>{" "}
                <span className="text-sm text-[#14231C]/70">a month, plus VAT</span>
              </p>
              <ul className="space-y-2 text-sm text-[#14231C]/80 mb-6 flex-1">
                {ADVERT_LINES.map((line) => (
                  <Point key={line.id}>{advertLine(line)}</Point>
                ))}
              </ul>
              <Link
                href="/advertise"
                className="self-start bg-[#14231C] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#245E3F] transition-colors"
              >
                See advertising options
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-[#14231C] mb-2">Once your listing is live</h2>
          <p className="text-[#14231C]/70 text-sm mb-5 max-w-2xl">
            These open when your business is listed and you have claimed it. We will tell you when they are available.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 rounded-2xl border border-dashed border-gray-300 p-6">
              <OpensLater />
              <h3 className="font-display text-xl font-bold text-[#14231C] mb-1">Business Hub</h3>
              <p className="text-sm text-[#14231C]/80">
                Sign in to update your listing and see how many people view it and click through. Free with your
                listing.
              </p>
            </div>
            <div className="bg-white/60 rounded-2xl border border-dashed border-gray-300 p-6">
              <OpensLater />
              <h3 className="font-display text-xl font-bold text-[#14231C] mb-1">Pro, £39 a month or £390 a year</h3>
              <p className="text-sm text-[#14231C]/80">
                Extra tools in the Business Hub, and a Featured place at the top of your category once it has several
                businesses. Paid by card when it opens.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#14231C]/10 bg-[#14231C]/5 px-6 py-4">
            <p className="text-sm text-[#14231C]/80">Already have an account? Sign in to the Business Hub.</p>
            <Link
              href="/dashboard"
              className="self-start sm:self-center flex-none bg-[#C4782A] hover:bg-[#A86C2A] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
            >
              Go to Business Hub →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">FAQ</h2>
          <PricingFAQ />
        </section>
      </div>
    </div>
  );
}
