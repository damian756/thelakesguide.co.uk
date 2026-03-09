import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const { reason } = await req.json();

  if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
    return NextResponse.json({ error: "Please provide a reason." }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) return NextResponse.json({ error: "No business found." }, { status: 404 });

  const review = await prisma.review.findUnique({
    where: { id },
    select: { id: true, businessId: true, flaggedAt: true },
  });

  if (!review || review.businessId !== business.id) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  if (review.flaggedAt) {
    return NextResponse.json({ error: "This review has already been flagged." }, { status: 409 });
  }

  await prisma.review.update({
    where: { id },
    data: {
      flaggedAt: new Date(),
      flagReason: reason.trim(),
      flagStatus: "pending",
    },
  });

  return NextResponse.json({ success: true });
}
