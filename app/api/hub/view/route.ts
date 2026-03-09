import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const businessId = body?.businessId;
    if (!businessId || typeof businessId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    prisma.businessClick
      .create({ data: { businessId, type: "view" } })
      .catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
