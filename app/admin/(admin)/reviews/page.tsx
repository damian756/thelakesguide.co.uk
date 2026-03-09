import { prisma } from "@/lib/prisma";
import AdminReviewsClient from "./AdminReviewsClient";

export const metadata = {
  title: "Reviews | Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "flagged" ? "flagged" : tab === "approved" ? "approved" : "pending";

  const [pending, flagged, approved] = await Promise.all([
    prisma.review.findMany({
      where: { status: "pending" },
      include: {
        business: { select: { name: true, slug: true, category: { select: { slug: true } } } },
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ flaggedAt: { sort: "desc", nulls: "last" } }, { createdAt: "asc" }],
    }),
    prisma.review.findMany({
      where: { flagStatus: "pending", status: "approved" },
      include: {
        business: { select: { name: true, slug: true, category: { select: { slug: true } } } },
        images: { orderBy: { sortOrder: "asc" } },
        response: true,
      },
      orderBy: { flaggedAt: "desc" },
    }),
    prisma.review.findMany({
      where: { status: "approved" },
      include: {
        business: { select: { name: true, slug: true, category: { select: { slug: true } } } },
        images: { orderBy: { sortOrder: "asc" } },
        response: true,
      },
      orderBy: { approvedAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <AdminReviewsClient
      pending={JSON.parse(JSON.stringify(pending))}
      flagged={JSON.parse(JSON.stringify(flagged))}
      approved={JSON.parse(JSON.stringify(approved))}
      activeTab={activeTab}
    />
  );
}
