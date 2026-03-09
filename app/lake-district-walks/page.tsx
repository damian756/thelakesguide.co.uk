import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/lake-district-walks`;

const faqs = [
  {
    q: "What is the best walk in the Lake District for beginners?",
    a: "Catbells above Keswick. Accessible, short (2 to 3 hours return from Hawes End jetty), with excellent views over Derwentwater. Loughrigg Fell above Ambleside is another good starter. Both give a proper fell experience without the commitment of the higher mountains.",
  },
  {
    q: "What is the best walk in the Lake District?",
    a: "Striding Edge on Helvellyn is the most celebrated route. The Fairfield Horseshoe from Ambleside, the Coniston Fells circuit, and the Buttermere round (Red Pike, High Stile, High Crag, Haystacks) are all serious contenders. It depends what you want from a day in the hills.",
  },
  {
    q: "How do I get to Scafell Pike?",
    a: "The most popular route is from Wasdale Head (CA20 1EX, NT car park). 5.6 miles return, 900m ascent, 5 to 6 hours. The Langdale route via Esk Hause is longer but wilder. Start early. The summit gets busy in summer and the weather can change fast.",
  },
  {
    q: "What should I bring for a Lake District walk?",
    a: "Proper waterproofs (jacket and trousers). Boots with ankle support and grip. A map and compass. Phone GPS is unreliable in mist and runs out of charge at the wrong moment. Water and food for the full day. A warm layer for summits even in summer. The weather changes fast.",
  },
  {
    q: "Are Lake District walks suitable for families with children?",
    a: "Many are. Easedale Tarn from Grasmere, Tarn Hows near Coniston (essentially flat), the lake circuits at Windermere and Grasmere, and Catbells with the boat approach are all appropriate for children. The high fells require full adult fitness and navigation ability.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Lake District Walks Guide",
    description: "The best walks in the Lake District. Routes for beginners, family walks, and serious fell days. Practical information on what to bring, how to prepare, and where to start.",
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
  title: "Lake District Walks | Best Routes for All Abilities",
  description: "The best walks in the Lake District. Easy family walks, beginner fells, and serious mountain days. Practical routes for Scafell Pike, Helvellyn, Catbells, and the Fairfield Horseshoe.",
  alternates: { canonical: url },
  openGraph: { title: "Lake District Walks | The Lakes Guide", description: "Best Lake District walks for all abilities. Routes, practical info, and what to bring.", url, siteName: "The Lakes Guide" },
};

export default function LakeDistrictWalksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Lake District walks</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Walking guide · Lake District
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Lake District Walks
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              I have walked in the Lakes in every season, in every kind of weather, with kids, with dogs, and on my own. The walking here is exceptional. It also requires genuine preparation. Weather changes fast. Navigation on the high tops matters. This guide covers the routes worth doing and the things worth knowing before you go.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "214", label: "Wainwright fells" },
              { stat: "OL4–OL7", label: "OS Explorer maps" },
              { stat: "mwis.org.uk", label: "Best forecast" },
              { stat: "Year-round", label: "Walking season" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>Getting started: what you need to know</h2>
            <p>
              The Lake District fells are not difficult, but they require respect. The weather changes fast. A clear morning can produce mist and rain by afternoon, turning a straightforward ridge into a navigation problem. The Ordnance Survey 1:25,000 maps (Explorer OL4, OL5, OL6, and OL7 cover most of the national park) are the standard planning tool. A compass. Proper waterproof clothing. Good boots with ankle support and a sole that grips wet rock.
            </p>
            <p>
              Mountain Weather Information Service (MWIS) at mwis.org.uk gives the best fell-specific weather forecast, broken down by area. Check it the morning of your walk, not the day before. The Met Office Mountain forecast is also good. If the forecast shows severe wind and low cloud on the high tops, choose a lower route.
            </p>

            <h2>Easy walks and family routes</h2>
            <p>
              Tarn Hows near Coniston (LA21 8DP, NT car park) is one of the most accessible scenic walks in the Lake District. A 3-mile circuit around an artificial tarn in a setting of mature woodland and fell views. Mostly flat and suitable for pushchairs on the main path. The autumn colours are exceptional.
            </p>
            <p>
              The Grasmere lake circuit is 4 miles of flat, varied walking along the lake shore and through the valley meadows. Start from the village car park and follow the public footpath south along the eastern shore, cross the River Rothay at Miller Bridge, and return along the western shore. About 1.5 to 2 hours. Good for all ages.
            </p>
            <p>
              Easedale Tarn from Grasmere is the ideal family introduction to the mountains. The path climbs steadily up Easedale Valley with a waterfall (Sour Milk Gill) providing entertainment midway. The tarn at 280 metres is the destination. Around 3.5 miles return with 280 metres of ascent. Allow 2 to 2.5 hours. The children will want to throw stones in the tarn. Let them.
            </p>
            <p>
              Stock Ghyll Force from Ambleside is a short woodland waterfall walk (20 minutes from the market place) that families can use as a morning warm-up before moving on. Not a destination in itself but worth the legs for the falls.
            </p>

            <h2>Beginner fells</h2>
            <p>
              Catbells above Keswick is the introductory fell walk. 451 metres, 2 to 3 hours return via Hawes End (take the Keswick Launch across Derwentwater). The path is clear and the final scramble to the summit requires hands but not technical ability. The views over Derwentwater from the ridge are outstanding. Go early on summer weekends to avoid the crowd.
            </p>
            <p>
              Loughrigg Fell above Ambleside is a slightly less famous but equally good starter fell. 335 metres, 2 to 3 hours from Ambleside, with views over Windermere and the surrounding fells. The summit plateau is larger than it looks from below and exploring the different viewpoints adds interest.
            </p>
            <p>
              Hallin Fell on the east side of Ullswater is a short, distinctive fell directly above the lake. The path from Martindale church (CA10 2RD) to the summit takes 30 minutes. The view down to Ullswater from the rocky summit is one of the best in the eastern Lakes for the effort involved.
            </p>

            <h2>Classic fell days</h2>
            <p>
              The Fairfield Horseshoe from Ambleside is the most celebrated circuit in the eastern Lakes. 10 miles with 900 metres of ascent, taking in Nab Scar, Heron Pike, Great Rigg, Fairfield, Hart Crag, Dove Crag, and Low Pike. Allow 6 to 7 hours. A demanding but not technical day on good paths throughout.
            </p>
            <p>
              The Langdale Pikes (Harrison Stickle, Pike o'Stickle, Pavey Ark) from Old Dungeon Ghyll (LA22 9JX) is a half-day that feels like a proper mountain day. Around 5 to 6 miles with 750 metres of ascent, including the optional Jack's Rake scramble on Pavey Ark. Allow 5 to 6 hours for the full circuit.
            </p>
            <p>
              The Coledale Horseshoe from Braithwaite near Keswick takes in Grisedale Pike, Hopegill Head, Eel Crag, Sail, Scar Crags, and Causey Pike. Around 10 miles with 1,100 metres of ascent. Allow 6 to 7 hours. One of the best circuit walks in the north-western fells, consistently underrated compared to the central Lakes routes.
            </p>
            <p>
              The Buttermere round combines Red Pike, High Stile, High Crag, and Haystacks with a start and finish at Buttermere (CA13 9XA). Adding Haystacks (Wainwright's favourite fell) makes this around 9 miles with 1,100 metres of ascent. Allow 7 to 8 hours. The combination of high-level ridge walking and two lakes in the valley below is outstanding.
            </p>

            <h2>The big days</h2>
            <p>
              Helvellyn via Striding Edge (from Glenridding, CA11 0PD) is the walk that most experienced walkers in England eventually do. 950 metres, 8 miles, 6 to 7 hours. Striding Edge is exposed and requires hands in places but is not technical in dry conditions. In ice or mist it requires care and navigation skill. The summit view, including the dramatic corrie holding Red Tarn below, is exceptional.
            </p>
            <p>
              Scafell Pike from Wasdale Head (CA20 1EX) is the obligatory tick — England's highest point at 978 metres. 5.6 miles return, 900 metres of ascent, 5 to 6 hours. The path is rough and the summit plateau requires compass work in mist. Start early and carry more water than you think you need.
            </p>
            <p>
              The Kentmere Horseshoe is the full traverse of the far eastern fells — Yoke, Ill Bell, Froswick, Thornthwaite Crag, High Street, Mardale Ill Bell, Harter Fell, Kentmere Pike — from Kentmere village (LA8 9JL). Around 12 to 14 miles with 1,200 metres of ascent. Allow 7 to 8 hours. Consistently excellent high-level ridge walking in the least-visited part of the national park.
            </p>

            <h2>What to bring</h2>
            <p>
              Waterproof jacket and waterproof overtrousers. Insulating layer: a fleece or down jacket that goes in the rucksack for summits and stops. Walking boots, not trainers: the ankle support and sole grip matter on wet or rocky ground. A printed OS map (phone GPS is unreliable in cloud and dies in the cold) and a compass. Water — at least 1 litre per person for a half-day, 2 litres for a full day. Food — enough for the planned duration plus an unplanned hour. A first aid kit.
            </p>
            <p>
              The navigation tools: 1:25,000 OS Explorer maps cover the national park in four sheets (OL4, OL5, OL6, OL7). The Harvey Superwalker maps are an alternative for those who prefer a cleaner fell-walking specific format. A silva or similar baseplate compass and the ability to take a bearing from the map and follow it in poor visibility is the essential skill that separates walkers who get into trouble from those who do not.
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
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-4">Related guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: "/dog-friendly-lake-district", label: "Dog-friendly Lake District", desc: "Walks, pubs, and practical advice with a dog" },
                { href: "/lake-district-with-kids", label: "Lake District with Kids", desc: "What actually works with children" },
                { href: "/rainy-day-lake-district", label: "Rainy Day Options", desc: "When the weather turns — the plan" },
                { href: "/keswick", label: "Keswick", desc: "Northern fells, Derwentwater, Catbells" },
                { href: "/ambleside", label: "Ambleside", desc: "Best walking base in the Lakes" },
                { href: "/coniston", label: "Coniston", desc: "Old Man, Brantwood, Tarn Hows" },
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
