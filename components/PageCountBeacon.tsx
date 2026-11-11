"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Sends the page path (no query string) to /api/count on each page view, for a
// plain daily count. No cookies, no local storage, nothing about the visitor.
export default function PageCountBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return;
    try {
      navigator.sendBeacon("/api/count", pathname);
    } catch {
      // Counting is best effort.
    }
  }, [pathname]);

  return null;
}
