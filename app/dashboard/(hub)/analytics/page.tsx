import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Eye, Globe, Phone, MapPin, BarChart2 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getClicksForPeriod,
  getDailyClickTrend,
  getAllTimeClicks,
  getCategoryBenchmark,
  getCategoryRank,
} from "@/lib/hub-analytics";
import PeriodSelector from "./PeriodSelector";

export const metadata = {
  title: "Analytics | Business Hub",
  description: "View your listing performance.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ period?: string }>;
};

export default async function AnalyticsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { businesses: { include: { category: true } } },
  });
  const business = user?.businesses[0];
  if (!business) redirect("/dashboard");

  const { period = "30" } = await searchParams;
  const periodNum =
    period === "all" ? null : Math.min(365, Math.max(1, parseInt(period, 10) || 30));

  const now = new Date();
  const from = periodNum
    ? new Date(now.getTime() - periodNum * 86400000)
    : new Date(0);
  const to = new Date();

  const [
    periodClicks,
    dailyTrend,
    allTimeClicks,
    categoryBenchmark,
    categoryRank,
  ] = await Promise.all([
    getClicksForPeriod(business.id, from, to),
    getDailyClickTrend(business.id, periodNum ?? 365),
    getAllTimeClicks(business.id),
    periodNum
      ? getCategoryBenchmark(business.id, business.categoryId, from, to)
      : Promise.resolve(0),
    periodNum
      ? getCategoryRank(business.id, business.categoryId, from, to)
      : Promise.resolve({ rank: 0, total: 0 }),
  ]);

  const views = periodClicks.view;
  const totalPeriod = views + periodClicks.website + periodClicks.phone + periodClicks.directions;
  const maxDaily = Math.max(1, ...dailyTrend.map((d) => d.count));

  const dayNames = dailyTrend.map((d) => {
    const dt = new Date(d.date);
    return dt.toLocaleDateString("en-GB", { weekday: "short" });
  });

  const statCards = [
    { key: "view", label: "Listing views", icon: Eye, value: periodClicks.view },
    { key: "website", label: "Website clicks", icon: Globe, value: periodClicks.website },
    { key: "phone", label: "Phone clicks", icon: Phone, value: periodClicks.phone },
    { key: "directions", label: "Directions", icon: MapPin, value: periodClicks.directions },
  ];

  const dayOfWeekCounts = new Array(7).fill(0);
  const hourCounts = new Array(24).fill(0);

  const clicksForInsights = await prisma.businessClick.findMany({
    where: { businessId: business.id },
    select: { createdAt: true },
  });
  for (const c of clicksForInsights) {
    const d = new Date(c.createdAt);
    dayOfWeekCounts[(d.getDay() + 6) % 7]++;
    hourCounts[d.getHours()]++;
  }
  const busiestDayIdx = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));
  const busiestHourIdx = hourCounts.indexOf(Math.max(...hourCounts));
  const busiestDay =
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
      busiestDayIdx
    ];
  const busiestHour =
    hourCounts.every((h) => h === 0)
      ? null
      : `${busiestHourIdx}:00–${busiestHourIdx + 1}:00`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">
          Analytics
        </h1>
        <PeriodSelector />
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, value }) => (
          <div
            key={key}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase mb-2">
              <Icon className="w-4 h-4" />
              <span>
                {period === "all" ? "All time" : `Last ${period} days`}
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-[#1B2E4B]">
              {value}
            </p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Daily chart — SVG area chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-1">
          Daily Activity — last{" "}
          {period === "all" ? "365" : period} days
        </h2>
        <p className="text-xs text-gray-400 mb-5">Total clicks and views per day</p>
        {maxDaily > 0 && dailyTrend.length > 0 ? (() => {
          const svgW = 700, svgH = 200;
          const pad = { top: 16, right: 16, bottom: 36, left: 44 };
          const cW = svgW - pad.left - pad.right;
          const cH = svgH - pad.top - pad.bottom;
          const n = dailyTrend.length;
          const spikeThreshold = maxDaily * 0.65;
          const recentCount = Math.min(7, n);

          const toX = (i: number) =>
            pad.left + (n > 1 ? (i / (n - 1)) * cW : cW / 2);
          const toY = (v: number) =>
            pad.top + cH - (v / maxDaily) * cH;

          const firstX = toX(0);
          const lastX = toX(n - 1);
          const bottomY = pad.top + cH;

          const linePoints = dailyTrend
            .map((d, i) => `${toX(i)},${toY(d.count)}`)
            .join(" ");

          const areaPath =
            `M${firstX},${toY(dailyTrend[0]?.count ?? 0)} ` +
            dailyTrend.map((d, i) => `${toX(i)},${toY(d.count)}`).join(" ") +
            ` L${lastX},${bottomY} L${firstX},${bottomY} Z`;

          // Y-axis: 0, half, max
          const yLabels = [0, Math.round(maxDaily / 2), maxDaily];

          // X-axis: show ~5 date labels evenly spaced
          const xLabelIndices = (() => {
            if (n <= 8) return dailyTrend.map((_, i) => i);
            const step = Math.floor(n / 4);
            const indices = [0];
            for (let i = step; i < n - step / 2; i += step) indices.push(i);
            if (indices[indices.length - 1] !== n - 1) indices.push(n - 1);
            return indices;
          })();

          return (
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full"
                style={{ minWidth: 320, height: svgH }}
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B2E4B" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#1B2E4B" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Y-axis grid + labels */}
                {yLabels.map((v) => (
                  <g key={v}>
                    <line
                      x1={pad.left} x2={svgW - pad.right}
                      y1={toY(v)} y2={toY(v)}
                      stroke="#f0f0f0" strokeWidth="1"
                    />
                    <text
                      x={pad.left - 6} y={toY(v) + 4}
                      textAnchor="end" fontSize="10" fill="#9ca3af"
                    >
                      {v}
                    </text>
                  </g>
                ))}

                {/* Area fill */}
                <path d={areaPath} fill="url(#areaGrad)" />

                {/* Line */}
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#1B2E4B"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.5"
                />

                {/* Dots — gold for spikes, green for recent 7 days, navy otherwise */}
                {dailyTrend.map((d, i) => {
                  const isSpike = d.count >= spikeThreshold;
                  const isRecent = i >= n - recentCount;
                  const fill = isSpike
                    ? "#C9A84C"
                    : isRecent
                    ? "#10b981"
                    : "#1B2E4B";
                  const r = isSpike ? 5 : isRecent ? 4 : 3;
                  return d.count > 0 ? (
                    <circle
                      key={d.date}
                      cx={toX(i)} cy={toY(d.count)}
                      r={r} fill={fill}
                    >
                      <title>{d.date}: {d.count} clicks</title>
                    </circle>
                  ) : null;
                })}

                {/* X-axis date labels */}
                {xLabelIndices.map((i) => {
                  const d = dailyTrend[i];
                  if (!d) return null;
                  const label = new Date(d.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  });
                  return (
                    <text
                      key={d.date}
                      x={toX(i)} y={svgH - 6}
                      textAnchor="middle"
                      fontSize="10" fill="#9ca3af"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
              <div className="flex gap-5 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B2E4B]/50 flex-shrink-0" />
                  Activity
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  Last 7 days
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
                  Event spike
                </span>
              </div>
            </div>
          );
        })() : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <BarChart2 className="w-12 h-12 text-gray-300 mb-3" />
            <p>No activity in this period</p>
          </div>
        )}
      </div>

      {/* Insights */}
      {(busiestDay || busiestHour) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
            Insights
          </h2>
          <div className="space-y-2 text-sm">
            {busiestDay && (
              <p className="text-gray-600">
                Your busiest day of the week: <strong>{busiestDay}</strong>
              </p>
            )}
            {busiestHour && (
              <p className="text-gray-600">
                Peak hour: <strong>{busiestHour}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Benchmark row */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
          How you compare
        </h2>
        {business.hubTier === "pro" && periodNum ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Your views</p>
              <p className="font-display text-2xl font-bold text-[#1B2E4B]">
                {views}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">
                Category average
              </p>
              <p className="font-display text-2xl font-bold text-[#1B2E4B]">
                {Math.round(categoryBenchmark)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Your rank</p>
              <p className="font-display text-2xl font-bold text-[#1B2E4B]">
                {categoryRank.rank}th of {categoryRank.total}{" "}
                {business.category.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#1B2E4B] p-6 text-white">
            <p className="font-semibold mb-2">
              Upgrade to Pro to see how you compare
            </p>
            <p className="text-white/70 text-sm mb-4">
              See your rank versus other {business.category.name} in Southport,
              and get category benchmarks.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972A] text-[#1B2E4B] px-4 py-2 rounded-full font-bold text-sm transition-colors"
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}
      </div>

      {/* All-time totals */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
          All-time totals
        </h2>
        <p className="text-gray-600 text-sm">
          Since joining:{" "}
          <strong>{allTimeClicks.view}</strong> views,{" "}
          <strong>{allTimeClicks.website}</strong> website clicks,{" "}
          <strong>{allTimeClicks.phone}</strong> phone clicks,{" "}
          <strong>{allTimeClicks.directions}</strong> directions
        </p>
      </div>
    </div>
  );
}
