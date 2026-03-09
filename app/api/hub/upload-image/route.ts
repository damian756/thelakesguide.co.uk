import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Demo guard
  if (session.user.email === "demo@southportguide.co.uk") {
    return NextResponse.json(
      { error: "Photo upload is disabled in the demo account." },
      { status: 403 }
    );
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true, images: true },
  });
  if (!business) {
    return NextResponse.json({ error: "No business found" }, { status: 404 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }
  if (business.images.length >= 6) {
    return NextResponse.json(
      { error: "Maximum 6 photos per listing." },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1] ?? "jpg";
  const filename = `businesses/${business.id}/${Date.now()}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type,
  });

  const updatedImages = [...business.images, blob.url];

  await prisma.business.update({
    where: { id: business.id },
    data: { images: updatedImages, updatedAt: new Date() },
  });

  return NextResponse.json({ url: blob.url, images: updatedImages });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  if (session.user.email === "demo@southportguide.co.uk") {
    return NextResponse.json({ error: "Disabled in demo." }, { status: 403 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true, images: true },
  });
  if (!business) {
    return NextResponse.json({ error: "No business found" }, { status: 404 });
  }

  const updatedImages = business.images.filter((img) => img !== url);

  await prisma.business.update({
    where: { id: business.id },
    data: { images: updatedImages, updatedAt: new Date() },
  });

  // Attempt to delete from Blob storage (best-effort)
  try {
    const { del } = await import("@vercel/blob");
    await del(url);
  } catch {
    // Non-fatal — URL may not be a Blob URL (e.g. legacy data)
  }

  return NextResponse.json({ images: updatedImages });
}
