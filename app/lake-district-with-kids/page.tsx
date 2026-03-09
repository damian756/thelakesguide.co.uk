import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/lake-district-with-kids`;

const faqs = [
  {
    q: "What is the best Lake District walk for kids?",
    a: "Tarn Hows near Coniston (flat, short, dramatic) and Easedale Tarn from Grasmere (a waterfall, a tarn, manageable ascent) are the two best starter walks. Catbells above Keswick works for older children who can manage 450m of ascent. The Ullswater lakeshore path from Howtown is flat and has the boat journey to add to the experience.",
  },
  {
    q: "What age can children go on Lake District fells?",
    a: "Confident walkers from around 6 to 8 can manage the lower fells like Catbells or Loughrigg. Anything over 700m and with technical terrain should wait until teenagers. Scafell Pike requires full adult fitness, navigation ability, and proper gear. It is not suitable for young children regardless of how 'adventurous' they are.",
  },
  {
    q: "Are there activities for kids in the Lake District when it is raining?",
    a: "Several. The Pencil Museum in Keswick is a surprisingly good couple of hours. The Windermere Jetty Museum near Bowness is excellent for anything over about 8. Go Ape has a site at Grizedale Forest. The World of Beatrix Potter in Bowness is aimed at under-8s. Rheged near Penrith has a cinema and climbing wall. None of them are cheap.",
  },
  {
    q: "What is the best Lake District destination for families?",
    a: "Keswick is the most practical family base. It has the best range of accommodation, is central for both the northern and southern Lakes, has good supermarkets, a leisure centre with a pool, and Derwentwater is walkable from the town. Bowness on Windermere is busier and more commercial but closer to more attractions.",
  },
  {
    q: "Can children go on the Windermere lake cruises?",
    a: "Yes. Windermere Lake Cruises operates year-round between Ambleside, Bowness, and Lakeside. Children under 5 travel free. The boats are covered with outdoor deck space. A round trip from Bowness to Ambleside takes about 40 minutes each way and is a good activity for most ages.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Lake District with Kids: Family Guide to Walks, Activities and Days Out",
    description:
      "Field-tested guide to the Lake District with children. Best family walks, indoor activities, lake boat trips, wildlife spotting, and practical advice for parents.",
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
  title: "Lake District with Kids | Family Walks, Activities and Days Out",
  description:
    "The family guide to the Lake District. Best walks for children, indoor activities for rainy days, lake boat trips, and where to stay with kids. Practical and honest.",
  alternates: { canonical: url },
  openGraph: {
    title: "Lake District with Kids | The Lakes Guide",
    description:
      "Best family walks, activities, and days out in the Lake District with children. Practical and honest.",
    url,
    siteName: "The Lakes Guide",
  },
};

export default function LakeDistrictWithKidsPage() {
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
              <span className="text-white/80">Lake District with kids</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Family guide · Lake District
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Lake District with Kids
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              I have brought my kids here since they were small. The Lakes works for families,
              but only if you pick the right things to do. Here is what actually works.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { stat: "All ages", label: "Routes available" },
              { stat: "Tarn Hows", label: "Best flat walk" },
              { stat: "Catbells", label: "Best starter fell" },
              { stat: "555 bus", label: "Car-free option" },
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
              What works with children
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Lake District is a better destination for children than most adults expect,
              and a harder one than the marketing suggests. The mountains are real mountains.
              The weather is genuinely unpredictable. A child who moans about walking will
              not stop moaning because they are in a beautiful valley. Plan accordingly.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              What works: shorter walks with a clear objective (a waterfall, a tarn, a
              summit). Boat trips. Wildlife. Getting wet in becks and lakes. The physical
              freedom of open fell land. A good pub lunch as reward. These things all work
              with the right age and temperament.
            </p>
            <p className="text-gray-700 leading-relaxed">
              What does not work: long linear walks with no obvious goal, anything requiring
              sustained concentration for navigation, and any fell above 700m with a child
              under 10. Manage expectations and the Lakes delivers. Overclaim and you will
              be carrying someone down a fell in the rain.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Best family walks
            </h2>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Tarn Hows, near Coniston (all ages)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The easiest serious walk in the Lake District. A well-maintained circular path
              around a dramatic tarn, almost entirely flat, 1.5 miles, accessible for
              pushchairs on the main path. The National Trust car park is at LA21 8DP. Charged,
              fills fast in summer. The setting is genuinely stunning and even very young
              children get something from it. Bring stale bread and expect to encounter
              waterfowl. No waterfall, but the visual payoff is immediate.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Easedale Tarn, Grasmere (5+, about 3 hours)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Park in Grasmere village (LA22 9RR). Walk out along Easedale Beck, passing
              Sourmilk Gill waterfall, to the tarn above. Around 3 miles return, 190m ascent.
              The waterfall is about 30 minutes in and provides an intermediate goal that
              keeps children motivated. The tarn above is genuinely dramatic. The descent is
              straightforward. A child of 5 or 6 who likes walking can manage this. It is one
              of the best short routes in the Lakes.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Catbells, Keswick (7+, about 3 hours)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The classic first fell for children. Take the Keswick Launch from Keswick to
              Hawes End jetty (adds a boat journey, which immediately improves morale). The
              path up Catbells is well-maintained and popular. Summit at 451m. Views over
              Derwentwater are excellent. The descent back to the jetty for the return boat
              is straightforward. Total about 3 miles. Good for children of around 7 and above
              who are comfortable on rough paths and heights. There is one short section of
              easy scrambling near the top that most children find exciting rather than
              frightening.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Ullswater lakeshore, Howtown to Glenridding (8+, half day)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Take the Ullswater Steamer from Glenridding (CA11 0PD) to Howtown pier and walk
              back. Around 6 miles on a good, mostly flat path with the lake to one side and
              dramatic fells to the other. The boat adds novelty and solves the there-and-back
              problem. The path is clear throughout. Some gentle ups and downs but nothing
              requiring fell fitness. A great day out for older children and adults together.
              Carry lunch, there is nothing between Howtown and Patterdale.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Stock Ghyll Force, Ambleside (all ages)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A 20-minute walk from the centre of Ambleside (LA22 0BN) to a 22m waterfall in
              a wooded gorge. Short enough for any age, dramatic enough to justify it. Good
              for a morning warm-up before lunch in Ambleside. The path is well-maintained but
              can be slippery after rain.
            </p>

            <h3 className="font-semibold text-lg text-[#14231C] mb-2">
              Aira Force, Ullswater (all ages)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              National Trust site near Glenridding. A series of waterfalls in a ravine, with
              good paths and bridges. Short circular walk of about 2 miles from the NT car
              park (CA11 0JS). Spectacular after heavy rain. Café on site. One of the most
              visited NT sites in the Lakes for good reason. Go on a weekday if possible.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Boat trips
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lake boat trips are the single most reliable family activity in the Lakes,
              rain or shine. Children who will not walk for more than 30 minutes will sit on
              a boat for two hours with no complaint.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Windermere Lake Cruises operates the most extensive service, with boats between
              Ambleside (Waterhead pier, LA22 0EY), Bowness, and Lakeside at the south end.
              Year-round timetable. Under-5s free, children's fare for 5 to 15. The Lakeside
              and Haverthwaite Railway connects at the south end for a steam train section.
              Doing the whole Ambleside to Lakeside run by boat and returning by combination
              of train and boat is a full day out that works for most ages.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ullswater Steamers run between Glenridding, Howtown, and Pooley Bridge. The
              classic use with children is to combine the steamer with a walk. Glenridding to
              Howtown by steamer, walk back along the lakeshore. Or all three piers by boat
              for the experience alone.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Keswick Launch covers Derwentwater with seven stopping points around the lake.
              Short sectors of 10 to 15 minutes between piers. You can hop on and off, which
              gives flexibility for a day combining a short walk with a lake section. Hawes
              End jetty is the starting point for Catbells.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Indoor and wet weather activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              It will rain. Have a plan. The following are worth your time:
            </p>
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong className="text-[#14231C]">Windermere Jetty Museum</strong> (LA23 3JH). A serious museum about Windermere's maritime history, opening onto the lake. The building itself is worth visiting. Good for 8 and above. Excellent on a wet afternoon. Admission charged.
              </li>
              <li>
                <strong className="text-[#14231C]">Pencil Museum, Keswick</strong> (CA12 5NG). Unexpectedly good. The story of Cumberland graphite and pencil manufacturing from the 16th century. Children enjoy the giant pencil. Two hours, reasonably priced. Better than you expect.
              </li>
              <li>
                <strong className="text-[#14231C]">World of Beatrix Potter, Bowness</strong> (LA23 3BX). Directly aimed at under-8s and the Peter Rabbit audience. An indoor walk-through attraction with the Potter characters and scenes. Short. Works well for young children, less so for older ones.
              </li>
              <li>
                <strong className="text-[#14231C]">Go Ape, Grizedale Forest</strong> (LA22 0QJ). Treetop aerial adventure with zip lines and rope walks. Minimum height restrictions apply (1m for junior course, 1.4m for adult). Book in advance, particularly in school holidays. Forestry England site. Several hours.
              </li>
              <li>
                <strong className="text-[#14231C]">Rheged, near Penrith</strong> (CA11 0DQ). A large arts and retail complex built into a hillside near Junction 40 of the M6. Has a cinema, climbing wall, and soft play area. Useful if you are arriving or departing via the M6.
              </li>
              <li>
                <strong className="text-[#14231C]">Keswick leisure centre</strong> (CA12 5NB). A public leisure centre with a 25m pool. Family swim sessions. Not glamorous, but useful if you are based in Keswick for several days.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Wildlife with children
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wildlife spotting works well with children if you set realistic expectations.
              Red squirrels in the Lake District are genuinely possible at several sites.
              Dodd Wood above Bassenthwaite Lake (CA12 4QE) has a red squirrel trail through
              the conifer woodland with feeders. Go in the morning, move quietly, and there is
              a real chance of seeing them at close range. Children find this more exciting
              than any manufactured attraction.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Osprey season at Dodd Wood runs April to August. The RSPB and Forestry England
              staff a telescope viewpoint at the Dodd Wood car park where the nest is visible.
              Trained staff explain what is happening. A child who has watched an osprey
              return to a nest with a fish will not forget it.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Deer in the Martindale valley, on the far side of Ullswater, are reliable for
              any time of year. Access is via Howtown. In October the red deer rut adds sound
              and drama. Binoculars help, but even without them the herd scale in Martindale
              is impressive.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Where to stay with children
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Self-catering is the most practical option for families with children. You can
              eat on your own schedule, you are not constrained by hotel breakfast times, and
              the economics usually work better for four or more people. The Lakes has an
              enormous supply of self-catering cottages. Book 6 to 12 months ahead for
              school holiday weeks. Popular spots like Grasmere, Hawkshead, and the Langdale
              valley fill extremely fast.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For practical family hotels, Keswick offers the widest choice. The Keswick
              Country House Hotel and the Inn on the Square both have family rooms and are
              central. Both allow dogs, which simplifies matters if you are combining a dog
              trip with a family trip.
            </p>
            <p className="text-gray-700 leading-relaxed">
              YHA hostels in the Lakes are a good family option if your children will sleep
              in bunks. Great Langdale, Hawkshead, and Coniston YHAs are all in excellent
              positions. Family rooms are available at most. Book early.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#14231C] mb-4">
              Practical notes
            </h2>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>
                Layers, always. The temperature on a fell top can be 10 degrees cooler than
                the valley. Children are less good at self-regulating and will not tell you
                they are cold until they are hypothermic. Pack more warm kit than seems
                necessary.
              </li>
              <li>
                Waterproof trousers are worth the argument. Children falling in becks,
                sitting in wet grass, and kneeling in mud is guaranteed. A change of clothes
                in the car for the return journey is also worth having.
              </li>
              <li>
                Snacks at altitude solve more morale problems than any amount of pre-trip
                enthusiasm. Children run out of energy and glucose quickly on ascent. Build in
                regular breaks with food.
              </li>
              <li>
                Midges are real in July and August, particularly at dawn and dusk in sheltered
                valleys. Avon Skin So Soft is the standard local repellent. DEET works but
                is not recommended for young children's skin.
              </li>
              <li>
                Car parks at popular sites (Tarn Hows, Aira Force, Haweswater) fill by 10am
                on summer weekends. Start early or accept a longer walk from overflow parking.
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
              Plan your Lakes trip
            </h2>
            <p className="text-white/75 mb-4">
              Find accommodation, things to do, and practical information for your visit.
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
