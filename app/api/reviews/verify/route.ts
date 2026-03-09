import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/?review=invalid", req.url));
  }

  const review = await prisma.review.findUnique({
    where: { emailToken: token },
    include: {
      business: { select: { slug: true, category: { select: { slug: true } } } },
    },
  });

  if (!review) {
    return NextResponse.redirect(new URL("/?review=invalid", req.url));
  }

  if (review.emailVerifiedAt) {
    // Already verified — redirect back to listing
    const url = `/${review.business.category.slug}/${review.business.slug}?review=already-verified`;
    return NextResponse.redirect(new URL(url, req.url));
  }

  if (review.emailTokenExp && review.emailTokenExp < new Date()) {
    return NextResponse.redirect(
      new URL(`/${review.business.category.slug}/${review.business.slug}?review=expired`, req.url)
    );
  }

  await prisma.review.update({
    where: { id: review.id },
    data: {
      emailVerifiedAt: new Date(),
      emailToken: null,
      emailTokenExp: null,
    },
  });

  const listingUrl = `/${review.business.category.slug}/${review.business.slug}?review=verified`;
  return NextResponse.redirect(new URL(listingUrl, req.url));
}
