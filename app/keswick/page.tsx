import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Mountain } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { pageOpenGraph } from "@/lib/seo";

// Hourly, so an advert past its "until" date (lib/ad-slots.ts) drops off.
export const revalidate = 3600;

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/keswick`;

const faqs = [
  {
    q: "What is there to do in Keswick?",
    a: "Walking is the main activity: Catbells, Skiddaw and Blencathra are within easy reach. The Keswick Launch sails round Derwentwater (not in December and January). The market is on Thursdays and Saturdays. There are restaurants, outdoor shops, Theatre by the Lake and Keswick Museum.",
  },
  {
    q: "What is the best walk from Keswick?",
    a: "Catbells is the most popular, with wide views over Derwentwater for relatively modest effort. The Latrigg walk above the town is shorter and good for a morning. For a serious day, Skiddaw via the tourist path or Blencathra via Hall's Fell Ridge are the main options.",
  },
  {
    q: "Where should I stay in Keswick?",
    a: "Keswick has a wide range of accommodation, from hostels to hotels. The Lodore Falls Hotel & Spa is on the shore of Derwentwater in Borrowdale. In the town there are many Victorian B&Bs on the main streets. Book well ahead for weekends and the Keswick Mountain Festival in May.",
  },
  {
    q: "Is Keswick easy to get to without a car?",
    a: "Yes, with some planning. Keswick has no railway station. The nearest main-line station is Penrith, 45 minutes away on the X4/X5 bus, which runs seven days a week all year, except Christmas Day and New Year's Day. The 555 bus runs about every hour from Windermere station via Ambleside and Grasmere.",
  },
  {
    q: "When is the Keswick market?",
    a: "Keswick market is held every Thursday and Saturday on the Market Square. Cumberland Council runs it, with some 65 to 70 stalls selling food, clothes and homeware.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
  {
    "@type": "TouristDestination",
    "@id": `${url}#place`,
    name: "Keswick",
    description: "Keswick is the capital of the northern Lake District. A market town on the shore of Derwentwater with direct access to Skiddaw, Blencathra, and Catbells.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.6014, longitude: -3.1342 },
    address: { "@type": "PostalAddress", addressLocality: "Keswick", addressCountry: "GB" },
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
  title: "Keswick | Restaurants, Walks & Visitor Guide",
  description: "Keswick in the Lake District: restaurants, walking routes, accommodation, Derwentwater, Catbells, and what to see and do in the northern Lakes.",
  alternates: { canonical: url },
  openGraph: pageOpenGraph({ title: "Keswick Guide | The Lakes Guide", description: "Visiting Keswick: restaurants, walking, Derwentwater lake cruises, accommodation and what to do.", url }),
};

export default function KeswickPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>

        {/* Hero */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"
            alt="Snow-capped mountain peaks above a sea of cloud"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/40" />
          <div className="relative w-full max-w-3xl mx-auto px-4 pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Keswick</span>
            </nav>
            <p className="text-[#E8B87A] text-xs font-bold uppercase tracking-widest mb-3">Village guide · Northern Lake District · CA12</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Keswick</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              The capital of the northern Lakes. A proper market town with good restaurants, an excellent market on Thursdays and Saturdays, Derwentwater at the bottom of the high street, and Skiddaw visible from most of it. This is where you come to base yourself for the northern fells.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { icon: MapPin, stat: "CA12 5JB", label: "Postcode" },
                { icon: Clock, stat: "Thu & Sat", label: "Market days" },
                { icon: Mountain, stat: "May", label: "Mountain Festival" },
                { icon: Clock, stat: "45 min", label: "From Penrith by bus" },
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
                { href: "#derwentwater", label: "Derwentwater" },
                { href: "#walking", label: "Walking" },
                { href: "#where-to-eat", label: "Where to Eat" },
                { href: "#what-to-see", label: "What to See" },
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
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">About Keswick</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Keswick sits in the northern Lake District on the River Greta, with Derwentwater at the foot of the town and Skiddaw rising directly to the north. It has been a market town since the 13th century. The Victorian tourism boom transformed it: the railway arrived in 1865, though the line has since closed, and the infrastructure built for that era is still visible in the Victorian B&Bs and hotels that line the main streets.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Keswick&rsquo;s main streets have outdoor shops, cafes and restaurants, plus the market twice a week. It is a functional town as well as a tourist destination.
            </p>
          </section>

          {/* Derwentwater */}
          <section id="derwentwater" className="mb-12 scroll-mt-20">
            <div className="rounded-2xl overflow-hidden border border-[#14231C]/10 md:flex mb-6">
              <div className="relative h-52 md:h-auto md:w-64 flex-none">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                  alt="Snow-capped mountain peaks above a sea of cloud"
                  fill sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
              <div className="bg-gray-50 p-6 flex flex-col justify-center md:flex-1">
                <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">10 min walk from the market</p>
                <h2 className="font-display text-xl font-bold text-[#14231C] mb-3">Derwentwater</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Not the largest lake, at about 3 miles long, but the setting is exceptional. Catbells and the Newlands fells to the west, Borrowdale to the south, Skiddaw and Blencathra to the north. The Keswick Launch (CA12 5DJ) sails a circuit of the lake calling at seven jetties. It does not sail in December and January.
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Friars Crag, a short walk from the town centre along the lake shore, gives the classic view of Derwentwater that has been painted and photographed for 200 years. John Ruskin described the view here as one of the three most beautiful in Europe. Managed by the National Trust.
            </p>
          </section>

          {/* Walking */}
          <section id="walking" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Walking from Keswick</h2>
            <div className="space-y-3">
              {[
                { name: "Catbells", stats: "451m · 1.5 hrs return from Hawes End", desc: "The walk. Extraordinary views over Derwentwater for relatively modest effort. The final scramble to the summit is hands-on but not technical. Access Hawes End by Keswick Launch. One of the best introductions to fell walking for beginners." },
                { name: "Latrigg", stats: "369m · 30 min from car park", desc: "Directly above the town. Quick, accessible, and the summit gives a panoramic view of Skiddaw, Derwentwater, and the Borrowdale valley that surprises most people who do it. Start from the Latrigg car park. Good for early mornings in autumn." },
                { name: "Skiddaw", stats: "931m · 8 miles · Full day", desc: "At 931m, one of the highest fells in England. The tourist path from the Latrigg car park takes the direct line to the summit. Around 900 metres of ascent. A good long day with serious views across the northern Lakes." },
                { name: "Blencathra", stats: "868m · Via Hall's Fell Ridge", desc: "The dramatic alternative to Skiddaw. Hall's Fell Ridge is one of the finest ridge walks in the northern Lakes. The approach from Threlkeld (CA12 4TF) gives the best line. Harder than Skiddaw but significantly more interesting." },
              ].map(({ name, stats, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-[#14231C]">{name}</h3>
                        <span className="text-xs text-gray-400">{stats}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Where to eat */}
          <section id="where-to-eat" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Where to Eat and Drink</h2>
            <div className="space-y-3">
              {[
                { name: "Bryson's", location: "42 Main Street, CA12 5JD", tag: "Bakery and tea rooms", desc: "A craft bakery and tea rooms, trading in Keswick since 1947." },
                { name: "The Square Orange", location: "20 St John's Street, CA12 5AS", tag: "Café bar", desc: "Stone-baked Roman-style pizza, tapas and desserts, with coffee, wine and beer. No reservations; dogs welcome." },
                { name: "The Dog & Gun", location: "2 Lake Road, CA12 5BT", tag: "Pub", desc: "Pub food, known for its homemade Hungarian goulash. Walk-ins only, no advance bookings. Dog friendly." },
                { name: "The Pheasant Inn", location: "Bassenthwaite Lake, CA13 9YE", tag: "Inn with rooms", desc: "A 17th-century coaching inn with a bar and restaurant, part of The Inn Collection Group. Dog friendly." },
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

          {/* What to see */}
          <section id="what-to-see" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">What to See</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: "Castlerigg Stone Circle", location: "CA12 4RN · Free · English Heritage", desc: "East of Keswick. 38 stones in a field with a fell panorama all round. English Heritage, which looks after it with the National Trust, says its exact age is uncertain. Allow 30 minutes at any time of year." },
                { name: "Keswick Museum", location: "Station Road, CA12 4NF · Charged", desc: "Local history and collections. Adults £8.50, under-5s free. Closed from 24 December 2026 to 31 January 2027." },
                { name: "The Pencil Museum", location: "Southey Works, CA12 5NG · Closed", desc: "The Derwent Pencil Museum is closed while it moves to a new site." },
                { name: "Keswick Market", location: "Market Square, CA12 5JR · Thu & Sat", desc: "Run by Cumberland Council, with some 65 to 70 stalls selling food, clothes and homeware." },
              ].map(({ name, location, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-[#14231C] mb-1">{name}</h3>
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
                <h3 className="font-semibold text-[#14231C] mb-3">By Bus</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> X4/X5 from Penrith station: about 45 minutes, daily except Christmas Day and New Year&apos;s Day</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> 555 from Windermere station via Ambleside and Grasmere, about hourly</li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> No railway station. Penrith, on the West Coast Main Line, is the nearest.</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#14231C] mb-3">Parking</h3>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> <span><strong>Lakeside (CA12 5DJ)</strong>: council car park, 253 spaces, by the boat landing</span></li>
                  <li className="flex gap-2"><span className="text-[#C4782A] font-bold">•</span> <span><strong>Headlands (CA12 5ER)</strong>: a short walk from the market</span></li>
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

          <AdSlot id="guide-keswick" className="mb-12" />

          {/* Explore nearby */}
          <section className="border-t border-gray-100 pt-10">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-5">Explore Nearby</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: "/ambleside", label: "Ambleside", desc: "Southern Lakes walking hub", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
                { href: "/windermere", label: "Windermere", desc: "England's largest lake", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 30 min south", image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80" },
                { href: "/coniston", label: "Coniston", desc: "Coniston Water and the Old Man", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" },
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
