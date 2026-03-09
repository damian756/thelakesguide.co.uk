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
  const { body } = await req.json();

  if (!body || typeof body !== "string" || body.trim().length < 5) {
    return NextResponse.json({ error: "Response is too short." }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "No business found." }, { status: 404 });
  }

  const review = await prisma.review.findUnique({
    where: { id },
    select: { id: true, businessId: true, status: true },
  });

  if (!review || review.businessId !== business.id || review.status !== "approved") {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  const response = await prisma.reviewResponse.upsert({
    where: { reviewId: id },
    create: { reviewId: id, businessId: business.id, body: body.trim() },
    update: { body: body.trim() },
  });

  return NextResponse.json({ success: true, response });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) return NextResponse.json({ error: "No business found." }, { status: 404 });

  await prisma.reviewResponse.deleteMany({
    where: { reviewId: id, businessId: business.id },
  });

  return NextResponse.json({ success: true });
}
