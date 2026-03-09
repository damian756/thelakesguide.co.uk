import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, BookOpen } from "lucide-react";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/grasmere`;

const faqs = [
  {
    q: "What is Grasmere famous for?",
    a: "Wordsworth. Dove Cottage on the edge of the village was William Wordsworth's home from 1799 to 1808. The Wordsworth Museum is here. Also Grasmere Gingerbread, which has been sold from the church corner since 1854, and the lake itself, which is one of the most beautiful in the Lake District.",
  },
  {
    q: "Is Grasmere worth visiting?",
    a: "Yes, particularly if you enjoy walking or have any interest in literary history. The village is compact and can be busy in summer, but the lake and the surrounding fells give it a quality that the gift shops and tea rooms can only partially obscure.",
  },
  {
    q: "What walks can you do from Grasmere?",
    a: "Helm Crag (the Howitzer summit) is the classic walk directly above the village — a 2-hour return with a scramble to the highest point. Easedale Tarn is a popular 3-mile circular. The Fairfield Horseshoe from Grasmere is a longer day. The lake circuit is an easy 4-mile flat walk.",
  },
  {
    q: "How far is Grasmere from Ambleside?",
    a: "4 miles north on the A591. About 10 minutes by car. The 555 bus connects them regularly. Walking the old coffin road between the two via Rydal is a pleasant hour.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Grasmere", item: url },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Grasmere",
    description: "Grasmere is a small village and lake in the central Lake District, most famous as Wordsworth's home and for Sarah Nelson's Grasmere Gingerbread.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.4597, longitude: -3.025 },
    address: { "@type": "PostalAddress", addressLocality: "Grasmere", postalCode: "LA22 9QT", addressCountry: "GB" },
  },
];

export const metadata: Metadata = {
  title: "Grasmere | Wordsworth, Gingerbread & Visitor Guide",
  description: "Complete guide to Grasmere. Dove Cottage, Wordsworth Museum, Grasmere Gingerbread, Helm Crag, Easedale Tarn. Everything you need to know for a visit to this central Lake District village.",
  alternates: { canonical: url },
  openGraph: { title: "Grasmere Guide | The Lakes Guide", description: "Wordsworth, gingerbread, and one of the most beautiful lakes in the Lake District. Complete visitor guide.", url, siteName: "The Lakes Guide" },
};

export default function GrasmerePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>

        {/* Hero */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=1400&q=80"
            alt="Grasmere lake in the central Lake District"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative w-full max-w-3xl mx-auto px-4 pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Grasmere</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">Village guide · Central Lake District · LA22</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Grasmere</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              Simultaneously one of the most visited and most genuinely beautiful places in the Lake District. Wordsworth lived here. The gingerbread is made to a recipe from 1854. The lake is outstanding. The village in August can feel overwhelmed, but the surrounding fells always offer a way out.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { icon: MapPin, stat: "LA22 9QT", label: "Postcode" },
                { icon: BookOpen, stat: "1799–1808", label: "Wordsworth at Dove Cottage" },
                { icon: Clock, stat: "1854", label: "Gingerbread recipe" },
                { icon: Clock, stat: "4 miles", label: "From Ambleside" },
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
                { href: "#dove-cottage", label: "Dove Cottage" },
                { href: "#gingerbread", label: "Gingerbread" },
                { href: "#the-lake", label: "The Lake" },
                { href: "#walking", label: "Walking" },
                { href: "#where-to-eat", label: "Where to Eat" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-white/60 hover:text-[#C4782A] transition-colors font-medium">{label}</a>
              ))}
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-10">

          {/* About */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">About Grasmere</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Grasmere is a small village in the valley of the same name, with a lake of the same name directly beside it. The village, the lake, and the surrounding fells are all called Grasmere. The lake is small — about three-quarters of a mile long — but exceptionally beautiful, sitting between the steep fell sides of Helm Crag to the north and Silver How to the west.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The literary history is the main draw for many visitors. William Wordsworth moved to Dove Cottage on the edge of the village in December 1799 with his sister Dorothy, and he lived here until 1808 writing some of the central work of English Romanticism. Dove Cottage is preserved by the Wordsworth Trust and is open for tours.
            </p>
          </section>

          {/* Dove Cottage */}
          <section id="dove-cottage" className="mb-12 scroll-mt-20">
            <div className="rounded-2xl overflow-hidden border border-[#14231C]/10 md:flex">
              <div className="relative h-52 md:h-auto md:w-64 flex-none">
                <Image
                  src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80"
                  alt="Dove Cottage — Wordsworth's home in Grasmere"
                  fill sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
              <div className="bg-gray-50 p-6 flex flex-col justify-center md:flex-1">
                <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">Book ahead in summer</p>
                <h2 className="font-display text-xl font-bold text-[#14231C] mb-3">Dove Cottage and the Wordsworth Museum</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  LA22 9SH, entrance charged. A 17th-century farmhouse on the old road to Ambleside, half a mile from the village centre. The cottage is small, darker than photographs suggest, and gives a clear impression of how Wordsworth&rsquo;s household actually lived. The tours are guided and well-informed.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="bg-[#14231C] text-white px-3 py-1.5 rounded-full">Guided tours</span>
                  <span className="bg-white border border-gray-200 text-[#14231C] px-3 py-1.5 rounded-full">First slot for smallest crowds</span>
                </div>
              </div>
            </div>
          </section>

          {/* Gingerbread */}
          <section id="gingerbread" className="mb-12 scroll-mt-20">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="font-display text-xl font-bold text-[#14231C]">Grasmere Gingerbread</h2>
                <span className="text-xs font-bold bg-[#C4782A] text-white px-2.5 py-1 rounded-full flex-none">Since 1854</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Sarah Nelson&rsquo;s Grasmere Gingerbread shop is at the corner of the churchyard (LA22 9SW). The recipe has been made to the same formula since 1854. It is not gingerbread in the conventional sense — harder, drier, spiced differently, and genuinely unique.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                The shop is tiny and the queue on summer days can be 20 people long, but it moves quickly. Buy more than you think you need — it keeps well and the tin is reusable.
              </p>
            </div>
          </section>

          {/* The lake */}
          <section id="the-lake" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">The Lake</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Grasmere lake is not particularly large but the setting makes it exceptional. The fell sides come close to the water on all sides, and the reflection of the surrounding landscape on a still autumn morning is one of the great quiet views of the central Lakes. The circuit path around the lake is about 4 miles on mostly flat ground, starting from the village.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The wooded island in the middle of the lake was used by Wordsworth and his circle for picnics. It is now a wildlife haven with no public access, visible from the shore path on the eastern side.
            </p>
          </section>

          {/* Walking */}
          <section id="walking" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Walking from Grasmere</h2>
            <div className="space-y-3">
              {[
                { name: "Helm Crag", stats: "405m · 45 min ascent · Easy scramble", desc: "The fell directly above the village with the distinctive rocky summit that Wainwright described as the Howitzer and the Lion and the Lamb. The views from the top directly down into Grasmere with the lake below are excellent." },
                { name: "Easedale Tarn", stats: "3.5 miles · 280m ascent · 2-2.5 hrs", desc: "The high tarn above the village, reached by a clear path up Easedale Valley past Sour Milk Gill waterfall. A good family walk that gives a waterfall and a tarn and ends in the village for the gingerbread." },
                { name: "Lake Circuit", stats: "4 miles · Flat · 1.5 hrs", desc: "The circuit path around the lake on mostly flat ground. One of the most accessible easy walks in the area. The eastern shore path gives the best reflection views on still mornings." },
                { name: "Silver How Ridge", stats: "5 miles · Views over Langdale", desc: "The longer walk that rewards those who go beyond the tourist zone. The ridge above the village gives views across Langdale and back down to Grasmere that most visitors never see." },
              ].map(({ name, stats, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#14231C]">{name}</h3>
                    <span className="text-xs text-gray-400 bg-white rounded-full px-2 py-0.5 border border-gray-100">{stats}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Where to eat */}
          <section id="where-to-eat" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Where to Eat</h2>
            <div className="space-y-3">
              {[
                { name: "The Jumble Room", location: "Langdale Road, LA22 9SU", tag: "Best restaurant", desc: "The most consistently well-regarded restaurant in Grasmere. Eclectic, independently owned, with a menu that changes regularly. Book ahead — it is small and fills up." },
                { name: "The Travellers Rest", location: "A591 south of Grasmere, LA22 9RR", tag: "Best post-walk pub", desc: "The right post-walk pub for the Fairfield Horseshoe or any of the southern approaches. Good food, decent beer, reliable quality." },
                { name: "The Rowan Tree", location: "Village centre", tag: "Good for lunch", desc: "A reliable lunch option with better food than the setting might suggest. Convenient for a break between Dove Cottage and the lake." },
              ].map(({ name, location, tag, desc }) => (
                <div key={name} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[#14231C]">{name}</h3>
                    <span className="text-[10px] font-bold bg-[#14231C] text-white px-2 py-0.5 rounded-full flex-none">{tag}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Getting there */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">Getting There</h2>
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                The 555 bus connects Grasmere with Windermere station, Ambleside, and Keswick roughly hourly. This is a reliable service and removes the parking problem in summer.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Car parking is at the main car park on Red Bank Road (LA22 9QT, pay and display) or along Broadgate. Both fill early in summer. Arrive before 10am or use the bus.
              </p>
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

          {/* Explore nearby */}
          <section className="border-t border-gray-100 pt-10">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-5">Explore Nearby</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: "/ambleside", label: "Ambleside", desc: "4 miles south, the walking hub", image: "https://images.unsplash.com/photo-1546430498-f6b45e5b35ca?w=400&q=80" },
                { href: "/keswick", label: "Keswick", desc: "15 miles north on the 555", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
                { href: "/windermere", label: "Windermere", desc: "England's largest lake", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
                { href: "/coniston", label: "Coniston", desc: "Coniston Water, Ruskin, Old Man", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" },
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
