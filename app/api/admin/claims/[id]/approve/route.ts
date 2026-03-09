import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getResend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { getClaimApprovalHtml, FROM_EMAIL, BASE_URL } from "@/lib/email-templates/claim-approval";
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
    include: {
      business: true,
      user: { select: { id: true, email: true, name: true } },
    },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }

  if (claim.status !== "pending") {
    return NextResponse.json(
      { error: "Claim has already been processed." },
      { status: 400 }
    );
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.business.update({
      where: { id: claim.businessId },
      data: { claimed: true, userId: claim.userId },
    }),
    prisma.claimRequest.update({
      where: { id },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    }),
    prisma.inviteToken.create({
      data: {
        userId: claim.userId,
        token,
        expiresAt,
      },
    }),
  ]);

  const activateUrl = `${BASE_URL}/claim-listing/activate?token=${token}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: claim.user.email,
    subject: `Your claim for ${claim.business.name} has been approved | The Lakes Guide`,
    html: getClaimApprovalHtml({
      name: claim.name,
      businessName: claim.business.name,
      activateUrl,
    }),
  });

  return NextResponse.json({ ok: true });
}
