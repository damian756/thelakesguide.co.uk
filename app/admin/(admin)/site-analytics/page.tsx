import { prisma } from "@/lib/prisma";
import { EVENTS } from "@/lib/lakes-data";
import { getVisibilityScore } from "@/lib/hub-analytics";
import type { Business } from "@prisma/client";
import SiteAnalyticsClient from "./SiteAnalyticsClient";

export const metadata = {
  title: "Site Analytics | Admin | SouthportGuide",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ period?: string }>;
};

type DailyRow = { date: string; count: number };

const TIER_MRR: Record<string, number> = {
  standard: 29,
  featured: 49,
  premium: 99,
};

export default async function SiteAnalyticsPage({ searchParams }: Props) {
  const { period = "30" } = await searchParams;
  const periodNum = Math.min(365, Math.max(1, parseInt(period, 10) || 30));

  const now = new Date();
  const from = new Date(now.getTime() - periodNum * 86_400_000);
  const priorFrom = new Date(from.getTime() - periodNum * 86_400_000);

  const last24h = new Date(now.getTime() - 24 * 3600 * 1000);
  const prior24h = new Date(last24h.getTime() - 24 * 3600 * 1000);

  const openStart = new Date("2026-07-12");
  const openEnd = new Date("2026-07-19T23:59:59");
  const showOpen2026 = now < new Date("2026-07-20");

  const [
    pulseClicksLast24h,
    pulseClicksPrior24h,
    pulsePageViewsLast24h,
    pulsePageViewsPrior24h,
    pendingReviews,
    pendingClaims,
    activeBoosts,
    businessClickDaily,
    pageViewDaily,
    businessesWithClicks,
    allBusinesses,
    categories,
    rawClicksCurrent,
    rawClicksPrior,
    reviewsThisPeriod,
    subscriptions,
    boostRevenue,
    openBoosts,
    openUnclaimed,
  ] = await Promise.all([
    prisma.businessClick.count({ where: { createdAt: { gte: last24h } } }),
    prisma.businessClick.count({ where: { createdAt: { gte: prior24h, lt: last24h } } }),
    prisma.pageView.count({ where: { createdAt: { gte: last24h } } }),
    prisma.pageView.count({ where: { createdAt: { gte: prior24h, lt: last24h } } }),
    prisma.review.count({ where: { status: "pending" } }),
    prisma.claimRequest.count({ where: { status: "pending" } }),
    prisma.listingBoost.count({
      where: { status: "active", endsAt: { gte: now } },
    }),
    prisma.$queryRaw<DailyRow[]>`
      SELECT DATE("createdAt")::text AS date, COUNT(*)::int AS count
      FROM "BusinessClick"
      WHERE "createdAt" >= ${from}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,
    prisma.$queryRaw<DailyRow[]>`
      SELECT DATE("createdAt")::text AS date, COUNT(*)::int AS count
      FROM "PageView"
      WHERE "createdAt" >= ${from}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,
    prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        category: { select: { slug: true, name: true } },
        claimed: true,
        hubTier: true,
        listingTier: true,
        description: true,
        shortDescription: true,
        phone: true,
        website: true,
        openingHours: true,
        images: true,
        rating: true,
      },
    }),
    prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        category: { select: { slug: true, name: true } },
        claimed: true,
        hubTier: true,
        listingTier: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
    }),
    prisma.businessClick.groupBy({
      by: ["businessId", "type"],
      where: { createdAt: { gte: from } },
      _count: { type: true },
    }),
    prisma.businessClick.groupBy({
      by: ["businessId", "type"],
      where: { createdAt: { gte: priorFrom, lt: from } },
      _count: { type: true },
    }),
    prisma.review.findMany({
      where: { createdAt: { gte: from } },
      select: {
        id: true,
        status: true,
        emailVerifiedAt: true,
        verifiedType: true,
        flaggedAt: true,
        createdAt: true,
        approvedAt: true,
        businessId: true,
      },
    }),
    prisma.subscription.findMany({
      where: { status: "active" },
      select: { tier: true },
    }),
    prisma.listingBoost.aggregate({
      where: { createdAt: { gte: from } },
      _sum: { pricePence: true },
    }),
    showOpen2026
      ? prisma.listingBoost.findMany({
          where: {
            status: "active",
            startsAt: { lte: openEnd },
            endsAt: { gte: openStart },
          },
          include: {
            business: { select: { name: true } },
            category: { select: { name: true } },
          },
        })
      : Promise.resolve([]),
    showOpen2026
      ? (async () => {
          const unclaimedIds = await prisma.business.findMany({
            where: {
              claimed: false,
              category: { slug: { in: ["hotels", "restaurants", "bars-nightlife", "golf"] } },
            },
            select: { id: true },
          });
          const ids = unclaimedIds.map((b) => b.id);
          if (ids.length === 0) return [];
          const clicks = await prisma.businessClick.groupBy({
            by: ["businessId"],
            where: {
              type: "view",
              businessId: { in: ids },
              createdAt: { gte: new Date(now.getTime() - 30 * 86_400_000) },
            },
            _count: { businessId: true },
          });
          return clicks.sort((a, b) => b._count.businessId - a._count.businessId).slice(0, 10);
        })()
      : Promise.resolve([]),
  ]);

  const businessIdsWithOpenClicks = (openUnclaimed as { businessId: string }[]).map((r) => r.businessId);
  const openUnclaimedBusinesses =
    businessIdsWithOpenClicks.length > 0
      ? await prisma.business.findMany({
          where: { id: { in: businessIdsWithOpenClicks } },
          select: {
            id: true,
            name: true,
            slug: true,
            category: { select: { name: true, slug: true } },
          },
        })
      : [];

  const openUnclaimedWithViews = businessIdsWithOpenClicks.map((bid) => {
    const row = (openUnclaimed as { businessId: string; _count: { businessId: number } }[]).find(
      (r) => r.businessId === bid
    );
    const b = openUnclaimedBusinesses.find((x) => x.id === bid);
    return { businessId: bid, views: row?._count?.businessId ?? 0, business: b };
  });

  const clickMapCurrent = new Map<string, Record<string, number>>();
  const clickMapPrior = new Map<string, Record<string, number>>();
  for (const c of rawClicksCurrent) {
    const existing = clickMapCurrent.get(c.businessId) ?? {
      view: 0,
      website: 0,
      phone: 0,
      directions: 0,
      google_reviews: 0,
    };
    existing[c.type as keyof typeof existing] = (existing[c.type as keyof typeof existing] ?? 0) + c._count.type;
    clickMapCurrent.set(c.businessId, existing);
  }
  for (const c of rawClicksPrior) {
    const existing = clickMapPrior.get(c.businessId) ?? {
      view: 0,
      website: 0,
      phone: 0,
      directions: 0,
      google_reviews: 0,
    };
    existing[c.type as keyof typeof existing] = (existing[c.type as keyof typeof existing] ?? 0) + c._count.type;
    clickMapPrior.set(c.businessId, existing);
  }

  const conversionsLast24h = await prisma.businessClick.count({
    where: {
      createdAt: { gte: last24h },
      type: { in: ["website", "phone", "directions"] },
    },
  });
  const conversionsPrior24h = await prisma.businessClick.count({
    where: {
      createdAt: { gte: prior24h, lt: last24h },
      type: { in: ["website", "phone", "directions"] },
    },
  });
  const viewsLast24h = await prisma.businessClick.count({
    where: { createdAt: { gte: last24h }, type: "view" },
  });
  const viewsPrior24h = await prisma.businessClick.count({
    where: { createdAt: { gte: prior24h, lt: last24h }, type: "view" },
  });

  const eventsInPeriod = EVENTS.filter((e) => {
    const d = new Date(e.isoDate);
    return d >= from && d <= now;
  });

  const mrr = subscriptions.reduce((s, sub) => s + (TIER_MRR[sub.tier] ?? 29), 0);
  const boostRevenuePounds = (boostRevenue._sum.pricePence ?? 0) / 100;

  const pendingReviewDetails = await prisma.review.findMany({
    where: { status: "pending" },
    select: { createdAt: true },
  });
  const avgPendingAge =
    pendingReviewDetails.length > 0
      ? pendingReviewDetails.reduce(
          (s, r) => s + (now.getTime() - new Date(r.createdAt).getTime()) / 86400000,
          0
        ) / pendingReviewDetails.length
      : 0;

  const topReviewedBusinessIds = reviewsThisPeriod
    .filter((r) => r.status === "approved")
    .reduce((acc, r) => {
      acc[r.businessId] = (acc[r.businessId] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topReviewed = Object.entries(topReviewedBusinessIds)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);
  const topReviewedBusinesses =
    topReviewed.length > 0
      ? await prisma.business.findMany({
          where: { id: { in: topReviewed } },
          select: { id: true, name: true, slug: true, category: { select: { slug: true } } },
        })
      : [];

  const weeklyRanks: Record<string, number>[] = [];
  for (let w = 0; w < 4; w++) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    weekEnd.setHours(23, 59, 59, 999);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    const weekClicks = await prisma.businessClick.groupBy({
      by: ["businessId"],
      where: { createdAt: { gte: weekStart, lte: weekEnd } },
      _count: { businessId: true },
    });
    const sorted = [...weekClicks].sort((a, b) => b._count.businessId - a._count.businessId);
    const top20Ids = sorted.slice(0, 20).map((s) => s.businessId);
    const rankMap: Record<string, number> = {};
    top20Ids.forEach((id) => (rankMap[id] = (rankMap[id] ?? 0) + 1));
    weeklyRanks.push(rankMap);
  }
  const consistentlyStrongIds = new Set<string>();
  for (const rankMap of weeklyRanks) {
    for (const id of Object.keys(rankMap)) {
      const total = weeklyRanks.filter((r) => r[id]).length;
      if (total >= 4) consistentlyStrongIds.add(id);
    }
  }
  const consistentlyStrongBusinesses = await prisma.business.findMany({
    where: { id: { in: Array.from(consistentlyStrongIds) } },
    select: {
      id: true,
      name: true,
      slug: true,
      category: { select: { name: true, slug: true } },
    },
  });
  const consistentlyStrongWithCount = consistentlyStrongBusinesses.map((b) => ({
    ...b,
    weeksInTop20: weeklyRanks.filter((r) => r[b.id]).length,
  }));

  const notConverting = businessesWithClicks.filter((b) => {
    const c = clickMapCurrent.get(b.id) ?? { view: 0, website: 0, phone: 0, directions: 0 };
    const conv = (c.website ?? 0) + (c.phone ?? 0) + (c.directions ?? 0);
    return (c.view ?? 0) >= 20 && conv === 0;
  });
  const notConvertingWithVisibility = notConverting.map((b) => {
    const clicks = clickMapCurrent.get(b.id) ?? { view: 0, website: 0, phone: 0, directions: 0 };
    const visibility = getVisibilityScore(b as unknown as Business);
    return { business: b, clicks, visibility };
  });

  const hotRightNow = allBusinesses
    .map((b) => {
      const curr = clickMapCurrent.get(b.id) ?? { view: 0 };
      const prior = clickMapPrior.get(b.id) ?? { view: 0 };
      const currViews = curr.view ?? 0;
      const priorViews = prior.view ?? 0;
      return { business: b, currViews, priorViews, delta: currViews - priorViews };
    })
    .filter((x) => x.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 10);

  const highTrafficUnclaimed = allBusinesses
    .filter((b) => !b.claimed)
    .map((b) => ({
      business: b,
      views: clickMapCurrent.get(b.id)?.view ?? 0,
    }))
    .filter((x) => x.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const claimedLowEngagement = allBusinesses
    .filter((b) => b.claimed)
    .map((b) => {
      const c = clickMapCurrent.get(b.id) ?? { view: 0, website: 0, phone: 0, directions: 0 };
      const views = c.view ?? 0;
      const conv = (c.website ?? 0) + (c.phone ?? 0) + (c.directions ?? 0);
      const rate = views > 0 ? (conv / views) * 100 : 0;
      return { business: b, views, conversions: conv, rate };
    })
    .filter((x) => x.views > 10 && x.rate < 5)
    .slice(0, 10);

  const categoryMatrix = categories.map((cat) => {
    const bizInCat = allBusinesses.filter((b) => b.category.slug === cat.slug);
    const ids = bizInCat.map((b) => b.id);
    let viewsCurrent = 0;
    let viewsPrior = 0;
    let conversionsCurrent = 0;
    for (const id of ids) {
      const c = clickMapCurrent.get(id) ?? {};
      const p = clickMapPrior.get(id) ?? {};
      viewsCurrent += c.view ?? 0;
      viewsPrior += p.view ?? 0;
      conversionsCurrent += (c.website ?? 0) + (c.phone ?? 0) + (c.directions ?? 0);
    }
    const deadCount = ids.filter((id) => {
      const c = clickMapCurrent.get(id) ?? {};
      return ((c.view ?? 0) + (c.website ?? 0) + (c.phone ?? 0) + (c.directions ?? 0)) === 0;
    }).length;
    const topBiz = bizInCat
      .map((b) => ({ b, total: (clickMapCurrent.get(b.id)?.view ?? 0) + (clickMapCurrent.get(b.id)?.website ?? 0) + (clickMapCurrent.get(b.id)?.phone ?? 0) + (clickMapCurrent.get(b.id)?.directions ?? 0) }))
      .sort((a, b) => b.total - a.total)[0];
    const engagementRate = viewsCurrent > 0 ? (conversionsCurrent / viewsCurrent) * 100 : 0;
    const claimedCount = bizInCat.filter((b) => b.claimed).length;
    return {
      category: cat,
      viewsCurrent,
      viewsPrior,
      pctChange: viewsPrior > 0 ? ((viewsCurrent - viewsPrior) / viewsPrior) * 100 : viewsCurrent > 0 ? 100 : 0,
      engagementRate,
      claimedPct: bizInCat.length > 0 ? (claimedCount / bizInCat.length) * 100 : 0,
      deadCount,
      topPerformer: topBiz?.b?.name ?? "—",
    };
  });

  const funnel = {
    total: allBusinesses.length,
    withActivity: allBusinesses.filter((b) => {
      const c = clickMapCurrent.get(b.id);
      const total = (c?.view ?? 0) + (c?.website ?? 0) + (c?.phone ?? 0) + (c?.directions ?? 0);
      return total > 0;
    }).length,
    claimed: allBusinesses.filter((b) => b.claimed).length,
    pro: allBusinesses.filter((b) => b.hubTier === "pro").length,
    paidTier: allBusinesses.filter((b) => ["standard", "featured", "premium"].includes(b.listingTier)).length,
  };
  const activeBoostCount = await prisma.listingBoost.count({
    where: { status: "active", endsAt: { gte: now } },
  });

  return (
    <SiteAnalyticsClient
      period={periodNum}
      periodLabel={period}
      pulse={{
        totalLast24h: pulseClicksLast24h,
        totalPrior24h: pulseClicksPrior24h,
        viewsLast24h,
        viewsPrior24h,
        conversionsLast24h,
        conversionsPrior24h,
        pageViewsLast24h: pulsePageViewsLast24h,
        pageViewsPrior24h: pulsePageViewsPrior24h,
        pendingReviews,
        pendingClaims,
        activeBoosts,
      }}
      trend={{
        businessClickDaily,
        pageViewDaily,
        eventsInPeriod,
      }}
      categoryMatrix={categoryMatrix}
      funnel={{ ...funnel, activeBoost: activeBoostCount }}
      highTrafficUnclaimed={highTrafficUnclaimed}
      claimedLowEngagement={claimedLowEngagement}
      notConvertingWithVisibility={notConvertingWithVisibility}
      hotRightNow={hotRightNow}
      consistentlyStrong={consistentlyStrongWithCount}
      reviews={reviewsThisPeriod}
      mrr={mrr}
      boostRevenuePounds={boostRevenuePounds}
      activeSubscriptions={subscriptions.length}
      avgPendingReviewAge={avgPendingAge}
      topReviewedBusinesses={topReviewedBusinesses}
      topReviewedCounts={topReviewed.reduce(
        (acc, id) => {
          acc[id] = topReviewedBusinessIds[id] ?? 0;
          return acc;
        },
        {} as Record<string, number>
      )}
      showOpen2026={showOpen2026}
      openBoosts={openBoosts}
      openUnclaimed={openUnclaimedWithViews}
    />
  );
}
