import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getUpgradeNudgeHtml, getUpgradeNudgeSubject } from "@/lib/email-templates/upgrade-nudge";
import { FROM_EMAIL } from "@/lib/email-templates/claim-approval";
import { getClicksForPeriod, getCategoryTotalClicks } from "@/lib/hub-analytics";
import { authOptions } from "@/lib/auth";

const COOLDOWN_DAYS = 60;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: { businessId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const businessId = body.businessId;
  if (!businessId || typeof businessId !== "string") {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      user: { select: { email: true, name: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (!business.claimed) {
    return NextResponse.json({ error: "Business is not claimed" }, { status: 400 });
  }

  if (business.hubTier !== "free") {
    return NextResponse.json({ error: "Business is already Pro" }, { status: 400 });
  }

  const userEmail = business.user?.email?.trim();
  if (!userEmail) {
    return NextResponse.json({ error: "Business has no user email" }, { status: 400 });
  }

  const cooldownFrom = new Date();
  cooldownFrom.setDate(cooldownFrom.getDate() - COOLDOWN_DAYS);

  const recentLog = await prisma.outreachLog.findFirst({
    where: {
      businessId,
      type: "upgrade_nudge",
      sentAt: { gte: cooldownFrom },
    },
    orderBy: { sentAt: "desc" },
  });

  if (recentLog) {
    return NextResponse.json(
      { error: "Already sent", alreadySentAt: recentLog.sentAt.toISOString() },
      { status: 409 }
    );
  }

  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);
  const lastWeekStart = new Date(thisMonday);
  lastWeekStart.setDate(thisMonday.getDate() - 7);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
  lastWeekEnd.setHours(23, 59, 59, 999);

  const [thisWeekClicks, categoryTotal] = await Promise.all([
    getClicksForPeriod(businessId, thisMonday, now),
    getCategoryTotalClicks(business.categoryId, thisMonday, now),
  ]);

  const viewCount =
    (thisWeekClicks.view ?? 0) +
    (thisWeekClicks.website ?? 0) +
    (thisWeekClicks.phone ?? 0) +
    (thisWeekClicks.directions ?? 0);

  const categorySharePercent =
    categoryTotal > 0 && viewCount > 0 ? Math.round((viewCount / categoryTotal) * 100) : null;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: getUpgradeNudgeSubject(business.name, viewCount),
    html: getUpgradeNudgeHtml({
      userName: business.user?.name ?? null,
      businessName: business.name,
      categoryName: business.category.name,
      viewCount,
      categorySharePercent,
    }),
  });

  if (error) {
    console.error("Upgrade nudge email failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await prisma.outreachLog.create({
    data: {
      businessId,
      type: "upgrade_nudge",
      sentTo: userEmail,
      sentBy: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, sentTo: userEmail });
}
