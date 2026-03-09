import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavMenu from "./components/NavMenu";
import { ConditionalNav, ConditionalFooter } from "./components/ConditionalShell";
import { Analytics } from "@vercel/analytics/next";
import { SiteTracker } from "@/components/SiteTracker";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "The Lakes Guide — The Complete Visitor Guide to the Lake District",
    template: "%s | The Lakes Guide",
  },
  description:
    "Discover the best restaurants, pubs, walks, villages and things to do in the Lake District. Your complete local guide.",
  keywords:
    "Lake District, Lake District restaurants, Lake District walks, things to do Lake District, visitor guide, Lakes Guide",
  authors: [{ name: "Churchtown Media", url: "https://churchtownmedia.co.uk" }],
  creator: "Churchtown Media",
  publisher: "The Lakes Guide",

  // Canonical & feeds
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/feed`,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE_URL,
    siteName: "The Lakes Guide",
    title: "The Lakes Guide — The Complete Visitor Guide to the Lake District",
    description:
      "Discover the best restaurants, pubs, walks, villages and things to do in the Lake District. Your complete local guide.",
    images: [
      {
        url: `${BASE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "The Lakes Guide — Discover the Lake District",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "The Lakes Guide — The Complete Visitor Guide to the Lake District",
    description: "Discover the best restaurants, pubs, walks, villages and things to do in the Lake District.",
    images: [`${BASE_URL}/og-default.png`],
    creator: "@TheLakesGuide",
  },

  // Icons (app/favicon.ico auto-served by Next.js; PNGs from public/)
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // PWA
  manifest: "/manifest.json",

  // Verification (add Search Console token when ready)
  // verification: { google: "YOUR_SEARCH_CONSOLE_VERIFICATION_TOKEN" },

  // Misc
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#FAF8F5]`}>
        <ConditionalNav><Navigation /></ConditionalNav>
        <main className="overflow-x-hidden">{children}</main>
        <ConditionalFooter><Footer /></ConditionalFooter>
        <SiteTracker />
        <Analytics />
      </body>
    </html>
  );
}

function Navigation() {
  return (
    <nav className="relative bg-white/95 backdrop-blur-sm border-b border-[#1B2E4B]/8 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="font-display text-xl font-bold text-[#1B2E4B] group-hover:text-[#C9A84C] transition-colors">
              The Lakes<span className="text-[#C9A84C]">Guide</span>
            </span>
            <span className="hidden sm:block text-xs text-gray-400 font-light tracking-widest uppercase mt-0.5">.co.uk</span>
          </Link>
          <NavMenu />
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1B2E4B] text-white/80">
      {/* Gold accent strip */}
      <div className="h-1 bg-gradient-to-r from-[#C9A84C] via-[#E8C87A] to-[#C9A84C]" />

      <div className="container mx-auto px-4 py-14 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold text-white mb-3">
              The Lakes<span className="text-[#C9A84C]">Guide</span>
              <span className="text-white/40 text-sm font-normal ml-1">.co.uk</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-4 max-w-xs">
              Your definitive guide to eating, staying, and exploring the Lake District.
            </p>
            <div className="flex gap-3">
              <a href="https://churchtownmedia.co.uk" className="text-xs text-[#C9A84C] hover:text-[#E8C87A] transition">
                Built by Churchtown Media ↗
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Lakes Network</p>
              <ul className="space-y-1.5">
                <li>
                  <span className="text-sm font-semibold text-white/40">TheLakesGuide.co.uk</span>
                </li>
                <li>
                  <a href="https://www.thelakeswildlife.co.uk" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/70 hover:text-[#C9A84C] transition">
                    The Lakes Wildlife ↗
                  </a>
                </li>
                <li>
                  <a href="https://www.hikethelakes.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/70 hover:text-[#C9A84C] transition">
                    Hike The Lakes ↗
                  </a>
                </li>
                <li>
                  <a href="https://thelakes.network" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/70 hover:text-[#C9A84C] transition">
                    TheLakes.network ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Things to Do", "/things-to-do"],
                ["Restaurants", "/restaurants"],
                ["Places to Stay", "/accommodation"],
                ["Pubs & Inns", "/pubs"],
                ["Cafes", "/cafes"],
                ["Walks", "/walks"],
                ["Villages", "/villages"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#C9A84C] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">More</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Fishing", "/activities"],
                ["Cycling", "/activities"],
                ["Wildlife", "/activities"],
                ["Events", "/events"],
                ["Shopping", "/shopping"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#C9A84C] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Business</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ["About this site", "/about"],
                ["List Your Business", "/claim-listing"],
                ["Pricing", "/pricing"],
                ["Advertise With Us", "/advertise"],
                ["Business Dashboard", "/dashboard"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#C9A84C] transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 pb-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <span>Part of the <a href="https://thelakes.network" target="_blank" rel="noopener" className="hover:text-white/60 transition">Lakes Network</a></span>
          <div className="flex flex-wrap gap-5">
            <a href="https://www.thelakesguide.co.uk" target="_blank" rel="noopener" className="hover:text-white/60 transition">The Lakes Guide</a>
            <a href="https://www.thelakeswildlife.co.uk" target="_blank" rel="noopener" className="hover:text-white/60 transition">The Lakes Wildlife</a>
            <a href="https://www.hikethelakes.com" target="_blank" rel="noopener" className="hover:text-white/60 transition">Hike The Lakes</a>
            <a href="https://thelakes.network" target="_blank" rel="noopener" className="hover:text-white/60 transition">TheLakes.network</a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-white/50">
            Lake District business?{" "}
            <span className="text-[#C9A84C] font-semibold">Partner with the Lakes Network</span>
          </p>
          <a href="mailto:hello@thelakes.network" className="text-[#C9A84C] hover:text-white transition font-medium text-sm">
            hello@thelakes.network →
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; 2026 The Lakes Guide — All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70 transition">Terms</Link>
            <Link href="/contact" className="hover:text-white/70 transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
