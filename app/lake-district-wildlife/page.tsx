import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import type { Metadata } from "next";

const BASE_URL = "https://www.thelakesguide.co.uk";
const WILDLIFE_URL = "https://www.thelakeswildlife.co.uk";

export const metadata: Metadata = {
  title: "Lake District Wildlife | Ospreys, Red Deer, Red Squirrels | The Lakes Guide",
  description:
    "Lake District wildlife guide. Ospreys at Haweswater, red deer in Martindale, red squirrels in Grizedale. The complete guide to wildlife in the Lakes.",
  alternates: { canonical: `${BASE_URL}/lake-district-wildlife` },
  openGraph: {
    title: "Lake District Wildlife | The Lakes Guide",
    description: "Ospreys, red deer, red squirrels. The complete guide to wildlife in the Lake District.",
    url: `${BASE_URL}/lake-district-wildlife`,
  },
};

export default function LakeDistrictWildlifePage() {
  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE_URL} alt="" fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: "center 20%" }} priority />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20">
          <nav className="flex items-center gap-1.5 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Lake District Wildlife</span>
          </nav>
          <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">Wildlife & Nature</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Lake District Wildlife
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Ospreys at Haweswater. Red deer in Martindale. Red squirrels in Grizedale. The Lake District has some of the best wildlife watching in England.
          </p>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-12">
        <div className="prose prose-slate max-w-none text-[#3C4E42] space-y-6">
          <p>
            The Lake District is one of the best places in England for wildlife. Ospreys breed at RSPB Haweswater and Foulshaw Moss. Red deer rut in Martindale in October. Red squirrels are in Grizedale and Whinlatter. Otters are on the rivers. Peregrines nest on the crags.
          </p>
          <p>
            For the full guide to Lake District wildlife, where to see each species, and when to go, visit The Lakes Wildlife.
          </p>
        </div>

        <div className="mt-12 bg-[#14231C] rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            The Complete Lake District Wildlife Guide
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Species guides, reserve pages, seasonal highlights, and practical tips. Where to see ospreys, red deer, red squirrels, and more.
          </p>
          <a
            href={WILDLIFE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C4782A] hover:bg-[#E8B87A] text-[#14231C] px-8 py-3.5 rounded-full font-bold transition-colors"
          >
            Visit TheLakesWildlife.co.uk <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
