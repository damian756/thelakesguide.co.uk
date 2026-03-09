import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import UpgradeSuccessBanner from "./UpgradeSuccessBanner";
import {
  Eye,
  Globe,
  Phone,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Zap,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getClicksForPeriod,
  getDailyClickTrend,
  getVisibilityScore,
} from "@/lib/hub-analytics";
import {
  getUpcomingEvents,
  getEventImpactEstimate,
  getBoostedCountInCategory,
} from "@/lib/event-intel";
import { formatDistanceToNow } from "date-fns";

function getWeekBounds(): { thisWeekStart: Date; thisWeekEnd: Date; lastWeekStart: Date; lastWeekEnd: Date } {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);
  const thisWeekEnd = new Date(thisMonday);
  thisWeekEnd.setDate(thisMonday.getDate() + 7);
  thisWeekEnd.setMilliseconds(-1);
  const lastWeekStart = new Date(thisMonday);
  lastWeekStart.setDate(thisMonday.getDate() - 7);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
  lastWeekEnd.setHours(23, 59, 59, 999);
  return { thisWeekStart: thisMonday, thisWeekEnd: now, lastWeekStart, lastWeekEnd };
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatTrend(value: number): { icon: "up" | "down" | "flat"; text: string; positive: boolean } {
  if (value > 0) return { icon: "up", text: `+${value}%`, positive: true };
  if (value < 0) return { icon: "down", text: `${value}%`, positive: false };
  return { icon: "flat", text: "No change", positive: false };
}

export const metadata = {
  title: "Overview | Business Hub",
  description: "Your business dashboard.",
  robots: { index: false, follow: false },
};

export default async function HubHomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { businesses: { include: { category: true } } },
  });
  const business = user?.businesses[0];
  if (!business) redirect("/dashboard");

  const { thisWeekStart, thisWeekEnd, lastWeekStart, lastWeekEnd } = getWeekBounds();

  const [thisWeekClicks, lastWeekClicks, dailyTrend, latestSnapshot, activeBoost, upcomingEvents, visibility] =
    await Promise.all([
      getClicksForPeriod(business.id, thisWeekStart, thisWeekEnd),
      getClicksForPeriod(business.id, lastWeekStart, lastWeekEnd),
      getDailyClickTrend(business.id, 7),
      prisma.reviewSnapshot.findFirst({
        where: { businessId: business.id },
        orderBy: { snapshotAt: "desc" },
      }),
      prisma.listingBoost.findFirst({
        where: {
          businessId: business.id,
          status: "active",
          startsAt: { lte: new Date() },
          endsAt: { gte: new Date() },
        },
        select: { label: true, endsAt: true },
      }),
      getUpcomingEvents(90),
      getVisibilityScore(business),
    ]);

  const statCards = [
    {
      key: "view",
      label: "Listing views",
      icon: Eye,
      thisWeek: thisWeekClicks.view,
      lastWeek: lastWeekClicks.view,
    },
    {
      key: "website",
      label: "Website clicks",
      icon: Globe,
      thisWeek: thisWeekClicks.website,
      lastWeek: lastWeekClicks.website,
    },
    {
      key: "phone",
      label: "Phone clicks",
      icon: Phone,
      thisWeek: thisWeekClicks.phone,
      lastWeek: lastWeekClicks.phone,
    },
    {
      key: "directions",
      label: "Directions",
      icon: MapPin,
      thisWeek: thisWeekClicks.directions,
      lastWeek: lastWeekClicks.directions,
    },
  ];

  const maxDaily = Math.max(1, ...dailyTrend.map((d) => d.count));
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx = (new Date().getDay() + 6) % 7;

  const reviewDelta =
    business.reviewCount != null && latestSnapshot
      ? business.reviewCount - latestSnapshot.reviewCount
      : 0;

  const googleMapsUrl = business.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${business.placeId}`
    : null;

  const nextEvent = upcomingEvents[0];
  const categoryName = business.category.name;
  const categorySlug = business.category.slug;

  let eventImpact: string | null = null;
  let boostedCount = 0;
  if (nextEvent) {
    eventImpact = getEventImpactEstimate(nextEvent.name, categorySlug);
    const eventEnd = nextEvent.dateEnd ?? new Date(new Date(nextEvent.dateStart).getTime() + 86400000);
    boostedCount = await getBoostedCountInCategory(
      business.categoryId,
      business.id,
      new Date(nextEvent.dateStart),
      eventEnd
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Suspense fallback={null}>
        <UpgradeSuccessBanner />
      </Suspense>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">
          {getGreeting()}, {business.name}
        </h1>
        <p className="text-sm text-gray-400">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, thisWeek, lastWeek }) => {
          const pct =
            lastWeek > 0
              ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
              : thisWeek > 0
                ? 100
                : 0;
          const trend = formatTrend(pct);
          return (
            <div
              key={key}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 uppercase mb-2">
                <Icon className="w-4 h-4" />
                <span>This week</span>
              </div>
              <p className="font-display text-3xl font-bold text-[#1B2E4B]">
                {thisWeek}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
              <div
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                  trend.positive
                    ? "text-emerald-600"
                    : trend.icon === "flat"
                      ? "text-gray-500"
                      : "text-red-500"
                }`}
              >
                {trend.icon === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                {trend.icon === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                {trend.icon === "flat" && <Minus className="w-3.5 h-3.5" />}
                <span>
                  vs last week {trend.icon !== "flat" ? trend.text : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Visibility score */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">
              Your Visibility Score
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-3 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-[#C9A84C] rounded-full transition-all"
                  style={{ width: `${visibility.score}%` }}
                />
              </div>
              <span className="font-display font-bold text-[#1B2E4B] text-lg">
                {visibility.score} / 100
              </span>
            </div>
            <ul className="space-y-2">
              {visibility.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between py-1"
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-sm hover:text-[#C9A84C] transition-colors"
                    >
                      {item.earned ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={item.earned ? "text-gray-700" : "text-gray-500"}>
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.earned ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={item.earned ? "text-gray-700" : "text-gray-500"}>
                        {item.label}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400">+{item.points}pts</span>
                </li>
              ))}
            </ul>
            {visibility.score < 100 && (
              <Link
                href="/dashboard/listing"
                className="mt-4 inline-block text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A] transition-colors"
              >
                Complete your listing →
              </Link>
            )}
          </div>

          {/* 7-day chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
              Last 7 days
            </h2>
            {maxDaily > 0 ? (
              <>
                <div className="flex items-end gap-1 h-16">
                  {dailyTrend.map((d, i) => (
                    <div
                      key={d.date}
                      className="flex-1 rounded-t flex flex-col justify-end"
                    >
                      <div
                        className={`w-full rounded-t ${
                          i === todayIdx ? "bg-[#C9A84C]" : "bg-[#1B2E4B]/20"
                        }`}
                        style={{
                          height: `${(d.count / maxDaily) * 100}%`,
                          minHeight: d.count > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  {dayNames.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm py-4">No activity yet</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Google Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-[#1B2E4B]">
                Google Reviews
              </h2>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-label="Google">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>via Google</span>
              </div>
            </div>
            {business.rating != null ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                  <span className="font-display text-3xl font-bold text-[#1B2E4B]">
                    {business.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {business.reviewCount?.toLocaleString() ?? 0} reviews
                </p>
                {reviewDelta !== 0 && (
                  <p
                    className={`text-xs font-medium mb-3 ${
                      reviewDelta > 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {reviewDelta > 0 ? "↑" : "↓"} {Math.abs(reviewDelta)} since
                    last check
                  </p>
                )}
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A] transition-colors"
                  >
                    View on Google ↗
                  </a>
                ) : (
                  <Link
                    href="/dashboard/reviews"
                    className="text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A] transition-colors"
                  >
                    View full history →
                  </Link>
                )}
                {business.googleReviewCachedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Checked{" "}
                    {formatDistanceToNow(new Date(business.googleReviewCachedAt), {
                      addSuffix: true,
                    })}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Not connected yet.{" "}
                <a href="mailto:hello@southportguide.co.uk" className="text-[#C9A84C] font-semibold">
                  Contact us
                </a>{" "}
                to link your Google listing.
              </p>
            )}
          </div>

          {/* Boost status */}
          <div
            className={`rounded-2xl border p-6 ${
              activeBoost
                ? "bg-emerald-50 border-emerald-200"
                : "bg-white border-gray-100 shadow-sm"
            }`}
          >
            <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-2 flex items-center gap-2">
              <Zap className={`w-5 h-5 ${activeBoost ? "text-emerald-500" : "text-gray-300"}`} />
              Listing Boost
            </h2>
            {activeBoost ? (
              <>
                <p className="text-emerald-700 font-semibold text-sm mb-1">
                  🟢 Active: {activeBoost.label || "Boost"}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Running until{" "}
                  {new Date(activeBoost.endsAt).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <Link
                  href="/dashboard/boosts"
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View details →
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">No active boost</p>
                <Link
                  href="/dashboard/boosts"
                  className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972A] text-white px-4 py-2 rounded-full font-bold text-sm transition-colors"
                >
                  Book a boost →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Intelligence */}
      {nextEvent && (
        <div
          className={`rounded-2xl border-l-4 border-[#C9A84C] p-6 ${
            business.hubTier === "pro"
              ? "bg-[#1B2E4B] text-white"
              : "bg-[#1B2E4B] text-white relative overflow-hidden"
          }`}
        >
          {business.hubTier === "pro" ? (
            <>
              <h2 className="font-display text-lg font-bold text-[#C9A84C] mb-2 flex items-center gap-2">
                ⚡ Event Intelligence
              </h2>
              <p className="font-semibold mb-1">
                {nextEvent.name} —{" "}
                {new Date(nextEvent.dateStart).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              {eventImpact && (
                <p className="text-[#C9A84C]/90 text-sm mb-1">
                  {eventImpact}
                </p>
              )}
              {boostedCount > 0 && (
                <p className="text-white/70 text-sm mb-1">
                  {boostedCount} {boostedCount === 1 ? "business" : "businesses"} in
                  your category {boostedCount === 1 ? "has" : "have"} already boosted.
                </p>
              )}
              <p className="text-white/70 text-sm mb-4">
                Book a boost to capture more traffic during this event.
              </p>
              <Link
                href="/dashboard/boosts"
                className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972A] text-[#1B2E4B] px-4 py-2 rounded-full font-bold text-sm transition-colors"
              >
                Book your boost →
              </Link>
            </>
          ) : (
            <div className="relative">
              <div className="blur-sm select-none pointer-events-none">
                <h2 className="font-display text-lg font-bold text-[#C9A84C] mb-2">
                  ⚡ Event Intelligence
                </h2>
                <p className="font-semibold mb-1">{nextEvent.name}</p>
                <p className="text-white/70 text-sm">
                  Footfall predictions for your category...
                </p>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1B2E4B]/80">
                <p className="text-white font-semibold mb-2">
                  Event Intelligence is a Pro feature
                </p>
                <p className="text-white/70 text-sm mb-4">
                  Upgrade to see upcoming footfall predictions for your category.
                </p>
                <Link
                  href="/dashboard/upgrade"
                  className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972A] text-[#1B2E4B] px-4 py-2 rounded-full font-bold text-sm transition-colors"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
