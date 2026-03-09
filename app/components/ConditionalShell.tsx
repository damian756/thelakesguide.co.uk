"use client";

import { usePathname } from "next/navigation";

const APP_ROUTES = ["/dashboard", "/admin"];

function isAppRoute(pathname: string): boolean {
  return APP_ROUTES.some((prefix) => pathname.startsWith(prefix));
}

export function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return null;
  return <>{children}</>;
}

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return null;
  return <>{children}</>;
}
