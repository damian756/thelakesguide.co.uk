import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bus, Clock, ArrowRight } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { pageOpenGraph } from "@/lib/seo";

// Hourly, so an advert past its "until" date (lib/ad-slots.ts) drops off.
export const revalidate = 3600;

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/ambleside`;

const faqs = [
  {
    q: "What is there to do in Ambleside?",
    a: "Walking is the main draw: Ambleside is a good base for the central fells. Loughrigg Fell above the town is a classic starter. Stock Ghyll Force waterfall is a 20-minute walk. Bridge House, the tiny National Trust building on a bridge over Stock Beck, can be seen from the street. The Armitt Museum covers local history and art.",
  },
  {
    q: "Is Ambleside good as a walking base?",
    a: "Yes. It is one of the most convenient walking bases in the Lake District. Langdale is 8 miles west. Coniston is 8 miles south. The Fairfield Horseshoe starts from the edge of town. Rydal Water and Grasmere are within easy reach. Dozens of walks start within a mile of the market cross.",
  },
  {
    q: "Where should I eat in Ambleside?",
    a: "Zeffirellis on Compston Road is a cinema and vegetarian restaurant, with pizza and pasta on the menu. The Golden Rule on Smithy Brow is a traditional pub that serves drinks but no meals. The Apple Pie on Rydal Road is a café and bakery serving breakfast and lunch.",
  },
  {
    q: "How do I get to Ambleside without a car?",
    a: "The 555 bus runs between Windermere station and Keswick via Ambleside, Rydal, and Grasmere. It runs roughly hourly. Windermere Lake Cruises also sail from Bowness to Waterhead pier in Ambleside (35 minutes), every day except Christmas Day.",
  },
  {
    q: "Is Ambleside or Windermere better as a base?",
    a: "Ambleside for walking and fell access. Windermere for lake activities, better transport connections, and more accommodation variety. If you intend to walk every day, Ambleside puts you much closer to the central fells without needing to drive through the busy Windermere area each morning.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
  {
    "@type": "TouristDestination",
    "@id": `${url}#place`,
    name: "Ambleside",
    description: "Ambleside is the walking hub of the Lake District, a small market town at the northern tip of Windermere giving direct access to the central fells, Langdale, and Coniston.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.4298, longitude: -2.9622 },
    address: { "@type": "PostalAddress", addressLocality: "Ambleside", addressCountry: "GB" },
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
  title: "Ambleside | Restaurants, Walks & Visitor Guide",
  description: "Ambleside in the Lake District: a walking base for the central fells, with restaurants, accommodation, Loughrigg Fell, Stock Ghyll Force and the Fairfield Horseshoe.",
  alternates: { canonical: url },
  openGraph: pageOpenGraph({ title: "Ambleside Guide | The Lakes Guide", description: "Ambleside: walking routes, restaurants, accommodation, and using it as a base for the central fells.", url }),
};

export default function AmblesidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>

        {/* Hero */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"
            alt="A valley of pine trees below snow-capped mountains"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/40" />
          <div className="relative w-full max-w-3xl mx-auto px-4 pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Ambleside</span>
            </nav>
            <p className="text-[#E8B87A] text-xs font-bold uppercase tracking-widest mb-3">Village guide · Central Lake District · LA22</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Ambleside</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              The walking hub of the Lake District. A small market town at the northern tip of Windermere that gives direct access to Langdale, the Fairfield Horseshoe, and most of the central fells without significant driving. If walking is the priority, this is the base.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { icon: MapPin, stat: "LA22 0DB", label: "Postcode" },
                { icon: Clock, stat: "8 miles", label: "To Langdale" },
                { icon: Bus, stat: "555 Bus", label: "Windermere to Keswick" },
                { icon: Clock, stat: "35 min", label: "Boat from Bowness" },
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
                { href: "#what-to-see", label: "What to See" },
                { href: "#walking", label: "Walking" },
                { href: "#where-to-eat", label: "Where to Eat" },
                { href: "#getting-there", label: "Getting There" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-white/60 hover:text-[#C4782A] transition-colors font-medium">{label}</a>
              ))}
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-10">

          {/* About */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">About Ambleside</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ambleside has been a market town since the 16th century. It sits at the head of Windermere, where Stock Beck flows down from the fells through the middle of the town. The town is compact (you can walk from one end to the other in 10 minutes) and is built in the grey Lakeland slate that characterises the central Lakes.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The town&rsquo;s position makes it a convenient walking base. Langdale is 8 miles west. The Fairfield Horseshoe, one of the most celebrated circuit walks in the eastern Lakes, starts and ends here. Rydal Water is a short walk north. Grasmere is 4 miles north on the 555 bus. Coniston is 8 miles south.
            </p>
          </section>

          {/* What to see */}
          <section id="what-to-see" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">What to See in Ambleside</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "Bridge House", location: "Stock Beck · National Trust", desc: "A tiny cottage built on a bridge over Stock Beck, owned by the National Trust since 1926. You can see it from the street at any time." },
                { name: "Stock Ghyll Force", location: "20 min walk from market", desc: "The waterfall above the town. The path up through the Victorian woodland takes 20 minutes from the market place and reaches a series of falls that drop about 70 feet." },
                { name: "The Armitt Museum", location: "Rydal Road, LA22 9BL · Charged", desc: "A museum and library with exhibitions, including Beatrix Potter and Kurt Schwitters." },
                { name: "Waterhead Pier", location: "LA22 0EY", desc: "The Windermere Lake Cruises ferry arrives and departs from Waterhead, half a mile south of the town centre. A pleasant walk from the pier into town." },
              ].map(({ name, location, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-[#14231C] mb-1">{name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Walking */}
          <section id="walking" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Walking from Ambleside</h2>
            <div className="space-y-3">
              {[
                { name: "Loughrigg Fell", stats: "335m · 40 min to summit", desc: "The local hill, directly above the town. A fine summit view over Windermere, Elterwater, and back into the central fells. The path from Rothay Park takes around 40 minutes. The right walk for a late afternoon or first visit to get oriented." },
                { name: "The Fairfield Horseshoe", stats: "10 miles · 900m ascent · 6-7 hrs", desc: "The classic big walk from Ambleside. A circuit via Nab Scar, Heron Pike, Great Rigg, Fairfield, Dove Crag, and Low Pike, returning through the valley. Start south through the town to the path at Rydal village." },
                { name: "Langdale from Ambleside", stats: "Drive or 516 bus west", desc: "Old Dungeon Ghyll at the head of Great Langdale (LA22 9JY) is the departure point for Scafell Pike via Esk Hause, Bowfell, and most of the southern high fells." },
              ].map(({ name, stats, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#14231C]">{name}</h3>
                    <span className="text-xs text-gray-400">{stats}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/lake-district-walks" className="inline-flex items-center gap-2 text-[#C4782A] font-semibold text-sm hover:text-[#14231C] transition-colors">
                Full Lake District walks guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Where to eat */}
          <section id="where-to-eat" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Where to Eat and Drink</h2>
            <div className="space-y-3">
              {[
                { name: "Zeffirellis", location: "Compston Road, LA22 9AD", tag: "Cinema and restaurant", desc: "A vegetarian restaurant, terrace café, jazz bar and two-screen cinema, with pizza and pasta on the menu." },
                { name: "The Apple Pie", location: "Rydal Road, LA22 9AN", tag: "Café and bakery", desc: "An independent, family-run café and bakery, open since 1975, serving breakfast and lunch." },
                { name: "The Golden Rule", location: "Smithy Brow, LA22 9AS", tag: "Pub", desc: "A Grade II listed, traditional pub with several rooms, run by Robinsons. No background music and no meals; an open fire, a beer garden, and dogs welcome throughout." },
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
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Getting There</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#14231C] mb-3">By Bus or Boat</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> 555 bus: Windermere to Keswick via Ambleside, about hourly</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Windermere Lake Cruises from Bowness (35 min) to Waterhead</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Stagecoach&rsquo;s North West Explorer ticket covers a day on its buses here (£12.50 adult)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#14231C] mb-3">By Car</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> A591 between Windermere and Keswick</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Parking on Rydal Road and Kelsick Road (pay and display)</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> Fills early on summer weekends. Arrive by 9am.</li>
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

          <AdSlot id="guide-ambleside" className="mb-12" />

          {/* Explore nearby */}
          <section className="border-t border-gray-100 pt-10">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-5">Explore Nearby</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: "/windermere", label: "Windermere", desc: "England's largest lake, 3 miles south", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 4 miles north", image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80" },
                { href: "/keswick", label: "Keswick", desc: "Northern Lakes capital", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
                { href: "/coniston", label: "Coniston", desc: "Coniston Water, 8 miles south-west", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" },
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
