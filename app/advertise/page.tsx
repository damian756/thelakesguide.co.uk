import Link from "next/link";
import { BarChart2, Star, Calendar, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Advertise With Us | The Lakes Guide",
  description: "List your business on The Lakes Guide. Free and premium listing options for Lake District businesses.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/advertise" },
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      <div className="bg-[#14231C] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise with The Lakes Guide</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Get in front of visitors searching for restaurants, accommodation, and things to do in the Lake District.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link href="/pricing" className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              View pricing
            </Link>
            <Link href="/claim-listing" className="bg-[#245E3F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2A6B8A] border-2 border-white">
              Claim free listing
            </Link>
          </div>
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
