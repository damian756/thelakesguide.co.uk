import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Bell } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import SiteReviewsTab from "./SiteReviewsTab";

export const metadata = {
  title: "Reviews | Business Hub",
  description: "Google reviews and The Lakes Guide ratings.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const { tab } = await searchParams;
  const activeTab = tab === "site" ? "site" : "google";

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      placeId: true,
      rating: true,
      reviewCount: true,
      googleReviewCachedAt: true,
      category: { select: { slug: true } },
    },
  });

  if (!business) redirect("/dashboard");

  const snapshots = await prisma.reviewSnapshot.findMany({
    where: {
      businessId: business.id,
      snapshotAt: { gte: new Date(Date.now() - 90 * 86400000) },
    },
    orderBy: { snapshotAt: "desc" },
    take: 10,
  });

  const siteReviews = await prisma.review.findMany({
    where: { businessId: business.id, status: "approved" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      response: true,
    },
    orderBy: { approvedAt: "desc" },
  });

  const siteRatingAvg =
    siteReviews.length > 0
      ? siteReviews.reduce((sum, r) => sum + r.starRating, 0) / siteReviews.length
      : null;

  const googleMapsUrl = business.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${business.placeId}`
    : null;

  const ratingPct =
    business.rating != null ? ((business.rating / 5) * 100).toFixed(1) : "0";

  const chartSnapshots = [...snapshots].reverse();
  const svgWidth = 400;
  const svgHeight = 200;
  const minRating = 3.0;
  const maxRating = 5.0;
  const chartPad = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = svgWidth - chartPad.left - chartPad.right;
  const chartH = svgHeight - chartPad.top - chartPad.bottom;
  const toX = (i: number) =>
    chartPad.left + (chartSnapshots.length > 1 ? (i / (chartSnapshots.length - 1)) * chartW : chartW / 2);
  const toY = (r: number) =>
    chartPad.top + chartH - ((r - minRating) / (maxRating - minRating)) * chartH;
  const points = chartSnapshots.map((s, i) => `${toX(i)},${toY(s.rating)}`).join(" ");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Reviews</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: "google", label: "Google Reviews" },
          { id: "site", label: `The Lakes Guide Reviews${siteReviews.length > 0 ? ` (${siteReviews.length})` : ""}` },
        ].map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/reviews?tab=${t.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === t.id
                ? "bg-white text-[#1B2E4B] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {activeTab === "google" && (
        <div className="space-y-8">
          {/* Rating hero */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {business.rating != null ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Star className="w-10 h-10 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="font-display text-4xl font-bold text-[#1B2E4B]">
                        {business.rating.toFixed(1)}
                      </span>
                      <p className="text-sm text-gray-500">
                        {business.reviewCount?.toLocaleString() ?? 0} total reviews
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>via Google</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-3 bg-[#C9A84C] rounded-full transition-all" style={{ width: `${ratingPct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mb-4">{business.rating.toFixed(1)} / 5.0</p>
                {business.googleReviewCachedAt && (
                  <p className="text-xs text-gray-400 mb-4">
                    Last checked: {formatDistanceToNow(new Date(business.googleReviewCachedAt), { addSuffix: true })}
                  </p>
                )}
                {googleMapsUrl && (
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A]">
                    View all reviews on Google Maps ↗
                  </a>
                )}
                {!business.placeId && (
                  <p className="text-xs text-gray-400 mt-3">
                    Want a direct link to your Google listing?{" "}
                    <a href="mailto:hello@thelakesguide.co.uk" className="text-[#C9A84C] font-medium hover:underline">Contact us to connect it.</a>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Google Reviews not connected.{" "}
                <a href="mailto:hello@thelakesguide.co.uk" className="text-[#C9A84C] font-semibold hover:underline">Contact us</a>{" "}
                to link your Google listing.
              </p>
            )}
          </div>

          {/* Rating trend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">Rating trend — last 90 days</h2>
            {chartSnapshots.length >= 2 ? (
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-lg" style={{ height: svgHeight }}>
                  {[3.0, 3.5, 4.0, 4.5, 5.0].map((r) => (
                    <g key={r}>
                      <line x1={chartPad.left} x2={svgWidth - chartPad.right} y1={toY(r)} y2={toY(r)} stroke="#f0f0f0" strokeWidth="1" />
                      <text x={chartPad.left - 6} y={toY(r) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{r.toFixed(1)}</text>
                    </g>
                  ))}
                  <polyline points={points} fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                  {chartSnapshots.map((s, i) => <circle key={s.id} cx={toX(i)} cy={toY(s.rating)} r="4" fill="#C9A84C" />)}
                  {chartSnapshots.map((s, i) => {
                    if (i !== 0 && i !== chartSnapshots.length - 1) return null;
                    return (
                      <text key={s.id} x={toX(i)} y={svgHeight - 4} textAnchor={i === 0 ? "start" : "end"} fontSize="10" fill="#9ca3af">
                        {new Date(s.snapshotAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </text>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <p className="text-sm text-gray-500">We&apos;ll track your rating over time. Check back after the next review check.</p>
            )}
          </div>

          {/* Alert settings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-3">
            <Bell className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              You&apos;ll receive email alerts when a new review is added or your rating changes. Manage notifications in{" "}
              <Link href="/dashboard/settings" className="text-[#C9A84C] font-semibold hover:text-[#B8972A]">Settings</Link>.
            </p>
          </div>
        </div>
      )}

      {activeTab === "site" && (
        <SiteReviewsTab
          reviews={JSON.parse(JSON.stringify(siteReviews))}
          ratingAvg={siteRatingAvg}
          businessName={business.name}
          businessSlug={business.slug}
          categorySlug={business.category.slug}
        />
      )}
    </div>
  );
}
