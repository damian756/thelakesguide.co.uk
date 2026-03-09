import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/rainy-day-lake-district`;

const faqs = [
  {
    q: "What can you do in the Lake District when it rains?",
    a: "Plenty. The museums in Keswick and at Windermere Jetty are genuinely good. Go Ape in Grizedale is outdoors but gear-managed. The Pencil Museum, World of Beatrix Potter, and Rheged near Penrith are reliable indoor options. And honestly, if you are properly waterproofed, a rainy day walk in the Lakes is one of the best experiences the place offers. The waterfalls are better, the crowds are gone, and the light is different.",
  },
  {
    q: "Is it worth visiting the Lake District in rain?",
    a: "Yes, and I would argue it is better in many ways. The crowds thin dramatically on a rainy day. The waterfalls are at their best. The valley mist and cloud is atmospheric rather than disappointing. You need the right gear: waterproof jacket and trousers, proper boots. With those you can walk comfortably in any conditions the Lakes throws at you in summer.",
  },
  {
    q: "What is the best museum in the Lake District?",
    a: "The Windermere Jetty Museum is the most impressive building and has the best exhibits. The Keswick Museum and Art Gallery is good for local history and the natural history collection. The Pencil Museum in Keswick is smaller but surprisingly well done. Ruskin's Brantwood near Coniston is worth visiting for the house and grounds.",
  },
  {
    q: "Are there any indoor activities for kids in the Lake District?",
    a: "Yes. Pencil Museum Keswick, World of Beatrix Potter in Bowness, Rheged near Penrith, and Windermere Jetty Museum. Go Ape in Grizedale is technically outdoor but is gear-dependant not weather-dependant once booked. Keswick leisure centre has a public pool for swim sessions.",
  },
  {
    q: "Where is the best place to have lunch in the Lake District on a rainy day?",
    a: "A good pub. The Old Dungeon Ghyll in Langdale, the Wasdale Head Inn, the Kirkstone Pass Inn, or the Dog and Gun in Keswick are all warm and welcoming when it is wet outside. In Keswick, The Square Orange does good food in a relaxed setting. In Ambleside, The Apple Pie bakery on Rydal Road is excellent for a wet afternoon.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Rainy Day Lake District: What to Do When the Weather Turns",
    description:
      "What to do in the Lake District on a rainy day. Best museums, indoor activities, wet weather walks, and where to eat when it is raining.",
    url,
    author: {
      "@type": "Person",
      name: "Damian Roche",
      url: BASE_URL,
    },
    publisher: { "@type": "Organization", name: "The Lakes Guide", url: BASE_URL },
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
];

export const metadata: Metadata = {
  title: "Rainy Day Lake District | What to Do When It Rains",
  description:
    "What to do in the Lake District when it rains. Best museums, indoor activities for kids, wet weather walks, and where to eat. Practical and honest.",
  alternates: { canonical: url },
  openGraph: {
    title: "Rainy Day Lake District | The Lakes Guide",
    description:
      "What to do in the Lake District on a rainy day. Museums, indoor activities, wet weather walks and places to eat.",
    url,
    siteName: "The Lakes Guide",
  },
};

export default function RainyDayLakeDistrictPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <main>

        {/* Hero */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1504266106287-1659872e6590?w=1400&q=80"
            alt="Rainy day in the Lake District valleys"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative w-full max-w-3xl mx-auto px-4 pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Rainy Day Lake District</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">Practical guide · Lake District</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Rainy Day in the Lake District</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              It will rain. The Lakes has some of the highest rainfall in England and that is part of what makes it what it is. Here is what to do about it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { stat: "140 in/yr", label: "Keswick rainfall" },
                { stat: "Jetty Museum", label: "Best wet day museum" },
                { stat: "Pencil Museum", label: "Keswick, 2 hrs" },
                { stat: "Waterproofs", label: "Still walk anyway" },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-black/40 backdrop-blur rounded-xl px-3 py-2.5 border border-white/20">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
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
                { href: "#walk-anyway", label: "Walk Anyway" },
                { href: "#wet-walks", label: "Wet Weather Walks" },
                { href: "#museums", label: "Museums" },
                { href: "#where-to-eat", label: "Where to Eat" },
                { href: "#boat-trips", label: "Boat Trips" },
                { href: "#gear", label: "Gear" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-white/60 hover:text-[#C4782A] transition-colors font-medium">{label}</a>
              ))}
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 pb-12 space-y-12 pt-10">

          <section id="walk-anyway" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              First: Gear Up and Walk Anyway
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The honest advice is this: if you have proper waterproofs and boots, walking
              in the rain in the Lake District is one of the best things you can do there.
              The waterfalls are louder and more impressive after overnight rain. The crowds
              thin to almost nothing. The light and atmosphere in the valleys under cloud is
              unlike clear-day walking. The fells are often clear above 600m even when the
              valley is socked in.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The key distinction is preparedness. A drizzle in a waterproof jacket is
              enjoyable. A downpour in a cotton hoodie is miserable and potentially dangerous.
              Invest in waterproof trousers as well as a jacket. Waterproof boots. Gloves and
              a hat even in summer, because a wet fell in July can be 6 degrees Celsius at
              the top.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you genuinely want indoor options, they exist and some are genuinely
              excellent. But do not write off a rainy day as a wasted day in the Lakes. It is
              not.
            </p>
          </section>

          <section id="wet-walks" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Best Wet Weather Walks
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some walks are better in the rain than in sun. These are worth doing on a wet day:
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Waterfalls routes
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              After overnight rain, waterfall routes are spectacular. Aira Force near
              Glenridding (CA11 0JS, NT car park) is one of the most impressive falls in the
              Lakes and is dramatically better after heavy rain. Sourmilk Gill above Grasmere
              on the Easedale Tarn path is another. Stock Ghyll Force above Ambleside is
              accessible in 20 minutes from the town centre. All of these are on good,
              well-maintained paths.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Woodland walks
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Woodland provides natural shelter and is the most comfortable walking in rain.
              Grizedale Forest between Coniston and Windermere (LA22 0QJ) has extensive
              waymarked trails through conifer and broadleaved woodland. Allen Bank and
              Grasmere area woods (NT, LA22 9QZ) are excellent. The Brantwood estate on
              Coniston Water (LA21 8AD) has woodland gardens that are remarkably good in rain.
              Moss, lichen, and the smell of wet conifer are specific pleasures of wet
              woodland walking that dry days do not give you.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Low-level lake circuits
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Grasmere lake circuit is about 3.5 miles, almost flat, and gives excellent
              views even in low cloud. The fell tops may be in cloud but the lake and immediate
              landscape are still worth walking. Similarly, the Derwentwater southern shore
              path from Keswick is excellent in wet weather, passing the lakeshore under tree
              cover for stretches.
            </p>
          </section>

          <section id="museums" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Museums and Indoor Attractions
            </h2>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Windermere Jetty Museum (LA23 3JH)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The most impressive museum building in the Lakes. An award-winning contemporary
              structure sitting directly on the shore of Windermere with access to historic
              boats on the lake itself. The exhibits cover Windermere's maritime history from
              the Victorian steam yachts to the Campbell water speed record attempts. Allow
              two to three hours. Good café. Admission charged. Excellent for adults and
              children over 8.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Pencil Museum, Keswick (CA12 5NG)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The story of graphite mining in Cumberland and pencil manufacturing from the
              16th century. Better than it sounds. The history of the Keswick graphite mine,
              discovered around 1565, is genuinely interesting, and the pencil manufacturing
              process is explained well. There is a world's largest pencil. Two hours and
              modestly priced. Good for a wet morning, particularly with children.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Keswick Museum and Art Gallery (CA12 5NJ)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Free entry. Local natural history, Lake District geology, literary connections
              (Wordsworth, Southey, Coleridge all spent time in Keswick), and a curiosity
              room that is difficult to describe and worth seeing. Small but worth an hour on a
              wet afternoon. In the Fitz Park grounds.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Brantwood, Coniston (LA21 8AD)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              John Ruskin's house on the eastern shore of Coniston Water. A serious house with
              serious contents, including Ruskin's own art and the collection he assembled. The
              gardens and woodland are extensive and work well in rain. Café in the house.
              Admission charged. Access by road or by the Coniston Launch from Coniston village.
              Allow half a day.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Dove Cottage, Grasmere (LA22 9SH)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wordsworth's home from 1799 to 1808. Small cottage, large cultural significance.
              Guided tours of the cottage, which is preserved more or less as it was. The
              adjacent Wordsworth Museum has manuscripts and portraits. An hour, possibly two.
              Admission charged. Central Grasmere, easy to combine with lunch at the same time.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Go Ape, Grizedale Forest (LA22 0QJ)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The treetop course operates in most weather conditions. You will get wet. The
              harness and equipment are designed to function in the rain, and the experience is
              genuinely different to fair-weather aerial adventures. Book in advance,
              particularly in school holidays. Height restrictions apply. Several hours.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Rheged, near Penrith (CA11 0DQ)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A large complex built into a hillside near Junction 40 of the M6. Cinema, craft
              shops, a climbing wall, soft play. Useful primarily if you are arriving or
              departing via the motorway and want something to do in transit, or if you are
              based in the Penrith/Ullswater area.
            </p>
          </section>

          <section id="where-to-eat" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Where to Eat on a Rainy Day
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A wet day is a good day for a long lunch or an afternoon tea. The Lakes has
              enough good pubs and cafés to make this a pleasure rather than a fallback.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong className="text-[#14231C]">The Apple Pie, Ambleside</strong> (Rydal Road, LA22 9AN). Bakery and café. Good sandwiches, excellent cakes, proper coffee. Gets busy. Sit in and wait rather than giving up.
              </li>
              <li>
                <strong className="text-[#14231C]">The Square Orange, Keswick</strong> (CA12 5JA). Relaxed café-bar in central Keswick. Good food at reasonable prices. Useful midday or afternoon.
              </li>
              <li>
                <strong className="text-[#14231C]">Old Dungeon Ghyll, Langdale</strong> (LA22 9JU). The hikers' bar is the best place in the Lakes to be when it is properly raining. Open fires, wet gear hanging everywhere, good beer, no pretension. Drive to Great Langdale and make a day of the valley even if the fells are in cloud.
              </li>
              <li>
                <strong className="text-[#14231C]">Grasmere Gingerbread Shop</strong> (LA22 9SW). Queuing in the rain for Grasmere gingerbread is a Lakes ritual. It is sold hot or cold, the shop is tiny, and the queue moves. Worth it.
              </li>
              <li>
                <strong className="text-[#14231C]">The Cuckoo Brow Inn, Far Sawrey</strong> (LA22 0LQ). In the village near Hill Top, Beatrix Potter's farm. Small, proper pub, good food, not over-touristed. Worth combining with a visit to Hill Top if you have children who know the Potter books.
              </li>
            </ul>
          </section>

          <section id="boat-trips" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Lake Boat Trips in Rain
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lake cruises operate in most rain conditions unless winds are severe. The boats
              on Windermere (Windermere Lake Cruises) and Ullswater (Ullswater Steamers) are
              covered with outdoor deck sections. The landscape from the water in low cloud and
              rain is atmospheric in a way that clear-day crossings are not. Mist over
              Ullswater with the fell outlines visible above it is genuinely beautiful.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Check weather and service status before setting out. High winds can cause
              cancellations. But light rain and overcast conditions rarely affect services.
            </p>
          </section>

          <section id="gear" className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Gear for Wet Weather in the Lakes
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This is worth a paragraph because it determines whether a rainy day is good or
              miserable. The basics:
            </p>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>
                Waterproof jacket with a hood. Not water-resistant, waterproof. There is a
                difference after the first hour of rain. Gore-Tex or equivalent.
              </li>
              <li>
                Waterproof trousers. Most people do not bring these and regret it. They weigh
                almost nothing and turn a miserable afternoon into a comfortable one.
              </li>
              <li>
                Waterproof boots or hiking shoes with good grip. Fell paths in rain are
                slippery. Trainers are not adequate above the valley floor.
              </li>
              <li>
                Spare layers, particularly for children. Wet fleeces, spare gloves, dry socks.
                Keep them in a dry bag in your rucksack.
              </li>
              <li>
                A dry bag or waterproof rucksack cover for your pack. Wet maps and wet phones
                are avoidable problems.
              </li>
            </ul>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">
              Common Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="group bg-gray-50 rounded-xl p-4">
                  <summary className="font-medium text-[#14231C] cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-[#C4782A] text-lg group-open:rotate-45 transition-transform flex-shrink-0 ml-4">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-5">Explore More Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: "/lake-district-with-kids", label: "Lake District with Kids", desc: "Family-tested activities", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
                { href: "/keswick", label: "Keswick", desc: "Pencil Museum, Derwentwater", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
                { href: "/windermere", label: "Windermere", desc: "Jetty Museum, lake cruises", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
                { href: "/coniston", label: "Coniston", desc: "Brantwood, Tarn Hows", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" },
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

          <section className="bg-[#14231C] text-white rounded-2xl p-8">
            <h2 className="font-display text-xl font-bold mb-2">
              Explore the Lake District
            </h2>
            <p className="text-white/75 mb-4">
              Find things to do, places to eat, and practical information for your visit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/things-to-do"
                className="bg-[#C4782A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a86323] transition"
              >
                Things to do
              </Link>
              <Link
                href="/lake-district-walks"
                className="border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Walking guide
              </Link>
              <Link
                href="/lake-district-with-kids"
                className="border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Lake District with kids
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
