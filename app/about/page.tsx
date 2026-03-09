import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About The Lakes Guide | Your Independent Visitor Guide to the Lake District",
  description:
    "The Lakes Guide is an independent visitor guide to the Lake District, published by Churchtown Media. Find out who writes it, how it works, and why we built it.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/about" },
  openGraph: {
    title: "About The Lakes Guide",
    description:
      "Independent visitor guide to the Lake District — published by Churchtown Media, written by someone who knows the fells.",
    url: "https://www.thelakesguide.co.uk/about",
    type: "website",
    siteName: "The Lakes Guide",
  },
};

const schemaData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.thelakesguide.co.uk/#website",
    name: "The Lakes Guide",
    url: "https://www.thelakesguide.co.uk",
    description:
      "Independent visitor guide to the Lake District — restaurants, accommodation, walks, things to do, and everything visitors need.",
    publisher: {
      "@type": "Organization",
      "@id": "https://www.thelakesguide.co.uk/#organization",
      name: "The Lakes Guide",
      url: "https://www.thelakesguide.co.uk",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.churchtownmedia.co.uk/about#founder",
    name: "Damian Roche",
    jobTitle: "Founder, Churchtown Media",
    description:
      "Editorial voice of The Lakes Guide — written from the perspective of someone who has walked the fells for decades and knows the Lake District.",
    worksFor: {
      "@id": "https://www.thelakesguide.co.uk/#website",
    },
    url: "https://www.churchtownmedia.co.uk/about",
    sameAs: [
      "https://www.linkedin.com/in/damian-roche-7ba8293a5/",
      "https://find-and-update.company-information.service.gov.uk/company/16960442",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-[#1B2E4B] text-white py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3">
              About this site
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
              About The Lakes Guide
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              An independent visitor guide to the Lake District — restaurants, accommodation, walks, things to do,
              and everything else you need to plan a visit. No official body funds this. Just a site built by
              someone who has been coming here for decades.
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl px-4 py-14">

          {/* Who writes it */}
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#1B2E4B] mb-5">Who writes it</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1B2E4B] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-display font-bold text-xl">D</span>
                </div>
                <div>
                  <p className="font-semibold text-[#1B2E4B] text-lg">Damian — Editor</p>
                  <p className="text-gray-500 text-sm">Ex-army · Fell walker · 20+ years in the Lakes</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Lakes Guide is written in the voice of Damian Roche — founder of Churchtown Media.
                He has walked the fells for decades, fished the tarns, and brought the kids. The content
                is practical and honest. If a route is brutal in mist, we say so. If somewhere is
                overpriced, we mention it. No paid editorial placements, no sponsored content disguised
                as a review. Businesses can pay for featured placement in listings — that&apos;s how the
                site stays free to use — but that has no influence on what gets written.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The content is honest. If something isn&apos;t worth the effort, we say so. We name specifics —
                the car park postcode, the trail, the café, the price. No fluff, no brochure-speak.
              </p>
            </div>
          </section>

          {/* Who publishes it */}
          <section id="damian" className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#1B2E4B] mb-5">Who publishes it</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <Image
                    src="https://www.churchtownmedia.co.uk/images/about/damian-headshot.jpg"
                    alt="Damian Roche — Founder of Churchtown Media"
                    width={96}
                    height={96}
                    className="rounded-2xl"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#1B2E4B] text-lg">Damian Roche</p>
                  <p className="text-gray-500 text-sm mb-3">
                    Founder,{" "}
                    <a
                      href="https://churchtownmedia.co.uk"
                      className="text-[#C9A84C] hover:underline font-medium"
                    >
                      Churchtown Media Ltd
                    </a>{" "}
                    — Company No. 16960442
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Damian is a 20-year web and SEO professional. He built The Lakes Guide because he
                    couldn&apos;t find a genuinely useful, editorially independent visitor guide to the
                    Lake District — one that was honest about conditions, effort, and value.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The Lakes Guide is part of{" "}
                    <a
                      href="https://thelakes.network"
                      className="text-[#C9A84C] hover:underline font-medium"
                    >
                      The Lakes Network
                    </a>{" "}
                    — independent editorial guides covering the Lake District, wildlife, and fell walking.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/damian-roche-7ba8293a5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#1B2E4B] hover:text-[#C9A84C] transition-colors"
                  >
                    LinkedIn profile →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* What the site covers */}
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#1B2E4B] mb-5">What we cover</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Restaurants & Cafés", desc: "Independent reviews and a full directory of places to eat and drink across the Lake District." },
                { label: "Accommodation", desc: "Hotels, B&Bs, and self-catering — from budget to boutique, in Keswick, Ambleside, Windermere and beyond." },
                { label: "Walks & Hiking", desc: "Fell walks, valley routes, and practical guides for the Wainwrights and beyond." },
                { label: "Villages & Towns", desc: "Keswick, Ambleside, Windermere, Coniston, Grasmere — what to expect and where to stop." },
                { label: "Things To Do", desc: "Water sports, cycling, Grizedale Forest, attractions and everything else to fill a day." },
                { label: "Events", desc: "What&apos;s on calendar — festivals, races, and seasonal events across the Lake District." },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
                  <p className="font-semibold text-[#1B2E4B] mb-1">{label}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How we make money */}
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#1B2E4B] mb-5">How it&apos;s funded</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Lakes Guide is free to use. It&apos;s funded by featured placement — businesses can pay
                for premium positioning in listings and categories. This is clearly disclosed on the site.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Featured placement does not influence editorial content. A restaurant that pays for a
                featured listing doesn&apos;t get a better review — it gets better visibility in the
                directory. If anything is sponsored, it will be explicitly labelled.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may also earn affiliate commissions from some booking links. These are disclosed
                where they appear.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-bold text-[#1B2E4B] mb-5">Get in touch</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                To list your business, enquire about featured placement, or report anything that
                looks wrong — use the contact form or email us directly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#1B2E4B] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#C9A84C] transition-colors"
                >
                  Contact us
                </Link>
                <Link
                  href="/claim-listing"
                  className="inline-flex items-center justify-center border border-[#1B2E4B] text-[#1B2E4B] font-semibold px-6 py-3 rounded-xl hover:bg-[#1B2E4B] hover:text-white transition-colors"
                >
                  Claim your listing
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
