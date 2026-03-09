import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

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

  await stripe.subscriptions.cancel(business.stripeSubscriptionId);

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
