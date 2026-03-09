import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/hub-unsubscribe";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invalid link</title></head><body style="font-family: system-ui; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center;"><h1 style="color: #1B2E4B;">Invalid or expired link</h1><p style="color: #666;">This unsubscribe link is invalid or has expired.</p></body></html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  const payload = verifyUnsubscribeToken(token);
  if (!payload) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invalid link</title></head><body style="font-family: system-ui; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center;"><h1 style="color: #1B2E4B;">Invalid or expired link</h1><p style="color: #666;">This unsubscribe link is invalid or has expired.</p></body></html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  await prisma.business.update({
    where: { id: payload.businessId },
    data: { weeklyEmailEnabled: false },
  });

  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Unsubscribed</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center; background: #FAF8F5;">
  <h1 style="color: #1B2E4B; margin-bottom: 16px;">You've been unsubscribed</h1>
  <p style="color: #666; margin: 0;">You will no longer receive weekly performance emails from SouthportGuide.</p>
  <p style="color: #888; font-size: 14px; margin-top: 24px;">You can re-enable them anytime in your <a href="${process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk"}/dashboard/settings" style="color: #C9A84C;">dashboard settings</a>.</p>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}
