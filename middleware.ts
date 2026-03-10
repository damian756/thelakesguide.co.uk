import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const BOT_RE = /bot|crawl|spider|slurp|googlebot|bingbot|yandex|facebookexternalhit|twitterbot|linkedinbot/i;

function getDevice(ua: string): string {
  const l = ua.toLowerCase();
  if (l.includes("tablet") || l.includes("ipad")) return "tablet";
  if (l.includes("mobile") || (l.includes("android") && !l.includes("tablet"))) return "mobile";
  return "desktop";
}

function getReferrerDomain(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|txt|xml|json|webp|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (req.headers.get("next-router-prefetch") === "1") return NextResponse.next();

  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) return NextResponse.next();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.next();

  const referrerDomain = getReferrerDomain(req.headers.get("referer"));
  const device = getDevice(ua);
  const id = crypto.randomUUID();

  event.waitUntil(
    (async () => {
      try {
        const sql = neon(dbUrl);
        await sql`
          INSERT INTO "PageView" (id, path, referrer, device, "createdAt")
          VALUES (${id}, ${pathname.slice(0, 500)}, ${referrerDomain}, ${device}, NOW())
        `;
      } catch {}
    })()
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
