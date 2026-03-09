"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useRef } from "react";

type Props = {
  q?: string;
  claimed?: string;
  tier?: string;
};

export default function BusinessSearchBar({ q, claimed, tier }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const values = { q, claimed, tier, ...overrides };
    for (const [key, val] of Object.entries(values)) {
      if (val) params.set(key, val);
    }
    return `${pathname}?${params.toString()}`;
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const qVal = (data.get("q") as string | null) ?? "";
    router.push(buildUrl({ q: qVal || undefined }));
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search input */}
      <form ref={formRef} onSubmit={handleSearch} className="flex-1 min-w-[220px] max-w-xs relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name…"
          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C]"
        />
        {q && (
          <button
            type="button"
            onClick={() => router.push(buildUrl({ q: undefined }))}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Claimed filter */}
      <select
        value={claimed ?? ""}
        onChange={(e) => router.push(buildUrl({ claimed: e.target.value || undefined }))}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
      >
        <option value="">All claimed</option>
        <option value="yes">Claimed</option>
        <option value="no">Unclaimed</option>
      </select>

      {/* Listing tier filter */}
      <select
        value={tier ?? ""}
        onChange={(e) => router.push(buildUrl({ tier: e.target.value || undefined }))}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
      >
        <option value="">All tiers</option>
        <option value="free">Free</option>
        <option value="standard">Standard</option>
        <option value="featured">Featured</option>
        <option value="premium">Premium</option>
      </select>

      {(q || claimed || tier) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-gray-500 hover:text-gray-800 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
