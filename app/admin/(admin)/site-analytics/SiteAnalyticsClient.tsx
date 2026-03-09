"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Zap,
  BarChart2,
  AlertTriangle,
} from "lucide-react";

type Pulse = {
  totalLast24h: number;
  totalPrior24h: number;
  viewsLast24h: number;
  viewsPrior24h: number;
  conversionsLast24h: number;
  conversionsPrior24h: number;
  pageViewsLast24h: number;
  pageViewsPrior24h: number;
  pendingReviews: number;
  pendingClaims: number;
  activeBoosts: number;
};

type Trend = {
  businessClickDaily: { date: string; count: number }[];
  pageViewDaily: { date: string; count: number }[];
  eventsInPeriod: { title: string; isoDate: string; dayLabel: string; emoji: string }[];
};

type CategoryRow = {
  category: { slug: string; name: string };
  viewsCurrent: number;
  viewsPrior: number;
  pctChange: number;
  engagementRate: number;
  claimedPct: number;
  deadCount: number;
  topPerformer: string;
};

type Funnel = {
  total: number;
  withActivity: number;
  claimed: number;
  pro: number;
  paidTier: number;
  activeBoost: number;
};

type BusinessBasic = {
  id: string;
  name: string;
  slug: string;
  category: { slug: string; name: string };
};

type VisibilityResult = { score: number; items: { label: string; earned: boolean }[] };

type Props = {
  period: number;
  periodLabel: string;
  pulse: Pulse;
  trend: Trend;
  categoryMatrix: CategoryRow[];
  funnel: Funnel;
  highTrafficUnclaimed: { business: BusinessBasic; views: number }[];
  claimedLowEngagement: { business: BusinessBasic; views: number; conversions: number; rate: number }[];
  notConvertingWithVisibility: {
    business: BusinessBasic & { description?: string | null; shortDescription?: string | null; phone?: string | null; website?: string | null; openingHours?: unknown; images?: string[]; rating?: number | null };
    clicks: Record<string, number>;
    visibility: VisibilityResult;
  }[];
  hotRightNow: { business: BusinessBasic; currViews: number; priorViews: number; delta: number }[];
  consistentlyStrong: (BusinessBasic & { weeksInTop20: number })[];
  reviews: { status: string; emailVerifiedAt: string | Date | null; verifiedType: string; flaggedAt: string | Date | null; createdAt: string | Date; approvedAt: string | Date | null; businessId: string }[];
  mrr: number;
  boostRevenuePounds: number;
  activeSubscriptions: number;
  avgPendingReviewAge: number;
  topReviewedBusinesses: { id: string; name: string; slug: string; category: { slug: string } }[];
  topReviewedCounts: Record<string, number>;
  showOpen2026: boolean;
  openBoosts: { business: { name: string }; category: { name: string }; type: string; startsAt: string | Date; label: string | null }[];
  openUnclaimed: { businessId: string; views: number; business?: { name: string; slug: string; category: { name: string; slug: string } } | null }[];
};

function PctChange({ current, prior }: { current: number; prior: number }) {
  if (prior === 0) {
    return current > 0 ? (
      <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
        <TrendingUp className="w-3 h-3" /> +100%
      </span>
    ) : null;
  }
  const pct = ((current - prior) / prior) * 100;
  if (pct > 0)
    return (
      <span className="text-emerald-600 text-xs font-semibold flex items-center gap-0.5">
        <TrendingUp className="w-3 h-3" /> +{pct.toFixed(0)}%
      </span>
    );
  if (pct < 0)
    return (
      <span className="text-red-500 text-xs font-semibold flex items-center gap-0.5">
        <TrendingDown className="w-3 h-3" /> {pct.toFixed(0)}%
      </span>
    );
  return null;
}

function StatCard({
  label,
  value,
  current,
  prior,
  alert,
}: {
  label: string;
  value: string | number;
  current?: number;
  prior?: number;
  alert?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between min-h-[100px] ${alert ? "border-amber-300 bg-amber-50" : "border-gray-100"}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wide leading-tight">{label}</p>
      <div>
        <p className={`font-display text-2xl font-bold mt-1 ${alert ? "text-amber-700" : "text-[#1B2E4B]"}`}>
          {value}
        </p>
        <div className="h-4 mt-1">
          {current !== undefined && prior !== undefined ? (
            <PctChange current={current} prior={prior} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FunnelBar({ label, count, total, color = "bg-[#1B2E4B]" }: { label: string; count: number; total: number; color?: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-32 shrink-0 text-right">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`${color} h-2.5 rounded-full transition-all`}
          style={{ width: `${Math.max(pct, count > 0 ? 1 : 0)}%` }}
        />
      </div>
      <span className="font-bold text-sm text-[#1B2E4B] w-10 text-right">{count.toLocaleString()}</span>
      {total > 0 && count !== total && (
        <span className="text-xs text-gray-400 w-10">{pct.toFixed(0)}%</span>
      )}
    </div>
  );
}

export default function SiteAnalyticsClient({
  period,
  periodLabel,
  pulse,
  trend,
  categoryMatrix,
  funnel,
  highTrafficUnclaimed,
  claimedLowEngagement,
  notConvertingWithVisibility,
  hotRightNow,
  consistentlyStrong,
  reviews,
  mrr,
  boostRevenuePounds,
  activeSubscriptions,
  avgPendingReviewAge,
  topReviewedBusinesses,
  topReviewedCounts,
  showOpen2026,
  openBoosts,
  openUnclaimed,
}: Props) {
  const [categorySort, setCategorySort] = useState<"views" | "engagement" | "dead">("views");

  const bcByDate = new Map(trend.businessClickDaily.map((r) => [r.date, r.count]));
  const pvByDate = new Map(trend.pageViewDaily.map((r) => [r.date, r.count]));
  const allDates: string[] = [];
  for (let d = 0; d < period; d++) {
    const dt = new Date();
    dt.setDate(dt.getDate() - (period - 1 - d));
    allDates.push(dt.toISOString().slice(0, 10));
  }
  const maxDaily = Math.max(
    1,
    ...allDates.map((d) => (bcByDate.get(d) ?? 0) + (pvByDate.get(d) ?? 0))
  );

  const sortedCategories = [...categoryMatrix].sort((a, b) => {
    if (categorySort === "views") return b.viewsCurrent - a.viewsCurrent;
    if (categorySort === "engagement") return b.engagementRate - a.engagementRate;
    return b.deadCount - a.deadCount;
  });

  const totalSubmitted = reviews.length;
  const emailVerified = reviews.filter((r) => r.emailVerifiedAt).length;
  const approved = reviews.filter((r) => r.status === "approved").length;
  const verifiedPurchase = reviews.filter((r) => r.verifiedType === "purchase").length;
  const flagged = reviews.filter((r) => r.flaggedAt).length;
  const avgApprovalDays =
    reviews.filter((r) => r.approvedAt).length > 0
      ? reviews
          .filter((r) => r.approvedAt)
          .reduce((s, r) => {
            const approvedTime = new Date(r.approvedAt as string | Date).getTime();
            const created = new Date(r.createdAt as string | Date).getTime();
            return s + (approvedTime - created) / 86400000;
          }, 0) / reviews.filter((r) => r.approvedAt).length
      : 0;

  return (
    <div className="max-w-7xl space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Site Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Last {period} days</p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm text-sm">
          {["7", "30", "90"].map((p) => (
            <Link
              key={p}
              href={`/admin/site-analytics?period=${p}`}
              className={`px-3 py-1.5 font-medium transition-colors ${
                periodLabel === p ? "bg-[#1B2E4B] text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}d
            </Link>
          ))}
        </div>
      </div>

      {/* Section 1 — Site Pulse */}
      <div className="space-y-3">
        {/* Row 1: Traffic metrics (with % change) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total interactions (24h)" value={pulse.totalLast24h.toLocaleString()} current={pulse.totalLast24h} prior={pulse.totalPrior24h} />
          <StatCard label="Listing views (24h)" value={pulse.viewsLast24h.toLocaleString()} current={pulse.viewsLast24h} prior={pulse.viewsPrior24h} />
          <StatCard label="Conversions (24h)" value={pulse.conversionsLast24h.toLocaleString()} current={pulse.conversionsLast24h} prior={pulse.conversionsPrior24h} />
          <StatCard label="Page views (24h)" value={pulse.pageViewsLast24h.toLocaleString()} current={pulse.pageViewsLast24h} prior={pulse.pageViewsPrior24h} />
        </div>
        {/* Row 2: Status metrics (no % change, alert if non-zero) */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Pending reviews" value={pulse.pendingReviews} alert={pulse.pendingReviews > 0} />
          <StatCard label="Pending claims" value={pulse.pendingClaims} alert={pulse.pendingClaims > 0} />
          <StatCard label="Active boosts" value={pulse.activeBoosts} />
        </div>
      </div>

      {/* Section 2 — Traffic Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-5">Traffic trend</h2>
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-300 pr-2 select-none pointer-events-none" style={{ width: 32 }}>
            <span>{maxDaily}</span>
            <span>{Math.round(maxDaily / 2)}</span>
            <span>0</span>
          </div>
          <div className="ml-8 flex gap-0.5 items-end h-32">
            {allDates.map((d) => {
              const bc = bcByDate.get(d) ?? 0;
              const pv = pvByDate.get(d) ?? 0;
              const total = bc + pv;
              const pct = (total / maxDaily) * 100;
              return (
                <div
                  key={d}
                  className="flex-1 flex flex-col justify-end gap-0.5 group"
                  title={`${d}: ${bc} listing views, ${pv} page views`}
                >
                  <div
                    className="w-full bg-[#1B2E4B] rounded-t min-h-[2px] group-hover:bg-[#2a4270] transition-colors"
                    style={{ height: `${Math.max(2, (bc / maxDaily) * 100)}%` }}
                  />
                  <div
                    className="w-full bg-[#C9A84C]/60 rounded-t min-h-[2px] group-hover:bg-[#C9A84C]/80 transition-colors"
                    style={{ height: `${Math.max(2, (pv / maxDaily) * 100)}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#1B2E4B]" /> Listing views</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#C9A84C]/60" /> Page views</span>
        </div>
        {trend.eventsInPeriod.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            {trend.eventsInPeriod.map((e) => (
              <span key={e.isoDate} className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-200">
                {e.emoji} {e.title} ({e.dayLabel})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 3 — Category Matrix */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B]">Category performance</h2>
          <div className="flex gap-2">
            {(["views", "engagement", "dead"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setCategorySort(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${categorySort === s ? "bg-[#1B2E4B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {s === "views" ? "By views" : s === "engagement" ? "By engagement" : "By dead listings"}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-right pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Views</th>
                <th className="text-right pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">vs prior</th>
                <th className="text-right pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Engagement</th>
                <th className="text-right pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Claimed</th>
                <th className="text-right pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Dead</th>
                <th className="text-left pb-3 font-semibold text-gray-500 text-xs uppercase tracking-wide pl-4">Top performer</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((row, i) => {
                const pct = row.viewsPrior > 0
                  ? ((row.viewsCurrent - row.viewsPrior) / row.viewsPrior) * 100
                  : null;
                return (
                  <tr key={row.category.slug} className={i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}>
                    <td className="py-2.5 px-2 font-medium text-[#1B2E4B] rounded-l">{row.category.name}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{row.viewsCurrent.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {pct === null ? (
                        <span className="text-gray-300">—</span>
                      ) : pct > 0 ? (
                        <span className="text-emerald-600 font-semibold">+{pct.toFixed(0)}%</span>
                      ) : pct < 0 ? (
                        <span className="text-red-500 font-semibold">{pct.toFixed(0)}%</span>
                      ) : (
                        <span className="text-gray-400">0%</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-gray-600">{row.engagementRate.toFixed(1)}%</td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-gray-600">{row.claimedPct.toFixed(0)}%</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {row.deadCount > 0 ? (
                        <span className="text-amber-600 font-semibold">{row.deadCount}</span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 pl-4 text-gray-500 rounded-r">{row.topPerformer}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4 — Funnel + Revenue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-6">Business funnel</h2>

        {/* Visual funnel bars */}
        <div className="space-y-3 mb-8">
          <FunnelBar label="Total listings" count={funnel.total} total={funnel.total} color="bg-[#1B2E4B]" />
          <FunnelBar label="With activity" count={funnel.withActivity} total={funnel.total} color="bg-[#2a4270]" />
          <FunnelBar label="Claimed" count={funnel.claimed} total={funnel.total} color="bg-[#C9A84C]" />
          <FunnelBar label="Pro hub" count={funnel.pro} total={funnel.total} color="bg-[#C9A84C]/70" />
          <FunnelBar label="Paid tier" count={funnel.paidTier} total={funnel.total} color="bg-emerald-500" />
          <FunnelBar label="Active boost" count={funnel.activeBoost} total={funnel.total} color="bg-emerald-400" />
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-3 gap-4 mb-8 pt-5 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Est. MRR</p>
            <p className="font-display text-2xl font-bold text-[#1B2E4B]">£{mrr.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{activeSubscriptions} active subs</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Boost revenue</p>
            <p className="font-display text-2xl font-bold text-[#1B2E4B]">£{boostRevenuePounds.toFixed(0)}</p>
            <p className="text-xs text-gray-400 mt-1">This period</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Unclaimed (high traffic)</p>
            <p className="font-display text-2xl font-bold text-amber-600">{highTrafficUnclaimed.length}</p>
            <p className="text-xs text-gray-400 mt-1">Revenue opportunity</p>
          </div>
        </div>

        {/* Sub-lists */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1B2E4B] mb-3 text-sm">High-traffic unclaimed</h3>
            {highTrafficUnclaimed.length === 0 ? (
              <p className="text-gray-400 text-sm">None</p>
            ) : (
              <ul className="space-y-2">
                {highTrafficUnclaimed.map(({ business, views }) => (
                  <li key={business.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                    <Link href={`/admin/businesses/${business.id}`} className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors">
                      {business.name}
                    </Link>
                    <span className="text-gray-400 tabular-nums">{views} views</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2E4B] mb-3 text-sm">Claimed, low engagement</h3>
            {claimedLowEngagement.length === 0 ? (
              <p className="text-gray-400 text-sm">None</p>
            ) : (
              <ul className="space-y-2">
                {claimedLowEngagement.map(({ business, views, rate }) => (
                  <li key={business.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                    <Link href={`/admin/businesses/${business.id}`} className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors">
                      {business.name}
                    </Link>
                    <span className="text-gray-400 tabular-nums">{views} views · {rate.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Section 5 — Engagement Intel */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Not converting — amber accent (most actionable) */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-6">
          <h3 className="font-display font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Getting views, not converting
          </h3>
          {notConvertingWithVisibility.length === 0 ? (
            <p className="text-amber-700/50 text-sm">None</p>
          ) : (
            <ul className="space-y-3">
              {notConvertingWithVisibility.slice(0, 5).map(({ business, visibility }) => (
                <li key={business.id}>
                  <Link href={`/admin/businesses/${business.id}`} className="font-medium text-sm text-amber-900 hover:text-[#C9A84C] transition-colors">
                    {business.name}
                  </Link>
                  <p className="text-xs text-amber-700/70 mt-0.5">Score: {visibility.score}/100</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Missing: {visibility.items.filter((i) => !i.earned).map((i) => i.label).join(", ") || "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hot right now */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#1B2E4B] mb-3 flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-[#C9A84C]" /> Hot right now
          </h3>
          {hotRightNow.length === 0 ? (
            <p className="text-gray-400 text-sm">None</p>
          ) : (
            <ul className="space-y-2">
              {hotRightNow.map(({ business, currViews, delta }) => (
                <li key={business.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                  <Link href={`/admin/businesses/${business.id}`} className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors truncate mr-2">
                    {business.name}
                  </Link>
                  <span className="text-emerald-600 font-semibold shrink-0 tabular-nums">+{delta}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Consistently strong */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#1B2E4B] mb-3 flex items-center gap-2 text-sm">
            <BarChart2 className="w-4 h-4 text-[#1B2E4B]" /> Consistently strong
          </h3>
          {consistentlyStrong.length === 0 ? (
            <p className="text-gray-400 text-sm">None</p>
          ) : (
            <ul className="space-y-2">
              {consistentlyStrong.map((b) => (
                <li key={b.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                  <Link href={`/${b.category.slug}/${b.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors truncate mr-2">
                    {b.name}
                  </Link>
                  <span className="text-gray-400 text-xs shrink-0">{b.weeksInTop20}w</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Section 6 — Review Health */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-5">Review system health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Submitted", value: totalSubmitted },
            { label: "Email verified", value: `${totalSubmitted > 0 ? ((emailVerified / totalSubmitted) * 100).toFixed(0) : 0}%` },
            { label: "Approval rate", value: `${totalSubmitted > 0 ? ((approved / totalSubmitted) * 100).toFixed(0) : 0}%` },
            { label: "With receipt", value: verifiedPurchase },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-display text-2xl font-bold text-[#1B2E4B]">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "IP flag rate", value: `${totalSubmitted > 0 ? ((flagged / totalSubmitted) * 100).toFixed(1) : 0}%`, warn: flagged > 0 },
            { label: "Avg days to approval", value: avgApprovalDays.toFixed(1) },
            { label: "Pending avg age", value: `${avgPendingReviewAge.toFixed(1)} days`, warn: avgPendingReviewAge > 3 },
          ].map(({ label, value, warn }) => (
            <div key={label} className={`rounded-xl p-4 ${warn ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}>
              <p className={`text-xs uppercase tracking-wide mb-1 ${warn ? "text-amber-600" : "text-gray-400"}`}>{label}</p>
              <p className={`font-display text-xl font-bold ${warn ? "text-amber-700" : "text-[#1B2E4B]"}`}>{value}</p>
            </div>
          ))}
        </div>
        {topReviewedBusinesses.length > 0 && (
          <div className="pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Top reviewed businesses</p>
            <ul className="space-y-2">
              {topReviewedBusinesses.map((b) => (
                <li key={b.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                  <Link href={`/${b.category.slug}/${b.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1B2E4B] hover:text-[#C9A84C] transition-colors">
                    {b.name}
                  </Link>
                  <span className="text-gray-400 tabular-nums">{topReviewedCounts[b.id] ?? 0} reviews</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 7 — Open 2026 */}
      {showOpen2026 && (
        <div className="bg-[#1B2E4B] rounded-2xl p-6 text-white">
          <h2 className="font-display text-lg font-bold text-white mb-5">Open 2026 command centre</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#C9A84C] mb-3 text-sm">Active boosts in Open window</h3>
              {openBoosts.length === 0 ? (
                <p className="text-white/40 text-sm">None yet</p>
              ) : (
                <ul className="space-y-2">
                  {openBoosts.map((b, i) => (
                    <li key={i} className="text-sm py-1.5 border-b border-white/10">
                      <span className="font-medium">{b.business.name}</span>
                      <span className="text-white/50 ml-2">{b.category.name} · {b.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-[#C9A84C] mb-3 text-sm">Unclaimed high-traffic (Open categories)</h3>
              {openUnclaimed.length === 0 ? (
                <p className="text-white/40 text-sm">None</p>
              ) : (
                <ul className="space-y-2">
                  {openUnclaimed.map((u) => (
                    <li key={u.businessId} className="flex items-center justify-between text-sm py-1.5 border-b border-white/10">
                      <Link
                        href={u.business ? `/${u.business.category.slug}/${u.business.slug}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-white hover:text-[#C9A84C] transition-colors"
                      >
                        {u.business?.name ?? u.businessId}
                      </Link>
                      <span className="text-white/50 tabular-nums">{u.views} views</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
