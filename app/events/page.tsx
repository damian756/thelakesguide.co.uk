import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowLeft, ExternalLink } from "lucide-react";
import { HERO_IMAGE_URL } from "@/lib/site-constants";
import { getEventsByMonth } from "@/lib/lakes-data";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import MonthFilter from "./MonthFilter";

export const revalidate = 3600; // Refresh hourly so Eventbrite sync appears

export const metadata = {
  title: "What's On in the Lake District 2026 | Events Calendar | The Lakes Guide",
  description:
    "The complete guide to events in the Lake District in 2026. Festivals, races, and seasonal events — updated regularly.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/events" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Comedy: "bg-purple-100 text-purple-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Theatre: "bg-indigo-100 text-indigo-700",
  Community: "bg-rose-100 text-rose-700",
  Festival: "bg-amber-100 text-amber-700",
  "Street Arts": "bg-orange-100 text-orange-700",
  Sport: "bg-green-100 text-green-700",
  "Circus & Arts": "bg-orange-100 text-orange-700",
  "Food & Drink": "bg-red-100 text-red-700",
  Music: "bg-blue-100 text-blue-700",
  Golf: "bg-emerald-100 text-emerald-700",
  "Arts & Culture": "bg-teal-100 text-teal-700",
};

function categoryClass(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600";
}

function getTodayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function eventDayLabel(event: { isoDate: string; dayLabel: string }) {
  return event.isoDate === getTodayISO() ? "Today" : event.dayLabel;
}

function formatDayLabel(dateStart: Date, dateEnd: Date | null): string {
  const start = dateStart;
  const end = dateEnd ?? dateStart;
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    return start.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }
  return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-GB", { month: "short" })}`;
}

async function getMergedEventsByMonth(): Promise<
  Record<string, Array<{ title: string; isoDate: string; endIsoDate?: string; dayLabel: string; venue: string; category: string; emoji: string; free: boolean; link: string; source?: "eventbrite" }>>
> {
  const staticByMonth = getEventsByMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dbEvents = await prisma.event.findMany({
    where: {
      status: "approved",
      OR: [{ dateEnd: { gte: today } }, { dateEnd: null, dateStart: { gte: today } }],
    },
    orderBy: { dateStart: "asc" },
  });

  const merged = { ...staticByMonth } as Record<
    string,
    Array<{ title: string; isoDate: string; endIsoDate?: string; dayLabel: string; venue: string; category: string; emoji: string; free: boolean; link: string; source?: "eventbrite" }>
  >;

  for (const ev of dbEvents) {
    const d = new Date(ev.dateStart);
    const label = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    if (!merged[label]) merged[label] = [];
    merged[label].push({
      title: ev.name,
      isoDate: ev.dateStart.toISOString().slice(0, 10),
      endIsoDate: ev.dateEnd ? ev.dateEnd.toISOString().slice(0, 10) : undefined,
      dayLabel: formatDayLabel(ev.dateStart, ev.dateEnd),
      venue: ev.venueName ?? "TBC",
      category: ev.category ?? "Community",
      emoji: "📅",
      free: ev.isFree,
      link: ev.link ?? "#",
      source: "eventbrite",
    });
  }

  for (const month of Object.keys(merged)) {
    merged[month].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  }

  return merged;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: activeMonth } = await searchParams;
  const eventsByMonth = await getMergedEventsByMonth();
  const allMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const firstDate = (month: string) => {
      const ev = eventsByMonth[month]?.[0];
      return ev ? new Date(ev.isoDate).getTime() : 0;
    };
    return firstDate(a) - firstDate(b);
  });
  const upcomingCount = Object.values(eventsByMonth).flat().filter(
    (e) => new Date(e.endIsoDate ?? e.isoDate) >= new Date(new Date().setHours(0, 0, 0, 0))
  ).length;

  const filteredMonths = activeMonth
    ? allMonths.filter((m) => m === activeMonth)
    : allMonths;

  const allMergedEvents = Object.values(eventsByMonth).flat();
  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lake District Events 2026",
    description: "The complete guide to events in the Lake District in 2026 — festivals, races, and seasonal events.",
    url: "https://www.thelakesguide.co.uk/events",
    numberOfItems: allMergedEvents.length,
    itemListElement: allMergedEvents.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
        item: {
          "@type": "Event",
          name: event.title,
          description: `${event.title} at ${event.venue}, Lake District.`,
          startDate: event.isoDate,
          endDate: event.endIsoDate ?? event.isoDate,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: event.venue,
            address: {
              "@type": "PostalAddress",
              addressLocality: event.venue,
              addressRegion: "Cumbria",
              addressCountry: "GB",
            },
          },
          isAccessibleForFree: event.free,
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            ...(event.free ? { price: "0", priceCurrency: "GBP" } : {}),
            url: event.link.startsWith("http") ? event.link : `https://www.thelakesguide.co.uk${event.link}`,
          },
          url: event.link.startsWith("http") ? event.link : `https://www.thelakesguide.co.uk${event.link}`,
          organizer: {
            "@type": "Organization",
            name: "The Lakes Guide",
            url: "https://www.thelakesguide.co.uk",
          },
        },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }} />
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="relative bg-[#1B2E4B] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
            alt="Lake District"
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover object-center opacity-30"
          />
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent relative z-10" />
        <div className="relative z-10 container mx-auto px-4 py-14 md:py-20 max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to guide
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-8 h-8 text-[#C9A84C]" />
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">Updated weekly</p>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            What&apos;s On in the Lake District<br />
            <span className="text-[#C9A84C]">2026 Events Calendar</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl">
            {upcomingCount} upcoming events across the year — from free community events to festivals and races. Updated regularly.
          </p>
        </div>
      </section>

      {/* Month filter tabs — client component */}
      <Suspense fallback={<div className="h-12 bg-white border-b border-gray-100" />}>
        <MonthFilter months={allMonths} />
      </Suspense>

      {/* Events by month */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {activeMonth && !eventsByMonth[activeMonth] ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No events found for this month.</p>
            <Link href="/events" className="text-[#C9A84C] font-semibold mt-4 inline-block hover:underline">
              View all events →
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredMonths.map((month) => {
              const events = eventsByMonth[month];
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = events.every((e) => new Date(e.isoDate) < today);

              return (
                <div key={month}>
                  <div className="flex items-center gap-4 mb-5">
                    <h2
                      className={`font-display text-xl md:text-2xl font-bold ${
                        isPast ? "text-gray-400" : "text-[#1B2E4B]"
                      }`}
                    >
                      {month}
                    </h2>
                    {isPast && (
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        Past
                      </span>
                    )}
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event, i) => {
                      const isExternal = event.link.startsWith("http");
                      const Tag = isExternal ? "a" : Link;
                      const extraProps = isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {};
                      const isCommunity = "source" in event && event.source === "eventbrite";

                      return (
                        <Tag
                          key={i}
                          href={event.link}
                          {...extraProps}
                          className={`group bg-white rounded-2xl p-5 border transition-all ${
                            isPast
                              ? "border-gray-100 opacity-50 pointer-events-none"
                              : "border-gray-100 hover:border-[#C9A84C]/40 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-2xl">{event.emoji}</span>
                            <div className="flex items-center gap-1.5">
                              {isCommunity && (
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                  Community
                                </span>
                              )}
                              {event.free ? (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                  Free
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-[#1B2E4B]/50 bg-gray-100 px-2.5 py-1 rounded-full">
                                  Tickets
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-1">
                            {eventDayLabel(event)}
                          </p>
                          <h3 className="font-display font-bold text-[#1B2E4B] text-base leading-snug mb-1 group-hover:text-[#C9A84C] transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">{event.venue}</p>

                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryClass(event.category)}`}>
                              {event.category}
                            </span>
                            {isExternal && (
                              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                            )}
                          </div>
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit event CTA */}
        <div className="mt-16 bg-[#1B2E4B] rounded-3xl p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white mb-2">Got an event to add?</h3>
          <p className="text-white/60 mb-6">
            We update this calendar weekly. If you run a Southport event that&apos;s not listed, get in touch.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C87A] text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            Submit your event
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
