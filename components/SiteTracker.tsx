"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) return;
    fetch("/api/p", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname ?? "/",
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
