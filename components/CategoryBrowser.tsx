"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Star, ShieldCheck, ShieldAlert, ShieldX, Shield,
  MapPin, Search, X, LayoutGrid, Map, SlidersHorizontal,
} from "lucide-react";
import { MapSkeleton, type MapPin as MapPinType } from "./CategoryMapTypes";

const CategoryMap = dynamic(() => import("./CategoryMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// ── Types ───────────────────────────────────────────────────────────────────

export type BrowserBusiness = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  listingTier: string;
  address: string;
  postcode: string;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
  hygieneRating: string | null;
  hygieneRatingShow: boolean;
  lat: number | null;
  lng: number | null;
  firstImage: string | null;
};

type SortOption = { key: string; label: string };
type AreaDef = { key: string; label: string };

type Props = {
  businesses: BrowserBusiness[];
  mapPins: MapPinType[];
  accentColor: string;
  themeGradient: string;
  emoji: string;
  category: string;
  isFoodCat: boolean;
  activeArea: string | undefined;
  activeSort: string;
  sortOptions: SortOption[];
  areas: AreaDef[];
  currentSort: string | undefined;
  currentArea: string | undefined;
  boostedBusinessIds?: string[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSnippet(b: BrowserBusiness): string | null {
  if (b.shortDescription) return b.shortDescription;
  if (b.description) {
    const first = b.description.split(/(?<=[.!?])\s+/)[0] ?? b.description;
    return first.length > 140 ? first.slice(0, 137) + "…" : first;
  }
  return null;
}

function getAreaLabel(address: string): string {
  const areas = ["Birkdale", "Ainsdale", "Churchtown", "Crossens", "Marshside",
    "Formby", "Ormskirk", "Scarisbrick", "Banks", "Halsall", "Burscough"];
  for (const a of areas) { if (address.includes(a)) return a; }
  return "Southport";
}

function hygieneStyle(r: string) {
  const n = parseInt(r);
  if (n >= 4) return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
  if (n === 3) return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
  if (n <= 2) return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
  return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" };
}

function HygieneIcon({ r }: { r: string }) {
  const n = parseInt(r);
  if (n >= 4) return <ShieldCheck className="w-3 h-3" />;
  if (n === 3) return <Shield className="w-3 h-3" />;
  if (n >= 0) return <ShieldAlert className="w-3 h-3" />;
  return <ShieldX className="w-3 h-3" />;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CategoryBrowser({
  businesses,
  mapPins,
  accentColor,
  themeGradient,
  emoji,
  category,
  isFoodCat,
  activeArea,
  activeSort,
  sortOptions,
  areas,
  currentSort,
  currentArea,
  boostedBusinessIds = [],
}: Props) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "map">("list");

  function buildUrl(overrides: Record<string, string | undefined>): string {
    const merged: Record<string, string> = {};
    if (currentSort) merged.sort = currentSort;
    if (currentArea) merged.area = currentArea;
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined) delete merged[k];
      else merged[k] = v;
    });
    const qs = new URLSearchParams(merged).toString();
    return `/${category}${qs ? `?${qs}` : ""}`;
  }

  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return businesses;
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.shortDescription ?? "").toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q)
    );
  }, [businesses, q]);

  const filteredPins = useMemo(() => {
    if (!q) return mapPins;
    return mapPins.filter((p) => p.name.toLowerCase().includes(q));
  }, [mapPins, q]);

  const activeAreaLabel = areas.find((a) => a.key === activeArea)?.label;

  return (
    <>
      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${category} in Southport…`}
          className="w-full pl-11 pr-11 py-3.5 text-sm bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400"
          style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Area filter — hidden on desktop (sidebar handles it) ──────────── */}
      <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 mr-1">
            <MapPin className="w-3 h-3" /> Area
          </span>
          <Link
            href={buildUrl({ area: undefined })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              !activeArea
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={!activeArea ? { backgroundColor: accentColor } : {}}
          >
            All
          </Link>
          {areas.map(({ key, label }) => (
            <Link
              key={key}
              href={buildUrl({ area: key })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeArea === key
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activeArea === key ? { backgroundColor: accentColor } : {}}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Sort + count + view toggle ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Sort options */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 shadow-sm px-2 py-1.5 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 mr-1 ml-1 shrink-0" />
          {sortOptions.map(({ key, label }) => (
            <Link
              key={key}
              href={buildUrl({ sort: key === "default" ? undefined : key })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSort === key
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
              style={activeSort === key ? { backgroundColor: accentColor } : {}}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Result count */}
        <span className="text-xs text-gray-400 ml-1 hidden sm:block">
          {q ? (
            <><span className="font-semibold text-gray-700">{filtered.length}</span> of {businesses.length} results</>
          ) : (
            <>
              <span className="font-semibold text-gray-700">{filtered.length}</span>
              {" "}listing{filtered.length !== 1 ? "s" : ""}
              {activeAreaLabel ? <span className="text-gray-300"> · </span> : null}
              {activeAreaLabel && <span className="font-medium text-gray-600">{activeAreaLabel}</span>}
            </>
          )}
        </span>

        {/* Map / List toggle — pushed to the right */}
        <div className="ml-auto flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === "list" ? "bg-gray-100 text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === "map" ? "bg-gray-100 text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {view === "map" ? (
        <CategoryMap pins={filteredPins} accentColor={accentColor} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">{emoji}</div>
          {q ? (
            <>
              <p className="text-gray-500 text-lg mb-2">No results for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="text-[#C9A84C] font-semibold text-sm hover:underline">
                Clear search
              </button>
            </>
          ) : activeArea ? (
            <>
              <p className="text-gray-500 text-lg mb-2">No listings in this area</p>
              <Link href={`/${category}`} className="text-[#C9A84C] font-semibold text-sm hover:underline">
                Clear area filter
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg mb-2">No listings yet</p>
              <p className="text-gray-400 text-sm mb-6">Be the first to list your business here.</p>
              <Link href="/claim-listing" className="inline-block bg-[#C9A84C] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#B8972A] transition-colors">
                Add Your Business
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const isFeatured = b.listingTier === "featured" || b.listingTier === "premium";
            const isBoosted = boostedBusinessIds.includes(b.id);
            const areaLabel = getAreaLabel(b.address);
            const showHygiene = isFoodCat && b.hygieneRating && b.hygieneRatingShow && /^\d+$/.test(b.hygieneRating);
            const hStyle = showHygiene && b.hygieneRating ? hygieneStyle(b.hygieneRating) : null;
            const snippet = getSnippet(b);

            return (
              <Link
                key={b.slug}
                href={`/${category}/${b.slug}`}
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 ${
                  isFeatured
                    ? "border-[#C9A84C]/40 ring-1 ring-[#C9A84C]/15 shadow-md hover:shadow-lg"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md shadow-sm"
                }`}
              >
                {/* Image / placeholder header */}
                <div className={`relative w-full h-44 flex-none overflow-hidden bg-gradient-to-br ${themeGradient}`}>
                  {b.firstImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.firstImage}
                        alt={b.name}
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

                  {/* Featured / boosted badge on image */}
                  {(isFeatured || isBoosted) && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {isFeatured && (
                        <span className="text-[10px] font-black bg-[#C9A84C] text-[#1B2E4B] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          ✦ Featured
                        </span>
                      )}
                      {isBoosted && !isFeatured && (
                        <span className="text-[10px] font-semibold bg-white/90 text-[#1B2E4B] px-2.5 py-1 rounded-full shadow-sm">
                          Featured This Week
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-display font-bold text-[#1B2E4B] text-base leading-snug group-hover:text-[#C9A84C] transition-colors mb-1 line-clamp-2">
                    {b.name}
                  </h2>

                  <p className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {areaLabel}{areaLabel !== "Southport" ? ", Southport" : ""}
                  </p>

                  {snippet ? (
                    <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-3 leading-relaxed">{snippet}</p>
                  ) : (
                    <div className="flex-1 mb-3" />
                  )}

                  <div className="flex items-center gap-2 flex-wrap mt-auto pt-3 border-t border-gray-50">
                    {b.rating ? (
                      <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {b.rating.toFixed(1)}
                        {b.reviewCount && (
                          <span className="font-normal text-amber-500">
                            ({b.reviewCount >= 1000 ? `${(b.reviewCount / 1000).toFixed(1)}k` : b.reviewCount})
                          </span>
                        )}
                      </span>
                    ) : null}

                    {showHygiene && hStyle && b.hygieneRating && (
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${hStyle.bg} ${hStyle.text} ${hStyle.border}`}>
                        <HygieneIcon r={b.hygieneRating} />
                        FSA {b.hygieneRating}★
                      </span>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                      {b.priceRange && (
                        <span className="text-gray-400 text-xs font-semibold">{b.priceRange}</span>
                      )}
                      <span
                        className="text-xs font-bold group-hover:translate-x-0.5 transition-transform"
                        style={{ color: accentColor }}
                      >
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
