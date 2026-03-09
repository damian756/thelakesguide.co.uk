import Link from "next/link";
import { Star, MapPin } from "lucide-react";

type Props = {
  slug: string;
  name: string;
  shortDescription: string | null;
  address: string;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
  listingTier: string;
  firstImage: string | null;
  categorySlug: string;
  themeGradient: string;
  emoji: string;
};

function getAreaLabel(address: string): string {
  const areas = ["Windermere", "Bowness", "Ambleside", "Keswick", "Grasmere", "Coniston", "Hawkshead", "Kendal"];
  for (const a of areas) {
    if (address.includes(a)) return a;
  }
  return "Lake District";
}

export default function OpenListingCard({
  slug,
  name,
  shortDescription,
  address,
  rating,
  reviewCount,
  priceRange,
  listingTier,
  firstImage,
  categorySlug,
  themeGradient,
  emoji,
}: Props) {
  const isFeatured = listingTier === "featured" || listingTier === "premium";
  const areaLabel = getAreaLabel(address);

  return (
    <Link
      href={`/${categorySlug}/${slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 ${
        isFeatured
          ? "border-[#C9A84C]/40 ring-1 ring-[#C9A84C]/15 shadow-md hover:shadow-lg"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md shadow-sm"
      }`}
    >
      {/* Image */}
      <div className={`relative w-full h-44 flex-none overflow-hidden bg-gradient-to-br ${themeGradient}`}>
        {firstImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImage}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-3 right-3 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
            <span className="text-5xl opacity-30 select-none">{emoji}</span>
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-black bg-[#C9A84C] text-[#1B2E4B] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              ✦ Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-[#1B2E4B] text-base leading-snug group-hover:text-[#C9A84C] transition-colors mb-1 line-clamp-2">
          {name}
        </h3>
        <p className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {areaLabel}{areaLabel !== "Lake District" ? ", Lake District" : ""}
        </p>
        {shortDescription ? (
          <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-3 leading-relaxed">{shortDescription}</p>
        ) : (
          <div className="flex-1 mb-3" />
        )}
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-3 border-t border-gray-50">
          {rating ? (
            <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
              {reviewCount && (
                <span className="font-normal text-amber-500">
                  ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
                </span>
              )}
            </span>
          ) : null}
          {priceRange && (
            <span className="text-xs text-gray-400 font-medium">{priceRange}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
