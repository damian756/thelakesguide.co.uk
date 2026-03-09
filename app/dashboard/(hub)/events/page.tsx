import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, TrendingUp, Zap, Lock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getUpcomingEvents,
  getEventImpactEstimate,
  getBoostedCountInCategory,
} from "@/lib/event-intel";

export const metadata = {
  title: "Event Intel | Business Hub",
  description: "Upcoming events and footfall predictions.",
  robots: { index: false, follow: false },
};

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      hubTier: true,
      categoryId: true,
      category: { select: { slug: true, name: true } },
    },
  });

  if (!business) redirect("/dashboard");

  if (business.hubTier !== "pro") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">
          Event Intel
        </h1>
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 bg-white/70">
            <Lock className="w-10 h-10 text-[#C9A84C]" />
            <p className="font-display text-xl font-bold text-[#1B2E4B]">
              Pro feature
            </p>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Event Intelligence is available on the Pro plan. See which events
              drive footfall in your category and book boosts at the right time.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-block px-6 py-2.5 bg-[#C9A84C] text-white font-semibold text-sm rounded-lg hover:bg-[#B8972A]"
            >
              Upgrade to Pro →
            </Link>
          </div>
          <div className="p-6 opacity-30 pointer-events-none select-none space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const events = await getUpcomingEvents(365);

  type EventWithIntel = {
    id: string;
    name: string;
    dateStart: Date;
    dateEnd: Date | null;
    category: string | null;
    featuredImage: string | null;
    impactEstimate: string | null;
    boostedCount: number;
  };

  const eventsWithIntel: EventWithIntel[] = await Promise.all(
    events.map(async (ev) => {
      const impactEstimate = getEventImpactEstimate(
        ev.name,
        business.category.slug
      );
      const boostedCount = await getBoostedCountInCategory(
        business.categoryId,
        business.id,
        ev.dateStart,
        ev.dateEnd ?? ev.dateStart
      );
      return { ...ev, featuredImage: ev.featuredImage ?? null, impactEstimate, boostedCount };
    })
  );

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#1B2E4B]">
          Event Intel
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upcoming events near Southport and their estimated impact on{" "}
          <strong>{business.category.name}</strong> searches.
        </p>
      </div>

      {eventsWithIntel.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            No events in the next 90 days. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {eventsWithIntel.map((ev) => {
            const isHighImpact = !!ev.impactEstimate;
            const dateLabel =
              ev.dateEnd &&
              ev.dateEnd.toDateString() !== ev.dateStart.toDateString()
                ? `${formatDate(ev.dateStart)} – ${formatDate(ev.dateEnd)}`
                : formatDate(ev.dateStart);

            return (
              <div
                key={ev.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                  isHighImpact
                    ? "border-[#C9A84C]/30 border-l-4 border-l-[#C9A84C]"
                    : "border-gray-100"
                }`}
              >
                {ev.featuredImage && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={ev.featuredImage}
                      alt={ev.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-base font-bold text-[#1B2E4B]">
                        {ev.name}
                      </h2>
                      {isHighImpact && (
                        <span className="text-[10px] bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          High impact
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{dateLabel}</p>
                    {ev.impactEstimate && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        {ev.impactEstimate}
                      </div>
                    )}
                    {ev.boostedCount > 0 ? (
                      <p className="text-xs text-gray-400">
                        {ev.boostedCount} other{" "}
                        {ev.boostedCount === 1 ? "business" : "businesses"} in
                        your category{" "}
                        {ev.boostedCount === 1 ? "has" : "have"} already boosted
                        for this period.
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        No competitors have boosted yet — be first.
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href="/dashboard/boosts"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2E4B] text-white text-sm font-semibold rounded-lg hover:bg-[#16263f] whitespace-nowrap"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Book boost
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info card */}
      <div className="bg-[#1B2E4B]/5 rounded-2xl p-5 text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-[#1B2E4B]">How this works</p>
        <p>
          Impact estimates are based on historical click data and event type.
          Booking a boost pins your listing to the top of{" "}
          <strong>{business.category.name}</strong> for the event period so
          visitors searching during the event find you first.
        </p>
        <p className="pt-1">
          <Link
            href="/dashboard/boosts"
            className="text-[#C9A84C] font-semibold hover:text-[#B8972A]"
          >
            Manage your boosts →
          </Link>
        </p>
      </div>
    </div>
  );
}
