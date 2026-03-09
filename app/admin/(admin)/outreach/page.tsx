import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import OutreachClient from "./OutreachClient";

export const metadata = {
  title: "Outreach | Admin | SouthportGuide",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  const now = new Date();
  const from30 = new Date(now.getTime() - 30 * 86_400_000);
  from30.setHours(0, 0, 0, 0);
  const from60 = new Date(from30.getTime() - 30 * 86_400_000);

  const ninetyDaysAgo = new Date(now.getTime() - 90 * 86_400_000);

  const [
    clickCountsCurrent,
    clickCountsPrior,
    unclaimedBusinesses,
    claimedFreeBusinesses,
    claimedProBusinesses,
    outreachLogs,
    recentOutreachLogs,
  ] = await Promise.all([
    prisma.businessClick.groupBy({
      by: ["businessId"],
      where: { type: "view", createdAt: { gte: from30 } },
      _count: { businessId: true },
    }),
    prisma.businessClick.groupBy({
      by: ["businessId"],
      where: { type: "view", createdAt: { gte: from60, lt: from30 } },
      _count: { businessId: true },
    }),
    prisma.business.findMany({
      where: { claimed: false },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.business.findMany({
      where: { claimed: true, hubTier: "free", userId: { not: null } },
      select: {
        id: true,
        name: true,
        slug: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.business.findMany({
      where: { claimed: true, hubTier: "pro", userId: { not: null } },
      select: {
        id: true,
        name: true,
        slug: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.outreachLog.findMany({
      take: 100,
      orderBy: { sentAt: "desc" },
      include: { business: { select: { name: true } } },
    }),
    prisma.outreachLog.findMany({
      where: { sentAt: { gte: ninetyDaysAgo } },
      orderBy: { sentAt: "desc" },
      select: { businessId: true, type: true, sentAt: true },
    }),
  ]);

  const lastClaimByBiz = new Map<string, Date>();
  const lastNudgeByBiz = new Map<string, Date>();
  const lastBoostByBiz = new Map<string, Date>();
  for (const l of recentOutreachLogs) {
    if (l.type === "claim_invite" && !lastClaimByBiz.has(l.businessId)) lastClaimByBiz.set(l.businessId, l.sentAt);
    if (l.type === "upgrade_nudge" && !lastNudgeByBiz.has(l.businessId)) lastNudgeByBiz.set(l.businessId, l.sentAt);
    if (l.type === "boost_upsell" && !lastBoostByBiz.has(l.businessId)) lastBoostByBiz.set(l.businessId, l.sentAt);
  }

  const viewByBizCurrent = new Map(clickCountsCurrent.map((c) => [c.businessId, c._count.businessId]));
  const viewByBizPrior = new Map(clickCountsPrior.map((c) => [c.businessId, c._count.businessId]));

  const claimCandidates = unclaimedBusinesses
    .filter((b) => b.email)
    .map((b) => ({
      business: b,
      views: viewByBizCurrent.get(b.id) ?? 0,
      lastSentAt: lastClaimByBiz.get(b.id) ?? null,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 500);

  const upgradeCandidates = claimedFreeBusinesses
    .map((b) => ({
      business: b,
      views: viewByBizCurrent.get(b.id) ?? 0,
      lastSentAt: lastNudgeByBiz.get(b.id) ?? null,
    }))
    .filter((x) => x.views >= 10)
    .sort((a, b) => b.views - a.views)
    .slice(0, 50);

  const boostCandidates = claimedProBusinesses
    .map((b) => {
      const curr = viewByBizCurrent.get(b.id) ?? 0;
      const prior = viewByBizPrior.get(b.id) ?? 0;
      const delta = curr - prior;
      return {
        business: b,
        currViews: curr,
        priorViews: prior,
        delta,
        lastSentAt: lastBoostByBiz.get(b.id) ?? null,
      };
    })
    .filter((x) => x.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 30);

  const serializedLogs = outreachLogs.map((l) => ({
    id: l.id,
    businessId: l.businessId,
    businessName: l.business.name,
    type: l.type,
    sentTo: l.sentTo,
    sentAt: l.sentAt.toISOString(),
    sentBy: l.sentBy,
  }));

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B] mb-6">Outreach</h1>
      <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse">Loading...</div>}>
        <OutreachClient
        claimCandidates={claimCandidates.map((c) => ({
          business: c.business,
          views: c.views,
          lastSentAt: c.lastSentAt?.toISOString() ?? null,
        }))}
        upgradeCandidates={upgradeCandidates.map((c) => ({
          business: c.business,
          views: c.views,
          lastSentAt: c.lastSentAt?.toISOString() ?? null,
        }))}
        boostCandidates={boostCandidates.map((c) => ({
          business: c.business,
          currViews: c.currViews,
          delta: c.delta,
          lastSentAt: c.lastSentAt?.toISOString() ?? null,
        }))}
        logs={serializedLogs}
      />
      </Suspense>
    </div>
  );
}
