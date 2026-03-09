import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambleside",
  description: "Ambleside guide. Coming soon.",
  robots: { index: false, follow: true },
};

export default function AmblesidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-[var(--forest)]">Ambleside</h1>
      <p className="mt-4 text-[var(--slate)]">Content coming soon.</p>
    </main>
  );
}
