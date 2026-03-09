import { prisma } from "@/lib/prisma";
import EventsPageClient from "./EventsPageClient";

export const metadata = {
  title: "Events | Admin",
  description: "Manage events.",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { dateStart: "asc" },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B] mb-6">
        Events
      </h1>
      <EventsPageClient
        events={events.map((e) => ({
          id: e.id,
          name: e.name,
          dateStart: e.dateStart.toISOString(),
          dateEnd: e.dateEnd?.toISOString() ?? null,
          description: e.description ?? "",
          category: e.category ?? "",
          featured: e.featured,
          source: e.source,
          status: e.status,
        }))}
      />
    </div>
  );
}
