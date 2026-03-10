import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function requireApiKey(req: NextRequest): NextResponse | null {
  const key = req.headers.get("x-api-key");
  const expected = process.env.COMMAND_CENTRE_API_KEY;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = requireApiKey(req);
  if (authError) return authError;

  const businesses = await prisma.business.findMany({
    where: {
      claimed: false,
      email: { not: null },
    },
    include: {
      category: { select: { slug: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://thelakesguide.co.uk";

  return NextResponse.json({
    site: "thelakesguide",
    listings: businesses.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      website: b.website,
      address: b.address,
      postcode: b.postcode,
      category: b.category?.name ?? null,
      categorySlug: b.category?.slug ?? null,
      listingUrl: `${baseUrl}/${b.category?.slug ?? "restaurants"}/${b.slug}`,
    })),
  });
}
