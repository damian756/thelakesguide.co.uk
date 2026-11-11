import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { HERO_IMAGE_URL, HERO_IMAGE_ALT, HERO_IMAGE_POSITION } from "@/lib/site-constants";
import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo";
import { ORG_REF } from "@/lib/schema";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/the-open-2026`;

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": url + "#article",
      headline: "The Open 2026 and the Lake District",
      description: "Written before The Open at Royal Birkdale in July 2026: the Lake District as a base for Open week. Kept for reference.",
      url,
      mainEntityOfPage: url,
      datePublished: "2026-03-09",
      dateModified: "2026-11-11",
      author: ORG_REF,
      publisher: ORG_REF,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "The Open 2026", item: url },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: "The Open 2026 and the Lake District | Accommodation",
  description:
    "The Open 2026 was played at Royal Birkdale in July. This page, written beforehand on staying in the Lake District for Open week, is kept for reference.",
  alternates: { canonical: `${BASE_URL}/the-open-2026` },
  openGraph: pageOpenGraph({
    title: "The Open 2026 and the Lake District | The Lakes Guide",
    description: "Written before The Open 2026 at Royal Birkdale: the Lake District as a base for Open week. Kept for reference.",
    url: `${BASE_URL}/the-open-2026`,
  }),
};

export default function TheOpen2026Page() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    <div className="min-h-screen bg-[#EAEDE8]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE_URL} alt={HERO_IMAGE_ALT} fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: HERO_IMAGE_POSITION }} priority />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 pointer-events-none" />
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
            The Open Championship was played at Royal Birkdale in July 2026. This page was written beforehand for visitors staying in the Lake District during Open week. The town guides below cover a visit at any time of year.
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
            The Open 2026 was played at Royal Birkdale, 12 to 19 July. The southern Lake District is about an hour&apos;s drive from the course, and Keswick, Windermere, Ambleside and Grasmere all have accommodation.
          </p>
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-display text-xl font-bold text-[#14231C] mb-4">Town guides</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/keswick" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Keswick</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/windermere" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Windermere</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/ambleside" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Ambleside</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/grasmere" className="flex items-center justify-between p-4 rounded-xl bg-[#EAEDE8] hover:bg-[#D8E5E0] transition-colors group">
              <span className="font-semibold text-[#14231C]">Grasmere</span>
              <ChevronRight className="w-5 h-5 text-[#C4782A] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
