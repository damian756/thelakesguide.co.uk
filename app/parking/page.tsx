import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Lake District Parking | Car Parks, Postcodes & Tips | The Lakes Guide",
  description:
    "Lake District parking guide. Car park postcodes, pay-and-display, free parking, and where to park for walks. Keswick, Ambleside, Windermere, and more.",
  alternates: { canonical: `${BASE_URL}/parking` },
  openGraph: {
    title: "Lake District Parking | The Lakes Guide",
    description: "Car park postcodes and parking tips for the Lake District. Where to park for walks, villages, and attractions.",
    url: `${BASE_URL}/parking`,
  },
};

function isFree(tags: string[], priceRange: string | null): boolean {
  return (tags ?? []).includes("free-parking") ||
    (!!priceRange && priceRange.toLowerCase() === "free");
}

export default async function ParkingIndexPage() {
  let parkings: { slug: string; name: string; address: string; postcode: string; priceRange: string | null; tags: string[] }[] = [];

  try {
    const catRecord = await prisma.category.findFirst({ where: { slug: "parking" } });
    if (catRecord) {
      const results = await prisma.business.findMany({
        where: { categoryId: catRecord.id },
        select: { slug: true, name: true, address: true, postcode: true, priceRange: true, tags: true },
        orderBy: { name: "asc" },
      });
      parkings = results.map((r) => ({
        slug: r.slug,
        name: r.name,
        address: r.address,
        postcode: r.postcode,
        priceRange: r.priceRange,
        tags: (r.tags ?? []) as string[],
      }));
    }
  } catch {
    // DB unavailable
  }

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
            <span className="text-white font-medium">Parking</span>
          </nav>
          <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">Practical</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Lake District Parking
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Car park postcodes, pay-and-display, and free parking. Where to park for walks, villages, and attractions.
          </p>
        </div>
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#EAEDE8" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        {parkings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Parking listings are being added. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {parkings.map((p) => (
              <Link
                key={p.slug}
                href={`/parking/${p.slug}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#C4782A]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MapPin className="w-5 h-5 text-[#C4782A] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#14231C] group-hover:text-[#C4782A] transition-colors truncate">
                      {p.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{p.postcode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isFree(p.tags, p.priceRange) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      Free
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#C4782A] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
