import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/dog-friendly-lake-district`;

const faqs = [
  {
    q: "Is the Lake District dog-friendly?",
    a: "Largely yes, though it requires planning. Dogs are welcome on most fells, the majority of lakes, and in a good number of pubs and cafes. The main restrictions are livestock fields (dogs must be on leads), some beaches and nature reserves during nesting season, and certain National Trust properties where dogs are not admitted to indoor areas.",
  },
  {
    q: "Can dogs go on Lake District fells?",
    a: "Yes. Dogs are permitted on virtually all fell paths including the Wainwrights. Keep them on leads in areas with livestock, particularly in spring when lambs are around. Farmers in the Lakes take this seriously and are within their rights to shoot a dog worrying sheep. Off lead on open fell tops is generally fine.",
  },
  {
    q: "Which Lake District pubs are dog-friendly?",
    a: "Most walkers' pubs in the Lakes are dog-friendly. The Wasdale Head Inn, The Old Dungeon Ghyll in Langdale, The Kirkstone Pass Inn, the Travellers Rest near Grasmere, and the Dog and Gun in Keswick are all known for welcoming dogs. Call ahead if you are unsure and want to eat rather than just drink.",
  },
  {
    q: "Can I take my dog to Windermere?",
    a: "Yes. The eastern and western shores both have good walking with dogs. Boats operated by Windermere Lake Cruises allow dogs on board. Bowness itself is manageable with a dog. Narrow pavements in town can get very busy in summer. Early morning or evening is easier.",
  },
  {
    q: "Are there dog-friendly beaches in the Lake District?",
    a: "The Lakes have lake shores rather than coastal beaches. Waterside access points on Coniston Water, Ullswater, Grasmere lake, and Derwentwater are generally open to dogs. There are no tidal seasonal restrictions as you would get on the coast. Watch out for boat launching areas.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dog-Friendly Lake District: Walks, Pubs, and Practical Advice",
    description:
      "Where to walk, stay, eat, and explore in the Lake District with your dog. Practical advice on dog-friendly fells, pubs, accommodation, and lake shores.",
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
  title: "Dog-Friendly Lake District | Walks, Pubs and Accommodation",
  description:
    "The dog-friendly Lake District guide. Best walks with dogs, which pubs welcome dogs, dog-friendly accommodation, and practical advice on fells, livestock, and lake shores.",
  alternates: { canonical: url },
  openGraph: {
    title: "Dog-Friendly Lake District | The Lakes Guide",
    description:
      "Walks, pubs, accommodation and practical advice for visiting the Lake District with your dog.",
    url,
    siteName: "The Lakes Guide",
  },
};

export default function DogFriendlyLakeDistrictPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <main>
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/80">Dog-friendly Lake District</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Practical guide · Lake District
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Dog-Friendly Lake District
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              The Lake District is a reasonable place to bring a dog, provided you know the
              rules. Most fells are open, most pubs welcome dogs, and the lake shores are
              accessible. Here is the practical guide.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { stat: "Open fells", label: "Dogs permitted" },
              { stat: "Lead required", label: "Near livestock" },
              { stat: "Mar-May", label: "Lambing (caution)" },
              { stat: "Check LDNPA", label: "Algae warnings" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-12 space-y-12">

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              The basics
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dogs are welcome across the vast majority of the Lake District. The open fell
              land is common land, legally accessible under the Countryside and Rights of Way
              Act, and dogs are permitted on it. Most lake shores, valley paths, and woodland
              trails are open. The National Trust, which manages significant parts of the
              Lakes, is generally dog-friendly with standard conditions: leads near livestock,
              not in marked exclusion zones.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The principal constraint is livestock. The Lakes are a working farming
              landscape. Sheep are everywhere, including on open fell land. Dogs that chase
              sheep can be shot by farmers within the law, and the rules are enforced. Spring
              is the most sensitive time, when lambs are young and easily scattered. Lead your
              dog wherever sheep are visible on enclosed ground. On the open fell tops above
              the walls, the risk is lower but use judgment.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The second constraint is a minority of sites during nesting season (April to
              July) where ground-nesting birds are vulnerable. This affects some wetland
              reserves more than fell paths.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Best dog walks in the Lake District
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Almost every fell walk in the Lakes is suitable for dogs, provided they are fit
              and you manage the livestock issue. Some stand out.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Catbells, Derwentwater
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              One of the most popular Lake District walks and excellent with dogs.
              The summit ridge is open fell land with no enclosed sheep fields en route
              from the Hawes End jetty (take the Keswick Launch). Two to three hours return.
              Views down Derwentwater are worth the effort and the ascent is manageable for
              most dogs. The boat adds interest and dogs are welcome on the Keswick Launch
              ferries.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Tarn Hows, near Coniston
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A National Trust site with a well-maintained circular trail around the tarns.
              Almost flat. Dogs must be on leads around the grazing areas but the path itself
              is easy walking for any dog, any age. The car park (LA21 8DP, National Trust,
              charged) fills quickly on summer weekends. Go before 9am or after 4pm if you
              want easy parking. The walk is around 1.5 miles round the main tarn.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Haystacks, Buttermere
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Haystacks was Wainwright's favourite fell, and it makes a brilliant dog walk.
              Park at Gatesgarth Farm (CA13 9XA, small car park, honesty box). The ascent
              follows a clear path via Scarth Gap. The summit area has several small tarns
              and is genuinely beautiful. Dogs can run freely on the open tops. Around 4
              miles, 3 to 4 hours, 450m ascent. The Buttermere valley circuit below is
              flatter and equally good.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Ullswater lakeshore
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The path from Howtown to Patterdale along the eastern shore of Ullswater is one
              of the best low-level walks in the Lakes. Around 6 miles on a good path with the
              lake to one side and fells rising steeply to the other. Mostly open, some
              livestock near Sandwick. Dogs welcome on the Ullswater Steamers, so you can
              take the boat one way and walk back. The Howtown pier is the starting point for
              the classic walk; park at Glenridding (CA11 0PD) and use the steamer service.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Fairfield Horseshoe, Ambleside
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A full fell day with dogs. The horseshoe starts and ends at Ambleside (park at
              the central car park, LA22 0DB). The route goes over Nab Scar, Heron Pike, Great
              Rigg, Fairfield summit, Hart Crag, Dove Crag, High Pike and Low Pike. Around 11
              miles, 900m ascent, allow a full day. The ridge is almost entirely open fell with
              minimal enclosed ground. A fit dog will handle this easily. Carry enough water
              for both of you.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Grizedale Forest
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Forestry England manages Grizedale Forest between Windermere and Coniston. Dogs
              on leads on the main trails. The forest has good waymarked routes, red squirrels
              in the upper sections, and a Go Ape facility if you have children in tow. The
              car park is at Hawkshead (LA22 0QJ). Good for wet weather when you want tree
              cover.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Dog-friendly pubs
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Post-walk pub access is a genuine priority with a dog. The majority of walkers'
              pubs in the Lakes are dog-friendly, at least in the bar area. Some key ones:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong className="text-[#14231C]">Wasdale Head Inn</strong> (CA20 1EX). As remote as it gets, dogs very welcome in the bar, and after Scafell Pike you will be glad it is there.
              </li>
              <li>
                <strong className="text-[#14231C]">Old Dungeon Ghyll, Langdale</strong> (LA22 9JU). The hikers' bar is legendary. Muddy boots and dogs are part of the furniture. No booking needed for the bar.
              </li>
              <li>
                <strong className="text-[#14231C]">Kirkstone Pass Inn</strong> (LA23 1LU). England's third highest pub, on the pass between Windermere and Ullswater. Exposed and often cold. Dogs very welcome, open fires.
              </li>
              <li>
                <strong className="text-[#14231C]">The Dog and Gun, Keswick</strong> (CA12 5JB). The name is a reasonable clue. Busy town pub, dogs in the bar, Keswick's best atmosphere on a wet evening.
              </li>
              <li>
                <strong className="text-[#14231C]">Travellers Rest, Grasmere</strong> (LA22 9RR). On the A591 just north of Grasmere. Good beer garden for summer. Dogs welcome in the bar and the garden.
              </li>
              <li>
                <strong className="text-[#14231C]">The Fish Inn, Buttermere</strong> (CA13 9XA). Village pub in one of the most beautiful valleys in the Lakes. Small, gets busy after a Haystacks day. Dogs in the bar.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Always call ahead if you want to eat in the restaurant section rather than the
              bar. Dog policies often differ between bar and dining room.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Dog-friendly accommodation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dog-friendly accommodation in the Lakes is plentiful but fills fast in school
              holidays. Book early and be specific about your dog when booking. Most places
              that accept dogs charge a small supplement (typically £10 to £20 per stay) and
              have size restrictions or a limit on number of dogs.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Self-catering is generally more straightforward than hotels or B&Bs. Cottages
              through Sykes Cottages, Hoseasons, and direct local letting agencies often
              accept dogs without the supplement that hotels charge. Check whether the garden
              is enclosed. In the Lakes, a dog bolting onto a road or into a field of sheep is
              a real risk with an open gate.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Camping is straightforward. Most NT and Forestry England campsite grounds permit
              dogs on leads. Wild camping (legal in the Lakes under the National Park access
              provisions) is fine with dogs but requires the same responsibility: no
              harassment of livestock, clean up after the dog.
            </p>
            <p className="text-gray-700 leading-relaxed">
              YHA hostels have variable dog policies. Most do not accept dogs in sleeping
              areas but some have outside secure kennels. Check individually. They tend to be
              upfront about this on booking.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Lake shores and water access
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dogs swimming in the Lakes is generally not a problem and most dogs will want
              to. Water quality in the larger lakes is good. The main risks are strong
              currents at inflows and outflows (particularly at weirs and narrow channels),
              cold water shock in winter and early spring, and blue-green algae (cyanobacteria)
              in warm, still conditions in late summer. When algae warnings are posted on
              a lake, keep dogs out of the water. It can be fatal.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Blue-green algae warnings are posted on the YDNPA and Lake District National
              Park Authority websites and social media during risk periods. Worth checking
              before you go if it has been a hot, still August week.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Good water access points: the shore at Glenridding on Ullswater, Waterhead near
              Ambleside on Windermere, the beach at Fell Foot (NT, Newby Bridge end of
              Windermere, LA12 8NN), Coniston village shore, and the shore at Grasmere
              village. All have good parking nearby.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Practical tips
            </h2>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>
                Carry a lead at all times. Even on open fell tops, you can encounter livestock
                in unexpected places.
              </li>
              <li>
                Sheep ticks are present across the Lake District fells, particularly in
                bracken. Check your dog thoroughly after fell walks, especially around ears,
                groin, and between toes. A tick remover tool is worth carrying.
              </li>
              <li>
                The Langdale valleys, Wasdale, and Buttermere have limited mobile signal.
                Download the OS map for your area offline before you go.
              </li>
              <li>
                Carry more water than you think you need for your dog on warm days. There are
                streams on most fell routes but after a dry spell the upper streams can be
                reduced to trickles.
              </li>
              <li>
                Check your dog for signs of heat exhaustion on warm days: excessive panting,
                drooling, disorientation. Start early, take breaks near water, and do not push
                a dog up a hot fell in the middle of the day.
              </li>
              <li>
                Know the livestock calendar. March to May is lambing season. Restrict off-lead
                time near farms and enclosed fields. November to February is generally the
                lowest risk period for livestock encounters on the open fell.
              </li>
            </ul>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h2 className="font-display text-xl font-bold text-[#14231C] mb-6">
              Common questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold text-[#14231C] mb-2">{faq.q}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#14231C] text-white rounded-2xl p-8">
            <h2 className="font-display text-xl font-bold mb-2">
              Explore the Lake District
            </h2>
            <p className="text-white/75 mb-4">
              Find dog-friendly walks, accommodation, and places to eat across the region.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/things-to-do"
                className="bg-[#C4782A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a86323] transition"
              >
                Things to do
              </Link>
              <Link
                href="/accommodation"
                className="border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Accommodation
              </Link>
              <Link
                href="/lake-district-walks"
                className="border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Walking guide
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
