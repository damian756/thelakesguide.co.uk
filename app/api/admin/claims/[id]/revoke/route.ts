import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const claim = await prisma.claimRequest.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }

  if (claim.status !== "approved") {
    return NextResponse.json(
      { error: "Only approved claims can be revoked." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    // Unclaim the business and unlink the user
    prisma.business.update({
      where: { id: claim.businessId },
      data: { claimed: false, userId: null, hubTier: "free" },
    }),
    // Mark the claim as revoked
    prisma.claimRequest.update({
      where: { id },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    }),
    // Expire any unused invite tokens for this user
    prisma.inviteToken.updateMany({
      where: { userId: claim.userId, usedAt: null },
      data: { expiresAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
