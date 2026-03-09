import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Windermere | The Lakes Guide",
  description: "Windermere guide. Coming soon.",
  robots: { index: false, follow: true },
};

export default function WindermerePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-[#14231C]">Windermere</h1>
      <p className="mt-4 text-[#4E5A50]">Content coming soon.</p>
    </main>
  );
}
