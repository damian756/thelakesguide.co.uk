"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

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

type RejectedNote = {
  id: string;
  removalNote: string | null;
  createdAt: string;
};

function displayName(r: Review) {
  if (r.displayName) return r.displayName;
  return `${r.firstName} ${r.lastName.charAt(0).toUpperCase()}.`;
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
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
        ✓ Email Verified
      </span>
    );
  }
  return null;
}

function Stars({ n }: { n: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > 220;
  const bodyText = !isLong || expanded ? review.body : review.body.slice(0, 220) + "…";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[#1B2E4B]">{displayName(review)}</span>
            <Stars n={review.starRating} />
            <VerifiedBadge type={review.verifiedType} />
          </div>
          {review.title && (
            <p className="font-medium text-sm text-gray-800 mt-0.5">&ldquo;{review.title}&rdquo;</p>
          )}
        </div>
        {review.approvedAt && (
          <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
            {new Date(review.approvedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{bodyText}</p>

      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-xs text-[#C9A84C] font-medium hover:text-[#B8972A]"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Read more</>
          )}
        </button>
      )}

      {review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((img) => (
            <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={img.imageUrl}
                alt="Review photo"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition"
                unoptimized
              />
            </a>
          ))}
        </div>
      )}

      {review.response && (
        <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1">Response from the business</p>
          <p className="text-sm text-gray-700">{review.response.body}</p>
        </div>
      )}
    </div>
  );
}

type SortOption = "newest" | "highest" | "lowest" | "verified";

export default function ReviewListClient({
  reviews,
  rejected,
}: {
  reviews: Review[];
  rejected: RejectedNote[];
}) {
  const [sort, setSort] = useState<SortOption>("newest");

  const sorted = [...reviews].sort((a, b) => {
    if (sort === "highest") return b.starRating - a.starRating;
    if (sort === "lowest") return a.starRating - b.starRating;
    if (sort === "verified") {
      if (a.verifiedType === "purchase" && b.verifiedType !== "purchase") return -1;
      if (b.verifiedType === "purchase" && a.verifiedType !== "purchase") return 1;
      return 0;
    }
    return new Date(b.approvedAt || 0).getTime() - new Date(a.approvedAt || 0).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-bold text-[#1B2E4B] text-lg">
          What visitors say
        </h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white"
        >
          <option value="newest">Newest first</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
          <option value="verified">Verified first</option>
        </select>
      </div>

      <div className="space-y-3">
        {sorted.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {rejected.map((r) => (
          <div key={r.id} className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-4 text-sm text-gray-400 italic">
            One review removed — {r.removalNote}
          </div>
        ))}
      </div>
    </div>
  );
}
