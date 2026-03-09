import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string().min(1).max(200),
  dateStart: z.string().min(1),
  dateEnd: z.string().nullable(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  featured: z.boolean(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { dateStart, dateEnd, ...rest } = parsed.data;
  const slug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = await prisma.event.findUnique({ where: { slug } });
  const finalSlug = existing
    ? `${slug}-${Date.now().toString(36)}`
    : slug;

  await prisma.event.create({
    data: {
      name: parsed.data.name,
      slug: finalSlug,
      dateStart: new Date(dateStart),
      dateEnd: dateEnd ? new Date(dateEnd) : null,
      description: rest.description,
      category: rest.category,
      featured: rest.featured,
    },
  });

  return NextResponse.json({ ok: true });
}
