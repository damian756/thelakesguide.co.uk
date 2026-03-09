import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mountain, AlertTriangle, MapPin, Clock, ArrowUpRight, CheckCircle2, ArrowRight } from "lucide-react";

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

const easyWalks = [
  {
    name: "Tarn Hows Circuit",
    start: "LA21 8DP",
    distance: "3 miles",
    ascent: "Minimal",
    time: "1.5 hrs",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80",
    description: "A 3-mile circuit around an artificial tarn near Coniston, in a setting of mature woodland and fell views. Mostly flat and suitable for pushchairs on the main path. The autumn colours are exceptional.",
    note: "NT car park. Fills early on summer weekends.",
  },
  {
    name: "Grasmere Lake Circuit",
    start: "LA22 9QT",
    distance: "4 miles",
    ascent: "Minimal",
    time: "2 hrs",
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=600&q=80",
    description: "Flat walking along the lake shore and through the valley meadows. Start from Grasmere village car park, follow the public footpath south along the eastern shore, cross the River Rothay at Miller Bridge, return along the western shore. Good for all ages.",
    note: "Start from Grasmere village car park.",
  },
  {
    name: "Easedale Tarn",
    start: "LA22 9QT",
    distance: "3.5 miles",
    ascent: "280m",
    time: "2.5 hrs",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
    description: "The ideal family introduction to the mountains. The path climbs steadily up Easedale Valley with Sour Milk Gill waterfall midway. The tarn at 280 metres is the destination. The children will want to throw stones in the tarn. Let them.",
    note: "From Grasmere village. Clear, signed path throughout.",
  },
  {
    name: "Stock Ghyll Force",
    start: "LA22 0DB",
    distance: "1.5 miles",
    ascent: "70m",
    time: "45 mins",
    image: "https://images.unsplash.com/photo-1546430498-f6b45e5b35ca?w=600&q=80",
    description: "A short woodland waterfall walk from Ambleside market place. The falls drop about 70 feet through mature Victorian-era woodland. A good morning warm-up before moving on. Not a destination in itself but worth the legs for the falls.",
    note: "20 minutes from Ambleside market place.",
  },
];

const beginnerFells = [
  {
    name: "Catbells",
    summit: "451m",
    start: "Hawes End jetty (Keswick Launch)",
    distance: "3 miles",
    ascent: "430m",
    time: "2.5 hrs",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    description: "The introductory fell walk. The path is clear and the final scramble to the summit requires hands but not technical ability. Views over Derwentwater from the ridge are outstanding. Take the Keswick Launch across Derwentwater to Hawes End for the classic approach.",
    note: "Go early on summer weekends — busy by 10am.",
  },
  {
    name: "Loughrigg Fell",
    summit: "335m",
    start: "Rothay Park, Ambleside",
    distance: "4 miles",
    ascent: "320m",
    time: "2.5 hrs",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
    description: "A slightly less famous but equally good starter fell above Ambleside. The summit plateau is larger than it looks from below and exploring the different viewpoints adds interest. Views over Windermere and the surrounding fells. A good orientation walk on a first visit.",
    note: "Multiple ascent routes from Ambleside, Grasmere and Skelwith Bridge.",
  },
  {
    name: "Hallin Fell",
    summit: "388m",
    start: "CA10 2RD",
    distance: "2 miles",
    ascent: "240m",
    time: "1.5 hrs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    description: "A short, distinctive fell directly above Ullswater on the eastern side. The path from Martindale church to the summit takes 30 minutes. The view down to Ullswater from the rocky summit is one of the best in the eastern Lakes for the effort involved.",
    note: "From Martindale church car park, CA10 2RD. Small and fills early.",
  },
];

const classicFells = [
  {
    name: "Fairfield Horseshoe",
    start: "Ambleside, LA22 0DB",
    distance: "10 miles",
    ascent: "900m",
    time: "6–7 hrs",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    description: "The most celebrated circuit in the eastern Lakes. Takes in Nab Scar, Heron Pike, Great Rigg, Fairfield, Hart Crag, Dove Crag, and Low Pike. A demanding but not technical day on good paths throughout. Starts and ends in Ambleside.",
    note: "Demanding but on clear paths throughout. No technical sections.",
  },
  {
    name: "Langdale Pikes",
    start: "Old Dungeon Ghyll, LA22 9JX",
    distance: "5.5 miles",
    ascent: "750m",
    time: "5–6 hrs",
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=600&q=80",
    description: "Harrison Stickle, Pike o'Stickle, Pavey Ark from Old Dungeon Ghyll. A half-day that feels like a proper mountain day. The optional Jack's Rake scramble on Pavey Ark adds serious interest for those with scrambling experience.",
    note: "Jack's Rake requires scrambling ability and is not suitable in wet conditions.",
  },
  {
    name: "Coledale Horseshoe",
    start: "Braithwaite, CA12 5RY",
    distance: "10 miles",
    ascent: "1,100m",
    time: "6–7 hrs",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    description: "Grisedale Pike, Hopegill Head, Eel Crag, Sail, Scar Crags, and Causey Pike from the village of Braithwaite near Keswick. One of the best circuit walks in the north-western fells, consistently underrated compared to the central Lakes routes.",
    note: "Starts from Braithwaite, 2 miles from Keswick. Limited parking.",
  },
  {
    name: "Buttermere Round",
    start: "Buttermere, CA13 9XA",
    distance: "9 miles",
    ascent: "1,100m",
    time: "7–8 hrs",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    description: "Red Pike, High Stile, High Crag, and Haystacks (Wainwright's favourite fell) in one circuit, starting and finishing in Buttermere. The combination of high-level ridge walking and two lakes in the valley below is outstanding.",
    note: "Allow a full day. Haystacks can be left for a separate short day if needed.",
  },
];

const bigDays = [
  {
    name: "Helvellyn via Striding Edge",
    start: "Glenridding, CA11 0PD",
    distance: "8 miles",
    ascent: "950m",
    time: "6–7 hrs",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
    description: "The walk that most experienced walkers in England eventually do. Striding Edge is exposed and requires hands in places but is not technical in dry conditions. In ice or mist it requires care and navigation skill. The summit view, including the dramatic corrie holding Red Tarn, is exceptional.",
    warning: "Striding Edge requires care in ice or mist. Assess conditions before committing.",
  },
  {
    name: "Scafell Pike",
    start: "Wasdale Head, CA20 1EX",
    distance: "5.6 miles",
    ascent: "900m",
    time: "5–6 hrs",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80",
    description: "England's highest point at 978 metres. The path from Wasdale Head is rough and the summit plateau requires compass work in mist. Start early and carry more water than you think you need. The Langdale route via Esk Hause is longer but quieter.",
    warning: "Summit plateau requires compass navigation in poor visibility. Busy in summer.",
  },
  {
    name: "Kentmere Horseshoe",
    start: "Kentmere, LA8 9JL",
    distance: "13 miles",
    ascent: "1,200m",
    time: "7–8 hrs",
    image: "https://images.unsplash.com/photo-1546430498-f6b45e5b35ca?w=600&q=80",
    description: "The full traverse of the far eastern fells: Yoke, Ill Bell, Froswick, Thornthwaite Crag, High Street, Mardale Ill Bell, Harter Fell, Kentmere Pike. Consistently excellent high-level ridge walking in the least-visited part of the national park.",
    warning: "Remote. Limited escape routes. Plan the route and check the forecast carefully.",
  },
];

const gearItems = [
  { icon: "🧥", title: "Waterproofs", desc: "Jacket and overtrousers. Not a shower jacket. Proper waterproofs that will hold in sustained rain." },
  { icon: "👟", title: "Walking boots", desc: "Not trainers. Ankle support and a sole that grips wet rock. The two things that prevent most incidents on the fells." },
  { icon: "🗺️", title: "OS Map + compass", desc: "1:25,000 OS Explorer: OL4, OL5, OL6, OL7 cover the national park. Harvey Superwalker maps are an alternative. Printed." },
  { icon: "🌤️", title: "Weather forecast", desc: "MWIS at mwis.org.uk gives the best fell-specific forecast. Check it the morning of your walk, not the day before." },
  { icon: "💧", title: "Water", desc: "1 litre per person minimum for a half-day. 2 litres for a full day. More in warm conditions." },
  { icon: "🎒", title: "Food + warm layer", desc: "Enough food for the planned duration plus an unplanned hour. A fleece or down jacket for summits and rest stops." },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Lake District Walks Guide",
    description: "The best walks in the Lake District. Routes for beginners, family walks, and serious fell days. Practical information on what to bring, how to prepare, and where to start.",
    url,
    author: { "@type": "Person", name: "Damian Roche", url: BASE_URL },
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

        {/* ── Hero ── */}
        <section className="relative min-h-[480px] flex items-end text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=80"
            alt="Walking on the Lake District fells"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative container mx-auto px-4 max-w-6xl pb-12 pt-32">
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Lake District walks</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Walking guide · Lake District
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
              Lake District Walks
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              I have walked in the Lakes in every season, in every kind of weather, with kids, with dogs, and on my own. The walking here is exceptional. It also requires genuine preparation. This guide covers the routes worth doing and the things worth knowing before you go.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[
                { stat: "214", label: "Wainwright fells" },
                { stat: "OL4–OL7", label: "OS Explorer maps" },
                { stat: "mwis.org.uk", label: "Best forecast" },
                { stat: "Year-round", label: "Walking season" },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-black/40 backdrop-blur rounded-xl px-3 py-2.5 border border-white/20">
                  <p className="font-display text-base font-bold text-white">{stat}</p>
                  <p className="text-white/55 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sticky section nav ── */}
        <nav className="bg-[#14231C] border-b border-white/10 sticky top-16 z-40">
          <div className="container mx-auto px-4 max-w-6xl py-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                { href: "#before-you-go", label: "Before You Go" },
                { href: "#easy-walks", label: "Easy Walks" },
                { href: "#beginner-fells", label: "Beginner Fells" },
                { href: "#classic-days", label: "Classic Days" },
                { href: "#big-days", label: "Big Days" },
                { href: "#what-to-bring", label: "What to Bring" },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-white/60 hover:text-[#C4782A] transition-colors font-medium">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 max-w-6xl py-12">

          {/* ── Before You Go ── */}
          <section id="before-you-go" className="mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl font-bold text-[#14231C] mb-8">Before You Go</h2>

            {/* Weather warning callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 text-lg mb-3">The Lake District fells are not a walk in the park</h3>
                  <ul className="space-y-2 text-sm text-amber-900">
                    <li className="flex gap-2"><span className="font-bold">⚡</span><span><strong>Weather changes fast.</strong> A clear morning can produce mist and rain by afternoon, turning a straightforward ridge into a navigation problem.</span></li>
                    <li className="flex gap-2"><span className="font-bold">🗺️</span><span><strong>Navigation matters on the high tops.</strong> Phone GPS is unreliable in mist and runs out of charge. Carry a printed OS map and know how to use a compass.</span></li>
                    <li className="flex gap-2"><span className="font-bold">🌡️</span><span><strong>Check MWIS</strong> (mwis.org.uk) the morning of your walk — not the day before. It gives fell-specific forecasts broken down by area of the national park.</span></li>
                    <li className="flex gap-2"><span className="font-bold">👟</span><span><strong>Proper boots, not trainers.</strong> The ankle support and sole grip on wet rock matter. This is the single most common thing that turns a good day bad.</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* OS map info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Mountain className="w-6 h-6 text-[#C4782A] flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-[#14231C] text-lg">OS Maps</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Four 1:25,000 OS Explorer sheets cover the national park: OL4 (The English Lakes, North Western), OL5 (The English Lakes, North Eastern), OL6 (The English Lakes, South Western), OL7 (The English Lakes, South Eastern).
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Harvey Superwalker maps are the alternative. Waterproof, fell-walking specific format, slightly clearer for route-finding. Worth the investment if you walk here regularly.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-[#C4782A] flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-[#14231C] text-lg">Getting to the Start</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  National Park car parks fill early on summer weekends. Arrive before 9am at popular starts (Glenridding, Old Dungeon Ghyll, Wasdale Head) or you will be parking on verges half a mile back.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The 555 bus (Windermere to Keswick via Ambleside and Grasmere) and the Keswick Launch give car-free access to many starts. Check the timetables before you rely on them.
                </p>
              </div>
            </div>
          </section>

          {/* ── Easy Walks ── */}
          <section id="easy-walks" className="mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl font-bold text-[#14231C] mb-3">Easy Walks and Family Routes</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
              No significant ascent, clear paths, suitable for children and dogs. These are the right walks for a first day, a bad-weather day, or anyone who does not want a fell day.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {easyWalks.map((walk) => (
                <div key={walk.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={walk.image}
                      alt={walk.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <h3 className="font-display font-bold text-white text-lg leading-tight">{walk.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { icon: Clock, text: walk.time },
                        { icon: ArrowUpRight, text: walk.distance },
                        { icon: MapPin, text: walk.start },
                      ].map(({ icon: Icon, text }) => (
                        <span key={text} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
                          <Icon className="w-3 h-3 text-[#C4782A]" />
                          {text}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-xs text-[#14231C] bg-green-50 text-green-700 rounded-full px-2.5 py-1 font-semibold">
                        ↑ {walk.ascent}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{walk.description}</p>
                    <p className="text-xs text-[#C4782A] font-semibold">{walk.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Beginner Fells ── */}
          <section id="beginner-fells" className="mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl font-bold text-[#14231C] mb-3">Beginner Fells</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
              The first step up from valley walks. These involve real ascent and some effort but are on clear paths throughout, without technical sections. The right introduction to the fells.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerFells.map((walk) => (
                <div key={walk.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={walk.image}
                      alt={walk.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display font-bold text-white text-lg leading-tight">{walk.name}</h3>
                      <p className="text-[#C4782A] text-xs font-bold">{walk.summit}</p>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { icon: Clock, text: walk.time },
                        { icon: ArrowUpRight, text: walk.distance },
                      ].map(({ icon: Icon, text }) => (
                        <span key={text} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
                          <Icon className="w-3 h-3 text-[#C4782A]" />
                          {text}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 rounded-full px-2.5 py-1 font-semibold">
                        ↑ {walk.ascent}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1">{walk.description}</p>
                    <div className="pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400"><span className="font-semibold text-[#14231C]">Start:</span> {walk.start}</p>
                      <p className="text-xs text-[#C4782A] font-semibold mt-1">{walk.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Classic Fell Days ── */}
          <section id="classic-days" className="mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl font-bold text-[#14231C] mb-3">Classic Fell Days</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Full days on the fells. These require reasonable fitness, proper gear, and the ability to navigate. Not technical routes, but serious walking days.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {classicFells.map((walk) => (
                <div key={walk.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={walk.image}
                      alt={walk.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display font-bold text-white text-xl leading-tight">{walk.name}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { icon: Clock, text: walk.time },
                        { icon: ArrowUpRight, text: walk.distance },
                        { icon: MapPin, text: walk.start },
                      ].map(({ icon: Icon, text }) => (
                        <span key={text} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
                          <Icon className="w-3 h-3 text-[#C4782A]" />
                          {text}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 rounded-full px-2.5 py-1 font-semibold">
                        ↑ {walk.ascent}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1">{walk.description}</p>
                    <p className="text-xs text-[#C4782A] font-semibold">{walk.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Big Days ── */}
          <section id="big-days" className="mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl font-bold text-[#14231C] mb-3">The Big Days</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
              These require full fitness, solid navigation, proper gear, and a clear weather forecast. Each of them has sent unprepared walkers to mountain rescue. Plan them seriously.
            </p>
            <div className="space-y-6">
              {bigDays.map((walk) => (
                <div key={walk.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="md:flex">
                    <div className="relative h-52 md:h-auto md:w-64 flex-none overflow-hidden">
                      <Image
                        src={walk.image}
                        alt={walk.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="font-display font-bold text-[#14231C] text-xl mb-3">{walk.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { icon: Clock, text: walk.time },
                          { icon: ArrowUpRight, text: walk.distance },
                          { icon: MapPin, text: walk.start },
                        ].map(({ icon: Icon, text }) => (
                          <span key={text} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
                            <Icon className="w-3 h-3 text-[#C4782A]" />
                            {text}
                          </span>
                        ))}
                        <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 rounded-full px-2.5 py-1 font-semibold">
                          ↑ {walk.ascent}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{walk.description}</p>
                      <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 font-medium">{walk.warning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── What to Bring ── */}
          <section id="what-to-bring" className="mb-16 scroll-mt-20">
            <h2 className="font-display text-3xl font-bold text-[#14231C] mb-3">What to Bring</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
              This is not a comprehensive kit list. These are the things that matter. Getting these right is the difference between a good day and a bad one.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gearItems.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold text-[#14231C] text-base mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary checklist */}
            <div className="mt-8 bg-[#14231C] rounded-2xl p-6 text-white">
              <h3 className="font-display font-bold text-lg mb-4 text-[#C4782A]">Before you leave the car park</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Waterproofs accessible, not at the bottom of the bag",
                  "Printed OS map for the right area (not just the app)",
                  "Compass and ability to take a bearing",
                  "Weather forecast checked this morning",
                  "Someone at home knows your route and return time",
                  "Phone charged and OS Maps app downloaded offline",
                  "Enough food and water for the planned route plus an extra hour",
                  "First aid kit including a blister kit",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C4782A] flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group bg-white border border-gray-100 rounded-xl p-4">
                  <summary className="font-medium text-[#14231C] cursor-pointer list-none flex justify-between items-center">
                    {q}
                    <span className="text-[#C4782A] text-lg group-open:rotate-45 transition-transform flex-shrink-0 ml-4">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ── Related guides ── */}
          <section className="border-t border-gray-100 pt-12">
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: "/dog-friendly-lake-district", label: "Dog-Friendly Lake District", desc: "Walks, pubs, and practical advice with a dog", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80" },
                { href: "/lake-district-with-kids", label: "Lake District with Kids", desc: "What actually works with children", image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80" },
                { href: "/rainy-day-lake-district", label: "Rainy Day Options", desc: "When the weather turns — the plan", image: "https://images.unsplash.com/photo-1511225070847-8c58a0a29c07?w=400&q=80" },
                { href: "/keswick", label: "Keswick", desc: "Catbells, Derwentwater, Skiddaw", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
                { href: "/ambleside", label: "Ambleside", desc: "Best walking base in the Lakes", image: "https://images.unsplash.com/photo-1546430498-f6b45e5b35ca?w=400&q=80" },
                { href: "/coniston", label: "Coniston", desc: "Old Man, Brantwood, Tarn Hows", image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80" },
              ].map(({ href, label, desc, image }) => (
                <Link key={href} href={href} className="group relative h-36 rounded-2xl overflow-hidden block">
                  <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-display font-bold text-sm">{label} <ArrowRight className="inline w-3 h-3" /></p>
                    <p className="text-white/65 text-xs mt-0.5">{desc}</p>
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
