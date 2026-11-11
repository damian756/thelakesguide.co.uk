import Link from "next/link";
import Image from "next/image";
import { HERO_IMAGE_URL, HERO_IMAGE_ALT, HERO_IMAGE_POSITION } from "@/lib/site-constants";
import { pageOpenGraph } from "@/lib/seo";

export const metadata = {
  title: "About The Lakes Guide | Who Publishes It and How It Works",
  description:
    "The Lakes Guide is a visitor guide to the Lake District, published by Churchtown Media Ltd. Who edits it, how it is paid for and what we stand for.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/about" },
  openGraph: pageOpenGraph({
    title: "About The Lakes Guide",
    description:
      "A visitor guide to the Lake District, published by Churchtown Media Ltd.",
    url: "https://www.thelakesguide.co.uk/about",
  }),
};

const schemaData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.thelakesguide.co.uk/#website",
    name: "The Lakes Guide",
    url: "https://www.thelakesguide.co.uk",
    description:
      "Visitor guide to the Lake District: restaurants, accommodation, walks and things to do.",
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
      "Founder of Churchtown Media Ltd, which publishes The Lakes Guide.",
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
        {/* Hero — walks-style */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
          <div className="absolute inset-0">
            <Image src={HERO_IMAGE_URL} alt={HERO_IMAGE_ALT} fill sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: HERO_IMAGE_POSITION }} priority />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 pointer-events-none" />
          </div>
          <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">About this site</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              About The Lakes Guide
            </h1>
            <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-2xl">
              A visitor guide to the Lake District: restaurants, accommodation, walks and things to do, with
              the practical details for planning a visit. Published by Churchtown Media Ltd.
            </p>
          </div>
          <div className="relative h-8 overflow-hidden">
            <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="rgb(249 250 251)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl px-4 py-14">

          {/* Who writes it */}
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-5">Who writes it</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#14231C] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C4782A] font-display font-bold text-xl">D</span>
                </div>
                <div>
                  <p className="font-semibold text-[#14231C] text-lg">Damian Roche, Editor</p>
                  <p className="text-gray-500 text-sm">Founder, Churchtown Media Ltd</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                The Lakes Guide is published by Churchtown Media Ltd and edited by its founder, Damian Roche.
              </p>
              <h3 className="font-display text-lg font-bold text-[#14231C] mb-4">What we stand for</h3>
              <dl className="space-y-4">
                {[
                  {
                    term: "Independent",
                    desc: "Churchtown Media Ltd pays for the guide, and local businesses can advertise on it. Every advert, sponsor and sponsored article is labelled on the page, and paying for a space does not change what we write in our own guides and posts.",
                  },
                  {
                    term: "Checked",
                    desc: "We check opening times, parking, prices and postcodes against official sources when we write a page and when we revise it. If we can't confirm something, we leave it out.",
                  },
                  {
                    term: "Useful",
                    desc: "Built for the visitor making a decision: where to stay, where to eat, when to go, what to expect. Practical first, inspirational second.",
                  },
                  {
                    term: "Focused",
                    desc: "Three Lakes Network guides that cover only the Lake District: The Lakes Guide for visiting, Hike The Lakes for the fells and The Lakes Wildlife for species and reserves.",
                  },
                ].map(({ term, desc }) => (
                  <div key={term}>
                    <dt className="font-semibold text-[#14231C]">{term}</dt>
                    <dd className="text-gray-700 leading-relaxed">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Who publishes it */}
          <section id="damian" className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-5">Who publishes it</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/blog/damian-headshot.jpg"
                    alt="Damian Roche, Founder of Churchtown Media"
                    width={96}
                    height={96}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#14231C] text-lg">Damian Roche</p>
                  <p className="text-gray-500 text-sm mb-3">
                    Founder,{" "}
                    <a
                      href="https://churchtownmedia.co.uk"
                      className="text-[#C4782A] hover:underline font-medium"
                    >
                      Churchtown Media Ltd
                    </a>{" "}
                    (Company No. 16960442)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Damian runs Churchtown Media, which publishes guide sites for the Sefton Coast and the
                    Lake District.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The Lakes Guide is part of{" "}
                    <a
                      href="https://thelakes.network"
                      className="text-[#C4782A] hover:underline font-medium"
                    >
                      The Lakes Network
                    </a>
                    : The Lakes Guide, Hike The Lakes for the fells and walking routes, and The Lakes Wildlife for species and reserves.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/damian-roche-7ba8293a5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#14231C] hover:text-[#C4782A] transition-colors"
                  >
                    LinkedIn profile →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* What the site covers */}
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-5">What we cover</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Restaurants & Cafés", desc: "Where to eat and drink, in our town guides and posts, with each place described from its own website." },
                { label: "Accommodation", desc: "Where to base yourself: Keswick, Ambleside, Windermere, Grasmere and beyond." },
                { label: "Walks & Hiking", desc: "Fell walks, valley routes, and practical guides for the Wainwrights and beyond." },
                { label: "Villages & Towns", desc: "Keswick, Ambleside, Windermere, Coniston, Grasmere: what to expect and where to stop." },
                { label: "Things To Do", desc: "Boat trips, water sports, cycling, Grizedale Forest, museums and other attractions." },
                { label: "Events", desc: "A calendar of festivals, races and seasonal events across the Lake District." },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
                  <p className="font-semibold text-[#14231C] mb-1">{label}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-4">Illustrations on this site are computer-generated.</p>
          </section>

          {/* How we make money */}
          <section className="mb-14">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-5">How it&apos;s paid for</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Lakes Guide is free to use. Churchtown Media Ltd pays for it, and local businesses can{" "}
                <Link href="/advertise" className="text-[#C4782A] font-semibold hover:underline">
                  advertise on it
                </Link>
                . The business directory is opening and has no listings yet.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Every advert, sponsor and sponsored article is labelled on the page, and paying for a space does not
                change what we write in our own guides and posts.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-5">Get in touch</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                To ask for your business to be listed, or to report anything that looks wrong, use the
                contact form.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#14231C] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#C4782A] transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
