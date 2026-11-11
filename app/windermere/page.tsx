import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Train, Clock, Anchor, ArrowRight } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { pageOpenGraph } from "@/lib/seo";

// Hourly, so an advert past its "until" date (lib/ad-slots.ts) drops off.
export const revalidate = 3600;

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/windermere`;

const faqs = [
  {
    q: "What is there to do in Windermere?",
    a: "Lake cruises with Windermere Lake Cruises, which sail every day except Christmas Day. Walking: Orrest Head for the classic view, or the Windermere Way around the lake. Restaurants and pubs in both Windermere town and Bowness. Windermere Jetty Museum for the lake's boats and history.",
  },
  {
    q: "Is Windermere a town or a lake?",
    a: "Both. Windermere town sits on the ridge above the lake, about a mile from the shore. Bowness-on-Windermere is the lakefront settlement. The two are effectively one place. Most visitors end up in Bowness; Windermere town has the train station.",
  },
  {
    q: "Where should I stay in Windermere or Bowness?",
    a: "Windermere town is quieter and has good transport links: Windermere station is at the end of the Lakes Line from Oxenholme. Bowness is on the lake, louder, with more hotels. Both have a wide range of accommodation from B&Bs to full hotels. Book ahead in summer.",
  },
  {
    q: "How do I get to Windermere without a car?",
    a: "The Lakes Line runs from Oxenholme, on the West Coast Main Line, to Windermere, calling at Kendal, Burneside and Staveley. From London Euston, change at Oxenholme. Northern also runs direct trains from Manchester to Windermere. The station is in Windermere town, about a 25-minute walk from Bowness pier.",
  },
  {
    q: "What is the Windermere Jetty Museum?",
    a: "Windermere Jetty Museum is a boat museum on the lake shore on Rayrigg Road, Bowness (LA23 1BN), run by Lakeland Arts. It houses historic boats from the lake's history and has a café. It is about a 12-minute walk from Bowness pier.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
  {
    "@type": "TouristDestination",
    "@id": `${url}#place`,
    name: "Windermere",
    description: "Windermere is England's largest natural lake and the main visitor hub for the Lake District. The town and Bowness-on-Windermere sit on the eastern shore.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.3774, longitude: -2.9074 },
    address: { "@type": "PostalAddress", addressLocality: "Windermere", addressCountry: "GB" },
  },
  {
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  ],
};

export const metadata: Metadata = {
  title: "Windermere | Restaurants, Things to Do & Visitor Guide",
  description: "Windermere and Bowness: restaurants, lake cruises, accommodation, parking, and things to do on England's largest natural lake.",
  alternates: { canonical: url },
  openGraph: pageOpenGraph({ title: "Windermere Guide | The Lakes Guide", description: "Visiting Windermere and Bowness-on-Windermere: restaurants, walks, lake cruises and accommodation.", url }),
};

export default function WindermerePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>

        {/* Hero */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80"
            alt=""
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/40" />
          <div className="relative w-full max-w-3xl mx-auto px-4 pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Windermere</span>
            </nav>
            <p className="text-[#E8B87A] text-xs font-bold uppercase tracking-widest mb-3">Village guide · Southern Lakes · LA23</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Windermere</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              England&rsquo;s largest natural lake and the busiest tourist destination in the Lake District. That is not necessarily a criticism. Windermere handles the crowds better than most places and there is a lot to do here. The trick is knowing what is worth your time.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { icon: MapPin, stat: "LA23 1AQ", label: "Town postcode" },
                { icon: Anchor, stat: "10.5 miles", label: "Lake length" },
                { icon: Train, stat: "Change at Oxenholme", label: "From London by train" },
                { icon: Clock, stat: "Year-round", label: "Open for visitors" },
              ].map(({ icon: Icon, stat, label }) => (
                <div key={label} className="bg-black/40 backdrop-blur rounded-xl px-3 py-2.5 border border-white/20">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-3 h-3 text-[#C4782A]" />
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">{label}</p>
                  </div>
                  <p className="font-display text-sm font-bold text-white">{stat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky nav */}
        <nav className="bg-[#14231C] border-b border-white/10 sticky top-16 z-40">
          <div className="mx-auto max-w-3xl px-4 py-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                { href: "#town-and-bowness", label: "Town & Bowness" },
                { href: "#the-lake", label: "The Lake" },
                { href: "#orrest-head", label: "Orrest Head" },
                { href: "#where-to-eat", label: "Where to Eat" },
                { href: "#getting-there", label: "Getting There" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-white/60 hover:text-[#C4782A] transition-colors font-medium">{label}</a>
              ))}
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-10">

          {/* Town and Bowness */}
          <section id="town-and-bowness" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">Windermere Town and Bowness</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: "Bowness-on-Windermere", desc: "The lakefront settlement. The piers, the boat hire, the ice cream, Windermere Lake Cruises. Noisier than Windermere town but closer to the water. The promenade and waterfront restaurants are the centre of activity." },
                { title: "Windermere Town", desc: "The ridge above the lake, about a mile from the shore. Has the train station, at the end of the Lakes Line from Oxenholme. Quieter, more residential, with cafes and restaurants. If you arrive by train, you start here." },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-[#14231C] mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">
              The Victorian tourism boom defined both. The railway arrived in 1847 and brought middle-class visitors from the industrial cities of the north. The infrastructure built for that trade is still visible in the hotels and guest houses that line the main streets. Windermere town and Bowness are effectively one settlement, a mile apart, connected by the B5360 and a steady flow of tourists in summer.
            </p>
          </section>

          {/* The Lake */}
          <section id="the-lake" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">The Lake</h2>
            <div className="bg-[#14231C] rounded-2xl p-6 text-white mb-6">
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: "Length", value: "10.5 miles", desc: "England&rsquo;s longest natural lake" },
                  { label: "Max depth", value: "67 metres", desc: "Deeper than it looks from shore" },
                  { label: "Lake cruises", value: "Year-round", desc: "From Bowness, Ambleside, Lakeside" },
                ].map(({ label, value, desc }) => (
                  <div key={label} className="text-center">
                    <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
                    <p className="font-display text-2xl font-bold text-white">{value}</p>
                    <p className="text-white/50 text-xs mt-1" dangerouslySetInnerHTML={{ __html: desc }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#14231C] mb-2">Windermere Lake Cruises</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Services from Bowness pier (LA23 3HQ), Waterhead at Ambleside (LA22 0EY), and Lakeside (LA12 8AS), every day except Christmas Day, on reduced timetables in winter. Freedom tickets cover unlimited travel; from 2 November to 23 March the 48 Hour Freedom ticket is £35 for an adult. Bowness to Ambleside takes 35 minutes.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#14231C] mb-2">Water Activities</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Kayak and paddleboard hire from the Bowness foreshore</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Electric boat hire, no licence required</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Wild swimming at Millerground (LA23 1QF)</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Ferry crossing to the quieter western shore</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Orrest Head */}
          <section id="orrest-head" className="mb-12 scroll-mt-20">
            <div className="rounded-2xl overflow-hidden border border-[#14231C]/10 md:flex">
              <div className="relative h-52 md:h-auto md:w-64 flex-none">
                <Image
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80"
                  alt="Two walkers with rucksacks on a mountain path below snow-capped peaks"
                  fill sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
              <div className="bg-gray-50 p-6 flex flex-col justify-center md:flex-1">
                <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">Do not skip this</p>
                <h2 className="font-display text-xl font-bold text-[#14231C] mb-3">Orrest Head</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Alfred Wainwright first saw the Lakes from Orrest Head in 1930 and it changed his life. The view from the summit takes in the full length of Windermere with the Coniston Fells and central Lake District peaks behind. 45 minutes return from Windermere station. 238 metres above sea level. Not difficult.
                </p>
                <p className="text-xs font-semibold text-[#14231C]">45 min return · Starts opposite the station · Free, no car needed</p>
              </div>
            </div>
          </section>

          {/* Windermere Jetty Museum */}
          <section className="mb-12">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="font-display text-xl font-bold text-[#14231C]">Windermere Jetty Museum</h2>
                <span className="text-xs font-semibold text-gray-500 flex-none">Allow 90 min</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Rayrigg Road, Bowness, LA23 1BN. Entrance charged. A museum of historic boats from the lake, run by Lakeland Arts, about a 12-minute walk from Bowness pier.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">The museum has a café looking over the lake.</p>
            </div>
          </section>

          {/* Where to eat */}
          <section id="where-to-eat" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Where to Eat</h2>
            <div className="space-y-3">
              {[
                { name: "Porto Restaurant", location: "3 Ash Street, Bowness, LA23 3EB", tag: "Restaurant", desc: "A modern British restaurant with a rooftop terrace. It traded as The Porthole until it was renamed." },
                { name: "The Royal Oak Inn", location: "Brantfell Road, Bowness, LA23 3EG", tag: "Inn", desc: "A traditional Lakeland inn, with the same owner since 1995, and the official finishing pub of the Dales Way since 1996." },
                { name: "The Belsfield", location: "Kendal Road, Bowness, LA23 3EL", tag: "Hotel", desc: "A 4-star hotel with 62 bedrooms, a brasserie, an Art Deco bar and a terrace." },
                { name: "Windermere Jetty Museum café", location: "Rayrigg Road, Bowness, LA23 1BN", tag: "Museum café", desc: "The café at the boat museum, looking over the lake." },
              ].map(({ name, location, tag, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[#14231C]">{name}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex-none">{tag}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Getting there */}
          <section id="getting-there" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Getting There and Parking</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Train className="w-4 h-4 text-[#C4782A]" />
                  <h3 className="font-semibold text-[#14231C]">By Train</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> London Euston to Oxenholme (about 2 hours 45 minutes), then the Lakes Line</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Northern runs direct trains from Manchester to Windermere</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> 555 bus from Windermere station to Bowness and Ambleside</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#C4782A]" />
                  <h3 className="font-semibold text-[#14231C]">Parking</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> <span><strong>Braithwaite Fold (LA23 3LH)</strong>: large, 5 min walk from Bowness</span></li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> <span><strong>Rayrigg Road (LA23 1DG)</strong>: smaller, closer to the waterfront</span></li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Car parks fill early on summer weekends.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group bg-gray-50 rounded-xl p-4">
                  <summary className="font-medium text-[#14231C] cursor-pointer list-none flex justify-between items-center">
                    {q}
                    <span className="text-[#C4782A] text-lg group-open:rotate-45 transition-transform flex-shrink-0 ml-4">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <AdSlot id="guide-windermere" className="mb-12" />

          {/* Explore nearby */}
          <section className="border-t border-gray-100 pt-10">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-5">Explore Nearby</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: "/ambleside", label: "Ambleside", desc: "3 miles north, the walking hub", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 8 miles north", image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80" },
                { href: "/coniston", label: "Coniston", desc: "Old Man, Brantwood, 8 miles west", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" },
                { href: "/keswick", label: "Keswick", desc: "Northern capital, Derwentwater", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
              ].map(({ href, label, desc, image }) => (
                <Link key={href} href={href} className="group relative h-32 rounded-2xl overflow-hidden block">
                  <Image src={image} alt={label} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-display font-bold text-sm">{label} <ArrowRight className="inline w-3 h-3" /></p>
                    <p className="text-white/65 text-xs">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
