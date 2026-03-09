import Link from "next/link";
import Image from "next/image";
import { BarChart2, Star, Calendar, TrendingUp } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";

export const metadata = {
  title: "Advertise With Us | The Lakes Guide",
  description: "List your business on The Lakes Guide. Free and premium listing options for Lake District businesses.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/advertise" },
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      {/* Hero — walks-style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE_URL} alt="" fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: "center 20%" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Advertise with The Lakes Guide
          </h1>
          <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-2xl mb-8">
            Get in front of visitors searching for restaurants, accommodation, and things to do in the Lake District.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/pricing" className="bg-white text-[#14231C] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View pricing
            </Link>
            <Link href="/claim-listing" className="bg-[#245E3F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2A6B8A] border-2 border-white transition-colors">
              Claim free listing
            </Link>
          </div>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <BarChart2 className="w-10 h-10 text-[#245E3F] mx-auto mb-3" />
            <h2 className="font-bold text-gray-900 mb-2">More visibility</h2>
            <p className="text-gray-600 text-sm">Featured listings get 42% more clicks than free listings.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Star className="w-10 h-10 text-[#245E3F] mx-auto mb-3" />
            <h2 className="font-bold text-gray-900 mb-2">Stand out</h2>
            <p className="text-gray-600 text-sm">Badge, top placement, and homepage rotation for paid tiers.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Calendar className="w-10 h-10 text-[#245E3F] mx-auto mb-3" />
            <h2 className="font-bold text-gray-900 mb-2">Event packages</h2>
            <p className="text-gray-600 text-sm">Seasonal and event packages for high-intent visitors.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <TrendingUp className="w-10 h-10 text-[#245E3F] mx-auto mb-3" />
            <h2 className="font-bold text-gray-900 mb-2">Track results</h2>
            <p className="text-gray-600 text-sm">Monthly analytics on views and clicks for Featured+ tiers.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Claim your free listing first, or jump straight to a paid tier. We&apos;ll help you get set up.
          </p>
          <Link href="/claim-listing" className="inline-block bg-[#245E3F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2A6B8A] mr-4">
            Claim listing
          </Link>
          <Link href="/contact" className="inline-block bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
