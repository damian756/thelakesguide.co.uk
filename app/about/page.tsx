import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About SouthportGuide | Your Independent Visitor Guide to Southport",
  description:
    "SouthportGuide.co.uk is an independent visitor guide to Southport, published by Churchtown Media. Find out who writes it, how it works, and why we built it.",
  alternates: { canonical: "https://www.southportguide.co.uk/about" },
  openGraph: {
    title: "About SouthportGuide.co.uk",
    description:
      "Independent visitor guide to Southport — published by Churchtown Media, written by locals.",
    url: "https://www.southportguide.co.uk/about",
    type: "website",
    siteName: "SouthportGuide.co.uk",
  },
};

const schemaData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.southportguide.co.uk/#website",
    name: "SouthportGuide.co.uk",
    url: "https://www.southportguide.co.uk",
    description:
      "Independent visitor guide to Southport — restaurants, hotels, events, things to do, and everything visitors need.",
    publisher: {
      "@type": "Organization",
      "@id": "https://www.southportguide.co.uk/#organization",
      name: "SouthportGuide.co.uk",
      url: "https://www.southportguide.co.uk",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.southportguide.co.uk/about#terry",
    name: "Terry",
    jobTitle: "Chief Editor, SouthportGuide.co.uk",
    description:
      "Editorial voice of SouthportGuide.co.uk — written from the perspective of a Southport local of over 40 years covering restaurants, hotels, events and everything visitors need to know.",
    worksFor: {
      "@id": "https://www.southportguide.co.uk/#website",
    },
    url: "https://www.southportguide.co.uk/about",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.churchtownmedia.co.uk/about#founder",
    name: "Damian Roche",
    jobTitle: "Founder, Churchtown Media",
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
              About SouthportGuide
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              An independent visitor guide to Southport — restaurants, hotels, events, things to do,
              and everything else you need to plan a visit. No official body funds this. No council
              budget. Just a site built by someone who lives here.
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
                  <span className="text-[#C9A84C] font-display font-bold text-xl">T</span>
                </div>
                <div>
                  <p className="font-semibold text-[#1B2E4B] text-lg">Terry — Chief Editor</p>
                  <p className="text-gray-500 text-sm">Southport local · 40+ years</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                SouthportGuide is written in the voice of Terry — a composite editorial persona built
                from genuine local knowledge, reader feedback, and decades of experience living in the
                town. Terry reflects the perspective of someone who has eaten in most of the
                restaurants, walked every part of the seafront, and knows which car parks fill up
                first on a summer Saturday.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The content is honest. If something isn&apos;t worth the journey, we say so. If
                somewhere is overpriced, we mention it. No paid editorial placements, no sponsored
                content disguised as a review. Businesses can pay for featured placement in
                listings — that&apos;s how the site stays free to use — but that has no influence on
                what gets written.
              </p>
              <div className="bg-[#FAF8F5] rounded-xl px-5 py-4 border border-[#E8E3D8]">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-[#1B2E4B]">A note on transparency:</span>{" "}
                  Terry is an editorial voice, not a named individual. The real person behind
                  SouthportGuide is Damian Roche, founder of Churchtown Media — see below.
                </p>
              </div>
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
                    Damian is a 20-year web and SEO professional based in Churchtown, Southport.
                    He built SouthportGuide because he couldn&apos;t find a genuinely useful,
                    editorially independent visitor guide to his own town — and because The Open
                    Championship coming to Royal Birkdale in 2026 and the Marine Lake Events Centre
                    opening in 2027 represent a once-in-a-generation opportunity for the town that
                    deserved proper coverage.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    SouthportGuide is part of the{" "}
                    <a
                      href="https://seftoncoast.network"
                      className="text-[#C9A84C] hover:underline font-medium"
                    >
                      Sefton Coast Network
                    </a>{" "}
                    — four independent editorial guides covering Southport, Formby, links golf, and
                    coastal wildlife.
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
                { label: "Restaurants & Cafés", desc: "Independent reviews and a full directory of places to eat and drink across Southport and Birkdale." },
                { label: "Hotels & Accommodation", desc: "Hotels, B&Bs, and self-catering — from budget to boutique. Includes Open 2026 availability notes." },
                { label: "Things To Do", desc: "Attractions, activities, nature, beaches and everything else to fill a day in Southport." },
                { label: "Events", desc: "What's on calendar — from the Flower Show to the Airshow to The Open Championship." },
                { label: "The Open 2026", desc: "The complete visitor hub for The Open Championship at Royal Birkdale, July 2026." },
                { label: "MLEC Guide", desc: "The Marine Lake Events Centre — what it is, what's on, and what it means for Southport." },
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
                SouthportGuide is free to use. It&apos;s funded by featured placement — businesses can pay
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
