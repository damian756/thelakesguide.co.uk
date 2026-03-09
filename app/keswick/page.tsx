import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/keswick`;

const faqs = [
  {
    q: "What is there to do in Keswick?",
    a: "Walking is the main activity — Catbells, Skiddaw, and Blencathra are within easy reach. Derwentwater lake cruises. The market on Saturday and Thursday. Good restaurants, outdoor shops, and the Keswick Museum. The Pencil Museum is niche but surprisingly interesting.",
  },
  {
    q: "What is the best walk from Keswick?",
    a: "Catbells is the most popular and with good reason — excellent views over Derwentwater with relatively modest effort. The Latrigg walk above the town is shorter and good for a morning. For a serious day, Skiddaw via the tourist path or Blencathra via Hall's Fell Ridge are the main options.",
  },
  {
    q: "Where should I stay in Keswick?",
    a: "Keswick has a wide range of accommodation from youth hostels to boutique hotels. The Lodore Falls Hotel on Derwentwater is the grand option. More central options include the Derwentwater Independent Hostel and many Victorian B&Bs on the main streets. Book well ahead for weekends and the Keswick Mountain Festival in May.",
  },
  {
    q: "Is Keswick easy to get to without a car?",
    a: "Manageable but requires planning. There is no direct train to Keswick. The nearest station is Penrith (30 minutes by bus) or Windermere (buses run via Ambleside and Grasmere on the 555/X4/X5). The 554 bus from Penrith is the most direct public transport route.",
  },
  {
    q: "When is the Keswick market?",
    a: "Keswick market is held every Thursday and Saturday in the Market Place. A traditional street market with local producers, crafts, and general goods. The Mountain Festival in May brings additional food and specialist markets. Saturday is the bigger of the two regular market days.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Keswick", item: url },
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
    name: "Keswick",
    description: "Keswick is the capital of the northern Lake District. A market town on the shore of Derwentwater with direct access to Skiddaw, Blencathra, and Catbells.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.6014, longitude: -3.1342 },
    address: { "@type": "PostalAddress", addressLocality: "Keswick", postalCode: "CA12 5JB", addressCountry: "GB" },
  },
];

export const metadata: Metadata = {
  title: "Keswick | Restaurants, Walks & Complete Visitor Guide",
  description: "Complete guide to Keswick in the Lake District. Restaurants, walking routes, accommodation, Derwentwater, Catbells, and what to see and do in the northern Lakes.",
  alternates: { canonical: url },
  openGraph: { title: "Keswick Guide | The Lakes Guide", description: "Everything you need for a visit to Keswick. Restaurants, walking, Derwentwater lake cruises, accommodation and what to do.", url, siteName: "The Lakes Guide" },
};

export default function KeswickPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Keswick</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Village guide · Northern Lake District · CA12
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Keswick</h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Keswick is the capital of the northern Lakes. A proper market town with a good range of restaurants, an excellent market on Thursdays and Saturdays, Derwentwater at the bottom of the high street, and Skiddaw visible from most of it. This is where you come to base yourself for the northern fells.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "CA12 5JB", label: "Postcode" },
              { stat: "Thu & Sat", label: "Market days" },
              { stat: "May", label: "Mountain Festival" },
              { stat: "35 min", label: "From Penrith by bus" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>About Keswick</h2>
            <p>
              Keswick sits in the northern Lake District on the River Greta, with Derwentwater at the foot of the town and Skiddaw rising directly to the north. It has been a market town since the 13th century, granted its charter in 1276. The Victorian tourism boom transformed it — the arrival of the railway in 1865 brought middle-class visitors from the industrial cities of the north, and the infrastructure built to accommodate them is still visible in the Victorian B&Bs and hotels that line the main streets.
            </p>
            <p>
              The outdoor industry has always had a presence in Keswick. George Fisher's outdoor shop on Borrowdale Road has been there since 1957 and is one of the best-stocked independent outdoor shops in England. Keswick's main street has a good range of outdoor retailers, cafes, and restaurants, plus the market twice a week. It is a functional town as well as a tourist destination — people live and work here year-round.
            </p>

            <h2>Derwentwater</h2>
            <p>
              Derwentwater is the lake that Keswick sits on, and it is one of the most beautiful. Not the largest — about 3 miles long and 1.25 miles wide — but the setting is exceptional. The surrounding fells come close to the water on all sides: Catbells and the Newlands fells to the west, Borrowdale to the south, Skiddaw and Blencathra to the north.
            </p>
            <p>
              The Keswick Launch runs a regular circuit of the lake from Keswick landing stage (CA12 5DJ) with seven stopping points. The circuit takes about 50 minutes. It is worth doing at least once for the views — particularly the view south toward Borrowdale from the middle of the lake. Individual stops allow you to walk sections of the lake shore and catch the boat back.
            </p>
            <p>
              Friars Crag, a short walk from the town centre along the lake shore, gives the classic view of Derwentwater that has been painted and photographed for 200 years. It is genuinely as good as the pictures suggest. John Ruskin described the view here as one of the three most beautiful in Europe. The trust that owns the land is the National Trust.
            </p>

            <h2>Walking from Keswick</h2>
            <p>
              Catbells is the walk. 451 metres, an hour and a half return from Hawes End (accessed by the Keswick Launch), with views over Derwentwater that are extraordinary for a relatively modest height. The final scramble to the summit is hands-on but not technical. One of the most popular fell walks in the Lake District, and one of the best introductions to fell walking for people who have not done it before.
            </p>
            <p>
              Skiddaw is the serious day. 931 metres, the fourth-highest fell in England. The tourist path from the Latrigg car park (CA12 5JR, free) takes the direct north line to the summit. Around 8 miles return with 900 metres of ascent. A good, long day with good views. Blencathra, 868 metres, is the dramatic alternative — the Hall's Fell Ridge approach is one of the finest ridge walks in the northern Lakes.
            </p>
            <p>
              Latrigg, directly above the town, is a 30-minute walk with a view that surprises people. The summit at 369 metres gives a panoramic view of Skiddaw, Derwentwater, and the Borrowdale valley that most people drive past without stopping for. The path starts from the Latrigg car park. An early morning walk in autumn, with the valley below in mist, is particularly good.
            </p>

            <h2>Where to eat</h2>
            <p>
              The Square Orange on St John's Street (CA12 5AG) is the most reliable cafe in Keswick for breakfast and lunch. Full English breakfasts, good coffee, reliable food. Often busy — arrive early or expect a wait. The Platty+ on Lake Road (CA12 5DQ) is a good lunch option, particularly for the lakeside setting.
            </p>
            <p>
              For an evening meal, Morrels on Lake Road (CA12 5BX) is the consistently recommended restaurant — modern British, locally sourced, with a wine list that actually has thought put into it. The Dog and Gun on Lake Road (CA12 5AT) is the right pub: proper Cumbrian pub food, real ale, and a layout that works for walkers and families. No pretensions, no disappointing food.
            </p>
            <p>
              The Keswick Brewing Company produces good beer. It is available in several local pubs and the tap room at the brewery. The Pheasant Inn at Bassenthwaite Lake (CA13 9YE), about 6 miles north, is worth the drive for Sunday lunch — a proper Cumbrian country pub with food that matches.
            </p>

            <h2>The market</h2>
            <p>
              Keswick market is held every Thursday and Saturday in the Market Place, in the pedestrianised centre of the town. The Saturday market is the bigger of the two. Local producers with meat, cheese, and vegetables. Crafts. General market goods. The Mountain Festival in May adds a specialist food market and outdoor equipment stalls that attract visitors specifically for the weekend.
            </p>

            <h2>Keswick Mountain Festival</h2>
            <p>
              The Keswick Mountain Festival is held in May, typically the third weekend, and brings together outdoor enthusiasts from across the country. Film screenings, talks from expedition climbers, guided walks, live music, and a large food market. It is one of the more enjoyable events in the Lakes calendar and does not require any particular interest in competitive mountaineering to enjoy. The atmosphere in the town during festival weekend is good.
            </p>

            <h2>Parking</h2>
            <p>
              Keswick has several car parks. The main one is at Lakeside (CA12 5DJ, large, pay and display) near the boat landing stage. The central car parks off Main Street are smaller and fill early on busy days. The Headlands car park (CA12 5ER) is a short walk from the market. On summer weekends, parking can be difficult by 10am. Arriving before 9am or using the Park and Ride service on the Penrith road is the reliable alternative.
            </p>

            <h2>What else to see</h2>
            <p>
              The Keswick Museum on Station Road (CA12 4NF, free entry) has a good collection covering the area's history, the pencil and graphite industry that was central to Keswick's economy from the 16th century, and the local arts and literary connections — Wordsworth, Coleridge, and Southey all had connections to the area.
            </p>
            <p>
              The Pencil Museum on Southey Works (CA12 5NG, entrance charged) is the dedicated museum of the Cumberland Pencil Company. It sounds like a niche interest and it is, but the story of the world's pencil industry having its origins in the graphite deposits of Borrowdale is genuinely interesting. Worth an hour if it is raining.
            </p>
            <p>
              Castlerigg Stone Circle (CA12 4RN, free, National Trust) is three miles east of Keswick. A Neolithic stone circle of 38 standing stones in a field with a 360-degree fell panorama. One of the earliest stone circles in England, predating Stonehenge. It is free to visit and is worth 30 minutes at any time of year.
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
                { href: "/ambleside", label: "Ambleside", desc: "Southern Lakes walking hub" },
                { href: "/windermere", label: "Windermere", desc: "England's largest lake" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 30 minutes south" },
                { href: "/coniston", label: "Coniston", desc: "Coniston Water and the Old Man" },
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
