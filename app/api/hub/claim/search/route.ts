import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string().min(2).max(200).trim(),
  postcode: z.string().min(3).max(20).trim(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter at least 2 characters for the business name and 3 for postcode." },
      { status: 400 }
    );
  }

  const { name, postcode } = parsed.data;
  const postcodePrefix = postcode.toUpperCase().replace(/\s/g, "").slice(0, 4);

  const businesses = await prisma.business.findMany({
    where: {
      name: { contains: name, mode: "insensitive" },
      postcode: { startsWith: postcodePrefix },
    },
    include: {
      category: { select: { name: true } },
    },
    take: 8,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    businesses.map((b) => ({
      id: b.id,
      name: b.name,
      address: b.address,
      postcode: b.postcode,
      category: b.category.name,
      claimed: b.claimed,
    }))
  );
}
