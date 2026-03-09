import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getStripe } from "@/lib/stripe";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BOOST_TYPES: Record<string, { pricePence: number; label: string }> = {
  standard: { pricePence: 1500, label: "Standard 7 days" },
  weekend: { pricePence: 1000, label: "Weekend (Fri/Sun)" },
  flower_show: { pricePence: 4900, label: "Flower Show Weekend" },
  air_show: { pricePence: 4900, label: "Air Show Weekend" },
  bank_holiday: { pricePence: 3500, label: "Bank Holiday Weekend" },
  christmas_markets: { pricePence: 9900, label: "Christmas Markets Month" },
  open2026: { pricePence: 14900, label: "The Open 2026 Fortnight" },
};

const CreateBoostSchema = z.object({
  boostType: z.string(),
  categoryId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  pricePence: z.number().int().positive(),
  label: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.email === "demo@thelakesguide.co.uk") {
    return NextResponse.json({ error: "Stripe payments are disabled in the demo account." }, { status: 403 });
  }



  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateBoostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { boostType, categoryId, startsAt, endsAt, pricePence, label } =
    parsed.data;

  const config = BOOST_TYPES[boostType];
  if (!config || config.pricePence !== pricePence) {
    return NextResponse.json(
      { error: "Invalid boost type or price" },
      { status: 400 }
    );
  }

  if (boostType === "open2026" && new Date() >= new Date("2026-07-12")) {
    return NextResponse.json(
      { error: "Open 2026 boost no longer available" },
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

  const conflict = await prisma.listingBoost.findFirst({
    where: {
      categoryId,
      status: "active",
      startsAt: { lte: new Date(endsAt) },
      endsAt: { gte: new Date(startsAt) },
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "slot_taken", message: "This boost slot is already booked" },
      { status: 409 }
    );
  }

  const baseUrl =
    process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";
  const productName = `Lakes Guide Boost | ${label?.trim() || config.label}`;

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: { name: productName },
          unit_amount: pricePence,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/dashboard/boosts?boosted=true`,
    cancel_url: `${baseUrl}/dashboard/boosts`,
    metadata: {
      businessId: business.id,
      categoryId,
      boostType,
      startsAt,
      endsAt,
      pricePence: String(pricePence),
      label: label?.trim() || "",
    },
  });

  return NextResponse.json({
    url: checkoutSession.url,
  });
}
