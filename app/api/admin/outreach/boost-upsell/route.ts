import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getBoostUpsellHtml, getBoostUpsellSubject } from "@/lib/email-templates/boost-upsell";
import { FROM_EMAIL } from "@/lib/email-templates/claim-approval";
import { authOptions } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);
const COOLDOWN_DAYS = 14;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: { businessId?: string; delta?: number; currViews?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const businessId = body.businessId;
  if (!businessId || typeof businessId !== "string") {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  const delta = typeof body.delta === "number" ? body.delta : 0;
  const currViews = typeof body.currViews === "number" ? body.currViews : 0;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      user: { select: { email: true, name: true } },
      category: { select: { name: true } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (!business.claimed) {
    return NextResponse.json({ error: "Business is not claimed" }, { status: 400 });
  }

  if (business.hubTier !== "pro") {
    return NextResponse.json({ error: "Business is not on Pro tier" }, { status: 400 });
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
      type: "boost_upsell",
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

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: userEmail,
    subject: getBoostUpsellSubject(),
    html: getBoostUpsellHtml({
      userName: business.user?.name ?? null,
      businessName: business.name,
      categoryName: business.category.name,
      delta,
      currViews,
    }),
  });

  if (error) {
    console.error("Boost upsell email failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await prisma.outreachLog.create({
    data: {
      businessId,
      type: "boost_upsell",
      sentTo: userEmail,
      sentBy: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, sentTo: userEmail });
}
