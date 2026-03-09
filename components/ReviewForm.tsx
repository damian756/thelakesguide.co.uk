"use client";

import { useState, useRef } from "react";
import { Star, Upload, X, Receipt } from "lucide-react";

type Props = {
  businessId: string;
  businessName: string;
};

export default function ReviewForm({ businessId, businessName }: Props) {
  const [step, setStep] = useState<"form" | "receipt" | "done">("form");
  const [submittedReviewId, setSubmittedReviewId] = useState<string | null>(null);

  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptDone, setReceiptDone] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 3 - photos.length);
    setPhotos((p) => [...p, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((p) => [...p, ...newPreviews]);
  }

  function removePhoto(i: number) {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPhotoPreviews((p) => p.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (starRating === 0) { setError("Please select a star rating."); return; }
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim()) { setError("Last name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (body.trim().length < 20) { setError("Review must be at least 20 characters."); return; }

    setSubmitting(true);

    const form = new FormData();
    form.append("businessId", businessId);
    form.append("firstName", firstName.trim());
    form.append("lastName", lastName.trim());
    form.append("displayName", displayName.trim());
    form.append("email", email.trim());
    form.append("starRating", String(starRating));
    form.append("title", title.trim());
    form.append("body", body.trim());
    photos.forEach((p) => form.append("photos", p));

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      setSubmittedReviewId(data.reviewId);
      setStep("receipt");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  async function handleReceiptUpload(file: File) {
    if (!submittedReviewId) return;
    setReceiptUploading(true);
    setReceiptError(null);
    try {
      const form = new FormData();
      form.append("reviewId", submittedReviewId);
      form.append("file", file);
      const res = await fetch("/api/reviews/receipt", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setReceiptError(data.error || "Upload failed. Please try again.");
      } else {
        setReceiptDone(true);
      }
    } catch {
      setReceiptError("Upload failed. Please check your connection and try again.");
    }
    setReceiptUploading(false);
  }

  if (step === "done") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 text-emerald-600 fill-emerald-400" />
        </div>
        <h3 className="font-semibold text-emerald-900 mb-1">Thanks for your review!</h3>
        <p className="text-sm text-emerald-700">We&apos;ve sent a verification link to your email. Click it to confirm your review and it&apos;ll appear once approved.</p>
      </div>
    );
  }

  if (step === "receipt") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
          <strong>Review submitted.</strong> Check your email for a verification link.
        </div>

        <div className="border border-dashed border-[#C9A84C]/60 rounded-xl p-5 text-center space-y-2">
          <Receipt className="w-7 h-7 text-[#C9A84C] mx-auto" />
          <p className="font-semibold text-gray-800 text-sm">Want a Verified Purchase badge?</p>
          <p className="text-xs text-gray-500">Upload a receipt or transaction screenshot to prove your visit. It won&apos;t be published — we check it privately then delete it.</p>

          {receiptDone ? (
            <p className="text-sm font-semibold text-emerald-700">Receipt uploaded. Thanks!</p>
          ) : receiptUploading ? (
            <p className="text-sm text-gray-500">Uploading...</p>
          ) : (
            <>
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setReceipt(f);
                    handleReceiptUpload(f);
                  }
                }}
              />
              {receipt && !receiptError ? (
                <p className="text-sm text-gray-500">{receipt.name}</p>
              ) : (
                <button
                  onClick={() => receiptInputRef.current?.click()}
                  className="inline-flex items-center gap-2 border border-[#C9A84C] text-[#C9A84C] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C9A84C]/10 transition"
                >
                  <Upload className="w-4 h-4" /> Choose receipt
                </button>
              )}
              {receiptError && (
                <p className="text-sm text-red-600 mt-1">{receiptError} <button onClick={() => receiptInputRef.current?.click()} className="underline">Try again</button></p>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setStep("done")}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Skip — continue without receipt
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-display text-lg font-bold text-[#1B2E4B] mb-5">
        Leave a review for {businessName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStarRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl leading-none transition-transform hover:scale-110"
              >
                <span className={n <= (hoverRating || starRating) ? "text-amber-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              placeholder="Damian"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              placeholder="Smith"
            />
          </div>
        </div>

        {/* Display name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display name{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            placeholder={firstName && lastName ? `${firstName} ${lastName.charAt(0).toUpperCase()}.` : "e.g. Golf Dave from Wigan"}
            maxLength={40}
          />
          <p className="text-xs text-gray-400 mt-1">Leave blank and we&apos;ll show &ldquo;{firstName || "First"} {lastName ? lastName.charAt(0).toUpperCase() + "." : "L."}&rdquo;</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            placeholder="you@example.com"
          />
          <p className="text-xs text-gray-400 mt-1">Used only to verify your review. Not displayed publicly.</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            placeholder="Great food, brilliant service"
          />
        </div>

        {/* Review body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your review *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            maxLength={1500}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
            placeholder="Tell us about your experience..."
          />
          <p className="text-xs text-gray-400 text-right mt-0.5">{body.length}/1500</p>
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos <span className="text-gray-400 font-normal">(optional, up to 3)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {photoPreviews.map((src, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => addPhotos(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#C9A84C] transition text-gray-400 hover:text-[#C9A84C]"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Add photo</span>
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-xl hover:bg-[#B8972A] disabled:opacity-50 transition text-sm"
        >
          {submitting ? "Submitting..." : "Submit review"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          All reviews are moderated. By submitting you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-600">terms</a>.
          Your full name will not be displayed publicly.
        </p>
      </form>
    </div>
  );
}
