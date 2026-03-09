import Link from "next/link";
import Image from "next/image";
import { Check, Minus, ChevronDown } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import PricingFAQ from "./PricingFAQ";

export const metadata = {
  title: "Pricing | List Your Business on The Lakes Guide",
  description:
    "Pricing for business listings on TheLakesGuide.co.uk. Free and Pro plans, plus category boosts.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/pricing" },
};

const FEATURES = [
  { label: "Claim & manage listing", free: true, pro: true },
  { label: "Analytics dashboard", free: true, pro: true },
  { label: "Monday morning email", free: true, pro: true },
  { label: "Visibility score", free: true, pro: true },
  { label: "Google review alerts", free: true, pro: true },
  { label: "Milestone notifications", free: true, pro: true },
  { label: "Category benchmarks", free: false, pro: true },
  { label: "Compare vs competitors", free: false, pro: true },
  { label: "Event intelligence", free: false, pro: true },
  { label: "Featured listing placement", free: false, pro: true },
  { label: "1 boost credit per month", free: false, pro: true },
] as const;

const BOOSTS = [
  { type: "Standard 7 days", price: "£15", pence: 1500 },
  { type: "Weekend (Fri–Sun)", price: "£10", pence: 1000 },
  { type: "Festival Weekend", price: "£49", pence: 4900 },
  { type: "Summer Event Weekend", price: "£49", pence: 4900 },
  { type: "Bank Holiday Weekend", price: "£35", pence: 3500 },
  { type: "Christmas Markets Month", price: "£99", pence: 9900 },
  { type: "Peak Season Fortnight", price: "£149", pence: 14900 },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero — walks-style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE_URL} alt="" fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: "center 20%" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Simple, transparent pricing
          </h1>
          <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-xl">
            Join Lake District businesses on the guide. Choose Free or Pro, then add boosts when you need extra visibility.
          </p>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12 space-y-12">
        {/* Free vs Pro table */}
        <section>
          <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">
            Free vs Pro
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-5 px-6 text-gray-600 font-semibold">
                    Feature
                  </th>
                  <th className="text-center py-5 px-6 text-gray-600 font-semibold">
                    Free
                  </th>
                  <th className="text-center py-5 px-6 bg-[#C4782A]/10 border-l border-[#C4782A]/20 font-semibold text-[#14231C]">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f, i) => (
                  <tr
                    key={f.label}
                    className={
                      i % 2 === 1 ? "bg-gray-50/50" : ""
                    }
                  >
                    <td className="py-4 px-6 text-gray-700">{f.label}</td>
                    <td className="py-4 px-6 text-center">
                      {f.free ? (
                        <Check className="w-5 h-5 text-emerald-600 inline" />
                      ) : (
                        <Minus className="w-5 h-5 text-gray-300 inline" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-[#C4782A]/5">
                      {f.pro ? (
                        <Check className="w-5 h-5 text-emerald-600 inline" />
                      ) : (
                        <Minus className="w-5 h-5 text-gray-300 inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Annual banner */}
        <div className="bg-[#C4782A]/15 border border-[#C4782A]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-[#14231C] text-lg">
              Pay annually and save 2 months
            </h3>
            <p className="text-gray-600 text-sm mt-0.5">
              £390/year instead of £468
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-[#C4782A] hover:bg-[#A86C2A] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors whitespace-nowrap"
          >
            Go to Business Hub →
          </Link>
        </div>

        {/* Boosts section */}
        <section>
          <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">
            Category boosts
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Appear at the top of your category for a set period. Pro subscribers
            get one free credit per month.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOSTS.map((b) => (
              <div
                key={b.type}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              >
                <p className="font-semibold text-[#14231C]">{b.type}</p>
                <p className="text-2xl font-bold text-[#C4782A] mt-2">{b.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Open 2026 */}
        <div className="bg-[#14231C] rounded-2xl p-6 text-white">
          <h3 className="font-display font-bold text-lg mb-2 flex items-center gap-2">
            🏌️ The Open 2026 — Royal Birkdale
          </h3>
          <p className="text-white/80 text-sm">
            Limited to one slot per category. 6 of 11 category slots available.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 border border-[#C4782A]/40 text-[#C4782A] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#C4782A]/10 transition"
          >
            Book your boost →
          </Link>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">
            FAQ
          </h2>
          <PricingFAQ />
        </section>
      </div>
    </div>
  );
}
