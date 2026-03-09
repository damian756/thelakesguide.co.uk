import Link from "next/link";
import Image from "next/image";
import {
  Waves,
  MapPin,
  Users,
  Dumbbell,
  ShoppingBag,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  TreePine,
  Landmark,
  Star,
  Baby,
  CloudRain,
  PoundSterling,
  Wine,
  Mountain,
} from "lucide-react";
import type { Metadata } from "next";
import { HERO_IMAGE_URL } from "@/lib/site-constants";

const BASE_URL = "https://www.thelakesguide.co.uk";

export const metadata: Metadata = {
  title: "Things to Do in the Lake District | The Complete Guide | The Lakes Guide",
  description:
    "The definitive guide to things to do in the Lake District. Windermere, Keswick, Ambleside, Coniston, Scafell Pike, Wainwrights, water sports, Grizedale Forest, and more. Written by someone who actually walks the fells.",
  keywords:
    "things to do in the Lake District, things to do Lake District, Lake District attractions, Lake District walks, Lake District with kids, free things to do Lake District, things to do in Cumbria",
  alternates: { canonical: `${BASE_URL}/things-to-do` },
  openGraph: {
    title: "Things to Do in the Lake District | The Complete Guide",
    description:
      "From Helvellyn to Haweswater ospreys, Grizedale red squirrels to Windermere cruises. The guide the tourism boards don't write.",
    url: `${BASE_URL}/things-to-do`,
    images: [{ url: `${BASE_URL}/og-default.png` }],
  },
};

const QUICK_LINKS = [
  { href: "#lakes", label: "Lakes & Water", icon: Waves },
  { href: "#family", label: "Family Days Out", icon: Baby },
  { href: "#nature", label: "Nature & Wildlife", icon: TreePine },
  { href: "#culture", label: "Culture & Heritage", icon: Landmark },
  { href: "#walks", label: "Walks & Fells", icon: Mountain },
  { href: "#activities", label: "Activities", icon: Dumbbell },
  { href: "#shopping", label: "Shopping", icon: ShoppingBag },
  { href: "#events", label: "Events", icon: CalendarDays },
  { href: "#faq", label: "FAQs", icon: Star },
];

const LAKES = [
  {
    name: "Windermere",
    tag: "England's largest lake",
    highlight: "The main hub for visitors",
    description:
      "Ten and a half miles long, Windermere is England's largest natural lake. Bowness-on-Windermere and Ambleside sit at either end. Cruises run year-round. Kayaking, paddleboarding, and sailing are all available. The western shore is quieter than the Bowness side.",
    practical: [
      "Boat hire from Bowness, Ambleside, and Waterhead.",
      "Windermere Lake Cruises run regular services. Check times before you go.",
      "Parking fills early in summer. Arrive before 10am or use the bus.",
      "Dogs allowed on most cruises. Check with the operator.",
    ],
    gradient: "from-[#2A6B8A] to-[#1E8AB0]",
    emoji: "🛶",
    href: "/activities",
  },
  {
    name: "Coniston Water",
    tag: "Steam Yacht Gondola",
    highlight: "Quieter than Windermere",
    description:
      "Five miles long, Coniston is where Donald Campbell set his world water speed records. The Steam Yacht Gondola runs from Coniston Pier. The village has a proper local feel. Good for a quieter day on the water.",
    practical: [
      "Coniston village, LA21 8EH. Pay and display car parks.",
      "Gondola runs March to October. Book ahead at weekends.",
      "Kayak and canoe hire from Coniston Boating Centre.",
      "The Old Man of Coniston looms above. Combine a lake day with a fell walk.",
    ],
    gradient: "from-[#1A5C5B] to-[#2E8B7A]",
    emoji: "⛵",
    href: "/activities",
  },
  {
    name: "Derwentwater",
    tag: "Keswick's lake",
    highlight: "Islands, launches, and views",
    description:
      "Keswick sits at the north end. Derwentwater has four islands, a launch service that runs to them, and some of the best views in the Lakes. Catbells rises from the western shore. A circuit of the lake is about 10 miles on foot.",
    practical: [
      "Keswick launch runs from the town pier. Hourly in season.",
      "Parking at Keswick or use the bus from Penrith.",
      "The Borrowdale road runs along the east shore. Stunning drive.",
      "Dogs welcome on the launches. Check times in winter.",
    ],
    gradient: "from-[#2A3F5C] to-[#3A5070]",
    emoji: "🏔️",
    href: "/activities",
  },
  {
    name: "Ullswater",
    tag: "Second longest",
    highlight: "Steamers and Helvellyn views",
    description:
      "Nine miles long, Ullswater is often cited as the most beautiful of the lakes. The Ullswater Steamers run from Glenridding and Pooley Bridge. Aira Force waterfall is on the western shore. Helvellyn dominates the skyline.",
    practical: [
      "Glenridding and Pooley Bridge have car parks. Fill early.",
      "Steamers run year-round. Reduced service in winter.",
      "Aira Force: National Trust. Pay and display. Worth the stop.",
      "The Kirkstone Pass road from Ambleside is dramatic. Check conditions in winter.",
    ],
    gradient: "from-[#1A4020] to-[#2E6830]",
    emoji: "🌊",
    href: "/activities",
  },
];

const FAMILY = [
  {
    name: "Grizedale Forest",
    sub: "Sculpture trail and Go Ape",
    detail:
      "Forest park between Windermere and Coniston. Sculpture trail, mountain biking, Go Ape, and family walks. The visitor centre has a café and bike hire. Red squirrels and red deer in the forest.",
    practical: "Grizedale, LA22 0QJ. Pay and display. Café and toilets on site.",
    emoji: "🌲",
    href: "/activities",
  },
  {
    name: "Lakes Aquarium",
    sub: "Indoor option for wet days",
    detail:
      "At the southern tip of Windermere, near Newby Bridge. Good for a rainy afternoon. Otters, fish, and a touch pool. Allow a couple of hours.",
    practical: "Lakeside, LA12 8AS. Check opening times. Café on site.",
    emoji: "🐟",
    href: "/attractions",
  },
  {
    name: "Brockhole",
    sub: "Lake District Visitor Centre",
    detail:
      "Between Windermere and Ambleside. Free entry to the grounds. Adventure playground, treetop nets, mini golf. Café and shop. Good for a half-day with kids.",
    practical: "Brockhole, LA23 1LJ. Pay and display. Café and toilets.",
    emoji: "🏡",
    href: "/attractions",
  },
  {
    name: "Lakeside & Haverthwaite Railway",
    sub: "Steam train",
    detail:
      "Heritage steam railway from Haverthwaite to Lakeside. Connects with Windermere cruises. Kids love it. Runs seasonally.",
    practical: "Haverthwaite, LA12 8AL. Check timetable. Combines well with a boat trip.",
    emoji: "🚂",
    href: "/attractions",
  },
  {
    name: "Honister Slate Mine",
    sub: "Via Ferrata and mine tours",
    detail:
      "At the top of Honister Pass. Mine tours, underground adventures, and the Via Ferrata for older kids and adults. The pass road itself is an experience.",
    practical: "Honister, CA12 5XN. Book ahead for Via Ferrata. Café on site.",
    emoji: "⛏️",
    href: "/activities",
  },
  {
    name: "The World of Beatrix Potter",
    sub: "Bowness attraction",
    detail:
      "In Bowness. Indoor attraction bringing the stories to life. Popular with younger children. Can get busy in school holidays.",
    practical: "Bowness, LA23 3BX. Check opening times. Book ahead at peak.",
    emoji: "🐰",
    href: "/attractions",
  },
];

const NATURE = [
  {
    name: "RSPB Haweswater",
    org: "Royal Society for the Protection of Birds",
    vol: "Ospreys. Free hide. Best viewing April to September",
    story:
      "The ospreys at Haweswater are the reason to go. Reintroduced in 2010, they breed here and can be seen from the hide. Get there before 10am if you want a decent spot. Take binoculars. The drive over the pass from Ambleside is dramatic.",
    tips: [
      "Mardale Head, CA10 2RP. Free parking. RSPB members get priority at the hide.",
      "Best months: April to September when the birds are present.",
      "Dawn and dusk are the best times for activity.",
      "The hide is small. Arrive early at weekends.",
    ],
    color: "blue",
    emoji: "🦅",
  },
  {
    name: "Grizedale Red Squirrels",
    org: "Forestry England",
    vol: "Native red squirrels in the forest",
    story:
      "Grizedale Forest has a healthy red squirrel population. You're more likely to see them early in the morning on quieter trails. The sculpture trail is the main draw for most visitors, but the wildlife is there if you're patient.",
    tips: [
      "Go early. First two hours after dawn are best.",
      "Spring and autumn offer better sightings.",
      "Stay on the trails. Keep dogs on leads.",
      "The visitor centre has squirrel information.",
    ],
    color: "green",
    emoji: "🐿️",
  },
  {
    name: "Leighton Moss RSPB",
    org: "Royal Society for the Protection of Birds",
    vol: "Largest reedbed in north-west England",
    story:
      "Just outside the National Park, near Silverdale. Bitterns, marsh harriers, bearded tits. The reserve is a proper day out. Bring binoculars. The hides are well placed. Café on site.",
    tips: [
      "Middleton Road, LA5 0SW. RSPB members free. Non-members pay.",
      "Bitterns are easiest in spring. Marsh harriers year-round.",
      "Allow at least half a day. Several hides to work through.",
      "Café and shop. Toilets. Accessible paths to some hides.",
    ],
    color: "blue",
    emoji: "🦆",
  },
];

const CULTURE = [
  {
    name: "Dove Cottage",
    tag: "Wordsworth's home",
    detail:
      "William Wordsworth lived here from 1799 to 1808. Grasmere. The museum and garden are worth a visit. Book ahead for the house tour.",
    href: "/attractions",
    emoji: "📜",
  },
  {
    name: "Hill Top",
    tag: "Beatrix Potter's farm",
    detail:
      "Near Sawrey. The house where Beatrix Potter wrote many of her books. National Trust. Book ahead. Timed entry. Small house, big queues if you don't plan.",
    href: "/attractions",
    emoji: "🐰",
  },
  {
    name: "Castlerigg Stone Circle",
    tag: "Neolithic. Free",
    detail:
      "Near Keswick. One of the earliest stone circles in Britain. Free to visit. The views are as good as the stones. Allow 30 minutes.",
    href: "/attractions",
    emoji: "🪨",
  },
  {
    name: "Brantwood",
    tag: "Ruskin's home",
    detail:
      "Coniston. John Ruskin's house. Art, gardens, and lake views. Good for a rainy afternoon. Café.",
    href: "/attractions",
    emoji: "🎨",
  },
  {
    name: "Theatre by the Lake",
    tag: "Keswick",
    detail:
      "Professional theatre on the lake shore. Year-round programme. Worth booking for an evening if you're staying in Keswick.",
    href: "/attractions",
    emoji: "🎭",
  },
  {
    name: "Abbot Hall",
    tag: "Art gallery",
    detail:
      "Kendal. Georgian art gallery with a strong collection. Good for a half-day when the weather turns.",
    href: "/attractions",
    emoji: "🖼️",
  },
];

const WALKS = [
  {
    name: "Helvellyn",
    rank: "England's third highest",
    detail:
      "The most popular fell in the Lakes. Striding Edge and Swirral Edge are the classic routes. Striding Edge in mist is not a joke. Go early, check the forecast, bring layers. The summit can be brutal even in summer.",
    open: "Year-round. Check conditions in winter",
    tag: "Classic ridge walk",
    tagColor: "bg-green-100 text-green-800",
    href: "/walks",
    emoji: "⛰️",
  },
  {
    name: "Scafell Pike",
    rank: "England's highest",
    detail:
      "3,209 feet. The big one. Multiple routes. Wasdale is the shortest but still a proper day. Seathwaite from Borrowdale is longer. Allow 6 to 8 hours. Take a map. Weather changes fast.",
    open: "Year-round. Winter needs experience",
    tag: "England's summit",
    tagColor: "bg-blue-100 text-blue-800",
    href: "/walks",
    emoji: "🏔️",
  },
  {
    name: "Catbells",
    rank: "Family-friendly",
    detail:
      "Above Derwentwater. The classic introductory fell. Steep in places but achievable for most. Views over the lake and across to Skiddaw. Gets busy. Go early.",
    open: "Year-round",
    tag: "Best first fell",
    tagColor: "bg-amber-100 text-amber-800",
    href: "/walks",
    emoji: "🥾",
  },
  {
    name: "Old Man of Coniston",
    rank: "Coniston's landmark",
    detail:
      "The pyramid above Coniston village. Multiple routes. The tourist path from the village is straightforward. Allow 4 to 5 hours. Good views over the lake and the southern fells.",
    open: "Year-round",
    tag: "Coniston's peak",
    tagColor: "bg-purple-100 text-purple-800",
    href: "/walks",
    emoji: "⛰️",
  },
];

const AUDIENCE_PANELS = [
  {
    icon: Baby,
    title: "Lake District with Kids",
    desc: "Grizedale sculpture trail, Brockhole, Lakes Aquarium, steam trains, and gentle walks. The Lakes works for families if you pick the right spots.",
    href: "/blog",
    cta: "Family guide →",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    icon: PoundSterling,
    title: "Free Things to Do",
    desc: "The fells, the lakeshores, the views. Most of the best stuff costs nothing. Castlerigg, Tarn Hows circuit, and any walk from the door.",
    href: "/blog",
    cta: "Free days out →",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  },
  {
    icon: CloudRain,
    title: "Rainy Day Options",
    desc: "Lakes Aquarium, Hill Top, Abbot Hall, Theatre by the Lake, and the cafés of Ambleside and Keswick. The weather builds character.",
    href: "/blog",
    cta: "Rainy day guide →",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  },
  {
    icon: Wine,
    title: "The Lakes for Adults",
    desc: "Fell walking, lake cruises, country pubs, and restaurants. The Lakes without children is a different experience. Book ahead at weekends.",
    href: "/restaurants",
    cta: "Restaurants & pubs →",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
];

const EVENTS = [
  { month: "Mar", event: "Keswick Mountain Festival", desc: "Outdoor activities and speakers.", free: false },
  { month: "May", event: "Grasmere Sports", desc: "Traditional Cumbrian wrestling and fell races.", free: true },
  { month: "Jul", event: "Kendal Calling", desc: "Music festival. Book early.", free: false },
  { month: "Aug", event: "Grasmere Rushbearing", desc: "Traditional village festival.", free: true },
  { month: "Sep", event: "Great North Swim", desc: "Windermere. Open water swimming event.", free: false },
  { month: "Oct", event: "Keswick Beer Festival", desc: "Cask ales and music.", free: false },
];

const FAQS = [
  {
    q: "What is there to do in the Lake District?",
    a: "Walking the fells, cruising the lakes, wildlife at Haweswater and Grizedale, culture at Dove Cottage and Hill Top, water sports on Windermere and Coniston, and village-hopping between Ambleside, Keswick, and Grasmere. The Lakes has more than most people fit into one trip.",
  },
  {
    q: "Is the Lake District good for families?",
    a: "Yes, if you pick the right spots. Grizedale, Brockhole, the steam railway, and gentle walks like Tarn Hows or around Derwentwater work well. Catbells is achievable for older kids. Avoid the big fells with young children unless they're experienced.",
  },
  {
    q: "What is the Lake District famous for?",
    a: "The fells, the lakes, Wordsworth, Beatrix Potter, and walking. Scafell Pike is England's highest mountain. Windermere is England's largest lake. The Wainwrights (214 fells) draw completionists from around the world.",
  },
  {
    q: "Which lake is best to visit?",
    a: "Depends what you want. Windermere has the most going on. Derwentwater has the best views. Ullswater is often called the most beautiful. Coniston is quieter. All are worth a day.",
  },
  {
    q: "How far is Keswick from Windermere?",
    a: "About 25 miles by road, roughly 45 minutes. The A591 runs through the middle. Ambleside and Grasmere are on the way. Allow longer in summer when the roads are busy.",
  },
  {
    q: "What is free to do in the Lake District?",
    a: "Walking. The fells, the lakeshores, Castlerigg stone circle, Tarn Hows, and most of the best views cost nothing. Parking charges apply at many car parks. The bus is a good way to avoid parking fees.",
  },
  {
    q: "When is the best time to visit the Lake District?",
    a: "Spring and autumn for fewer crowds and good walking weather. Summer is busy but the long days help. Winter can be spectacular but check conditions before heading onto the fells.",
  },
  {
    q: "Are dogs allowed in the Lake District?",
    a: "Yes, in most places. Keep dogs on leads near livestock. Some areas have seasonal restrictions. The main tourist attractions vary. Check before you go.",
  },
];

const PAGE_LD = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Lake District",
  description:
    "The Lake District, Cumbria. Fells, lakes, walking, wildlife, and culture. England's largest national park.",
  url: `${BASE_URL}/things-to-do`,
  touristType: ["Family", "Walking", "Nature", "Culture", "Adventure"],
  geo: { "@type": "GeoCoordinates", latitude: 54.4609, longitude: -3.0886 },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Things to Do in the Lake District", item: `${BASE_URL}/things-to-do` },
  ],
};

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ThingsToDoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />

      <div className="min-h-screen bg-[#EAEDE8]">

        {/* Hero — walks-style */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2A6B8A] to-[#245E3F]">
          <div className="absolute inset-0">
            <Image
              src={HERO_IMAGE_URL}
              alt="Lake District fells and landscape"
              fill
              sizes="100vw"
              quality={80}
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A6B8A] to-[#245E3F] opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
          </div>

          <div className="relative container mx-auto px-4 max-w-7xl py-14 md:py-20 lg:py-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-[#C4782A] text-[#14231C] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                The Complete Guide
              </span>
              <span className="text-white/50 text-sm font-medium">TheLakesGuide.co.uk</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Things to Do in the <span className="text-[#C4782A]">Lake District</span>
            </h1>
            <p className="text-white/80 text-lg lg:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] max-w-2xl mb-8">
              Most people come for the walking. The fells, the lakes, the views. But there&apos;s more. Wildlife at Haweswater.
              Steamers on Windermere. Beatrix Potter and Wordsworth. This is the guide the tourism boards don&apos;t write.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#lakes"
                className="bg-[#C4782A] hover:bg-[#E8B87A] text-[#14231C] px-7 py-3.5 rounded-full font-bold text-sm transition-colors"
              >
                Explore the Guide
              </a>
              <Link
                href="/events"
                className="bg-white/10 border border-white/25 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-colors hover:bg-white/20"
              >
                Events →
              </Link>
            </div>
          </div>

          <div className="relative h-8 overflow-hidden">
            <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 32L360 16C720 0 1080 0 1440 16V32H0Z" fill="#14231C" />
            </svg>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="sticky top-16 z-20 bg-[#14231C]/97 backdrop-blur-sm border-b border-white/10 shadow-lg">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex gap-0.5 overflow-x-auto py-2.5 scrollbar-hide">
              {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 text-white/60 hover:text-[#C4782A] text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-white/5 whitespace-nowrap transition"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative bg-[#14231C] text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#14231C]/80 via-[#14231C]/60 to-[#14231C]/80" />
          <div className="relative container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/10">
              {[
                { value: "16", unit: "lakes", label: "major lakes" },
                { value: "214", unit: "fells", label: "Wainwrights" },
                { value: "3,209", unit: "ft", label: "Scafell Pike" },
                { value: "10.5", unit: "miles", label: "Windermere" },
                { value: "1", unit: "of 15", label: "UK national parks" },
                { value: "912", unit: "sq miles", label: "national park" },
              ].map((s) => (
                <div key={s.label} className="text-center px-4 py-6">
                  <div className="text-2xl font-extrabold text-[#C4782A]">{s.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{s.unit}</div>
                  <div className="text-[11px] text-white/40 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-7xl space-y-24">

          {/* Damian's Take */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 border-l-4 border-l-[#C4782A]">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-3">Damian&apos;s Take</p>
              <h2 className="font-display text-3xl font-bold text-[#14231C] mb-6">Why the Lakes Keeps Drawing People Back</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-[1.05rem]">
                <p>
                  I&apos;ve walked Helvellyn a dozen times. Striding Edge in mist is not a joke. Go early, check the forecast, and bring layers. The summit can be brutal even in summer. But when the conditions are right, there&apos;s nowhere better.
                </p>
                <p>
                  The Lakes isn&apos;t just about the big fells. The ospreys at Haweswater are worth the drive. Grizedale has red squirrels and a sculpture trail that works for families. Windermere cruises are touristy but the views are genuinely good. And the villages, Ambleside, Keswick, Grasmere, each have their own character.
                </p>
                <p>
                  The guide below covers all of it. We&apos;ve been honest about what&apos;s worth your time and what isn&apos;t, and we&apos;ve included the practical details that the official tourism sites tend to leave out.
                </p>
              </div>
            </div>
          </section>

          {/* The Lakes */}
          <section id="lakes" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">On the Water</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">The Lakes</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Four of the main lakes, each with a different character. Cruises, kayaking, and quiet shores.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {LAKES.map((lake) => (
                <div key={lake.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`bg-gradient-to-r ${lake.gradient} px-6 py-5`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">{lake.tag}</span>
                        <h3 className="font-display text-xl font-bold text-white mt-1">{lake.name}</h3>
                      </div>
                      <span className="text-3xl">{lake.emoji}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-[#C4782A]/10 border border-[#C4782A]/20 rounded-lg px-3 py-2 mb-4">
                      <p className="text-[11px] font-bold text-[#C4782A] uppercase tracking-wider">{lake.highlight}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-5 text-sm">{lake.description}</p>
                    <div className="space-y-2 mb-5">
                      {lake.practical.map((tip) => (
                        <div key={tip} className="flex gap-2 text-xs text-gray-600">
                          <ChevronRight className="w-3.5 h-3.5 text-[#C4782A] flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={lake.href}
                      className="inline-flex items-center gap-1.5 text-[#C4782A] font-semibold text-sm hover:text-[#14231C] transition-colors"
                    >
                      Explore Activities <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#14231C] rounded-2xl p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-1">Water Sports</p>
                  <h3 className="font-display text-xl font-bold">Kayaking, Sailing, Paddleboarding</h3>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    Windermere and Coniston have the most options. Derwentwater and Ullswater have hire too. Book ahead at weekends in summer.
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="flex-shrink-0 bg-[#C4782A] text-[#14231C] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#E8B87A] transition-colors"
                >
                  Walking &amp; Activities →
                </Link>
              </div>
            </div>
          </section>

          {/* Family Days Out */}
          <section id="family" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">With Kids</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Family Days Out</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                The Lake District works for families. These are the spots that actually deliver.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FAMILY.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h3 className="font-display font-bold text-[#14231C] text-lg mb-0.5">{item.name}</h3>
                  <p className="text-[#C4782A] text-xs font-semibold mb-3">{item.sub}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.detail}</p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-gray-500 font-medium">{item.practical}</p>
                  </div>
                  <Link href={item.href} className="text-[#C4782A] text-sm font-semibold hover:text-[#14231C] transition-colors flex items-center gap-1">
                    More info <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Nature & Wildlife */}
          <section id="nature" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Beyond the Fells</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Nature &amp; Wildlife</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Ospreys, red squirrels, and one of the best wetland reserves in the North West.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {NATURE.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className={`px-6 py-5 ${item.color === "green" ? "bg-gradient-to-r from-[#1A4020] to-[#2E6830]" : "bg-gradient-to-r from-[#2A6B8A] to-[#1E8AB0]"}`}>
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">{item.org}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <h3 className="font-display text-xl font-bold text-white">{item.name}</h3>
                      <span className="text-3xl">{item.emoji}</span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">{item.vol}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-5 text-sm">{item.story}</p>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#14231C] mb-3">Practical Information</h4>
                    <div className="space-y-2">
                      {item.tips.map((tip) => (
                        <div key={tip} className="flex gap-2 text-xs text-gray-600">
                          <ChevronRight className="w-3.5 h-3.5 text-[#C4782A] flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Culture & Heritage */}
          <section id="culture" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">History &amp; Culture</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Culture &amp; Heritage</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Wordsworth, Beatrix Potter, Ruskin, and stone circles. The Lakes has more than the scenery.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CULTURE.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#C4782A]/30 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <p className="text-[#C4782A] text-[11px] font-bold uppercase tracking-wider mb-1">{item.tag}</p>
                  <h3 className="font-display font-bold text-[#14231C] text-lg mb-3 group-hover:text-[#C4782A] transition-colors">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Walks & Fells */}
          <section id="walks" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">The Fells</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Walks &amp; Fells</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                The 214 Wainwrights draw completionists. These four are the ones everyone should know.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {WALKS.map((course) => (
                <div key={course.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${course.tagColor}`}>{course.tag}</span>
                      <h3 className="font-display text-xl font-bold text-[#14231C] mt-2">{course.name}</h3>
                      <p className="text-[#C4782A] text-xs font-semibold mt-0.5">{course.rank}</p>
                    </div>
                    <span className="text-3xl flex-shrink-0">{course.emoji}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.detail}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">{course.open}</p>
                    <Link href={course.href} className="text-[#C4782A] text-sm font-semibold hover:text-[#14231C] transition-colors flex items-center gap-1">
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#1A4020] to-[#2E6830] rounded-2xl p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-1">The Wainwrights</p>
                  <h3 className="font-display text-xl font-bold">214 Fells</h3>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    Alfred Wainwright documented 214 fells in his seven Pictorial Guides. Completionists come from around the world to tick them all. Start with the classics and work up.
                  </p>
                </div>
                <Link
                  href="/walks"
                  className="flex-shrink-0 bg-[#C4782A] text-[#14231C] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#E8B87A] transition-colors"
                >
                  Walks Guide →
                </Link>
              </div>
            </div>
          </section>

          {/* Activities */}
          <section id="activities" className="scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Sport &amp; Outdoors</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Activities</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                The Lakes is built for outdoor activity. Water, bikes, and climbing.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { emoji: "🚣", title: "Kayaking & Canoeing", detail: "Windermere, Coniston, Derwentwater, and Ullswater all have hire. Calm water options for beginners. Book ahead at weekends.", link: "/activities" },
                { emoji: "🚴", title: "Mountain Biking", detail: "Grizedale Forest has graded trails. Whinlatter has a purpose-built centre. The roads are serious for road cyclists.", link: "/activities" },
                { emoji: "🧗", title: "Climbing & Via Ferrata", detail: "Honister has the Via Ferrata. Shepherd's Crag in Borrowdale. Plenty of outdoor centres for instruction.", link: "/activities" },
                { emoji: "🥾", title: "Walking", detail: "The main event. From gentle lakeside strolls to the big fells. Check the forecast. Take a map. Know your exit.", link: "/walks" },
                { emoji: "⛵", title: "Sailing", detail: "Windermere and Coniston have sailing clubs and hire. Derwentwater too. The lake is usually calm enough for beginners.", link: "/activities" },
                { emoji: "🚣", title: "Paddleboarding", detail: "Stand-up paddleboarding has taken off. Windermere and Coniston. Hire available. Wetsuits recommended outside summer.", link: "/activities" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#C4782A]/30 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h3 className="font-display font-bold text-[#14231C] text-lg mb-2 group-hover:text-[#C4782A] transition-colors">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Shopping */}
          <section id="shopping" className="scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Shops &amp; Villages</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Shopping in the Lake District</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Keswick, Ambleside, and Windermere have the main shopping. Grasmere for gingerbread. Hawkshead for Beatrix Potter.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { name: "Keswick", sub: "Outdoor gear and independents", detail: "The main town in the north. Outdoor shops, bookshops, and cafés. Good for a browse after a walk.", href: "/shopping", emoji: "🏔️" },
                { name: "Ambleside", sub: "Independent boutiques", detail: "Outdoor shops, galleries, and cafés. Compact and walkable. Good for a lunch stop.", href: "/shopping", emoji: "🏘️" },
                { name: "Grasmere", sub: "Gingerbread and village shops", detail: "Famous for Sarah Nelson's gingerbread. Small, traditional, and busy in summer.", href: "/shopping", emoji: "🍪" },
                { name: "Hawkshead", sub: "Beatrix Potter country", detail: "Cobbled village. Near Hill Top. Independent shops and tea rooms.", href: "/shopping", emoji: "🏚️" },
                { name: "Bowness", sub: "Windermere's hub", detail: "Tourist shops, restaurants, and the lake. Busy in summer. Good for boat hire.", href: "/shopping", emoji: "🛶" },
                { name: "Kendal", sub: "Gateway town", detail: "The main town before the Lakes. High street shops, Abbot Hall, and a good base.", href: "/shopping", emoji: "🛒" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#C4782A]/30 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <p className="text-[#C4782A] text-[11px] font-bold uppercase tracking-wider mb-1">{item.sub}</p>
                  <h3 className="font-display font-bold text-[#14231C] text-lg mb-2 group-hover:text-[#C4782A] transition-colors">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Events */}
          <section id="events" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Year-Round</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Events in the Lake District</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Mountain festivals, traditional sports, and music. The calendar runs year-round.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {EVENTS.map((ev) => (
                <div key={ev.event} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#C4782A] text-xs font-black uppercase tracking-widest">{ev.month}</span>
                    {ev.free && (
                      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">FREE</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-[#14231C] text-sm leading-snug mb-1">{ev.event}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{ev.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[#14231C] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#245E3F] transition-colors"
            >
              Full Events Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* Plan Your Visit */}
          <section className="scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Plan Your Visit</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">What Kind of Trip?</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg">
                Different visitors want very different things from the Lakes. Here&apos;s the guide by type.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {AUDIENCE_PANELS.map((panel) => (
                <Link
                  key={panel.title}
                  href={panel.href}
                  className="relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end hover:shadow-xl transition-all group"
                >
                  <Image
                    src={panel.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={75}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  <div className="relative p-6">
                    <panel.icon className="w-7 h-7 mb-2 text-[#C4782A]" />
                    <h3 className="font-display font-bold text-white text-lg mb-1.5 group-hover:text-[#C4782A] transition-colors">{panel.title}</h3>
                    <p className="text-white/70 text-xs leading-relaxed mb-3 line-clamp-3">{panel.desc}</p>
                    <span className="text-[#C4782A] text-sm font-semibold flex items-center gap-1">
                      {panel.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Where to Eat & Stay strip */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Complete Your Visit</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#14231C]">Where to Eat &amp; Stay</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <Link href="/restaurants" className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-[#EAEDE8] transition">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition">
                  <MapPin className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-[#14231C] text-lg mb-1 group-hover:text-[#C4782A] transition-colors">Restaurants</h3>
                <p className="text-gray-500 text-sm">From pub grub to fine dining. Book ahead at weekends.</p>
              </Link>
              <Link href="/hotels" className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-[#EAEDE8] transition">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-display font-bold text-[#14231C] text-lg mb-1 group-hover:text-[#C4782A] transition-colors">Hotels</h3>
                <p className="text-gray-500 text-sm">B&Bs, inns, and hotels. From budget to luxury.</p>
              </Link>
              <Link href="/pubs" className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-[#EAEDE8] transition">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
                  <Wine className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-display font-bold text-[#14231C] text-lg mb-1 group-hover:text-[#C4782A] transition-colors">Pubs</h3>
                <p className="text-gray-500 text-sm">Post-walk pubs. Real ale and lake views.</p>
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-28">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C4782A] font-bold mb-2">Common Questions</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14231C]">Things to Do in the Lake District, FAQs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-display font-bold text-[#14231C] text-base mb-2 flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-[#C4782A] flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#14231C] rounded-2xl p-8 md:p-12 text-center text-white">
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest mb-3">Lake District Business?</p>
            <h2 className="font-display text-3xl font-bold mb-4">Get Your Business in Front of Visitors</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              TheLakesGuide.co.uk is the independent visitor guide to the Lake District. List your restaurant,
              hotel, or activity and reach people actively planning a visit.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/claim-listing"
                className="bg-[#C4782A] hover:bg-[#E8B87A] text-[#14231C] px-8 py-3.5 rounded-full font-bold transition-colors"
              >
                List Your Business
              </Link>
              <Link
                href="/advertise"
                className="bg-white/10 border border-white/25 text-white px-8 py-3.5 rounded-full font-semibold transition-colors hover:bg-white/20"
              >
                Advertising Options
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
