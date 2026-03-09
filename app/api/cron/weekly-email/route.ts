import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getClicksForPeriod,
  getVisibilityScore,
  getCategoryTotalClicks,
} from "@/lib/hub-analytics";
import { generateWeeklyEmail } from "@/lib/email-templates/weekly-report";
import { signUnsubscribeToken } from "@/lib/hub-unsubscribe";
import { getUpcomingEvents } from "@/lib/lakes-data";
import { getEventImpactEstimate } from "@/lib/event-intel";

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "The Lakes Guide <onboarding@resend.dev>";

function getWeekBounds(): { thisWeekStart: Date; thisWeekEnd: Date; lastWeekStart: Date; lastWeekEnd: Date } {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);
  const thisWeekEnd = new Date(thisMonday);
  thisWeekEnd.setDate(thisMonday.getDate() + 7);
  thisWeekEnd.setMilliseconds(-1);
  const lastWeekStart = new Date(thisMonday);
  lastWeekStart.setDate(thisMonday.getDate() - 7);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
  lastWeekEnd.setHours(23, 59, 59, 999);
  return { thisWeekStart: thisMonday, thisWeekEnd: now, lastWeekStart, lastWeekEnd };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  const businesses = await prisma.business.findMany({
    where: {
      claimed: true,
      weeklyEmailEnabled: true,
      userId: { not: null },
    },
    include: {
      user: true,
      category: true,
    },
  });

  const { thisWeekStart, thisWeekEnd, lastWeekStart, lastWeekEnd } =
    getWeekBounds();
  const upcomingEvents = getUpcomingEvents(14);
  const firstUpcoming = upcomingEvents[0] ?? null;

  let sent = 0;

  for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
    const batch = businesses.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (business) => {
        const user = business.user;
        if (!user?.email) return;

        const [thisWeekClicks, lastWeekClicks, categoryTotal, latestSnapshot] =
          await Promise.all([
            getClicksForPeriod(business.id, thisWeekStart, thisWeekEnd),
            getClicksForPeriod(business.id, lastWeekStart, lastWeekEnd),
            business.hubTier === "pro"
              ? getCategoryTotalClicks(business.categoryId, thisWeekStart, thisWeekEnd)
              : Promise.resolve(0),
            prisma.reviewSnapshot.findFirst({
              where: { businessId: business.id },
              orderBy: { snapshotAt: "desc" },
            }),
          ]);

        const visibility = getVisibilityScore(business);
        const totalThis = Object.values(thisWeekClicks).reduce((a, b) => a + b, 0);
        const categorySharePercent =
          categoryTotal > 0 && business.hubTier === "pro"
            ? Math.round((totalThis / categoryTotal) * 100)
            : null;

        let reviewDelta: number | null = null;
        let ratingDelta: number | null = null;
        if (
          latestSnapshot &&
          business.reviewCount != null &&
          business.rating != null
        ) {
          reviewDelta = business.reviewCount - latestSnapshot.reviewCount;
          const rDelta = business.rating - latestSnapshot.rating;
          ratingDelta = Math.abs(rDelta) >= 0.1 ? rDelta : null;
        }

        const unsubscribeToken = signUnsubscribeToken(business.id);
        const baseUrl =
          process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";
        const unsubscribeUrl = `${baseUrl}/api/hub/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

        const html = generateWeeklyEmail(
          {
            id: business.id,
            name: business.name,
            category: { name: business.category.name },
            rating: business.rating,
            reviewCount: business.reviewCount,
            hubTier: business.hubTier,
          },
          { name: user.name, email: user.email },
          {
            thisWeekClicks,
            lastWeekClicks,
            visibilityScore: visibility.score,
            categorySharePercent,
            rating: business.rating,
            reviewCount: business.reviewCount,
            reviewDelta,
            ratingDelta,
          },
          {
            unsubscribeUrl,
            upcomingEvent: firstUpcoming
              ? {
                  title: firstUpcoming.title,
                  isoDate: firstUpcoming.isoDate,
                  dayLabel: firstUpcoming.dayLabel,
                  category: firstUpcoming.category,
                  impactEstimate: getEventImpactEstimate(
                    firstUpcoming.title,
                    business.category.slug
                  ),
                }
              : null,
          }
        );

        const { error } = await getResend().emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `Your Lakes Guide week | ${business.name}`,
          html,
        });

        if (error) {
          console.error(
            `Weekly email failed for ${business.name} (${user.email}):`,
            error
          );
          return;
        }

        await prisma.weeklyEmailLog.create({
          data: {
            businessId: business.id,
            weekStart: thisWeekStart,
          },
        });
        sent++;
      })
    );

    if (i + BATCH_SIZE < businesses.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return NextResponse.json({ sent });
}
