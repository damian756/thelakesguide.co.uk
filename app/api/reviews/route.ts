import { getResend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReviewVerificationEmail } from "@/lib/email-templates/review-verify";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const BASE_URL = process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fields: Record<string, string> = {};
    const photoFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      for (const [key, value] of form.entries()) {
        if (typeof value === "string") {
          fields[key] = value;
        } else if (value instanceof File && key === "photos") {
          photoFiles.push(value);
        }
      }
    } else {
      fields = await req.json();
    }

    const { businessId, firstName, lastName, displayName, email, starRating, title, body } = fields;

    if (!businessId || !firstName || !lastName || !email || !starRating || !body) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const rating = parseInt(starRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Star rating must be 1–5." }, { status: 400 });
    }

    if (body.trim().length < 20) {
      return NextResponse.json({ error: "Review must be at least 20 characters." }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true, slug: true, category: { select: { slug: true } } },
    });
    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    const ip = getIp(req);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400 * 1000);

    // Rate limit: 1 review per IP per listing per 30 days
    if (ip !== "unknown") {
      const recentByIp = await prisma.review.findFirst({
        where: {
          businessId,
          ipAddress: ip,
          createdAt: { gte: thirtyDaysAgo },
          status: { not: "rejected" },
        },
      });
      if (recentByIp) {
        return NextResponse.json(
          { error: "You've already submitted a review for this business recently." },
          { status: 429 }
        );
      }
    }

    // Rate limit: 1 review per email per listing ever
    const existingByEmail = await prisma.review.findFirst({
      where: {
        businessId,
        email: email.toLowerCase(),
        status: { not: "rejected" },
      },
    });
    if (existingByEmail) {
      return NextResponse.json(
        { error: "A review from this email address already exists for this listing." },
        { status: 429 }
      );
    }

    // Check for suspicious IP activity across all listings
    const recentIpCount = ip !== "unknown"
      ? await prisma.review.count({
          where: {
            ipAddress: ip,
            createdAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) },
          },
        })
      : 0;

    const token = randomUUID();
    const tokenExp = new Date(Date.now() + 48 * 3600 * 1000);

    const review = await prisma.review.create({
      data: {
        businessId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName?.trim() || null,
        email: email.toLowerCase().trim(),
        starRating: rating,
        title: title?.trim() || null,
        body: body.trim(),
        status: "pending",
        emailToken: token,
        emailTokenExp: tokenExp,
        ipAddress: ip,
        ...(recentIpCount >= 3 ? { flaggedAt: new Date(), flagReason: "High submission volume from same IP" } : {}),
      },
    });

    // Upload review photos
    if (photoFiles.length > 0) {
      const uploads = photoFiles.slice(0, 3).map(async (file, i) => {
        if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_PHOTO_SIZE) return null;
        const ext = file.type.split("/")[1] ?? "jpg";
        const blob = await put(`reviews/${review.id}/${i}.${ext}`, file, {
          access: "public",
          contentType: file.type,
        });
        return blob.url;
      });

      const urls = (await Promise.all(uploads)).filter(Boolean) as string[];
      if (urls.length > 0) {
        await prisma.reviewImage.createMany({
          data: urls.map((url, i) => ({
            reviewId: review.id,
            imageUrl: url,
            sortOrder: i,
          })),
        });
      }
    }

    const verifyUrl = `${BASE_URL}/api/reviews/verify?token=${token}`;

    await getResend().emails.send({
      from: "SouthportGuide <hello@thelakesguide.co.uk>",
      to: email,
      subject: `Confirm your review of ${business.name}`,
      html: generateReviewVerificationEmail(business.name, verifyUrl),
    });

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch (err) {
    console.error("[reviews POST]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
