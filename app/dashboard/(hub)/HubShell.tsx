"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BarChart2,
  Building2,
  Star,
  Zap,
  CalendarDays,
  ArrowUpCircle,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/dashboard/home", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/listing", label: "My Listing", icon: Building2 },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/boosts", label: "Boosts", icon: Zap },
  { href: "/dashboard/events", label: "Event Intel", icon: CalendarDays, proOnly: true },
];

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role?: string;
};

type Business = {
  id: string;
  name: string;
  slug: string;
  hubTier: string;
  category: { slug: string };
};

type HubShellProps = {
  user: User;
  business: Business | null;
  children: React.ReactNode;
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function HubShell({ user, business, children }: HubShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({
    href,
    label,
    icon: Icon,
    proOnly,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    proOnly?: boolean;
  }) => {
    const isActive = pathname === href;
    const showProBadge = proOnly && business?.hubTier === "free";
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
          isActive
            ? "bg-white/10 text-white border-l-2 border-[#C9A84C] pl-3"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium text-sm">{label}</span>
        {showProBadge && (
          <span className="text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded font-bold ml-auto">
            PRO
          </span>
        )}
      </Link>
    );
  };

  const listingUrl = business
    ? `https://www.southportguide.co.uk/${business.category.slug}/${business.slug}`
    : "#";

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#1B2E4B]">
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <div className="px-4 py-5 flex items-center gap-2">
            <span className="font-display font-bold text-white">
              Southport<span className="text-[#C9A84C]">Guide</span>
            </span>
            <span className="text-white/40 text-xs font-normal">Business Portal</span>
          </div>

          {/* User */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] font-bold flex items-center justify-center text-sm flex-shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.name || "User"}</p>
                <p className="text-[#C9A84C] text-xs truncate">{business?.name || "No listing"}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            {business?.hubTier === "free" && (
              <Link
                href="/dashboard/upgrade"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
              >
                <ArrowUpCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">Upgrade to Pro</span>
              </Link>
            )}
            <div className="pt-4 space-y-0.5 border-t border-white/10">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
                >
                  <span className="font-medium text-sm">Admin</span>
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">Settings</span>
              </Link>
              <a
                href={listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">View my listing</span>
              </a>
            </div>
          </nav>

          {/* Sign out */}
          <div className="p-3 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: "/dashboard" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#1B2E4B] flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-display font-bold text-white text-sm">
          Southport<span className="text-[#C9A84C]">Guide</span>
        </span>
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] font-bold flex items-center justify-center text-sm">
          {getInitials(user.name)}
        </div>
      </div>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-[#1B2E4B] z-50 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-14">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-white/60 text-sm truncate">{user.email}</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            {business?.hubTier === "free" && (
              <Link
                href="/dashboard/upgrade"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C9A84C] hover:bg-[#C9A84C]/10"
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Upgrade to Pro</span>
              </Link>
            )}
            <div className="pt-4 space-y-0.5 border-t border-white/10">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C9A84C] hover:bg-[#C9A84C]/10"
                >
                  <span className="font-medium text-sm">Admin</span>
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">Settings</span>
              </Link>
              <a
                href={listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="font-medium text-sm">View my listing</span>
              </a>
            </div>
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: "/dashboard" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/5 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-64 pt-14 lg:pt-0">
        {user.email === "demo@southportguide.co.uk" && (
          <div className="bg-[#C9A84C] text-[#1B2E4B] text-sm font-semibold px-6 py-3 flex items-center justify-between gap-4">
            <span>
              🎭 <span className="font-bold">Demo account</span> — you&apos;re viewing The Sandgrounder. Data is illustrative only. Stripe payments are disabled.
            </span>
            <a
              href="/claim-listing"
              className="whitespace-nowrap underline hover:no-underline text-[#1B2E4B] font-bold text-xs"
            >
              Claim your real listing →
            </a>
          </div>
        )}
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
