"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileCheck,
  Building2,
  CalendarDays,
  Mail,
  BarChart2,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Star,
  Activity,
  Send,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/claims", label: "Claims", icon: FileCheck },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/businesses", label: "Businesses", icon: Building2 },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/site-analytics", label: "Site Analytics", icon: Activity },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/email-logs", label: "Email logs", icon: Mail },
  { href: "/admin/outreach", label: "Outreach", icon: Send },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1B2E4B] text-white flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <p className="font-display font-bold text-lg">Admin</p>
          <p className="text-white/60 text-xs mt-0.5">SouthportGuide</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#C9A84C] text-[#1B2E4B]"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/dashboard" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1B2E4B] z-50 transform transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <p className="font-display font-bold">Admin</p>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                pathname === href ? "bg-[#C9A84C] text-[#1B2E4B]" : "text-white/80"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-[#FAF8F5]/95 backdrop-blur border-b border-gray-100 px-4 py-3 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-[#1B2E4B]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
