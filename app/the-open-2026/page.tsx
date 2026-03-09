import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import type { Metadata } from "next";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "The Open 2026 and the Lake District | Accommodation | The Lakes Guide",
  description:
    "The Open Championship 2026 at Royal Birkdale. Lake District accommodation for visitors during Open week. Stay in the Lakes and drive to the course.",
  alternates: { canonical: `${BASE_URL}/the-open-2026` },
  openGraph: {
    title: "The Open 2026 and the Lake District | The Lakes Guide",
    description: "Lake District accommodation for The Open 2026. Stay in Keswick, Windermere, or Ambleside during Open week.",
    url: `${BASE_URL}/the-open-2026`,
  },
};

export default function TheOpen2026Page() {
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
            <span className="text-white font-medium">The Open 2026</span>
          </nav>
          <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">12–19 July 2026</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            The Open 2026 and the Lake District
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            The Open Championship returns to Royal Birkdale in July 2026. The Lake District is about 45 minutes from the course. If you want to combine golf with a few days in the Lakes, or base yourself here for the week, this is where to look.
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
            The Open 2026 is at Royal Birkdale, 12–19 July. Accommodation near the course fills early. The Lake District is a 45-minute drive. Keswick, Windermere, Ambleside, and Grasmere all have good options if you want to stay in the Lakes and drive to the course, or extend your trip with a few days walking.
          </p>
          <p>
            Book early. Open week is one of the busiest periods. Lake District accommodation gets snapped up. Keswick and Windermere have the widest choice. Ambleside and Grasmere are quieter but still within range.
          </p>
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-display text-xl font-bold text-[#14231C] mb-4">Where to Stay</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/accommodation?area=keswick" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Keswick</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/accommodation?area=windermere" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Windermere</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/accommodation?area=ambleside" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Ambleside</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/accommodation" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">All accommodation</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
