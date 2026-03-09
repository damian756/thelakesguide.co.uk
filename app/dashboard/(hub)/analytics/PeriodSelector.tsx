"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PERIODS = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "all", label: "All time" },
] as const;

export default function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("period") || "30";

  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map(({ key, label }) => {
        const isActive = current === key;
        return (
          <button
            key={key}
            onClick={() =>
              router.push(`/dashboard/analytics?period=${key}`)
            }
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#1B2E4B] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
