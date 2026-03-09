import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/ambleside`;

const faqs = [
  {
    q: "What is there to do in Ambleside?",
    a: "Walking is the main draw — Ambleside is the best base in the Lakes for accessing the central fells. Loughrigg Fell above the town is a classic starter. Stock Ghyll Force waterfall is a 20-minute walk. Bridge House, the tiny National Trust building on a bridge, is worth a quick look. The Armitt Museum covers local history and art.",
  },
  {
    q: "Is Ambleside good as a walking base?",
    a: "It is probably the best base in the Lake District for walking. Langdale is 8 miles west. Coniston is 8 miles south. The Fairfield Horseshoe starts from the edge of town. Rydal Water and Grasmere are within easy reach. Dozens of walks start within a mile of the market cross.",
  },
  {
    q: "Where should I eat in Ambleside?",
    a: "Zeffirellis on Compston Road is consistently good — a cinema-restaurant combination with Italian and vegetarian food, good wine. The Golden Rule on Smithy Brow is the best pub for a straightforward pint in unpretentious surroundings. Fellpack near the old Market Hall is good for lunch.",
  },
  {
    q: "How do I get to Ambleside without a car?",
    a: "The 555 bus runs between Windermere station and Keswick via Ambleside, Rydal, and Grasmere. It runs roughly hourly. The Windermere Lake Cruises also run from Bowness to Waterhead pier in Ambleside (35 minutes). Both are reliable and allow car-free access to the central Lakes.",
  },
  {
    q: "Is Ambleside or Windermere better as a base?",
    a: "Ambleside for walking and fell access. Windermere for lake activities, better transport connections, and more accommodation variety. If you intend to walk every day, Ambleside puts you much closer to the central fells without needing to drive through the busy Windermere area each morning.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Ambleside", item: url },
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
    name: "Ambleside",
    description: "Ambleside is the walking hub of the Lake District, a small market town at the northern tip of Windermere giving direct access to the central fells, Langdale, and Coniston.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.4298, longitude: -2.9622 },
    address: { "@type": "PostalAddress", addressLocality: "Ambleside", postalCode: "LA22 0DB", addressCountry: "GB" },
  },
];

export const metadata: Metadata = {
  title: "Ambleside | Restaurants, Walks & Complete Visitor Guide",
  description: "Complete guide to Ambleside in the Lake District. The best walking base in the Lakes. Restaurants, accommodation, Loughrigg Fell, Stock Ghyll Force, and the Fairfield Horseshoe.",
  alternates: { canonical: url },
  openGraph: { title: "Ambleside Guide | The Lakes Guide", description: "Everything you need for Ambleside. Walking routes, restaurants, accommodation, and how to use it as a base for the central fells.", url, siteName: "The Lakes Guide" },
};

export default function AmblesidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Ambleside</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Village guide · Central Lake District · LA22
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Ambleside</h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Ambleside is the walking hub of the Lake District. A small market town at the northern tip of Windermere that gives direct access to Langdale, the Fairfield Horseshoe, and most of the central fells without significant driving. If walking is the priority, this is the base.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "LA22 0DB", label: "Postcode" },
              { stat: "8 miles", label: "To Langdale" },
              { stat: "Ferry", label: "From Bowness (35 min)" },
              { stat: "555 Bus", label: "Windermere to Keswick" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>About Ambleside</h2>
            <p>
              Ambleside has been a market town since the 16th century. It sits at the head of Windermere, where Stock Beck flows down from the fells through the middle of the town. The town is compact — you can walk from one end to the other in 10 minutes — and is built in the grey Lakeland slate that characterises the central Lakes. It is a functional place as well as a tourist destination, with good shops, a range of restaurants, and a community that uses it year-round.
            </p>
            <p>
              The town's position makes it the best walking base in the Lake District. Langdale is 8 miles west. The Fairfield Horseshoe, one of the most celebrated circuit walks in the eastern Lakes, starts and ends here. Rydal Water is a short walk north. Grasmere is 4 miles north on the 555 bus. Coniston is 8 miles south. Within a mile of the market cross there are dozens of walk options without needing transport.
            </p>

            <h2>What to see in Ambleside</h2>
            <p>
              Bridge House on Stock Beck is the building that appears on more Lake District postcards than almost anything else. A tiny, two-room cottage built on a bridge over Stock Beck — now a National Trust information point. It is believed to have been built in the 18th century as an apple store for Ambleside Hall. It is worth five minutes; no need to budget more than that.
            </p>
            <p>
              Stock Ghyll Force is the waterfall above the town. The path up through the woodland takes about 20 minutes from the market place and reaches a series of falls that drop about 70 feet. The woodland around the falls was planted in the Victorian era and is mature and atmospheric. A good half-hour walk, appropriate for all abilities in dry conditions.
            </p>
            <p>
              The Armitt Museum on Rydal Road (LA22 0BZ, entrance charged) has a good collection covering the natural history and cultural history of the area. Beatrix Potter watercolours, John Ruskin material, and a fossil collection from the geological history of the Lakes. Smaller and more interesting than its modest appearance suggests.
            </p>

            <h2>Walking from Ambleside</h2>
            <p>
              Loughrigg Fell is the local hill, directly above the town. 335 metres, modest by Lake District standards, with a fine summit view over Windermere, Elterwater, and back into the central fells. The path from Rothay Park takes around 40 minutes to the summit. This is the right walk for a late afternoon or for a first visit when you want to get oriented and understand the geography.
            </p>
            <p>
              The Fairfield Horseshoe is the classic big walk from Ambleside. A 10-mile circuit via Nab Scar, Heron Pike, Great Rigg, Fairfield, Dove Crag, and Low Pike, returning through the valley. Around 900 metres of ascent. Allow 6 to 7 hours. Start by heading south through the town to the path at Rydal village.
            </p>
            <p>
              For Langdale, drive or take the 516 bus west from Ambleside. The bus runs irregularly — check the timetable before relying on it for specific fell walks. Old Dungeon Ghyll at the head of Great Langdale (LA22 9JU) is the departure point for Scafell Pike via Esk Hause, Bowfell, Crinkle Crags, Harrison Stickle, and most of the southern high fells.
            </p>

            <h2>Where to eat and drink</h2>
            <p>
              Zeffirellis on Compston Road (LA22 0BT) is the best-known restaurant in Ambleside and with good reason. A cinema and restaurant combined, with an Italian and vegetarian menu that is genuinely good. The price point is reasonable for the quality. The main restaurant upstairs is preferable to the ground-floor cafe. Book ahead on weekends and during the summer.
            </p>
            <p>
              Fellpack near the old Market Hall (LA22 0BT) is good for lunch — a light, modern menu with local ingredients. The kind of place you eat well without spending a lot. Suitable for walkers returning off the fell who want something beyond a pub sandwich.
            </p>
            <p>
              The Golden Rule on Smithy Brow (LA22 9AS) is the best pub in Ambleside. No music, no slot machines, no food — just good real ale in unpretentious surroundings. It is a pub that respects what it is and does not try to be something else. Local walkers, tourists who have found it, and people who just want a proper pint.
            </p>
            <p>
              For coffee in the morning, Sarah Nelson's Grasmere Gingerbread on the 555 bus route is technically in Grasmere rather than Ambleside, but if you are walking or cycling north it is worth the stop. Back in Ambleside proper, Lucy's on a Plate on Church Street (LA22 0BU) does reliable breakfasts.
            </p>

            <h2>Accommodation</h2>
            <p>
              Ambleside has a wide range from the Ambleside YHA (LA22 0EU, on the lake at Waterhead) which is well-managed and popular with walking groups, to a number of mid-range hotels and a good selection of B&Bs in the Victorian stone houses around the town centre.
            </p>
            <p>
              The Windermere Lake Cruises ferry arrives and departs from Waterhead pier (LA22 0BB), half a mile south of Ambleside town centre. If you are arriving from Bowness by boat, the walk from the pier into town is straightforward.
            </p>

            <h2>Getting there</h2>
            <p>
              The 555 bus connects Windermere station with Ambleside, Rydal, Grasmere, and Keswick. It runs hourly and is one of the most useful bus routes in the Lakes. The Windermere to Ambleside section takes about 20 minutes. Day Rider tickets give unlimited travel on this and connecting routes.
            </p>
            <p>
              By car, Ambleside is on the A591 between Windermere and Keswick. Parking is in the central car parks off Rydal Road and Kelsick Road (pay and display). Both fill early on summer weekends — arrive by 9am or use the Windermere transport options.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#14231C]">Frequently asked questions</h2>
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-gray-50 rounded-xl p-4">
                <summary className="font-medium text-[#14231C] cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-[#C4782A] text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-4">Explore nearby</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: "/windermere", label: "Windermere", desc: "England's largest lake, 3 miles south" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 4 miles north" },
                { href: "/keswick", label: "Keswick", desc: "Northern Lakes capital" },
                { href: "/coniston", label: "Coniston", desc: "Coniston Water, 8 miles south-west" },
              ].map(({ href, label, desc }) => (
                <Link key={href} href={href} className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <p className="font-semibold text-[#14231C]">{label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
