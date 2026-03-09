import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClicksForPeriod } from "@/lib/hub-analytics";
import { CATEGORIES } from "@/lib/config";
import BoostsPageClient from "./BoostsPageClient";

export const metadata = {
  title: "Boosts | Business Hub",
  description: "Boost your listing visibility.",
  robots: { index: false, follow: false },
};

export default async function BoostsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    include: { category: true },
  });

  if (!business) redirect("/dashboard");

  const now = new Date();

  const [activeBoost, categoryBoosts, pastBoosts, expiredWithViews] =
    await Promise.all([
      prisma.listingBoost.findFirst({
        where: {
          businessId: business.id,
          status: "active",
          startsAt: { lte: now },
          endsAt: { gte: now },
        },
        include: { category: true },
      }),
      prisma.listingBoost.findMany({
        where: {
          categoryId: { in: (await prisma.category.findMany({ select: { id: true } })).map((c) => c.id) },
          status: "active",
          startsAt: { lte: now },
          endsAt: { gte: now },
        },
        include: { category: true, business: { select: { id: true } } },
      }),
      prisma.listingBoost.findMany({
        where: { businessId: business.id, endsAt: { lt: now } },
        orderBy: { endsAt: "desc" },
        take: 10,
        include: { category: true },
      }),
      (async () => {
        const expired = await prisma.listingBoost.findMany({
          where: {
            businessId: business.id,
            endsAt: { lt: now },
          },
          orderBy: { endsAt: "desc" },
          take: 10,
        });
        const views: Array<{ during: number; before: number }> = [];
        for (const b of expired) {
          const duringFrom = new Date(b.startsAt);
          duringFrom.setHours(0, 0, 0, 0);
          const duringTo = new Date(b.endsAt);
          duringTo.setHours(23, 59, 59, 999);
          const beforeTo = new Date(b.startsAt);
          beforeTo.setMilliseconds(-1);
          const beforeFrom = new Date(beforeTo);
          beforeFrom.setDate(beforeFrom.getDate() - 7);

          const [duringClicks, beforeClicks] = await Promise.all([
            getClicksForPeriod(business.id, duringFrom, duringTo),
            getClicksForPeriod(business.id, beforeFrom, beforeTo),
          ]);
          views.push({
            during: duringClicks.view ?? 0,
            before: beforeClicks.view ?? 0,
          });
        }
        return views;
      })(),
    ]);

  const activeByCategory = new Map(
    categoryBoosts.map((b) => [
      b.categoryId,
      {
        endsAt: b.endsAt,
        isMine: b.businessId === business.id,
      },
    ])
  );

  const categories = await prisma.category.findMany({
    where: { slug: { in: CATEGORIES.map((c) => c.slug) } },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">Boosts</h1>

      {/* 1. Current boost status */}
      <div
        className={`rounded-2xl border p-6 ${
          activeBoost
            ? "bg-emerald-50 border-emerald-200"
            : "bg-white border-gray-100 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap
            className={`w-10 h-10 ${activeBoost ? "text-emerald-500" : "text-gray-300"}`}
          />
          <div>
            <h2 className="font-display text-lg font-bold text-[#1B2E4B]">
              {activeBoost ? "🟢 Active boost" : "No active boost"}
            </h2>
            {activeBoost ? (
              <p className="text-emerald-700 font-semibold text-sm">
                {activeBoost.label || "Boost"}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Book a boost to appear at the top of your category
              </p>
            )}
          </div>
        </div>
        {activeBoost ? (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Running until{" "}
              {new Date(activeBoost.endsAt).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="text-sm text-gray-600">
              You&apos;re appearing at the top of {activeBoost.category.name}{" "}
              listings.
            </p>
          </>
        ) : (
          <Link
            href="#book"
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972A] text-white px-4 py-2 rounded-full font-bold text-sm transition-colors"
          >
            Book a boost
          </Link>
        )}
      </div>

      {/* 2. Category grid + 3. Book form */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
            Category availability
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const active = activeByCategory.get(cat.id);
              const isMyCategory = cat.id === business.categoryId;
              return (
                <div
                  key={cat.id}
                  className={`rounded-xl border p-4 ${
                    active?.isMine
                      ? "border-[#C9A84C]/30 bg-[#C9A84C]/5"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <p className="font-semibold text-[#1B2E4B] text-sm">{cat.name}</p>
                  {active?.isMine ? (
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-[#C9A84C]/20 text-[#B8972A] px-2 py-0.5 rounded-full">
                      Your boost
                    </span>
                  ) : active ? (
                    <span className="inline-block mt-2 text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      Booked until{" "}
                      {new Date(active.endsAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  ) : (
                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  )}
                  {isMyCategory && !active && (
                    <Link
                      href="#book"
                      className="block mt-3 text-xs font-semibold text-[#C9A84C] hover:text-[#B8972A]"
                    >
                      Book now →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div id="book">
          <BoostsPageClient
            categoryId={business.categoryId}
            boostCredits={business.boostCredits}
            isPro={business.hubTier === "pro"}
          />
        </div>
      </div>

      {/* 4. Past boosts */}
      <div>
        <h2 className="font-display text-lg font-bold text-[#1B2E4B] mb-4">
          Past boosts
        </h2>
        {pastBoosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active or past boosts yet.</p>
            <Link
              href="#book"
              className="inline-block mt-4 bg-[#C9A84C] hover:bg-[#B8972A] text-white px-4 py-2 rounded-full font-bold text-sm transition-colors"
            >
              Book a boost
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Period
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600">
                    Label
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600">
                    Views during
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600">
                    Week before
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600">
                    Uplift
                  </th>
                </tr>
              </thead>
              <tbody>
                {pastBoosts.map((b, i) => {
                  const v = expiredWithViews[i] ?? { during: 0, before: 0 };
                  const uplift =
                    v.before > 0
                      ? Math.round(((v.during - v.before) / v.before) * 100)
                      : v.during > 0
                        ? 100
                        : 0;
                  return (
                    <tr
                      key={b.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(b.startsAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        –{" "}
                        {new Date(b.endsAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-4 px-6 text-gray-700">{b.type}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {b.label || "—"}
                      </td>
                      <td className="py-4 px-6 text-right font-medium">
                        {v.during}
                      </td>
                      <td className="py-4 px-6 text-right">{v.before}</td>
                      <td
                        className={`py-4 px-6 text-right font-semibold ${
                          uplift > 0
                            ? "text-emerald-600"
                            : uplift < 0
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      >
                        {uplift > 0 ? "+" : ""}
                        {uplift}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
