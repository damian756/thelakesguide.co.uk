import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | The Lakes Guide",
  description: "The page you're looking for doesn't exist. Explore restaurants, walks, things to do and more in the Lake District.",
};

const QUICK_LINKS = [
  { href: "/things-to-do", label: "Things to do" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/cafes", label: "Cafes" },
  { href: "/walks", label: "Walks" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/blog", label: "Blog" },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center">

        <div className="text-8xl font-extrabold text-[#1B2E4B]/10 leading-none select-none mb-2">
          404
        </div>

        <h1 className="font-display text-3xl font-bold text-[#1B2E4B] mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          That page doesn&apos;t exist or has moved. Here&apos;s where you can get back to exploring the Lake District.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#1B2E4B] hover:bg-[#243d63] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm mb-12"
        >
          Back to The Lakes Guide
        </Link>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
            Explore the Lake District
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {QUICK_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#C9A84C] hover:text-[#a88835] font-semibold hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
