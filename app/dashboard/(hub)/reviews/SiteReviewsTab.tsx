"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, Flag, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

type ReviewImage = { id: string; imageUrl: string };
type ReviewResponse = { id: string; body: string };

type Review = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  starRating: number;
  title: string | null;
  body: string;
  verifiedType: string;
  approvedAt: string | null;
  images: ReviewImage[];
  response: ReviewResponse | null;
};

function displayName(r: Review) {
  if (r.displayName) return r.displayName;
  return `${r.firstName} ${r.lastName.charAt(0).toUpperCase()}.`;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-500">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function VerifiedBadge({ type }: { type: string }) {
  if (type === "purchase") {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-200">
        ✓ Verified Purchase
      </span>
    );
  }
  if (type === "email") {
    return (
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
        ✓ Email Verified
      </span>
    );
  }
  return null;
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const [showRespond, setShowRespond] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [responseBody, setResponseBody] = useState(review.response?.body || "");
  const [flagReason, setFlagReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(review.response?.body || null);
  const [flagged, setFlagged] = useState(false);

  async function submitResponse() {
    if (!responseBody.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/hub/reviews/${review.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: responseBody }),
    });
    if (res.ok) {
      setCurrentResponse(responseBody);
      setShowRespond(false);
    }
    setLoading(false);
  }

  async function submitFlag() {
    if (!flagReason.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/hub/reviews/${review.id}/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: flagReason }),
    });
    if (res.ok) {
      setFlagged(true);
      setShowFlag(false);
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="px-5 py-4 cursor-pointer hover:bg-gray-50/50"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-sm text-[#1B2E4B]">{displayName(review)}</span>
              <Stars n={review.starRating} />
              <VerifiedBadge type={review.verifiedType} />
            </div>
            {review.title && (
              <p className="text-sm font-medium text-gray-800">&ldquo;{review.title}&rdquo;</p>
            )}
            <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{review.body}</p>
            {review.approvedAt && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.approvedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {currentResponse && (
              <span className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
                <MessageSquare className="w-3.5 h-3.5" /> Responded
              </span>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{review.body}</p>

          {review.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.images.map((img) => (
                <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img src={img.imageUrl} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                </a>
              ))}
            </div>
          )}

          {/* Current response */}
          {currentResponse && (
            <div className="bg-blue-50 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">Your response:</p>
              <p className="text-sm text-gray-700">{currentResponse}</p>
              <button
                onClick={() => { setShowRespond(true); setResponseBody(currentResponse); }}
                className="text-xs text-blue-600 hover:underline mt-2"
              >
                Edit response
              </button>
            </div>
          )}

          {/* Respond form */}
          {showRespond ? (
            <div className="space-y-2">
              <textarea
                value={responseBody}
                onChange={(e) => setResponseBody(e.target.value)}
                rows={4}
                placeholder="Write your response..."
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitResponse}
                  disabled={loading || !responseBody.trim()}
                  className="bg-[#C9A84C] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#B8972A] disabled:opacity-50 transition"
                >
                  {loading ? "Saving..." : "Post response"}
                </button>
                <button onClick={() => setShowRespond(false)} className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          ) : !currentResponse ? (
            <button
              onClick={() => setShowRespond(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A]"
            >
              <MessageSquare className="w-4 h-4" /> Respond to this review
            </button>
          ) : null}

          {/* Flag */}
          {!flagged && !showFlag && (
            <button
              onClick={() => setShowFlag(true)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
            >
              <Flag className="w-3 h-3" /> Flag as suspicious
            </button>
          )}
          {showFlag && (
            <div className="space-y-2">
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                rows={2}
                placeholder="Explain why this review looks suspicious..."
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitFlag}
                  disabled={loading || !flagReason.trim()}
                  className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  Submit flag
                </button>
                <button onClick={() => setShowFlag(false)} className="text-sm text-gray-500">Cancel</button>
              </div>
            </div>
          )}
          {flagged && (
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Flag submitted. We&apos;ll investigate within 48 hours.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SiteReviewsTab({
  reviews,
  ratingAvg,
  businessName,
  businessSlug,
  categorySlug,
}: {
  reviews: Review[];
  ratingAvg: number | null;
  businessName: string;
  businessSlug: string;
  categorySlug: string;
}) {
  const verifiedCount = reviews.filter((r) => r.verifiedType === "purchase").length;
  const emailCount = reviews.filter((r) => r.verifiedType === "email").length;
  const respondedCount = reviews.filter((r) => r.response).length;

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <Star className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-700 mb-1">No The Lakes Guide reviews yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Reviews will appear here once visitors leave them on your listing and they&apos;re approved.
          </p>
          <Link
            href={`/${categorySlug}/${businessSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A]"
          >
            View your listing <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Average rating", value: ratingAvg ? `${ratingAvg.toFixed(1)} ★` : "—" },
              { label: "Total reviews", value: reviews.length },
              { label: "Verified Purchase", value: verifiedCount },
              { label: "Response rate", value: reviews.length ? `${Math.round((respondedCount / reviews.length) * 100)}%` : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-2xl font-display font-bold text-[#1B2E4B]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-sm text-gray-600">
            {verifiedCount} Verified Purchase &middot; {emailCount} Email Verified
            {respondedCount < reviews.length && (
              <span className="ml-3 text-amber-700 font-medium">
                {reviews.length - respondedCount} review{reviews.length - respondedCount !== 1 ? "s" : ""} without a response
              </span>
            )}
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>

          <div className="pt-2">
            <Link
              href={`/${categorySlug}/${businessSlug}#reviews`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A]"
            >
              View reviews on your listing <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
