"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function MonthFilter({ months }: { months: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("month") ?? "";

  function select(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (month) {
      params.set("month", month);
    } else {
      params.delete("month");
    }
    router.push(`/events?${params.toString()}`);
  }

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => select("")}
            className={`flex-none text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              !active
                ? "bg-[#1B2E4B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All months
          </button>
          {months.map((month) => (
            <button
              key={month}
              onClick={() => select(month)}
              className={`flex-none text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                active === month
                  ? "bg-[#C9A84C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {month.replace(" 2026", "").replace(" 2027", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
