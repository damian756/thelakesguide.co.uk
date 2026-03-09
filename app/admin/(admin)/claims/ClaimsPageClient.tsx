"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Check, X, RotateCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Claim = {
  id: string;
  name: string;
  email: string;
  message: string | null;
  status: string;
  createdAt: string;
  business: { id: string; name: string; address: string; postcode: string };
};

type Props = {
  claims: Claim[];
  tab: "pending" | "approved" | "rejected";
};

export default function ClaimsPageClient({ claims, tab }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function approve(id: string) {
    setLoadingId(id);
    setError(null);
    const res = await fetch(`/api/admin/claims/${id}/approve`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to approve.");
      setLoadingId(null);
      return;
    }
    setLoadingId(null);
    router.refresh();
  }

  async function reject(id: string) {
    setLoadingId(id);
    setError(null);
    const res = await fetch(`/api/admin/claims/${id}/reject`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to reject.");
      setLoadingId(null);
      return;
    }
    setLoadingId(null);
    router.refresh();
  }

  async function revoke(id: string) {
    if (!confirm("Revoke this claim? The business will be marked unclaimed and the user unlinked.")) return;
    setLoadingId(id);
    setError(null);
    const res = await fetch(`/api/admin/claims/${id}/revoke`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to revoke.");
      setLoadingId(null);
      return;
    }
    setLoadingId(null);
    router.refresh();
  }

  const tabs = [
    { value: "pending" as const, label: "Pending" },
    { value: "approved" as const, label: "Approved" },
    { value: "rejected" as const, label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={`/admin/claims?tab=${t.value}`}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg -mb-px transition ${
              tab === t.value
                ? "bg-white border border-b-0 border-gray-200 text-[#1B2E4B]"
                : "text-gray-500 hover:text-[#1B2E4B]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {claims.length === 0 ? (
        <p className="text-gray-500 text-sm py-8">No {tab} claims.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-3 px-6 font-semibold text-gray-600">
                  Business
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">
                  Claimant
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">
                  Submitted
                </th>
                {(tab === "pending" || tab === "approved") && (
                  <th className="text-right py-3 px-6 font-semibold text-gray-600">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 px-6">
                    <p className="font-medium text-[#1B2E4B]">{c.business.name}</p>
                    <p className="text-xs text-gray-500">
                      {c.business.address}, {c.business.postcode}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p>{c.name}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs text-[#C9A84C] hover:underline"
                    >
                      {c.email}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {formatDistanceToNow(new Date(c.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  {tab === "pending" && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => approve(c.id)}
                          disabled={loadingId !== null}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                        >
                          {loadingId === c.id ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => reject(c.id)}
                          disabled={loadingId !== null}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                      {c.message && (
                        <p className="text-xs text-gray-500 mt-2 text-left max-w-xs truncate">
                          &quot;{c.message}&quot;
                        </p>
                      )}
                    </td>
                  )}
                  {tab === "approved" && (
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => revoke(c.id)}
                        disabled={loadingId !== null}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 disabled:opacity-50 ml-auto"
                      >
                        {loadingId === c.id ? (
                          <span className="w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5" />
                        )}
                        Revoke
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
