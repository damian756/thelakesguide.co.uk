import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TIER_MRR: Record<string, number> = {
  standard: 29,
  featured: 49,
  premium: 99,
};

function requireApiKey(req: NextRequest): NextResponse | null {
  const key = req.headers.get("x-api-key");
  const expected = process.env.COMMAND_CENTRE_API_KEY;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = requireApiKey(req);
  if (authError) return authError;

  try {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now);
  monthStart.setDate(monthStart.getDate() - 30);
  monthStart.setHours(0, 0, 0, 0);

  const [
    pageviewsToday,
    pageviewsThisWeek,
    pageviewsThisMonth,
    topPagesRaw,
    topReferrersRaw,
    totalBusinesses,
    claimedCount,
    blogPostsCount,
    blogPostsThisWeek,
    lastBlogPost,
    subscriptions,
    boostRevenue,
    featuredCount,
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: weekStart } },
      _count: { path: true },
    }),
    prisma.pageView.groupBy({
      by: ["referrer"],
      where: {
        createdAt: { gte: weekStart },
        referrer: { not: null },
      },
      _count: { referrer: true },
    }),
    prisma.business.count(),
    prisma.business.count({ where: { claimed: true } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.count({
      where: {
        published: true,
        publishedAt: { gte: weekStart },
      },
    }),
    prisma.blogPost.findFirst({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { publishedAt: true },
    }),
    prisma.subscription.findMany({
      where: { status: "active" },
      select: { tier: true },
    }),
    prisma.listingBoost.aggregate({
      where: { status: "active", endsAt: { gte: now } },
      _sum: { pricePence: true },
    }),
    prisma.business.count({
      where: {
        listingTier: { in: ["standard", "featured", "premium"] },
      },
    }),
  ]);

  const mrr = subscriptions.reduce((s, sub) => s + (TIER_MRR[sub.tier] ?? 29), 0);
  const boostMrr = (boostRevenue._sum.pricePence ?? 0) / 100;

  return NextResponse.json({
    site: "thelakesguide",
    network: "lakes",
    period: now.toISOString().slice(0, 10),
    analytics: {
      pageviewsToday,
      pageviewsThisWeek,
      pageviewsThisMonth,
      uniqueVisitorsThisWeek: pageviewsThisWeek,
      topPages: topPagesRaw
        .map((r) => ({ path: r.path, count: r._count.path }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topReferrers: topReferrersRaw
        .filter((r) => r.referrer)
        .map((r) => ({ referrer: r.referrer!, count: r._count.referrer }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    },
    content: {
      totalListings: totalBusinesses,
      claimedListings: claimedCount,
      totalBlogPosts: blogPostsCount,
      blogPostsThisWeek,
      lastBlogPostDate: lastBlogPost?.publishedAt?.toISOString().slice(0, 10) ?? null,
      totalGuides: 0,
    },
    revenue: {
      hubMembers: subscriptions.length,
      hubMRR: mrr,
      featuredListings: featuredCount,
      featuredMRR: mrr + boostMrr,
      affiliateThisMonth: 0,
    },
    outreach: {
      emailsSentThisWeek: 0,
      responsesThisWeek: 0,
      pendingFollowUps: 0,
    },
  });
  } catch (err) {
    console.error("[lakes-guide stats]", err);
    return NextResponse.json(
      { error: String(err instanceof Error ? err.message : err) },
      { status: 500 }
    );
  }
}
