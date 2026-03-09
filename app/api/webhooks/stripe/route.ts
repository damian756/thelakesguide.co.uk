import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "payment" && session.metadata) {
        const { businessId, categoryId, boostType, startsAt, endsAt, pricePence, label } =
          session.metadata;
        if (businessId && categoryId && boostType && startsAt && endsAt && pricePence) {
          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null;

          await prisma.listingBoost.create({
            data: {
              businessId,
              categoryId,
              type: boostType,
              label: label || null,
              startsAt: new Date(startsAt),
              endsAt: new Date(endsAt),
              pricePence: parseInt(pricePence, 10),
              stripePaymentIntentId: paymentIntentId,
              status: "active",
            },
          });
        }
      }
    }

    if (event.type === "customer.subscription.created") {
      const sub = event.data.object as Stripe.Subscription;
      const periodStart = (sub as { current_period_start?: number }).current_period_start;
      const periodEnd = (sub as { current_period_end?: number }).current_period_end;
      const businessId = sub.metadata?.businessId;
      const userId = sub.metadata?.userId;
      if (businessId && userId) {
        await prisma.business.update({
          where: { id: businessId },
          data: {
            hubTier: "pro",
            stripeSubscriptionId: sub.id,
            stripeCustomerId: sub.customer as string,
          },
        });
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: sub.id },
          create: {
            businessId,
            tier: "premium",
            stripeSubscriptionId: sub.id,
            stripeCustomerId: sub.customer as string,
            status: sub.status,
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : new Date(),
          },
          update: {
            status: sub.status,
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : undefined,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
          },
        });
      }
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const periodStart = (sub as { current_period_start?: number }).current_period_start;
      const periodEnd = (sub as { current_period_end?: number }).current_period_end;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: sub.status,
          ...(periodStart && { currentPeriodStart: new Date(periodStart * 1000) }),
          ...(periodEnd && { currentPeriodEnd: new Date(periodEnd * 1000) }),
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const biz = await prisma.business.findFirst({
        where: { stripeSubscriptionId: sub.id },
        select: { id: true },
      });
      if (biz) {
        await prisma.business.update({
          where: { id: biz.id },
          data: { hubTier: "free" },
        });
      }
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "cancelled" },
      });
    }
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
