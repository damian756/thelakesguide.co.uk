import { prisma } from "@/lib/prisma";
import ReviewForm from "./ReviewForm";
import ReviewListClient from "./ReviewListClient";

type Props = {
  businessId: string;
  businessName: string;
  slug: string;
  categorySlug: string;
  reviewVerifiedParam?: string | null;
};

export default async function ReviewSection({
  businessId,
  businessName,
  slug,
  categorySlug,
  reviewVerifiedParam,
}: Props) {
  const reviews = await prisma.review.findMany({
    where: { businessId, status: "approved" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      response: true,
    },
    orderBy: { approvedAt: "desc" },
  });

  const rejected = await prisma.review.findMany({
    where: { businessId, status: "rejected", removalNote: { not: null } },
    select: { id: true, removalNote: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.starRating, 0) / reviews.length
      : null;

  const verifiedCount = reviews.filter((r) => r.verifiedType === "purchase").length;
  const emailCount = reviews.filter((r) => r.verifiedType === "email").length;

  return (
    <section id="reviews" className="space-y-4">
      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-[#1B2E4B]">
                {avgRating!.toFixed(1)}
              </p>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`text-2xl ${n <= Math.round(avgRating!) ? "text-amber-400" : "text-gray-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="space-y-1 flex-1 min-w-[180px]">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.starRating === star).length;
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right text-gray-500">{star}</span>
                    <span className="text-amber-400 text-xs">★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-4 text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-gray-500 space-y-1 self-start">
              {verifiedCount > 0 && (
                <p className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full" />
                  {verifiedCount} Verified Purchase
                </p>
              )}
              {emailCount > 0 && (
                <p className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                  {emailCount} Email Verified
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification for verified/expired param */}
      {reviewVerifiedParam === "verified" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 font-medium">
          Your review has been verified and is awaiting approval. It will appear here once approved.
        </div>
      )}
      {reviewVerifiedParam === "expired" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          That verification link has expired. Please submit your review again.
        </div>
      )}

      {/* Review list */}
      {reviews.length > 0 && (
        <ReviewListClient
          reviews={JSON.parse(JSON.stringify(reviews))}
          rejected={JSON.parse(JSON.stringify(rejected))}
        />
      )}

      {/* Review form */}
      <ReviewForm businessId={businessId} businessName={businessName} />
    </section>
  );
}
