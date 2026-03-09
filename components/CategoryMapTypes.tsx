export type MapPin = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
  listingTier: string;
  address: string;
  category: string;
};

export function MapSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-gray-100 border border-gray-200 animate-pulse flex items-center justify-center" style={{ height: 520 }}>
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-sm">Loading map…</p>
      </div>
    </div>
  );
}
