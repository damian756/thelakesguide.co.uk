import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Runs on the 1st of each month at 09:00 UTC (configured in vercel.json).
// Adds 1 boost credit to every active Pro business.

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.business.updateMany({
    where: { hubTier: "pro", claimed: true },
    data: { boostCredits: { increment: 1 } },
  });

  return NextResponse.json({ credited: result.count });
}
