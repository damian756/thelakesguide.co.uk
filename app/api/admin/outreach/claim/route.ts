import { getResend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getClaimOutreachHtml, getClaimOutreachSubject } from "@/lib/email-templates/claim-outreach";
import { FROM_EMAIL, BASE_URL } from "@/lib/email-templates/claim-approval";
import { authOptions } from "@/lib/auth";

const COOLDOWN_DAYS = 30;

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
    include: { category: { select: { slug: true } } },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (business.claimed) {
    return NextResponse.json({ error: "Business is already claimed" }, { status: 400 });
  }

  const email = business.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Business has no email" }, { status: 400 });
  }

  const cooldownFrom = new Date();
  cooldownFrom.setDate(cooldownFrom.getDate() - COOLDOWN_DAYS);

  const recentLog = await prisma.outreachLog.findFirst({
    where: {
      businessId,
      type: "claim_invite",
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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const viewCount = await prisma.businessClick.count({
    where: {
      businessId,
      type: "view",
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  const claimUrl = `${BASE_URL}/claim-listing`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: getClaimOutreachSubject(business.name, viewCount),
    html: getClaimOutreachHtml({
      businessName: business.name,
      viewCount,
      claimUrl,
    }),
  });

  if (error) {
    console.error("Claim outreach email failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await prisma.outreachLog.create({
    data: {
      businessId,
      type: "claim_invite",
      sentTo: email,
      sentBy: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, sentTo: email });
}
