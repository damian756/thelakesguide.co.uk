import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/windermere`;

const faqs = [
  {
    q: "What is there to do in Windermere?",
    a: "Lake cruises on the Windermere Steamers. Walking — Orrest Head for the classic view, or the Windermere Way around the lake. Good restaurants and pubs in both Windermere town and Bowness. The Windermere Jetty Museum for lake history.",
  },
  {
    q: "Is Windermere a town or a lake?",
    a: "Both. Windermere town sits on the ridge above the lake, about a mile from the shore. Bowness-on-Windermere is the lakefront settlement. The two are effectively one place. Most visitors end up in Bowness; Windermere town has the train station.",
  },
  {
    q: "Where should I stay in Windermere or Bowness?",
    a: "Windermere town is quieter and has good transport links — the Windermere station is on the branch from Oxenholme. Bowness is on the lake, louder, with more hotels. Both have a wide range of accommodation from B&Bs to full hotels. Book ahead in summer.",
  },
  {
    q: "How do I get to Windermere without a car?",
    a: "The Windermere branch line runs from Oxenholme on the West Coast Main Line. Regular services from London Euston change at Oxenholme. Trains also run from Leeds and Manchester via Oxenholme. The station is in Windermere town, about a mile from Bowness and the lake.",
  },
  {
    q: "What is the Windermere Jetty Museum?",
    a: "The Windermere Jetty Museum is a boat museum on the lake shore in Bowness (LA23 3HQ). It houses a collection of historic wooden boats from the lake's history, including some of the oldest mechanically powered boats in the world. The building itself is architecturally interesting. Worth an hour or two.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Windermere", item: url },
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
    name: "Windermere",
    description: "Windermere is England's largest natural lake and the main visitor hub for the Lake District. The town and Bowness-on-Windermere sit on the eastern shore.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.3774, longitude: -2.9074 },
    address: { "@type": "PostalAddress", addressLocality: "Windermere", postalCode: "LA23 1AQ", addressCountry: "GB" },
  },
];

export const metadata: Metadata = {
  title: "Windermere | Restaurants, Things to Do & Visitor Guide",
  description: "Complete visitor guide to Windermere and Bowness. Restaurants, lake cruises, accommodation, parking, and what to do in England's largest lake district town.",
  alternates: { canonical: url },
  openGraph: { title: "Windermere Guide | The Lakes Guide", description: "Everything you need to visit Windermere and Bowness-on-Windermere. Restaurants, walks, lake cruises, accommodation.", url, siteName: "The Lakes Guide" },
};

export default function WindermerePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Windermere</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Village guide · Lake District · LA23
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Windermere</h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              England's largest natural lake, and the busiest tourist destination in the Lake District. That is not necessarily a criticism. Windermere handles the crowds better than most places and there is genuinely a lot to do here. The trick is knowing what is worth your time.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "LA23 1AQ", label: "Town postcode" },
              { stat: "10.5 miles", label: "Lake length" },
              { stat: "Train", label: "Direct from London" },
              { stat: "Year-round", label: "Open for visitors" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Windermere town and Bowness</h2>
            <p>
              Windermere the town and Bowness-on-Windermere are effectively one settlement, about a mile apart on the eastern shore of the lake. The railway brought Victorian tourists here in the 1840s and the infrastructure that built up around that trade is still largely intact. Windermere station is the terminus of the branch from Oxenholme — the only train service into the national park. Bowness is on the lake shore, the place with the piers, the boat hire, and the ice cream.
            </p>
            <p>
              Most visitors spend their time in Bowness. The promenade, the Windermere Steamers pier, the cluster of shops and restaurants on the waterfront — this is where the action is. Windermere town itself is more residential, with good cafes and restaurants, a useful supermarket, and the station. If you are arriving by train, you arrive in Windermere town and either walk or take a bus to the lake.
            </p>
            <p>
              The lake is the main event. England's largest natural lake at 10.5 miles long. Significantly deeper than it looks from the shore — up to 67 metres in places. The western shore is quieter and less developed, accessible by the Windermere Steamers to the ferry crossing at Ferry House or by boat.
            </p>

            <h2>Getting around</h2>
            <p>
              Windermere is the most accessible Lake District destination without a car. The train from London Euston changes at Oxenholme (approximately 2.5 hours). Trains also run from Manchester Piccadilly and Leeds via Oxenholme. The branch line from Oxenholme to Windermere takes about 20 minutes.
            </p>
            <p>
              The 599 bus service runs along the main Windermere to Grasmere road, connecting Windermere station, Bowness, Ambleside, and Grasmere. This is the main visitor bus route in the southern Lakes. It runs frequently in summer and allows car-free exploration of the valley.
            </p>
            <p>
              If you are driving, the main car parks are at Braithwaite Fold (LA23 3LH, large, 5 minutes from Bowness), Rayrigg Road (LA23 1DG, smaller, closer to the front), and along Glebe Road. All are pay and display. The town car parks fill by 11am on summer weekends. Park early or use the Braithwaite Fold and walk.
            </p>

            <h2>The lake</h2>
            <p>
              The Windermere Lake Cruises operate ferry and cruise services from three piers: Bowness pier (LA23 3HQ), Waterhead pier at Ambleside (LA22 0BB), and Lakeside pier at the southern end (LA12 8AS). The service connects these three points and allows car-free travel the length of the lake. A day ticket covers unlimited travel.
            </p>
            <p>
              The cruise from Bowness to Waterhead at Ambleside (around 35 minutes) is one of the better ways to see the lake from water level. The western shore is undeveloped above the treeline, and the reflection of the surrounding fells on a still morning is genuinely impressive. The southern cruise to Lakeside takes about 45 minutes and connects with the steam railway at Haverthwaite.
            </p>
            <p>
              Kayak and paddleboard hire is available from several operators on the Bowness foreshore. Electric boat hire (quiet, no licence required, good for close-in lake exploration) is available at several points. Wild swimming is possible at Millerground (LA23 1QF) on the east shore — a small beach with lake access that is popular in summer.
            </p>

            <h2>Orrest Head</h2>
            <p>
              Orrest Head is the viewpoint that defined the Lake District for generations. Alfred Wainwright first saw the Lake District from Orrest Head in 1930 and it changed his life. The view from the summit takes in the full length of Windermere with the Coniston Fells and the central Lake District peaks behind. It is not a difficult walk — 45 minutes return from Windermere station, 238 metres above sea level — and it is one of the best introductory views in the national park.
            </p>
            <p>
              The path starts opposite Windermere station (LA23 1AB). Follow the signed path up through the woodland and onto the summit. Take the right-hand path where it splits to reach the summit cairn and the best view. The wooden shelter at the top is a good place to stop. The view is worth it even in cloud — something usually clears.
            </p>

            <h2>Walking routes</h2>
            <p>
              Beyond Orrest Head, the Windermere Way is a 40-mile circular route around the entire lake. This is a multi-day walk, typically done in 3 to 4 days. It is not as demanding as the fell routes — it follows the lake shore and woodland paths for much of its length — but it gives a complete picture of the lake that day visitors rarely see.
            </p>
            <p>
              The Claife Heights are the woodland and moorland above the western shore, accessed from the ferry landing at Near Sawrey (LA22 0JZ). The walk from the ferry to the Heights and back gives views over the lake from the western side and is a quieter alternative to the busy eastern shore. The Victorian-era interpretation centre at Claife Station, restored by the National Trust, is worth a look.
            </p>

            <h2>Where to eat</h2>
            <p>
              The restaurants in Bowness range from solid to excellent. The Porthole on Ash Street (LA23 3EB) is one of the better small restaurants — Italian-influenced, locally sourced, good wine list. Book ahead at weekends. The Crafty Baa on Lake Road has a good craft beer and food offer. On the lake front, the cafes around the pier are predictable tourist food but some are reasonable for lunch.
            </p>
            <p>
              In Windermere town, Francine's on Main Road (LA23 1DX) is consistently good for an evening meal — modern British with local ingredients. The pubs in Windermere town are generally better than the equivalents in Bowness for food quality. The Royal Oak on Market Square is reliable and unpretentious.
            </p>
            <p>
              For a proper Lake District tearoom, the Windermere Jetty Museum cafe (LA23 3HQ) on the lake front is worth knowing about. Better than the average museum cafe, and the setting gives views over the lake.
            </p>

            <h2>Windermere Jetty Museum</h2>
            <p>
              The Windermere Jetty Museum (LA23 3HQ, entrance charged) houses the national collection of historic boats from the lake. The collection includes Dolly, the world's oldest mechanically powered boat, built in 1850 and recovered from the lake bed in 1962. The architecture of the museum building itself, designed by Carmody Groarke, is controversial locally but interesting. Worth 90 minutes if you have any interest in engineering, design, or social history.
            </p>

            <h2>Accommodation</h2>
            <p>
              The Windermere and Bowness area has the highest density of accommodation in the Lake District. This ranges from budget B&Bs to boutique hotels. Bowness is where most of the lake-view accommodation is. The Belsfield Hotel (LA23 3EL) is one of the grander options with lake views and gardens. Cedar Manor Hotel (LA23 1AX) in Windermere town is a reliable choice without the Bowness premium.
            </p>
            <p>
              Self-catering cottages and apartments in the villages south of Bowness — Bowness itself, Storrs, and Ings — give a more residential experience. Sykes Cottages and Hoseasons both have large inventories in the area.
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
                { href: "/ambleside", label: "Ambleside", desc: "3 miles north, the walking hub" },
                { href: "/keswick", label: "Keswick", desc: "Northern capital, Derwentwater, Skiddaw" },
                { href: "/coniston", label: "Coniston", desc: "John Ruskin, Coniston Water, Old Man" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, fell walks" },
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
