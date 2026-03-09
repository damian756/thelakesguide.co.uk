import Link from "next/link";
import { Eye, Globe, Phone, MapPin, TrendingUp, BarChart2, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Analytics | Admin | SouthportGuide",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ period?: string; category?: string }>;
};

export default async function AdminAnalyticsPage({ searchParams }: Props) {
  const { period = "30", category = "all" } = await searchParams;
  const periodNum =
    period === "all" ? null : Math.min(365, Math.max(1, parseInt(period, 10) || 30));

  const now = new Date();
  const from = periodNum ? new Date(now.getTime() - periodNum * 86_400_000) : new Date(0);

  // Fetch all categories for the filter
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true },
  });

  // Fetch all businesses with their category
  const businesses = await prisma.business.findMany({
    where: category !== "all" ? { category: { slug: category } } : undefined,
    select: {
      id: true,
      name: true,
      slug: true,
      categoryId: true,
      category: { select: { name: true, slug: true } },
      claimed: true,
      listingTier: true,
      rating: true,
      reviewCount: true,
    },
    orderBy: { name: "asc" },
  });

  const businessIds = businesses.map((b) => b.id);

  // Fetch all clicks for these businesses in the period in one query
  const rawClicks = await prisma.businessClick.groupBy({
    by: ["businessId", "type"],
    where: {
      businessId: { in: businessIds },
      createdAt: { gte: from },
    },
    _count: { type: true },
  });

  // Build a map: businessId -> { view, website, phone, directions, google_reviews, total }
  type ClickMap = Record<string, number>;
  const clickMap = new Map<string, ClickMap>();
  for (const b of businesses) {
    clickMap.set(b.id, { view: 0, website: 0, phone: 0, directions: 0, google_reviews: 0, total: 0 });
  }
  for (const c of rawClicks) {
    const existing = clickMap.get(c.businessId);
    if (existing) {
      existing[c.type] = (existing[c.type] ?? 0) + c._count.type;
      existing.total += c._count.type;
    }
  }

  // Build sorted leaderboard
  const leaderboard = businesses
    .map((b) => ({
      ...b,
      clicks: clickMap.get(b.id) ?? { view: 0, website: 0, phone: 0, directions: 0, total: 0 },
    }))
    .sort((a, b) => b.clicks.total - a.clicks.total);

  // Summary totals
  const totals = leaderboard.reduce(
    (acc, b) => {
      acc.total += b.clicks.total;
      acc.view += b.clicks.view ?? 0;
      acc.website += b.clicks.website ?? 0;
      acc.phone += b.clicks.phone ?? 0;
      acc.directions += b.clicks.directions ?? 0;
      return acc;
    },
    { total: 0, view: 0, website: 0, phone: 0, directions: 0 }
  );

  // Category breakdown
  const catTotals = new Map<string, { name: string; slug: string; total: number; count: number }>();
  for (const b of leaderboard) {
    const existing = catTotals.get(b.category.slug);
    if (existing) {
      existing.total += b.clicks.total;
      existing.count += 1;
    } else {
      catTotals.set(b.category.slug, {
        name: b.category.name,
        slug: b.category.slug,
        total: b.clicks.total,
        count: 1,
      });
    }
  }
  const catBreakdown = Array.from(catTotals.values()).sort((a, b) => b.total - a.total);
  const maxCatTotal = Math.max(1, catBreakdown[0]?.total ?? 1);

  const periodLabel = period === "all" ? "All time" : `Last ${period} days`;
  const activeBusinesses = leaderboard.filter((b) => b.clicks.total > 0).length;

  return (
    <div className="max-w-7xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">{periodLabel} · {leaderboard.length} listings</p>
        </div>

        {/* Period + Category filters */}
        <div className="flex flex-wrap gap-2">
          {/* Period */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm text-sm">
            {[
              { label: "7d", value: "7" },
              { label: "30d", value: "30" },
              { label: "90d", value: "90" },
              { label: "All", value: "all" },
            ].map(({ label, value }) => (
              <Link
                key={value}
                href={`/admin/analytics?period=${value}&category=${category}`}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  period === value
                    ? "bg-[#1B2E4B] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm text-sm">
            <Link
              href={`/admin/analytics?period=${period}&category=all`}
              className={`px-3 py-1.5 font-medium transition-colors ${
                category === "all"
                  ? "bg-[#1B2E4B] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/admin/analytics?period=${period}&category=${cat.slug}`}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-[#1B2E4B] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total interactions", value: totals.total, icon: TrendingUp, accent: "#1B2E4B" },
          { label: "Listing views", value: totals.view, icon: Eye, accent: "#4A7D9A" },
          { label: "Website clicks", value: totals.website, icon: Globe, accent: "#2E7D6E" },
          { label: "Phone clicks", value: totals.phone, icon: Phone, accent: "#C9A84C" },
          { label: "Directions", value: totals.directions, icon: MapPin, accent: "#E8593A" },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
              <Icon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <p className="font-display text-3xl font-bold text-[#1B2E4B]">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-5">By category</h2>
          {catBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm">No data for this period.</p>
          ) : (
            <div className="space-y-4">
              {catBreakdown.map((cat) => (
                <div key={cat.slug}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <Link
                      href={`/admin/analytics?period=${period}&category=${cat.slug}`}
                      className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors"
                    >
                      {cat.name}
                    </Link>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                      <span>{cat.count} listings</span>
                      <span className="font-semibold text-[#1B2E4B]">{cat.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1B2E4B] rounded-full transition-all"
                      style={{ width: `${(cat.total / maxCatTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Active listings</p>
            <p className="font-display text-2xl font-bold text-[#1B2E4B]">
              {activeBusinesses}
              <span className="text-sm font-normal text-gray-400 ml-1">/ {leaderboard.length}</span>
            </p>
          </div>
        </div>

        {/* Leaderboard — top 10 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#1B2E4B]">Top listings</h2>
            <span className="text-xs text-gray-400">{periodLabel}</span>
          </div>
          {leaderboard.filter((b) => b.clicks.total > 0).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <BarChart2 className="w-10 h-10 mb-3 text-gray-200" />
              <p className="text-sm">No activity in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {leaderboard.filter((b) => b.clicks.total > 0).slice(0, 15).map((b, i) => {
                const maxTotal = leaderboard[0]?.clicks.total || 1;
                const pct = (b.clicks.total / maxTotal) * 100;
                return (
                  <div key={b.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 font-mono text-sm w-5 text-right flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/admin/businesses/${b.id}`}
                            className="font-semibold text-[#1B2E4B] text-sm truncate hover:text-[#C9A84C] transition-colors"
                          >
                            {b.name}
                          </Link>
                          {b.listingTier !== "free" && (
                            <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C9A84C]/10 text-[#C9A84C] uppercase">
                              {b.listingTier}
                            </span>
                          )}
                          <Link
                            href={`/${b.category.slug}/${b.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </Link>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{b.category.name}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{b.clicks.view}</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{b.clicks.website}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.clicks.phone}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.clicks.directions}</span>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1B2E4B] to-[#C9A84C]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="font-display font-bold text-[#1B2E4B] text-lg">
                          {b.clicks.total.toLocaleString()}
                        </span>
                        <p className="text-xs text-gray-400">total</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B]">All listings</h2>
          <span className="text-xs text-gray-400">{leaderboard.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Business</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <span className="flex items-center justify-center gap-1"><Eye className="w-3 h-3" />Views</span>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <span className="flex items-center justify-center gap-1"><Globe className="w-3 h-3" />Website</span>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <span className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" />Phone</span>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  <span className="flex items-center justify-center gap-1"><MapPin className="w-3 h-3" />Directions</span>
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaderboard.map((b, i) => (
                <tr
                  key={b.id}
                  className={`hover:bg-gray-50/60 transition-colors ${b.clicks.total === 0 ? "opacity-40" : ""}`}
                >
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">{i + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/businesses/${b.id}`}
                        className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors"
                      >
                        {b.name}
                      </Link>
                      {b.listingTier !== "free" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C9A84C]/10 text-[#C9A84C] uppercase">
                          {b.listingTier}
                        </span>
                      )}
                      {b.claimed && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                          claimed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{b.category.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#1B2E4B]">
                    {b.clicks.view > 0 ? b.clicks.view : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#1B2E4B]">
                    {b.clicks.website > 0 ? b.clicks.website : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#1B2E4B]">
                    {b.clicks.phone > 0 ? b.clicks.phone : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#1B2E4B]">
                    {b.clicks.directions > 0 ? b.clicks.directions : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-display font-bold ${b.clicks.total > 0 ? "text-[#1B2E4B]" : "text-gray-200"}`}>
                      {b.clicks.total > 0 ? b.clicks.total.toLocaleString() : "0"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
