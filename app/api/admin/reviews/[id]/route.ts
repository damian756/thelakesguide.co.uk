import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getResend } from "@/lib/resend";
import { del } from "@vercel/blob";
import {
  generateReviewApprovedEmail,
  generateNewSiteReviewEmail,
} from "@/lib/email-templates/review-verify";

export const runtime = "nodejs";
const BASE_URL = process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";

function displayName(review: { displayName: string | null; firstName: string; lastName: string }) {
  if (review.displayName) return review.displayName;
  return `${review.firstName} ${review.lastName.charAt(0).toUpperCase()}.`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { action, rejectionReason, removalNote, verifiedType } = body;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: { select: { slug: true } },
          user: { select: { email: true, name: true } },
        },
      },
    },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  if (action === "approve") {
    const resolvedVerifiedType = verifiedType || (review.receiptImageUrl ? "purchase" : "email");

    await prisma.review.update({
      where: { id },
      data: {
        status: "approved",
        verifiedType: resolvedVerifiedType,
        approvedAt: new Date(),
        receiptImageUrl: null,
      },
    });

    // Delete receipt from blob storage
    if (review.receiptImageUrl) {
      try {
        await del(review.receiptImageUrl);
      } catch { /* non-fatal */ }
    }

    // Notify reviewer
    try {
      const listingUrl = `${BASE_URL}/${review.business.category.slug}/${review.business.slug}`;
      await getResend().emails.send({
        from: "The Lakes Guide <hello@thelakesguide.co.uk>",
        to: review.email,
        subject: `Your review of ${review.business.name} is live`,
        html: generateReviewApprovedEmail(review.firstName, review.business.name, listingUrl),
      });
    } catch { /* non-fatal */ }

    // Notify business owner if listing is claimed
    if (review.business.user?.email) {
      try {
        await getResend().emails.send({
          from: "The Lakes Guide <hello@thelakesguide.co.uk>",
          to: review.business.user.email,
          subject: `New review for ${review.business.name}`,
          html: generateNewSiteReviewEmail(
            review.business.user.name,
            review.business.name,
            displayName(review),
            review.starRating,
            review.body
          ),
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ success: true, status: "approved" });
  }

  // reject
  await prisma.review.update({
    where: { id },
    data: {
      status: "rejected",
      rejectionReason: rejectionReason || null,
      removalNote: removalNote || null,
      receiptImageUrl: null,
    },
  });

  if (review.receiptImageUrl) {
    try {
      await del(review.receiptImageUrl);
    } catch { /* non-fatal */ }
  }

  return NextResponse.json({ success: true, status: "rejected" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { removalNote } = await req.json().catch(() => ({}));

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (review.receiptImageUrl) {
    try { await del(review.receiptImageUrl); } catch { /* non-fatal */ }
  }

  // Delete review images from blob
  const images = await prisma.reviewImage.findMany({ where: { reviewId: id } });
  for (const img of images) {
    try { await del(img.imageUrl); } catch { /* non-fatal */ }
  }

  if (removalNote) {
    // Soft delete: keep record with note visible on listing
    await prisma.review.update({
      where: { id },
      data: { status: "rejected", removalNote, receiptImageUrl: null },
    });
  } else {
    await prisma.review.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}
