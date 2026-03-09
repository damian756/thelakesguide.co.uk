import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BOOST_TYPES: Record<string, { pricePence: number; label: string }> = {
  standard: { pricePence: 1500, label: "Standard 7 days" },
  weekend: { pricePence: 1000, label: "Weekend (Fri–Sun)" },
  flower_show: { pricePence: 4900, label: "Flower Show Weekend" },
  air_show: { pricePence: 4900, label: "Air Show Weekend" },
  bank_holiday: { pricePence: 3500, label: "Bank Holiday Weekend" },
  christmas_markets: { pricePence: 9900, label: "Christmas Markets Month" },
  open2026: { pricePence: 14900, label: "The Open 2026 Fortnight" },
};

const UseCreditSchema = z.object({
  boostType: z.string(),
  categoryId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  label: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UseCreditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { boostType, categoryId, startsAt, endsAt, label } = parsed.data;

  const config = BOOST_TYPES[boostType];
  if (!config) {
    return NextResponse.json(
      { error: "Invalid boost type" },
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
    select: { id: true, boostCredits: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (business.boostCredits < 1) {
    return NextResponse.json(
      { error: "No boost credits available" },
      { status: 400 }
    );
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

  await prisma.$transaction([
    prisma.listingBoost.create({
      data: {
        businessId: business.id,
        categoryId,
        type: boostType,
        label: label?.trim() || null,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        pricePence: config.pricePence,
        status: "active",
      },
    }),
    prisma.business.update({
      where: { id: business.id },
      data: { boostCredits: { decrement: 1 } },
    }),
  ]);

  const baseUrl =
    process.env.NEXTAUTH_URL || "https://www.southportguide.co.uk";

  return NextResponse.json({
    url: `${baseUrl}/dashboard/boosts?boosted=true`,
  });
}
