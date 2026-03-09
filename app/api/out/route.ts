import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = new Set(["website", "phone", "directions", "google_reviews", "view"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("id");
  const type = searchParams.get("type");
  const dest = searchParams.get("url");

  // Record the click fire-and-forget — never block the redirect
  if (businessId && type && ALLOWED_TYPES.has(type)) {
    prisma.businessClick
      .create({ data: { businessId, type } })
      .catch(() => {});
  }

  if (!dest) {
    return new NextResponse(null, { status: 400 });
  }

  // Validate dest is an absolute http/https URL to prevent open redirect abuse
  try {
    const url = new URL(dest);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return new NextResponse(null, { status: 400 });
    }
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  return NextResponse.redirect(dest, { status: 302 });
}
