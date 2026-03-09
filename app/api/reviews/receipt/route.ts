import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const reviewId = form.get("reviewId") as string | null;
    const file = form.get("file") as File | null;

    if (!reviewId || !file) {
      return NextResponse.json({ error: "Missing reviewId or file." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, WebP or PDF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum 10MB." }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, status: true },
    });

    if (!review || (review.status !== "unverified" && review.status !== "pending")) {
      return NextResponse.json({ error: "Review not found or already processed." }, { status: 404 });
    }

    const ext = file.type === "application/pdf" ? "pdf" : (file.type.split("/")[1] ?? "jpg");
    const blob = await put(`receipts/${reviewId}/receipt.${ext}`, file, {
      access: "public",
      contentType: file.type,
    });

    await prisma.review.update({
      where: { id: reviewId },
      data: { receiptImageUrl: blob.url },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reviews/receipt POST]", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
