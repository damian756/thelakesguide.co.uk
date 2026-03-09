import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Anchor } from "lucide-react";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/coniston`;

const faqs = [
  {
    q: "What is Coniston famous for?",
    a: "Three things mainly: John Ruskin, who lived at Brantwood on the lake's eastern shore; Arthur Ransome, who set the Swallows and Amazons books partly here; and Donald Campbell, who died on Coniston Water in 1967 attempting the world water speed record. Also the Coniston Old Man, one of the most-walked fells in the southern Lakes.",
  },
  {
    q: "What is the best walk near Coniston?",
    a: "Coniston Old Man from the village is the most popular — around 5.5 miles return with 750 metres of ascent. The circuit via Dow Crag and Goat's Water is a better day. For a shorter walk, the circuit of Tarn Hows (3 miles, flat) is one of the most scenic easy walks in the Lake District.",
  },
  {
    q: "Is Brantwood worth visiting?",
    a: "Yes. Brantwood (LA21 8AD, entrance charged) is John Ruskin's house on the eastern shore of Coniston Water. The house has a significant art collection and the gardens, designed by Ruskin, are excellent. The setting above the lake is exceptional. Allow 2 to 3 hours.",
  },
  {
    q: "How do I get to Coniston without a car?",
    a: "The 505 bus runs from Ambleside and Windermere to Coniston. The Coniston Launch boat service runs from Coniston pier to Brantwood and other stopping points on the lake. The combination of bus and boat gives access to Coniston and the lake without a car.",
  },
  {
    q: "Where should I eat in Coniston?",
    a: "The Black Bull on Yewdale Road is the main pub — it brews its own beer and does solid food. The Sun Hotel also serves food. For a quick lunch, the Bluebird Cafe near the pier gives views over the lake and is a reasonable option.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Coniston", item: url },
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
    name: "Coniston",
    description: "Coniston is a village at the foot of Coniston Old Man on the western shore of Coniston Water. Known for John Ruskin's Brantwood, the Swallows and Amazons legacy, and Donald Campbell's water speed record attempts.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.3693, longitude: -3.0723 },
    address: { "@type": "PostalAddress", addressLocality: "Coniston", postalCode: "LA21 8EH", addressCountry: "GB" },
  },
];

export const metadata: Metadata = {
  title: "Coniston | Ruskin, Old Man & Complete Visitor Guide",
  description: "Complete guide to Coniston. Coniston Old Man walk, Brantwood house and gardens, Coniston Water boat trips, Tarn Hows. Restaurants, accommodation and practical information.",
  alternates: { canonical: url },
  openGraph: { title: "Coniston Guide | The Lakes Guide", description: "Coniston Old Man, Brantwood, Coniston Water and Tarn Hows. Complete visitor guide for the southern Lake District village.", url, siteName: "The Lakes Guide" },
};

export default function ConistonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>

        {/* Hero */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=80"
            alt="Coniston Water with the fells above the southern Lake District"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative w-full max-w-3xl mx-auto px-4 pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Coniston</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">Village guide · Southern Lake District · LA21</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Coniston</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              Quieter than Windermere, less well-known than Grasmere, and one of the more rewarding places in the southern Lakes. The Old Man rises directly above the village. The lake is long and beautiful. Brantwood is worth half a day. The Black Bull brews its own beer.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { icon: MapPin, stat: "LA21 8EH", label: "Postcode" },
                { icon: Anchor, stat: "5 miles", label: "Coniston Water length" },
                { icon: Clock, stat: "803m", label: "Coniston Old Man" },
                { icon: Clock, stat: "8 miles", label: "From Ambleside" },
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
                { href: "#old-man", label: "Coniston Old Man" },
                { href: "#brantwood", label: "Brantwood" },
                { href: "#tarn-hows", label: "Tarn Hows" },
                { href: "#the-lake", label: "The Lake" },
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
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">About Coniston</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Coniston is a small village in the southern Lake District, sitting at the foot of Coniston Old Man with the lake, Coniston Water, stretching south. It is a working village as much as a tourist one — there was copper mining here for centuries, and the Old Man is covered in the remains of the industry.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The three figures who define Coniston&rsquo;s cultural identity are John Ruskin, Arthur Ransome, and Donald Campbell. Ruskin lived at Brantwood on the eastern shore from 1872 until his death in 1900. Ransome set key parts of his Swallows and Amazons books here. Campbell died in 1967, attempting the world water speed record on Bluebird K7. His body and the remains of the boat were recovered from the lake in 2001.
            </p>
          </section>

          {/* Coniston Old Man */}
          <section id="old-man" className="mb-12 scroll-mt-20">
            <div className="rounded-2xl overflow-hidden border border-[#14231C]/10 md:flex mb-6">
              <div className="relative h-52 md:h-auto md:w-64 flex-none">
                <Image
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80"
                  alt="Coniston Old Man rising above the village"
                  fill sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
              <div className="bg-gray-50 p-6 flex flex-col justify-center md:flex-1">
                <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-2">803 metres</p>
                <h2 className="font-display text-xl font-bold text-[#14231C] mb-3">Coniston Old Man</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Old Man rises directly above the village. The main ascent via the quarry path climbs through the working history of the fell, copper ore spoil tips, slate quarry remains, an old reservoir. At 600 metres it passes Low Water, a dark tarn below the summit. Views east to Coniston Water and south to Morecambe Bay.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#14231C] mb-1 text-sm">Main quarry route</h3>
                <p className="text-xs text-gray-400 mb-1.5">5.5 miles return · 750m ascent · 4-5 hrs</p>
                <p className="text-gray-600 text-sm">Clear and well-maintained. The standard ascent. Good views from the summit plateau with a triangulation pillar.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-[#14231C] mb-1 text-sm">Dow Crag circuit</h3>
                <p className="text-xs text-gray-400 mb-1.5">7 miles · 900m ascent · 5-6 hrs</p>
                <p className="text-gray-600 text-sm">A significantly better day. Via Goat&rsquo;s Water under the east face of Dow Crag, one of the great cliff faces in the southern Lakes, then over the ridge to the Old Man.</p>
              </div>
            </div>
          </section>

          {/* Brantwood */}
          <section id="brantwood" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">Brantwood</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Brantwood (LA21 8AD, entrance charged) is on the eastern shore of Coniston Water, accessible by road via the B5285 from Coniston village or by boat on the Coniston Launch. John Ruskin bought the house in 1871 and spent the last 28 years of his life here, extending the house, creating the gardens, and producing some of his later writing on economics, art criticism, and social reform.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The house contains original furniture and artworks, including Ruskin&rsquo;s own drawings and paintings. The gardens, which Ruskin designed with an unconventional approach that included terraced bog gardens and a wild fell garden above the house, are excellent in spring and summer.
            </p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-[#14231C] text-sm mb-1">Practical notes</p>
              <p className="text-gray-600 text-sm">Allow 2 to 3 hours for the house, garden, and lake shore walk from the jetty. The Coniston Launch runs from Coniston pier to Brantwood regularly. The cafe at Brantwood is reasonable. Combining the boat trip with the Brantwood visit removes the need to drive the eastern shore road.</p>
            </div>
          </section>

          {/* Tarn Hows */}
          <section id="tarn-hows" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">Tarn Hows</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tarn Hows (LA21 8DP, National Trust, charged parking) is 3 miles north-east of Coniston and is one of the most visited National Trust locations in England. The tarn is artificial — created in the Victorian era by damming a series of small tarns — but the setting is outstanding. The circuit path around the tarn is about 3 miles on mostly flat, good-quality paths. Suitable for wheelchairs and pushchairs on the main circuit.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-semibold text-amber-800 text-sm mb-1">When to visit</p>
              <p className="text-amber-700 text-sm">Busy in summer. Arrive before 10am or visit in late afternoon. The autumn colours around the tarn are exceptional and October is the best time for the combination of colour, light, and manageable crowds.</p>
            </div>
          </section>

          {/* The lake */}
          <section id="the-lake" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">Coniston Water</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Coniston Water is 5 miles long and one of the quieter major lakes. There is no road along most of the western shore, giving it a more remote feel than Windermere. The Coniston Launch runs regular cruises from the pier at Coniston village (LA21 8AJ) to Brantwood and other points. A circuit cruise takes about 90 minutes.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The steam yacht Gondola, operated by the National Trust, runs from May to October. One of the most comfortable ways to see the lake. The lake is good for wildlife in winter: goldeneye and goosander both occur, and red squirrels are present in the woodland above the western shore.
            </p>
          </section>

          {/* Where to eat */}
          <section id="where-to-eat" className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Where to Eat and Drink</h2>
            <div className="space-y-3">
              {[
                { name: "The Black Bull Inn", location: "Yewdale Road, LA21 8DU", tag: "Best pub", desc: "The most important pub in Coniston. Brewed its own beer since 2003, starting with Bluebird Bitter and expanding to a range of Coniston ales. Honest pub food done consistently well." },
                { name: "Yew Tree Farm", location: "Near Tarn Hows, LA21 8DP", tag: "Most characterful", desc: "One of the most characterful farm cafe settings in the southern Lakes. Serves teas and does accommodation. The right stop after Tarn Hows." },
                { name: "Bluebird Cafe", location: "Near the pier, LA21 8AJ", tag: "Before a boat trip", desc: "Lake views and a reasonable option for lunch before boarding the Coniston Launch or Gondola." },
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
                The 505 bus runs from Ambleside and Windermere to Coniston roughly every 90 minutes to 2 hours. By car, Coniston is on the A593 from Ambleside or via the B5285 from Hawkshead.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Main car parking is in the village car park on Yewdale Road (LA21 8EH, pay and display). It fills on summer weekends — arrive early.
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
                { href: "/ambleside", label: "Ambleside", desc: "8 miles north, central Lakes hub", image: "https://images.unsplash.com/photo-1546430498-f6b45e5b35ca?w=400&q=80" },
                { href: "/windermere", label: "Windermere", desc: "England's largest lake", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 12 miles north", image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=400&q=80" },
                { href: "/keswick", label: "Keswick", desc: "Northern Lakes capital", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
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
