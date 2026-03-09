import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Admin | The Lakes Guide",
  description: "Admin dashboard.",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const [
    totalBusinesses,
    claimedCount,
    proCount,
    pendingClaims,
    recentClaims,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { claimed: true } }),
    prisma.business.count({ where: { hubTier: "pro" } }),
    prisma.claimRequest.count({ where: { status: "pending" } }),
    prisma.claimRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        business: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total businesses", value: totalBusinesses },
    { label: "Claimed", value: claimedCount },
    { label: "Pro subscribers", value: proCount },
    { label: "Pending claims", value: pendingClaims },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <p className="text-xs text-gray-400 uppercase mb-1">{label}</p>
            <p className="font-display text-3xl font-bold text-[#1B2E4B]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B]">
            Recent claims
          </h2>
          <Link
            href="/admin/claims"
            className="text-sm font-semibold text-[#C9A84C] hover:text-[#B8972A]"
          >
            View all claims →
          </Link>
        </div>
        {recentClaims.length === 0 ? (
          <p className="px-6 py-8 text-gray-500 text-sm">No claims yet.</p>
        ) : (
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
                <th className="text-left py-3 px-6 font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/claims`}
                      className="font-medium text-[#1B2E4B] hover:text-[#C9A84C]"
                    >
                      {c.business.name}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{c.name}</td>
                  <td className="py-4 px-6 text-gray-500">
                    {formatDistanceToNow(new Date(c.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        c.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : c.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
