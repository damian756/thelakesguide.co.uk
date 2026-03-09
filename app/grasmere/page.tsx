import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.thelakesguide.co.uk";
const url = `${BASE_URL}/grasmere`;

const faqs = [
  {
    q: "What is Grasmere famous for?",
    a: "Wordsworth. Dove Cottage on the edge of the village was William Wordsworth's home from 1799 to 1808. The Wordsworth Museum is here. Also Grasmere Gingerbread, which has been sold from the church corner since 1854, and the lake itself, which is one of the most beautiful in the Lake District.",
  },
  {
    q: "Is Grasmere worth visiting?",
    a: "Yes, particularly if you enjoy walking or have any interest in literary history. The village is compact and can be busy in summer, but the lake and the surrounding fells give it a quality that the gift shops and tea rooms can only partially obscure.",
  },
  {
    q: "What walks can you do from Grasmere?",
    a: "Helm Crag (the Howitzer summit) is the classic walk directly above the village — a 2-hour return with a scramble to the highest point. Easedale Tarn is a popular 3-mile circular. The Fairfield Horseshoe from Grasmere is a longer day. The lake circuit is an easy 4-mile flat walk.",
  },
  {
    q: "How far is Grasmere from Ambleside?",
    a: "4 miles north on the A591. About 10 minutes by car. The 555 bus connects them regularly. Walking the old coffin road between the two via Rydal is a pleasant hour.",
  },
];

const pageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Grasmere", item: url },
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
    name: "Grasmere",
    description: "Grasmere is a small village and lake in the central Lake District, most famous as Wordsworth's home and for Sarah Nelson's Grasmere Gingerbread.",
    url,
    geo: { "@type": "GeoCoordinates", latitude: 54.4597, longitude: -3.025 },
    address: { "@type": "PostalAddress", addressLocality: "Grasmere", postalCode: "LA22 9QT", addressCountry: "GB" },
  },
];

export const metadata: Metadata = {
  title: "Grasmere | Wordsworth, Gingerbread & Visitor Guide",
  description: "Complete guide to Grasmere. Dove Cottage, Wordsworth Museum, Grasmere Gingerbread, Helm Crag, Easedale Tarn. Everything you need to know for a visit to this central Lake District village.",
  alternates: { canonical: url },
  openGraph: { title: "Grasmere Guide | The Lakes Guide", description: "Wordsworth, gingerbread, and one of the most beautiful lakes in the Lake District. Complete visitor guide.", url, siteName: "The Lakes Guide" },
};

export default function GrasmerePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <main>
        <div className="bg-[#14231C] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <nav className="text-sm text-white/50 mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white/80 transition">Home</Link>
              <span>/</span>
              <span className="text-white/80">Grasmere</span>
            </nav>
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">
              Village guide · Central Lake District · LA22
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Grasmere</h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
              Grasmere is simultaneously one of the most visited and most genuinely beautiful places in the Lake District. Wordsworth lived here. The gingerbread is made to a recipe from 1854. The lake is outstanding. The village in August can feel overwhelmed, but the surrounding fells always offer a way out.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "LA22 9QT", label: "Postcode" },
              { stat: "1799–1808", label: "Wordsworth at Dove Cottage" },
              { stat: "1854", label: "Gingerbread recipe" },
              { stat: "4 miles", label: "From Ambleside" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="font-display text-xl font-bold text-[#14231C]">{stat}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none">
            <h2>About Grasmere</h2>
            <p>
              Grasmere is a small village in the valley of the same name, with a lake of the same name directly beside it. The village, the lake, and the surrounding fells are all called Grasmere. The lake is small — about three-quarters of a mile long — but exceptionally beautiful, sitting between the steep fell sides of Helm Crag to the north and Silver How to the west. The village has a church, a cluster of shops and cafes, and more visitors per square metre in summer than almost anywhere in the national park.
            </p>
            <p>
              The literary history is the main draw for many visitors. William Wordsworth moved to Dove Cottage on the edge of the village in December 1799 with his sister Dorothy, and he lived here until 1808 writing some of the central work of English Romanticism. The Lyrical Ballads, Poems in Two Volumes, The Prelude — much of it was written here or conceived on walks from here. Dove Cottage is preserved by the Wordsworth Trust and is open for tours.
            </p>

            <h2>Dove Cottage and the Wordsworth Museum</h2>
            <p>
              Dove Cottage (LA22 9SH, entrance charged, book ahead in summer) is a 17th-century farmhouse on the old road to Ambleside, half a mile from the village centre. The cottage itself is small, darker than photographs suggest, and gives a clear impression of how Wordsworth's household actually lived. The tours are guided and well-informed. The Wordsworth Museum adjacent to the cottage has a significant collection of manuscripts, portraits, and contemporary documents.
            </p>
            <p>
              The cottage fills quickly on summer mornings. A timed entry system manages numbers. If you want the cottage without crowds, the first entry slot is your best option. The garden and grounds are included in the ticket and are worth more time than most people give them.
            </p>

            <h2>Grasmere Gingerbread</h2>
            <p>
              Sarah Nelson's Grasmere Gingerbread shop is at the corner of the churchyard (LA22 9SW). The recipe has been made to the same formula since 1854. It is not gingerbread in the conventional sense — it is harder, drier, spiced differently, and genuinely unique. The shop is tiny and the queue on summer days can be 20 people long, but it moves quickly.
            </p>
            <p>
              There is a reason people travel specifically to buy it and post it home. It is worth the queue. Buy more than you think you need — it keeps well and the tin is reusable.
            </p>

            <h2>The lake</h2>
            <p>
              Grasmere lake is not particularly large but the setting makes it exceptional. The fell sides come close to the water on all sides, and the reflection of the surrounding landscape on a still autumn morning is one of the great quiet views of the central Lakes. The circuit path around the lake is about 4 miles on mostly flat ground, starting from the village.
            </p>
            <p>
              The wooded island in the middle of the lake was used by Wordsworth and his circle for picnics and was known as the Floating Island in the 19th century. It is now a wildlife haven with no public access. It is visible from the shore path on the eastern side.
            </p>

            <h2>Walking from Grasmere</h2>
            <p>
              Helm Crag is the fell directly above the village with the distinctive rocky summit that Wainwright described as the Howitzer and the Lion and the Lamb. The summit is at 405 metres and the ascent from the village takes about 45 minutes. The top involves a short, easy scramble on the rocky outcrops. The views from the top — directly down into Grasmere with the lake below and the Fairfield fells beyond — are excellent.
            </p>
            <p>
              Easedale Tarn is the high tarn above the village, reached by a clear path up Easedale Valley past Sour Milk Gill waterfall. The tarn sits at 280 metres in a hanging valley. The circuit from the village is about 3.5 miles with 280 metres of ascent. Allow 2 to 2.5 hours. A good family walk that gives the children a waterfall and a tarn and ends in the village for the gingerbread.
            </p>
            <p>
              The Silver How ridge to the west of the lake is a longer walk (around 5 miles) that rewards those who continue beyond the tourist zone. The ridge above the village gives views across Langdale and back down to Grasmere that most visitors never see.
            </p>

            <h2>Where to eat</h2>
            <p>
              The Jumble Room on Langdale Road (LA22 9SU) is the most consistently well-regarded restaurant in Grasmere. Eclectic, independently owned, with a menu that changes regularly. Book ahead — it is small and fills up. The Rowan Tree cafe near the village centre is a reliable lunch option with better food than the setting might suggest.
            </p>
            <p>
              The Travellers Rest pub on the A591 south of Grasmere (LA22 9RR) is the right post-walk pub for the Fairfield Horseshoe or any of the southern approaches. Good food, decent beer, reliable quality. The Dale Lodge Hotel serves food and has a good location relative to the village.
            </p>

            <h2>Getting there</h2>
            <p>
              The 555 bus connects Grasmere with Windermere station, Ambleside, and Keswick roughly hourly. This is a reliable service and removes the parking problem in summer. Car parking is at the main car park on Red Bank Road (LA22 9QT, pay and display) or along Broadgate. Both fill early in summer — arrive before 10am or use the bus.
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
                { href: "/ambleside", label: "Ambleside", desc: "4 miles south, the walking hub" },
                { href: "/keswick", label: "Keswick", desc: "15 miles north on the 555" },
                { href: "/windermere", label: "Windermere", desc: "England's largest lake" },
                { href: "/coniston", label: "Coniston", desc: "Coniston Water, Ruskin, Old Man" },
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
