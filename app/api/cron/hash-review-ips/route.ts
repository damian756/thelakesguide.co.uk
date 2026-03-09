import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

// Hashes raw IP addresses on reviews older than 30 days (GDPR minimisation).
// Runs daily at 3am UTC.

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 30 * 86400 * 1000);

  const reviews = await prisma.review.findMany({
    where: {
      ipHashed: false,
      ipAddress: { not: null },
      createdAt: { lte: cutoff },
    },
    select: { id: true, ipAddress: true },
    take: 500,
  });

  if (reviews.length === 0) {
    return NextResponse.json({ hashed: 0 });
  }

  await Promise.all(
    reviews.map((r) =>
      prisma.review.update({
        where: { id: r.id },
        data: {
          ipAddress: createHash("sha256").update(r.ipAddress!).digest("hex"),
          ipHashed: true,
        },
      })
    )
  );

  return NextResponse.json({ hashed: reviews.length });
}
