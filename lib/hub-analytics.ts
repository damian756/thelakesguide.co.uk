import { prisma } from "@/lib/prisma";
import type { Business } from "@prisma/client";

export async function getClicksForPeriod(
  businessId: string,
  from: Date,
  to: Date
): Promise<Record<string, number>> {
  try {
    const clicks = await prisma.businessClick.groupBy({
      by: ["type"],
      where: {
        businessId,
        createdAt: { gte: from, lte: to },
      },
      _count: { type: true },
    });
    const result: Record<string, number> = {
      view: 0,
      website: 0,
      phone: 0,
      directions: 0,
      google_reviews: 0,
    };
    for (const c of clicks) {
      result[c.type] = c._count.type;
    }
    return result;
  } catch {
    return { view: 0, website: 0, phone: 0, directions: 0, google_reviews: 0 };
  }
}

export async function getDailyClickTrend(
  businessId: string,
  days: number
): Promise<{ date: string; count: number }[]> {
  try {
    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    const clicks = await prisma.businessClick.findMany({
      where: { businessId, createdAt: { gte: from, lte: to } },
      select: { createdAt: true },
    });

    const byDate = new Map<string, number>();
    for (let d = 0; d < days; d++) {
      const dte = new Date(from);
      dte.setDate(dte.getDate() + d);
      const key = dte.toISOString().slice(0, 10);
      byDate.set(key, 0);
    }
    for (const c of clicks) {
      const key = new Date(c.createdAt).toISOString().slice(0, 10);
      byDate.set(key, (byDate.get(key) ?? 0) + 1);
    }

    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  } catch {
    return [];
  }
}

export async function getAllTimeClicks(
  businessId: string
): Promise<Record<string, number>> {
  try {
    const clicks = await prisma.businessClick.groupBy({
      by: ["type"],
      where: { businessId },
      _count: { type: true },
    });
    const result: Record<string, number> = {
      view: 0,
      website: 0,
      phone: 0,
      directions: 0,
      google_reviews: 0,
    };
    for (const c of clicks) {
      result[c.type] = c._count.type;
    }
    return result;
  } catch {
    return { view: 0, website: 0, phone: 0, directions: 0, google_reviews: 0 };
  }
}

export async function getCategoryBenchmark(
  businessId: string,
  categoryId: string,
  from: Date,
  to: Date
): Promise<number> {
  try {
    const businessesInCategory = await prisma.business.findMany({
      where: { categoryId },
      select: { id: true },
    });
    const ids = businessesInCategory.map((b) => b.id);
    if (ids.length === 0) return 0;

    const totals = await prisma.businessClick.groupBy({
      by: ["businessId"],
      where: {
        businessId: { in: ids },
        createdAt: { gte: from, lte: to },
      },
      _count: true,
    });

    const sum = totals.reduce((s, t) => s + t._count, 0);
    return ids.length > 0 ? sum / ids.length : 0;
  } catch {
    return 0;
  }
}

export async function getCategoryTotalClicks(
  categoryId: string,
  from: Date,
  to: Date
): Promise<number> {
  try {
    const businessesInCategory = await prisma.business.findMany({
      where: { categoryId },
      select: { id: true },
    });
    const ids = businessesInCategory.map((b) => b.id);
    if (ids.length === 0) return 0;

    const totals = await prisma.businessClick.groupBy({
      by: ["businessId"],
      where: {
        businessId: { in: ids },
        createdAt: { gte: from, lte: to },
      },
      _count: true,
    });
    return totals.reduce((s, t) => s + t._count, 0);
  } catch {
    return 0;
  }
}

export async function getCategoryRank(
  businessId: string,
  categoryId: string,
  from: Date,
  to: Date
): Promise<{ rank: number; total: number }> {
  try {
    const businessesInCategory = await prisma.business.findMany({
      where: { categoryId },
      select: { id: true },
    });
    const ids = businessesInCategory.map((b) => b.id);
    if (ids.length === 0) return { rank: 1, total: 0 };

    const totals = await prisma.businessClick.groupBy({
      by: ["businessId"],
      where: {
        businessId: { in: ids },
        createdAt: { gte: from, lte: to },
      },
      _count: true,
    });

    const byBusiness = new Map(totals.map((t) => [t.businessId, t._count]));
    const sorted = ids
      .map((id) => ({ id, count: byBusiness.get(id) ?? 0 }))
      .sort((a, b) => b.count - a.count);
    const rank = sorted.findIndex((s) => s.id === businessId) + 1;
    return { rank: rank || sorted.length, total: sorted.length };
  } catch {
    return { rank: 1, total: 0 };
  }
}

export type VisibilityItem = {
  label: string;
  points: number;
  earned: boolean;
  href?: string;
};

export function getVisibilityScore(business: Business): {
  score: number;
  items: VisibilityItem[];
} {
  const items: VisibilityItem[] = [];
  let score = 0;

  const desc = (business.description || business.shortDescription || "").trim();
  if (desc.length > 50) {
    score += 20;
    items.push({
      label: "Description added",
      points: 20,
      earned: true,
      href: "/dashboard/listing#section-description",
    });
  } else {
    items.push({
      label: "Description added",
      points: 20,
      earned: false,
      href: "/dashboard/listing#section-description",
    });
  }

  if (business.phone) {
    score += 10;
    items.push({
      label: "Phone number",
      points: 10,
      earned: true,
      href: "/dashboard/listing#section-contact",
    });
  } else {
    items.push({
      label: "Phone number",
      points: 10,
      earned: false,
      href: "/dashboard/listing#section-contact",
    });
  }

  if (business.website) {
    score += 10;
    items.push({
      label: "Website URL",
      points: 10,
      earned: true,
      href: "/dashboard/listing#section-contact",
    });
  } else {
    items.push({
      label: "Website URL",
      points: 10,
      earned: false,
      href: "/dashboard/listing#section-contact",
    });
  }

  if (business.openingHours != null) {
    score += 15;
    items.push({
      label: "Opening hours",
      points: 15,
      earned: true,
      href: "/dashboard/listing#section-hours",
    });
  } else {
    items.push({
      label: "Opening hours",
      points: 15,
      earned: false,
      href: "/dashboard/listing#section-hours",
    });
  }

  if (business.images && business.images.length > 0) {
    score += 15;
    items.push({
      label: "Has photos",
      points: 15,
      earned: true,
      href: "/dashboard/listing#section-photos",
    });
  } else {
    items.push({
      label: "Has photos",
      points: 15,
      earned: false,
      href: "/dashboard/listing#section-photos",
    });
  }

  if (business.rating != null && business.rating >= 4.0) {
    score += 10;
    items.push({ label: "Google rating ≥ 4.0", points: 10, earned: true });
  } else {
    items.push({ label: "Google rating ≥ 4.0", points: 10, earned: false });
  }

  if (business.hubTier === "pro") {
    score += 20;
    items.push({
      label: "Pro plan",
      points: 20,
      earned: true,
      href: "/dashboard/upgrade",
    });
  } else {
    items.push({
      label: "Pro plan",
      points: 20,
      earned: false,
      href: "/dashboard/upgrade",
    });
  }

  return { score, items };
}
