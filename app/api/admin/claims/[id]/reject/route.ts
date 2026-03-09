import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getClaimRejectionHtml, FROM_EMAIL } from "@/lib/email-templates/claim-approval";
import { authOptions } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  if (claim.status !== "pending") {
    return NextResponse.json(
      { error: "Claim has already been processed." },
      { status: 400 }
    );
  }

  await prisma.claimRequest.update({
    where: { id },
    data: {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
    },
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: claim.email,
    subject: "Update on your listing claim — SouthportGuide",
    html: getClaimRejectionHtml({
      name: claim.name,
      businessName: claim.business.name,
    }),
  });

  return NextResponse.json({ ok: true });
}
