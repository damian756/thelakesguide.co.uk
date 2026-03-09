import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/lakes-data";

// Redirect /blog/category/[slug] → /blog?category=[slug]
// This ensures clean canonical URLs while still having a routable path.

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function BlogCategoryRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  redirect(`/blog?category=${slug}`);
}
