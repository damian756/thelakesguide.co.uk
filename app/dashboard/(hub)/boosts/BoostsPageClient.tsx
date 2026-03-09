"use client";

import { useState, useMemo } from "react";
import { getBoostTypes, formatPrice } from "@/lib/boost-config";

type Props = {
  categoryId: string;
  boostCredits: number;
  isPro: boolean;
};

export default function BoostsPageClient({
  categoryId,
  boostCredits,
  isPro,
}: Props) {
  const boostTypes = getBoostTypes();
  const [boostType, setBoostType] = useState<string>(boostTypes[0]?.id ?? "standard");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  });
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = boostTypes.find((t) => t.id === boostType) ?? boostTypes[0];
  const endsAt = useMemo(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + (config?.days ?? 7));
    end.setMilliseconds(-1);
    return end;
  }, [startDate, config?.days]);

  const pricePence = config?.pricePence ?? 1500;

  async function handleCheckout() {
    setError(null);
    setLoading("checkout");
    try {
      const res = await fetch("/api/hub/create-boost-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boostType,
          categoryId,
          startsAt: new Date(startDate).toISOString(),
          endsAt: endsAt.toISOString(),
          pricePence,
          label: label.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? data.message ?? "Failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No redirect URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleUseCredit() {
    setError(null);
    setLoading("credit");
    try {
      const res = await fetch("/api/hub/use-boost-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boostType,
          categoryId,
          startsAt: new Date(startDate).toISOString(),
          endsAt: endsAt.toISOString(),
          label: label.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? data.message ?? "Failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No redirect URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  const canUseCredit = boostCredits >= 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
        Book a boost
      </h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={boostType}
            onChange={(e) => setBoostType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl text-sm px-4 py-2.5 bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]"
          >
            {boostTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} — {formatPrice(t.pricePence)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl text-sm px-4 py-2.5 bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End date
          </label>
          <p className="text-sm text-gray-600">
            {endsAt.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Optional label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Bank Holiday Weekend"
            className="w-full border border-gray-200 rounded-xl text-sm px-4 py-2.5 bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-sm font-bold text-[#1B2E4B] mb-3">
            Total: {formatPrice(pricePence)}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleCheckout}
              disabled={!!loading}
              className="w-full bg-[#C9A84C] hover:bg-[#B8972A] text-white py-3 rounded-full font-bold text-sm transition-colors disabled:opacity-60"
            >
              {loading === "checkout" ? "Redirecting…" : "Checkout →"}
            </button>
            {canUseCredit && (
              <button
                onClick={handleUseCredit}
                disabled={!!loading}
                className="w-full border border-[#C9A84C]/40 text-[#C9A84C] py-2.5 rounded-full font-semibold text-sm hover:bg-[#C9A84C]/10 transition-colors disabled:opacity-60"
              >
                {loading === "credit" ? "Processing…" : "Use credit →"}
              </button>
            )}
          </div>
        </div>

        {isPro && (
          <p className="text-xs text-gray-500">
            Pro subscribers: 1 free credit per month. You have {boostCredits}{" "}
            credit{boostCredits !== 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </div>
  );
}
