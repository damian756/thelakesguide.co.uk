import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStripe } from "@/lib/stripe";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true, stripeSubscriptionId: true, hubTier: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found." }, { status: 404 });
  }

  if (business.hubTier !== "pro" || !business.stripeSubscriptionId) {
    return NextResponse.json({ error: "No active Pro subscription." }, { status: 400 });
  }

  await getStripe().subscriptions.cancel(business.stripeSubscriptionId);

  await prisma.business.update({
    where: { id: business.id },
    data: { hubTier: "free" },
  });

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: business.stripeSubscriptionId },
    data: { status: "cancelled", canceledAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
