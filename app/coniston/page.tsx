import type { Metadata } from "next";
import Link from "next/link";

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
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Coniston</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Village guide · Southern Lake District · LA21
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Coniston</h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Coniston is quieter than Windermere, less well-known than Grasmere, and for my money one of the more rewarding places in the southern Lakes. The Old Man rises directly above the village. The lake is long and beautiful. Brantwood is worth half a day. The Black Bull brews its own beer.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "LA21 8EH", label: "Postcode" },
              { stat: "5 miles", label: "Coniston Water length" },
              { stat: "803m", label: "Coniston Old Man" },
              { stat: "8 miles", label: "From Ambleside" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>About Coniston</h2>
            <p>
              Coniston is a small village in the southern Lake District, sitting at the foot of Coniston Old Man with the lake, Coniston Water, stretching south. It is a working village as much as a tourist one — there was copper mining here for centuries, and the Old Man is covered in the remains of the industry. The village has a church, a handful of pubs and cafes, and a good range of outdoor shops.
            </p>
            <p>
              The three figures who define Coniston's cultural identity are John Ruskin, Arthur Ransome, and Donald Campbell. Ruskin lived at Brantwood on the eastern shore from 1872 until his death in 1900. Ransome set key parts of his Swallows and Amazons children's books in the Coniston area, and the lake appears thinly disguised in the books. Campbell died here in 1967, attempting the world water speed record on Bluebird K7. His body and the remains of the boat were recovered from the lake in 2001.
            </p>

            <h2>Coniston Old Man</h2>
            <p>
              The Old Man rises to 803 metres and is the fell that defines the village. The main ascent from the village via the quarry path climbs through the working history of the fell — copper ore spoil tips, slate quarry remains, an old reservoir for the machinery. The path is clear and well-maintained. At 600 metres it passes Low Water, a dark tarn in a hollow below the summit. The summit itself is a spacious plateau with a triangulation pillar and views east to Coniston Water and south to Morecambe Bay.
            </p>
            <p>
              The circuit via Goat's Water and Dow Crag is a significantly better day. From the village, head west to Goat's Water, a cold dark tarn below the eastern face of Dow Crag. The crag itself is a major rock climbing venue — the east face is one of the great cliff faces in the southern Lakes. Walk under the face, cross the ridge to the Old Man, and descend via the quarry path. Around 7 miles with 900 metres of ascent. Allow 5 to 6 hours.
            </p>

            <h2>Brantwood</h2>
            <p>
              Brantwood (LA21 8AD) is on the eastern shore of Coniston Water, accessible by road via the B5285 from Coniston village or by boat on the Coniston Launch. John Ruskin bought the house in 1871 and spent the last 28 years of his life here, extending the house, creating the gardens, and producing some of his later writing on economics, art criticism, and social reform.
            </p>
            <p>
              The house contains original furniture and artworks, including Ruskin's own drawings and paintings. The collection is significant and the interpretation is good. The gardens, which Ruskin designed with an unconventional approach that included terraced bog gardens and a wild fell garden above the house, are excellent in spring and summer.
            </p>
            <p>
              Entrance is charged. Allow 2 to 3 hours for the house, garden, and the walk along the lake shore from the Brantwood jetty. The cafe at Brantwood is reasonable. The Coniston Launch runs from Coniston pier to Brantwood regularly — combining the boat trip with the Brantwood visit removes the need to drive the eastern shore road.
            </p>

            <h2>Tarn Hows</h2>
            <p>
              Tarn Hows (LA21 8DP, National Trust, charged parking) is 3 miles north-east of Coniston and is one of the most visited National Trust locations in England. The tarn is artificial — created in the Victorian era by damming a series of small tarns — but the setting is outstanding. The circuit path around the tarn is about 3 miles on mostly flat, good-quality paths. Suitable for wheelchairs and pushchairs on the main circuit.
            </p>
            <p>
              Tarn Hows is busy in summer. Arrive before 10am or visit in late afternoon. The autumn colours around the tarn are exceptional and October is the best time for the combination of colour, light, and manageable crowds.
            </p>

            <h2>Coniston Water and the lake</h2>
            <p>
              Coniston Water is 5 miles long and one of the quieter major lakes. There is no road along most of the western shore, giving it a more remote feel than Windermere. The Coniston Launch runs regular cruises from the pier at Coniston village (LA21 8AJ) to Brantwood and other points on the lake. A circuit cruise takes about 90 minutes.
            </p>
            <p>
              The lake is good for wildlife in winter — goldeneye and goosander both occur, and red squirrels are present in the woodland above the western shore. The steam yacht Gondola, operated by the National Trust, runs from May to October and is one of the most comfortable ways to see the lake.
            </p>

            <h2>Where to eat and drink</h2>
            <p>
              The Black Bull Inn on Yewdale Road (LA21 8DU) is the most important pub in Coniston. It has brewed its own beer since 2003, starting with Bluebird Bitter and expanding to a range of Coniston ales. The food is honest pub food done consistently well. It is the right pub for this part of the Lakes.
            </p>
            <p>
              The Sun Hotel on the edge of the village (LA21 8HQ) serves food and has a pleasant garden. The Bluebird Cafe near the pier gives lake views and is a reasonable option for lunch before a boat trip. Yew Tree Farm at Coniston (LA21 8DP), near Tarn Hows, serves teas and does accommodation — one of the most characterful farm cafe settings in the southern Lakes.
            </p>

            <h2>Getting there</h2>
            <p>
              The 505 bus runs from Ambleside and Windermere to Coniston. The service runs roughly every 90 minutes to 2 hours. By car, Coniston is on the A593 from Ambleside or via the B5285 from Hawkshead. Main car parking is in the village car park on Yewdale Road (LA21 8EH, pay and display). It fills on summer weekends — arrive early.
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
                { href: "/ambleside", label: "Ambleside", desc: "8 miles north, central Lakes hub" },
                { href: "/windermere", label: "Windermere", desc: "England's largest lake" },
                { href: "/grasmere", label: "Grasmere", desc: "Wordsworth country, 12 miles north" },
                { href: "/keswick", label: "Keswick", desc: "Northern Lakes capital" },
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
