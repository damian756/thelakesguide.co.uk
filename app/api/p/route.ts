import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOT_PATTERNS = [
  "bot",
  "crawler",
  "spider",
  "Googlebot",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
];

function isBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BOT_PATTERNS.some((p) => lower.includes(p.toLowerCase()));
}

function getDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const lower = ua.toLowerCase();
  if (lower.includes("tablet") || lower.includes("ipad")) return "tablet";
  if (lower.includes("mobile") || (lower.includes("android") && !lower.includes("tablet"))) return "mobile";
  return "desktop";
}

function extractReferrerDomain(referrer: string | null): string | null {
  if (!referrer || typeof referrer !== "string" || referrer.trim() === "") return null;
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = body?.path;
    const referrer = body?.referrer;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ ok: true });
    }

    if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
      return NextResponse.json({ ok: true });
    }

    const ua = req.headers.get("user-agent") ?? "";
    if (isBot(ua)) {
      return NextResponse.json({ ok: true });
    }

    const device = getDevice(ua);
    const referrerDomain = extractReferrerDomain(referrer ?? null);

    prisma.pageView
      .create({
        data: {
          path: path.slice(0, 500),
          referrer: referrerDomain?.slice(0, 255) ?? null,
          device,
        },
      })
      .catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
