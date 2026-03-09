"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  XCircle,
  Flag,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Receipt,
} from "lucide-react";

type ReviewImage = { id: string; imageUrl: string; sortOrder: number };
type ReviewResponse = { id: string; body: string };
type Business = { name: string; slug: string; category: { slug: string } };

type Review = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  email: string;
  starRating: number;
  title: string | null;
  body: string;
  status: string;
  verifiedType: string;
  receiptImageUrl: string | null;
  emailVerifiedAt: string | null;
  ipAddress: string | null;
  flaggedAt: string | null;
  flagReason: string | null;
  flagStatus: string | null;
  rejectionReason: string | null;
  removalNote: string | null;
  createdAt: string;
  approvedAt: string | null;
  business: Business;
  images: ReviewImage[];
  response?: ReviewResponse | null;
};

function displayName(r: Review) {
  if (r.displayName) return r.displayName;
  return `${r.firstName} ${r.lastName.charAt(0).toUpperCase()}.`;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-500 font-bold text-sm">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function FraudBadge({ review }: { review: Review }) {
  if (review.flaggedAt && review.flagReason?.includes("IP")) {
    return (
      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium border border-red-200">
        <AlertTriangle className="w-3 h-3" /> High IP volume
      </span>
    );
  }
  return null;
}

function EmailBadge({ review }: { review: Review }) {
  if (review.emailVerifiedAt) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium border border-orange-200">
      Email unconfirmed
    </span>
  );
}

function ReviewCard({
  review,
  mode,
  onAction,
}: {
  review: Review;
  mode: "pending" | "flagged" | "approved";
  onAction: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [removalNote, setRemovalNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [verifiedType, setVerifiedType] = useState<"email" | "purchase">(
    review.receiptImageUrl ? "purchase" : "email"
  );

  async function approve() {
    setLoading(true);
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", verifiedType }),
    });
    setLoading(false);
    onAction();
  }

  async function reject() {
    setLoading(true);
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", rejectionReason: rejectReason }),
    });
    setLoading(false);
    onAction();
  }

  async function removeApproved() {
    setLoading(true);
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removalNote }),
    });
    setLoading(false);
    onAction();
  }

  async function markFlagReviewed() {
    setLoading(true);
    await fetch(`/api/admin/reviews/${review.id}/flag-reviewed`, {
      method: "POST",
    });
    setLoading(false);
    onAction();
  }

  const listingUrl = `/${review.business.category.slug}/${review.business.slug}`;

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${review.flaggedAt ? "border-amber-300" : "border-gray-100"}`}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-gray-50/50"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-[#1B2E4B] text-sm">{review.business.name}</span>
            <Link
              href={listingUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-[#C9A84C]"
            >
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Stars n={review.starRating} />
            <EmailBadge review={review} />
            <FraudBadge review={review} />
          </div>
          <p className="text-xs text-gray-500">
            {displayName(review)} &middot; {review.email} &middot;{" "}
            {new Date(review.createdAt).toLocaleDateString("en-GB")}
          </p>
          {review.title && (
            <p className="text-sm font-medium text-gray-800 mt-1">&ldquo;{review.title}&rdquo;</p>
          )}
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{review.body}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {review.images.length > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <ImageIcon className="w-3.5 h-3.5" /> {review.images.length}
            </span>
          )}
          {review.receiptImageUrl && (
            <span className="flex items-center gap-0.5 text-xs text-amber-600 font-medium">
              <Receipt className="w-3.5 h-3.5" /> Receipt
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {/* Full review body */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Review</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{review.body}</p>
          </div>

          {/* IP info */}
          {review.ipAddress && (
            <div className="text-xs text-gray-500">
              IP: <code className="bg-gray-100 px-1 py-0.5 rounded">{review.ipAddress}</code>
              {review.flaggedAt && (
                <span className="ml-2 text-amber-700">
                  Flagged: {review.flagReason}
                </span>
              )}
            </div>
          )}

          {/* Review photos */}
          {review.images.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Photos</p>
              <div className="flex gap-2 flex-wrap">
                {review.images.map((img) => (
                  <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img.imageUrl}
                      alt="Review photo"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Receipt */}
          {review.receiptImageUrl && (
            <div>
              <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold mb-2">Receipt (private — delete after decision)</p>
              <a href={review.receiptImageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={review.receiptImageUrl}
                  alt="Receipt"
                  className="max-w-xs rounded-lg border border-amber-200 hover:opacity-80 transition"
                />
              </a>
            </div>
          )}

          {/* Business response (approved tab) */}
          {mode === "approved" && review.response && (
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm">
              <p className="text-xs font-semibold text-blue-700 mb-1">Business response:</p>
              <p className="text-gray-700">{review.response.body}</p>
            </div>
          )}

          {/* Pending actions */}
          {mode === "pending" && (
            <div className="space-y-3">
              {review.receiptImageUrl && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Approve as:</span>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`verified-${review.id}`}
                      checked={verifiedType === "purchase"}
                      onChange={() => setVerifiedType("purchase")}
                    />
                    Verified Purchase
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`verified-${review.id}`}
                      checked={verifiedType === "email"}
                      onChange={() => setVerifiedType("email")}
                    />
                    Email Verified only
                  </label>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={approve}
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve{review.receiptImageUrl ? ` — ${verifiedType === "purchase" ? "Verified Purchase" : "Email Verified"}` : ""}
                </button>

                {!showReject ? (
                  <button
                    onClick={() => setShowReject(true)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <option value="">Select reason…</option>
                      <option value="spam">Spam</option>
                      <option value="fake">Appears fake</option>
                      <option value="offensive">Offensive language</option>
                      <option value="off-topic">Off topic</option>
                      <option value="duplicate">Duplicate</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      onClick={reject}
                      disabled={loading || !rejectReason}
                      className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      Confirm reject
                    </button>
                    <button
                      onClick={() => setShowReject(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flagged actions */}
          {mode === "flagged" && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
                <p className="font-semibold text-amber-800 mb-1 flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" /> Business flagged this review
                </p>
                <p className="text-amber-700">{review.flagReason}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={markFlagReviewed}
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <CheckCircle className="w-4 h-4" /> Mark reviewed (keep review)
                </button>
                {!showRemove ? (
                  <button
                    onClick={() => setShowRemove(true)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <XCircle className="w-4 h-4" /> Remove review
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap w-full">
                    <input
                      type="text"
                      value={removalNote}
                      onChange={(e) => setRemovalNote(e.target.value)}
                      placeholder="Public removal note (optional)"
                      className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <button
                      onClick={removeApproved}
                      disabled={loading}
                      className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      Remove
                    </button>
                    <button onClick={() => setShowRemove(false)} className="text-sm text-gray-500">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approved tab — remove option */}
          {mode === "approved" && (
            <div>
              {!showRemove ? (
                <button
                  onClick={() => setShowRemove(true)}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Remove this review
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={removalNote}
                    onChange={(e) => setRemovalNote(e.target.value)}
                    placeholder="Public removal note (optional)"
                    className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <button
                    onClick={removeApproved}
                    disabled={loading}
                    className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Remove
                  </button>
                  <button onClick={() => setShowRemove(false)} className="text-sm text-gray-500">Cancel</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminReviewsClient({
  pending,
  flagged,
  approved,
  activeTab,
}: {
  pending: Review[];
  flagged: Review[];
  approved: Review[];
  activeTab: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function refresh() {
    router.refresh();
  }

  function setTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/admin/reviews?${params.toString()}`);
  }

  const tabs = [
    { id: "pending", label: "Pending", count: pending.length },
    { id: "flagged", label: "Disputed", count: flagged.length },
    { id: "approved", label: "Approved", count: approved.length },
  ];

  const currentList =
    activeTab === "flagged" ? flagged : activeTab === "approved" ? approved : pending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Reviews</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-white text-[#1B2E4B] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.id
                  ? tab.id === "flagged" ? "bg-amber-100 text-amber-800" : "bg-[#C9A84C]/20 text-[#1B2E4B]"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {activeTab === "pending" ? "No reviews waiting for approval." :
             activeTab === "flagged" ? "No disputed reviews." :
             "No approved reviews yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              mode={activeTab as "pending" | "flagged" | "approved"}
              onAction={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
