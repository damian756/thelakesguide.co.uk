import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  postcode: z.string().min(1).max(20),
  phone: z.string().max(30).optional(),
  email: z.string().max(100).optional().default(""),
  website: z.string().max(500).optional().default(""),
  shortDescription: z.string().max(300).optional().default(""),
  description: z.string().max(5000).optional().default(""),
  placeId: z.string().max(200).optional().default(""),
  listingTier: z.enum(["free", "standard", "featured", "premium"]).optional().default("free"),
  hubTier: z.enum(["free", "pro"]),
  boostCredits: z.number().int().min(0),
  featured: z.boolean(),
  claimed: z.boolean(),
});

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const body = await _req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const emptyToNull = (s: string) => (s.trim() || null);

  await prisma.business.update({
    where: { id },
    data: {
      name: data.name,
      address: data.address,
      postcode: data.postcode,
      phone: emptyToNull(data.phone ?? ""),
      email: emptyToNull(data.email ?? ""),
      website: emptyToNull(data.website ?? ""),
      shortDescription: emptyToNull(data.shortDescription ?? ""),
      description: emptyToNull(data.description ?? ""),
      placeId: emptyToNull(data.placeId ?? ""),
      listingTier: data.listingTier ?? "free",
      hubTier: data.hubTier,
      boostCredits: data.boostCredits,
      featured: data.featured,
      claimed: data.claimed,
    },
  });

  return NextResponse.json({ ok: true });
}
