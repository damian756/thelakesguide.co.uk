import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import GuideLayout from "@/app/components/GuideLayout";
import { getGuideOptional, GUIDES, GUIDE_CATEGORIES } from "@/lib/guides-config";

const BASE_URL = "https://www.thelakesguide.co.uk";

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideOptional(slug);
  if (!guide) return {};

  return {
    title: guide.metaTitle ?? `${guide.title} | The Lakes Guide`,
    description: guide.metaDescription ?? guide.excerpt,
    alternates: { canonical: `${BASE_URL}/guides/${slug}` },
    openGraph: {
      title: guide.metaTitle ?? guide.title,
      description: guide.metaDescription ?? guide.excerpt,
      url: `${BASE_URL}/guides/${slug}`,
      images: [{ url: `${BASE_URL}${guide.heroImage}` }],
    },
    robots: guide.status === "coming-soon" ? { index: false, follow: true } : undefined,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideOptional(slug);

  if (!guide) notFound();

  return (
    <GuideLayout guide={guide}>
      <div className="relative min-h-[50vh] flex items-end bg-[#14231C] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14231C] via-[#14231C]/70 to-[#14231C]/30" />
        </div>
        <div className="relative container mx-auto px-4 pb-16 pt-24 max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#C4782A] text-[#14231C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              {GUIDE_CATEGORIES[guide.category].label}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              {guide.title}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{guide.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl py-16">
          {guide.status === "coming-soon" ? (
            <div className="text-center py-12">
              <p className="text-[#C4782A] text-sm font-semibold uppercase tracking-wider mb-2">Coming soon</p>
              <p className="text-gray-600">
                This guide is in development. Check back soon for the full guide to {guide.title}.
              </p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed">{guide.excerpt}</p>
            </div>
          )}
        </div>
      </div>
    </GuideLayout>
  );
}
