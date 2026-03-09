import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UpdateListingSchema = z.object({
  shortDescription: z.string().max(160).optional().default(""),
  description: z.string().max(1000).optional().default(""),
  phone: z.string().max(30).optional().default(""),
  email: z.union([z.string().email().max(100), z.literal("")]).optional().default(""),
  website: z.union([z.string().url().max(500), z.literal("")]).optional().default(""),
  priceRange: z.enum(["£", "££", "£££", "££££"]).nullable().optional(),
  openingHours: z
    .object({
      weekdayText: z.array(z.string()),
    })
    .nullable()
    .optional(),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateListingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const updateData: Record<string, unknown> = {
    shortDescription: (data.shortDescription ?? "").trim() || null,
    description: (data.description ?? "").trim() || null,
    phone: (data.phone ?? "").trim() || null,
    email: (data.email ?? "").trim() || null,
    website: (data.website ?? "").trim() || null,
    priceRange: data.priceRange ?? undefined,
    openingHours: data.openingHours ?? undefined,
    updatedAt: new Date(),
  };

  await prisma.business.update({
    where: { id: business.id },
    data: updateData as Parameters<typeof prisma.business.update>[0]["data"],
  });

  return NextResponse.json({ success: true });
}
