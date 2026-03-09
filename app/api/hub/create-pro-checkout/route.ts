import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET) : null;

const CreateProSchema = z.object({
  billingPeriod: z.enum(["monthly", "annual"]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.email === "demo@southportguide.co.uk") {
    return NextResponse.json({ error: "Stripe payments are disabled in the demo account." }, { status: 403 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const monthlyPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const annualPriceId = process.env.STRIPE_PRO_ANNUAL_PRICE_ID;

  if (!monthlyPriceId || !annualPriceId) {
    return NextResponse.json(
      { error: "Pro price IDs not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateProSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const priceId =
    parsed.data.billingPeriod === "annual" ? annualPriceId : monthlyPriceId;

  const baseUrl =
    process.env.NEXTAUTH_URL || "https://www.southportguide.co.uk";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/home?upgraded=true`,
    cancel_url: `${baseUrl}/dashboard/upgrade`,
    customer_email: session.user.email ?? undefined,
    subscription_data: {
      metadata: {
        businessId: business.id,
        userId: session.user.id,
      },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({
    url: checkoutSession.url,
  });
}
