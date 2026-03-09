import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { GUIDES, GUIDE_CATEGORIES, type GuideCategory } from "@/lib/guides-config";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Lake District Guides | The Lakes Guide",
  description:
    "Editorial guides to the Lake District. Villages, walks, practical info, and where to eat. Written by people who know the Lakes.",
  alternates: { canonical: `${BASE_URL}/guides` },
  openGraph: {
    title: "Lake District Guides | The Lakes Guide",
    description: "Editorial guides to the Lake District. Villages, walks, practical info, and where to eat.",
    url: `${BASE_URL}/guides`,
  },
};

const CATEGORY_ORDER: GuideCategory[] = ["walks-fells", "areas", "practical", "food-drink"];

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      <div className="bg-[#14231C] text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-white/40">
              <li>
                <Link href="/" className="hover:text-[#C4782A] transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-white/30">›</li>
              <li className="text-white/70 font-semibold">Guides</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4 mb-5">
            <BookOpen className="w-8 h-8 text-[#C4782A] flex-shrink-0" />
            <div>
              <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest">The Lakes Guide</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">The Guides</h1>
            </div>
          </div>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-6">
            Villages, walks, where to eat, and the practical stuff. Written by people who know the Lakes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-16">
        {CATEGORY_ORDER.map((cat) => {
          const guidesInCat = GUIDES.filter((g) => g.category === cat);
          if (guidesInCat.length === 0) return null;
          return (
            <section key={cat} id={cat} className="mb-16">
              <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6 flex items-center gap-2">
                <span>{GUIDE_CATEGORIES[cat].emoji}</span>
                {GUIDE_CATEGORIES[cat].label}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidesInCat.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={guide.canonicalPath ?? `/guides/${guide.slug}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#C4782A]/30 transition-all group overflow-hidden"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={guide.heroImage}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[#C4782A] text-[10px] font-bold uppercase tracking-wider">
                          {GUIDE_CATEGORIES[guide.category].label}
                        </p>
                        <h3 className="font-display font-bold text-white text-lg group-hover:text-[#C4782A] transition-colors">
                          {guide.title}
                        </h3>
                      </div>
                      {guide.status === "coming-soon" && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-white/90 text-[#14231C] text-[10px] font-bold px-2 py-1 rounded-full">
                            Coming soon
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{guide.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
