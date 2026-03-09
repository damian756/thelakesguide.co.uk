import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User } from "lucide-react";
import { BLOG_POSTS, getBlogPostCategory } from "@/lib/lakes-data";
import { BLOG_CONTENT, ContentBlock } from "@/lib/blog-content";
import { notFound } from "next/navigation";

const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function toIso(dateStr: string): string {
  const [day, mon, year] = dateStr.split(" ");
  return `${year}-${MONTHS[mon] ?? "01"}-${day.padStart(2, "0")}`;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | The Lakes Guide`,
    description: post.excerpt,
    alternates: { canonical: `https://www.thelakesguide.co.uk/blog/${slug}` },
  };
}

/** Parse [text](href) markdown links in a string, returning mixed text/link JSX nodes. */
function parseInlineLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, linkText, href] = match;
    const isExternal = href.startsWith("http");
    parts.push(
      <a
        key={match.index}
        href={href}
        className="text-[#1B2E4B] underline underline-offset-2 decoration-[#C9A84C]/60 hover:decoration-[#C9A84C] transition-colors font-medium"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {linkText}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length === 1 ? parts[0] : parts;
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="font-display text-2xl md:text-3xl font-bold text-[#1B2E4B] mt-10 mb-4 leading-snug">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="font-display text-xl font-bold text-[#1B2E4B] mt-8 mb-3">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-5 text-[1.0625rem]">
          {parseInlineLinks(block.text)}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mb-6 space-y-2.5">
          {block.items.map((item, j) => {
            const dashIdx = item.indexOf(" — ");
            const hasLead = dashIdx !== -1;
            return (
              <li key={j} className="flex gap-3 text-gray-700 text-[1.0625rem]">
                <span className="text-[#C9A84C] font-bold flex-none mt-0.5">→</span>
                <span>
                  {hasLead ? (
                    <>
                      <strong className="text-[#1B2E4B]">{item.slice(0, dashIdx)}</strong>
                      {" — "}
                      {item.slice(dashIdx + 3)}
                    </>
                  ) : item}
                </span>
              </li>
            );
          })}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="mb-6 space-y-2.5 list-decimal list-inside">
          {block.items.map((item, j) => (
            <li key={j} className="text-gray-700 text-[1.0625rem]">
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div key={i} className="bg-[#FAF8F5] border-l-4 border-[#C9A84C] rounded-r-xl px-5 py-4 my-7">
          <p className="text-[#1B2E4B] font-medium leading-relaxed">
            <span className="mr-2">{block.emoji}</span>
            {block.text}
          </p>
        </div>
      );
    case "quote":
      return (
        <blockquote key={i} className="border-l-4 border-[#C9A84C] pl-5 py-1 my-7 italic text-gray-600 text-lg">
          &ldquo;{block.text}&rdquo;
          {block.attr && <cite className="block text-sm not-italic text-gray-400 mt-2">— {block.attr}</cite>}
        </blockquote>
      );
    case "cta":
      return (
        <div key={i} className="my-8 rounded-2xl border border-[#C9A84C]/30 bg-[#1B2E4B] px-6 py-5">
          <p className="text-white/80 text-sm mb-3 leading-relaxed">{block.text}</p>
          <a href={block.href} className="inline-flex items-center font-bold text-[#C9A84C] hover:text-[#e0ba66] transition-colors text-sm">
            {block.label}
          </a>
        </div>
      );
    case "image":
      if (block.portrait) {
        return (
          <figure key={i} className="my-8 flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-gray-100 w-full max-w-sm">
              <div className="relative w-full aspect-[3/4] bg-gray-100">
                <Image
                  src={block.src}
                  alt={block.alt}
                  fill
                  sizes="(max-width: 480px) 100vw, 384px"
                  quality={85}
                  className="object-cover"
                  style={{ objectPosition: block.objectPosition ?? "center" }}
                />
              </div>
              {block.caption && (
                <figcaption className="bg-gray-50 px-5 py-3 text-sm text-gray-500 text-center leading-relaxed">
                  {block.caption}
                </figcaption>
              )}
            </div>
          </figure>
        );
      }
      return (
        <figure key={i} className="my-8 rounded-2xl overflow-hidden border border-gray-100">
          <div className="relative w-full aspect-[16/9] bg-gray-100">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              quality={85}
              className="object-cover"
              style={{ objectPosition: block.objectPosition ?? "center 40%" }}
            />
          </div>
          {block.caption && (
            <figcaption className="bg-gray-50 px-5 py-3 text-sm text-gray-500 text-center leading-relaxed">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure key={i} className="my-8 rounded-2xl overflow-hidden border border-gray-100">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={block.poster}
              className="w-full h-full object-cover"
            >
              <source src={block.src} type="video/mp4" />
            </video>
          </div>
          {block.caption && (
            <figcaption className="bg-gray-50 px-5 py-3 text-sm text-gray-500 text-center leading-relaxed">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "hr":
      return <hr key={i} className="my-8 border-gray-200" />;
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const cat = getBlogPostCategory(post);
  const content = BLOG_CONTENT[slug];

  const isoDate = toIso(post.date);
  const canonicalUrl = `https://www.thelakesguide.co.uk/blog/${slug}`;

  const isDamian = post.author === "damian";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith("http")
      ? post.image
      : `https://www.thelakesguide.co.uk${post.image}`,
    datePublished: isoDate,
    dateModified: isoDate,
    url: canonicalUrl,
    author: isDamian
      ? {
          "@type": "Person",
          "@id": "https://www.churchtownmedia.co.uk/about#founder",
          name: "Damian Roche",
          jobTitle: "Founder, Churchtown Media",
          url: "https://www.churchtownmedia.co.uk/about",
          sameAs: ["https://www.linkedin.com/in/damian-roche-7ba8293a5/"],
        }
      : {
          "@type": "Person",
          "@id": "https://www.thelakesguide.co.uk/about#terry",
          name: "Terry",
          jobTitle: "Chief Editor",
          url: "https://www.thelakesguide.co.uk/about",
          worksFor: {
            "@type": "Organization",
            "@id": "https://www.thelakesguide.co.uk/#website",
            name: "SouthportGuide.co.uk",
            url: "https://www.thelakesguide.co.uk",
          },
        },
    publisher: {
      "@type": "Organization",
      "@id": "https://www.thelakesguide.co.uk/#organization",
      name: "SouthportGuide.co.uk",
      url: "https://www.thelakesguide.co.uk",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero image */}
      <div className="relative h-72 md:h-[26rem] bg-[#1B2E4B]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
          style={{ objectPosition: "center 35%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2E4B]/50 via-[#1B2E4B]/20 to-[#1B2E4B]/95" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All posts
          </Link>
          {cat && (
            <span
              className="inline-block text-xs font-bold text-white px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: cat.color }}
            >
              {cat.label}
            </span>
          )}
          <h1
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.75)" }}
          >
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Byline card */}
        <div className="bg-white rounded-2xl border border-gray-100 -mt-6 relative z-10 px-6 py-4 mb-10 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {isDamian ? (
              <Image
                src="/images/blog/damian-headshot.jpg"
                alt="Damian Roche"
                width={32}
                height={32}
                className="rounded-full flex-none object-cover w-8 h-8"
                unoptimized
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1B2E4B] flex items-center justify-center flex-none">
                <User className="w-4 h-4 text-[#C9A84C]" />
              </div>
            )}
            <div>
              <p className="font-semibold text-[#1B2E4B] text-xs">{isDamian ? "Damian Roche" : "Terry"}</p>
              <p className="text-[10px] text-gray-400">{isDamian ? "Founder, Churchtown Media" : "Chief Editor, SouthportGuide.co.uk"}</p>
            </div>
          </div>
          <span className="text-gray-200 hidden sm:block">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.date}
          </div>
          {cat && (
            <>
              <span className="text-gray-200 hidden sm:block">|</span>
              <Link
                href={`/blog?category=${cat.slug}`}
                className="font-semibold hover:underline text-xs"
                style={{ color: cat.color }}
              >
                {cat.label}
              </Link>
            </>
          )}
        </div>

        {/* Content */}
        <article className="bg-white rounded-2xl border border-gray-100 p-7 md:p-10 mb-12">
          {content ? (
            <>
              {content.map((block, i) => renderBlock(block, i))}
              {/* Author sign-off */}
              <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
                {isDamian ? (
                  <Image
                    src="/images/blog/damian-headshot.jpg"
                    alt="Damian Roche"
                    width={48}
                    height={48}
                    className="rounded-full flex-none object-cover w-12 h-12"
                    unoptimized
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1B2E4B] flex items-center justify-center flex-none text-[#C9A84C] font-display font-bold text-xl">
                    T
                  </div>
                )}
                <div>
                  <p className="font-bold text-[#1B2E4B] text-sm">{isDamian ? "Damian Roche" : "Terry"}</p>
                  <p className="text-gray-400 text-xs leading-snug mt-0.5">
                    {isDamian
                      ? "Founder, Churchtown Media. Builder of SouthportGuide.co.uk and SeftonCoastWildlife.co.uk. Based in Churchtown, Southport."
                      : <>Chief Editor, SouthportGuide.co.uk — Lives in Churchtown with his wife,<br className="hidden sm:block" /> four kids, and Frank the bulldog.</>
                    }
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{post.excerpt}</p>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="font-display text-xl font-bold text-[#1B2E4B] mb-2">Full article coming soon</h3>
                <p className="text-gray-500 text-sm">Check back shortly — Terry&apos;s working on it.</p>
              </div>
            </>
          )}
        </article>

        {/* More in same category */}
        {cat && (() => {
          const sameCategory = BLOG_POSTS.filter(
            (p) => p.categorySlug === post.categorySlug && p.slug !== slug
          ).slice(0, 2);
          if (sameCategory.length === 0) return null;
          return (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl font-bold text-[#1B2E4B]">More in {cat.label}</h3>
                <Link href={`/blog?category=${cat.slug}`} className="text-sm text-[#C9A84C] font-semibold hover:underline">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {sameCategory.map((related) => {
                  const relatedCat = getBlogPostCategory(related);
                  return (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C9A84C]/30 hover:shadow-md transition-all flex"
                    >
                      <div className="relative w-24 flex-none overflow-hidden">
                        <Image src={related.image} alt={related.title} fill sizes="96px" quality={60} className="object-cover" />
                      </div>
                      <div className="p-4 flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: relatedCat?.color }}>{relatedCat?.label}</span>
                        <h4 className="font-bold text-[#1B2E4B] text-sm leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">{related.title}</h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Other posts */}
        <h3 className="font-display text-xl font-bold text-[#1B2E4B] mb-5">More from the blog</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {BLOG_POSTS.filter((p) => p.slug !== slug && p.categorySlug !== post.categorySlug)
            .slice(0, 4)
            .map((related) => {
              const relatedCat = getBlogPostCategory(related);
              return (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C9A84C]/30 hover:shadow-md transition-all flex"
                >
                  <div className="relative w-24 flex-none overflow-hidden">
                    <Image src={related.image} alt={related.title} fill sizes="96px" quality={60} className="object-cover" />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: relatedCat?.color }}>{relatedCat?.label}</span>
                    <h4 className="font-bold text-[#1B2E4B] text-sm leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">{related.title}</h4>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
    </>
  );
}
