import Link from "next/link";
import Image from "next/image";
import {
  Waves,
  MapPin,
  Users,
  Flag,
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
} from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = "https://www.southportguide.co.uk";

export const metadata: Metadata = {
  title: "Things to Do in Southport | The Complete Local Guide | SouthportGuide.co.uk",
  description:
    "The definitive guide to things to do in Southport — 22 miles of coastline, England's Golf Coast, red squirrels at Formby, Antony Gormley's Another Place, family attractions, culture, and the UK's biggest events calendar. Written by locals.",
  keywords:
    "things to do in Southport, things to do Southport, Southport attractions, Southport beaches, Southport with kids, free things to do Southport, things to do in Southport Merseyside",
  alternates: { canonical: `${BASE_URL}/things-to-do` },
  openGraph: {
    title: "Things to Do in Southport | The Complete Local Guide",
    description:
      "From Formby's red squirrels to Royal Birkdale, Antony Gormley's iron men to England's second-longest pier — the guide the tourism boards don't write.",
    url: `${BASE_URL}/things-to-do`,
    images: [{ url: `${BASE_URL}/southport-pier.webp` }],
  },
};

const QUICK_LINKS = [
  { href: "#beaches", label: "Beaches", icon: Waves },
  { href: "#family", label: "Family Days Out", icon: Baby },
  { href: "#nature", label: "Nature & Wildlife", icon: TreePine },
  { href: "#culture", label: "Culture & Heritage", icon: Landmark },
  { href: "#golf", label: "Golf", icon: Flag },
  { href: "#activities", label: "Activities", icon: Dumbbell },
  { href: "#shopping", label: "Shopping", icon: ShoppingBag },
  { href: "#events", label: "Events 2026", icon: CalendarDays },
  { href: "#faq", label: "FAQs", icon: Star },
];

const BEACHES = [
  {
    name: "Formby Beach",
    tag: "National Trust · Red Squirrels",
    highlight: "22,200 searches/mo — the region's most searched beach",
    description:
      "Seven miles of sand backed by pine woodland where native red squirrels still survive — one of only twelve refuges left in Britain. Walk the Lifeboat Road pinewood trails at dawn in spring or autumn and you'll see them. The beach itself is vast and backed by dramatic dunes; at low tide, prehistoric footprints from 8,000 BC occasionally emerge from the sand. One of the genuinely extraordinary days out within reach of Southport.",
    practical: [
      "Parking: Lifeboat Road car park, L37 — £8.50 per car. Victoria Road car park currently closed for conservation works.",
      "Go early on weekdays to avoid queues in summer.",
      "Squirrel nuts available from the Warden's Office on-site.",
      "7 miles south of Southport — 15 minutes by car or train (Formby station).",
      "Dogs welcome, on leads in the squirrel reserve.",
    ],
    gradient: "from-[#1A4020] to-[#2E6830]",
    emoji: "🐿️",
    href: "/beaches-parks",
  },
  {
    name: "Southport Beach",
    tag: "Town Centre · Marine Lake",
    highlight: "9,900 searches/mo — Southport's famous main beach",
    description:
      "Southport Beach is enormous — one of the widest in England. At low tide the sea can be a kilometre away, making it a landscape to walk through rather than a swim spot (though the tide does come in). The best time to visit is at sunset, when the light across the flats is genuinely spectacular. The beach sits alongside Marine Lake, Adventure Coast, and King's Gardens — you can easily make a full day of it without touching the sea at all.",
    practical: [
      "Access via Marine Drive / the Promenade — postcode PR8 1RX.",
      "Free parking along Marine Drive bays.",
      "Best at low to mid-tide for walking; check tide times before you go.",
      "Dog-friendly year-round on most sections.",
      "10-minute walk from Southport town centre and train station.",
    ],
    gradient: "from-[#1A5C7A] to-[#1E8AB0]",
    emoji: "🏖️",
    href: "/guides/southport-beach",
  },
  {
    name: "Ainsdale Beach",
    tag: "Nature Reserve · Dog-Friendly",
    highlight: "6,600 searches/mo — the local's quieter choice",
    description:
      "Two miles south of Southport, Ainsdale is backed by one of north-west Europe's most important dune systems — a Site of Special Scientific Interest home to natterjack toads, sand lizards, and great crested newts. Blue Flag awarded. Noticeably quieter than Southport Beach, with a more natural feel. The beach here is genuinely wide even at higher tide, making it the best choice when you want sand underfoot rather than a hike across the flats.",
    practical: [
      "Car park on Shore Road, Ainsdale — pay and display.",
      "Dog-friendly year-round.",
      "Blue Flag beach — high water quality.",
      "4 miles from Southport town centre; direct train to Ainsdale station.",
      "Café and facilities in the car park area.",
    ],
    gradient: "from-[#1A5C5B] to-[#2E8B7A]",
    emoji: "🌿",
    href: "/beaches-parks",
  },
  {
    name: "Crosby Beach",
    tag: "Antony Gormley · Another Place",
    highlight: "18,100 searches/mo — the art installation that stops people in their tracks",
    description:
      "One hundred cast-iron figures, each weighing 650 kilos, spread across three kilometres of tidal beach — all facing out to sea. Antony Gormley's *Another Place* is one of the most quietly powerful pieces of public art in England. Each figure is a cast of Gormley's own body. They're most visible at low tide, at their most dramatic at sunset. Technically 14 miles south of Southport, but an obvious pairing for any visit to the area.",
    practical: [
      "Best visited at low tide — check tide times before you go.",
      "Do not walk to the furthest figures — stay within 50 metres of the promenade.",
      "Nearest stations: Hall Road, Blundellsands & Crosby (Merseyrail, every 15 mins).",
      "Parking at Hall Road or Crosby Leisure Centre.",
      "Allow 1 hour. Free to visit. Year-round.",
    ],
    gradient: "from-[#2A3F5C] to-[#3A5070]",
    emoji: "🗿",
    href: "/attractions",
  },
];

const FAMILY = [
  {
    name: "Adventure Coast Southport",
    sub: "Formerly Southport Pleasureland",
    detail:
      "30+ rides across four themed lands — Cartoon Boardwalk, Viking Landing, Steampunk Bay, and Pirate Cove. Free to enter; pay per ride or buy a wristband. Open weekends and selected weekdays, late March to end of September, 11am–5pm. The Enigma thrill ride, Ghost Train, and Loki's Log Flume are the headline acts; there's plenty for toddlers too.",
    practical: "Marine Drive, PR8 1RX · 15 min walk from Southport station · Free entry",
    emoji: "🎢",
    href: "/attractions",
  },
  {
    name: "King's Gardens",
    sub: "17 acres · Completely free",
    detail:
      "Southport's best free afternoon. The 17-acre gardens include a large adventure playground (with a separate fenced area for under-5s with baby swings), fountains, crazy golf, pedalos, the Victorian Venetian Bridge, and plenty of grass for a picnic. Fully accessible paths. Right on the seafront, next to Marine Lake.",
    practical: "Marine Drive, PR8 1RX · Free entry · Accessible · Open year-round",
    emoji: "🏡",
    href: "/attractions",
  },
  {
    name: "Splash World",
    sub: "Indoor water park — all weather",
    detail:
      "The answer to the inevitable Lancashire question. Splash World is Southport's indoor water park, with slides, pools, and water play for all ages. Fully under cover, which makes it the obvious backup plan when the weather turns.",
    practical: "Esplanade, PR8 1RX · Near Adventure Coast · Check opening times online",
    emoji: "🌊",
    href: "/activities",
  },
  {
    name: "Marine Lake",
    sub: "140 acres · Motorboats · Pedalos",
    detail:
      "One of the largest man-made lakes in the UK, right in the heart of Southport. Hire motorboats, jet skis, or swan pedalos by the hour. Lake cruises run in summer. Pram-friendly paths run around the whole perimeter — good for a walk with younger children even without getting on the water.",
    practical: "Marine Drive · Boat hire from Marine Lake · Accessible pathways",
    emoji: "⛵",
    href: "/activities",
  },
  {
    name: "Southport Model Railway Village",
    sub: "UK's first model railway village",
    detail:
      "The first model railway village ever built in the UK. 45mm G-gauge trains run through a miniature village built to replicate south west Lancashire architecture. Niche and wonderful — ideal for a couple of hours with children or grandchildren who have any interest in railways.",
    practical: "Kings Gardens, Marine Drive · Check seasonal opening times",
    emoji: "🚂",
    href: "/attractions",
  },
  {
    name: "British Lawnmower Museum",
    sub: "The world's strangest museum",
    detail:
      "Genuinely the most peculiar museum in England. Over 200 vintage and celebrity lawnmowers — including machines owned by Nicholas Parsons, Brian May, and HRH Prince Charles. Inexplicably compelling. Allow 45 minutes and come with an open mind.",
    practical: "106 Shakespeare Street, PR8 5AJ · Small admission charge · Year-round",
    emoji: "🌱",
    href: "/attractions",
  },
];

const NATURE = [
  {
    name: "RSPB Marshside",
    org: "Royal Society for the Protection of Birds",
    vol: "Free entry · 80,000+ Pink-footed Geese · PR9 9PH",
    story:
      "On the northern edge of Southport — five minutes from Churchtown — and almost completely unknown to visitors. Free entry to one of the best birdwatching sites in the North West. In winter, 80,000+ Pink-footed Geese roost on the Ribble Estuary and flight overhead at dusk; the noise arrives before the birds do. Nel's Hide looks over the managed scrapes with breeding Avocets in spring. The coastal saltmarsh path on the other side of the sea wall adds a completely different walk — flat, exposed, tidal pools, big sky. Dogs on leads throughout.",
    tips: [
      "Car park on Redshank Road — £1.50 up to 2 hrs, £3 over 2 hrs. RSPB members free.",
      "Car park hours: 8:30am–4pm (Nov–Mar), 8:30am–5pm (Mar–Oct). Locked at closing.",
      "Nel's Hide open 8:30am–4pm. Guide dogs only inside. Bring a flask — no café on site.",
      "Pink-footed Geese: October–March at dusk on the sea wall viewpoints.",
      "Dogs allowed on leads on paths and coastal saltmarsh. Keep off the saltmarsh itself.",
    ],
    color: "blue",
    emoji: "🦆",
  },
  {
    name: "Formby Red Squirrel Reserve",
    org: "National Trust",
    vol: "One of twelve red squirrel refuges in Britain",
    story:
      "The red squirrel population at Formby nearly collapsed after a squirrelpox outbreak in 2008. It has since recovered, and Formby remains one of the last places in England to see native red squirrels in the wild. The pine woodland above the dunes is their habitat — walk quietly on the signposted trails and you'll often spot them, especially in the early morning. Spring and autumn are the best seasons.",
    tips: [
      "Go early — the squirrels are most active in the first two hours after dawn.",
      "Spring (April–May) and autumn (September–October) offer best sightings.",
      "Squirrel nuts available from the Warden's Office to attract them.",
      "Stay on signposted paths through the pine woodland above the beach.",
      "Dogs must be on leads in the squirrel reserve.",
    ],
    color: "green",
    emoji: "🐿️",
  },
  {
    name: "WWT Martin Mere Wetland Centre",
    org: "Wildfowl & Wetlands Trust",
    vol: "600 acres · 10 miles from Southport",
    story:
      "One of the best wildlife experiences in the North West, yet almost entirely unknown to people visiting Southport. Martin Mere's 600 acres of wetland attract thousands of migratory birds each year — pink-footed geese in winter, breeding lapwing and redshank in spring, marsh harriers and avocets through summer. Year-round otters, kingfishers, and canoe safaris on the waterways. Guided walks run Tuesday to Thursday. Free parking; discounted entry if you arrive without a car.",
    tips: [
      "Fish Lane, Burscough, L40 0TA — 10 miles from Southport.",
      "Free parking on site.",
      "Arrive without a car for a discounted entry rate.",
      "Guided walks run Tues–Thurs (seasonal — check wwt.org.uk).",
      "Canoe safaris available to book in advance.",
    ],
    color: "blue",
    emoji: "🦆",
  },
];

const CULTURE = [
  {
    name: "Lord Street",
    tag: "Victorian boulevard · Paris connection",
    detail:
      "A mile-long, tree-lined Victorian boulevard 80 metres wide — so wide because it was built across marshy ground between two sandhills. Prince Louis-Napoléon Bonaparte lived in Southport from 1846 to 1848. When he later became Emperor Napoleon III, he commissioned Baron Haussmann to redesign Paris. The grand, wide, tree-lined boulevards of Paris are widely believed to have been inspired by Lord Street. Walk it with that in mind.",
    href: "/shopping",
    emoji: "🏛️",
  },
  {
    name: "The Atkinson",
    tag: "Museum · Gallery · Theatre",
    detail:
      "Originally Cambridge Hall (built 1874), donated to Southport by cotton manufacturer William Atkinson with £40,000. Now the town's cultural hub: over 3,500 artworks on rotation, 25,000 pieces of social history, the Goodison Egyptology Collection (one of the largest outside London), the Between Land and Sea coastal history museum, a 400-seat theatre, café, library, and tourist information. Gallery and museum entry is free.",
    href: "/attractions",
    emoji: "🎭",
  },
  {
    name: "Churchtown",
    tag: "Medieval village · Botanic Gardens",
    detail:
      "The oldest part of Southport — a village within a town. Most visitors to Southport never find it. St Cuthbert's medieval parish church, Botanic Gardens (opened 1875, established by working men who raised £18,000, now celebrating its 150th anniversary), Botanic Road independent shops, and a pace of life entirely at odds with the seafront. Ten minutes from the town centre by car or bus.",
    href: "/attractions",
    emoji: "🌿",
  },
  {
    name: "Southport Pier",
    tag: "England's second longest · 1,108 metres",
    detail:
      "The second longest pier in England (Southend takes the title, but requires a train). Victorian, restored, and worth the walk. From the end you get a proper sense of the scale of this coastline — the estuary, the dunes, the wide sky over the Irish Sea. On a clear day you can see Wales. Allow 40 minutes for a relaxed return walk.",
    href: "/guides/southport-pier",
    emoji: "🌊",
  },
  {
    name: "Wayfarers Arcade",
    tag: "Grade II listed · Victorian · 125 years old",
    detail:
      "Lord Street's hidden gem. A Grade II listed Victorian shopping arcade, around 125 years old, tucked off the main boulevard. Independents, antiques dealers, a coffee shop, and the particular atmosphere that only a covered Victorian arcade can provide. Worth 20 minutes.",
    href: "/shopping",
    emoji: "🏚️",
  },
  {
    name: "Birkdale Village",
    tag: "Independent boutiques · Village atmosphere",
    detail:
      "A village within the town — and the locals' preference for a quieter afternoon of coffee and shopping. Birkdale has a strong concentration of independent food, fashion, and lifestyle shops along Liverpool Road and the surrounding streets. Two minutes from Royal Birkdale Golf Club.",
    href: "/attractions",
    emoji: "🛍️",
  },
];

const GOLF_COURSES = [
  {
    name: "Royal Birkdale",
    rank: "World Top 25",
    detail:
      "Widely regarded as the finest links course in England and consistently ranked in the world top 25. Hosting The Open Championship for the 11th time in July 2026. The course is famous for its willow scrub rough, towering dunes, and the relentless challenge it presents to the world's best players. Green fees from £210.",
    open: "Open from April · Green fees from £210",
    tag: "The Open 2026 host",
    tagColor: "bg-green-100 text-green-800",
    href: "/the-open-2026",
    emoji: "⛳",
  },
  {
    name: "Hillside Golf Club",
    rank: "UK & Ireland Top 100",
    detail:
      "England Top 100. UK & Ireland Top 100. And yet Hillside has never hosted The Open Championship — a fact that golfers find bewildering and locals take mild satisfaction in. The back nine, running through towering dunes alongside Royal Birkdale's fairways, is as good a stretch of links golf as you'll play anywhere in Britain. Host of the 2019 British Masters. Green fees from £110.",
    open: "Members & visitors · Green fees from £110",
    tag: "Often called Birkdale's equal",
    tagColor: "bg-blue-100 text-blue-800",
    href: "/golf",
    emoji: "⛳",
  },
  {
    name: "Southport & Ainsdale",
    rank: "Open Championship Qualifier",
    detail:
      "Classic links, across the railway line from Hillside. S&A serves as an Open Championship Qualifier course when the Open is at Royal Birkdale. Sir Nick Faldo described the cluster of Birkdale, Hillside, and S&A as 'tough to beat for true links golf anywhere in the world.' Underrated and often underbooked — good value relative to its neighbours.",
    open: "Members & visitors · Green fees from ~£60",
    tag: "Open qualifier course",
    tagColor: "bg-amber-100 text-amber-800",
    href: "/golf",
    emoji: "⛳",
  },
  {
    name: "Hesketh Golf Club",
    rank: "Founded 1885 — Southport's oldest club",
    detail:
      "The most underrated course in the area. Founded in 1885, making it Southport's oldest golf club. Sir Henry Cotton described the 16th hole as 'Lancashire's best Par 3.' Green fees start from £50 — exceptional value for a course of this quality and history. Often the easiest to book, and worth seeking out specifically.",
    open: "Members & visitors · Green fees from £50",
    tag: "Best value in the area",
    tagColor: "bg-purple-100 text-purple-800",
    href: "/golf",
    emoji: "⛳",
  },
];

const AUDIENCE_PANELS = [
  {
    icon: Baby,
    title: "Southport with Kids",
    desc: "King's Gardens (free), Adventure Coast (free entry), Marine Lake pedalos, Splash World, Model Railway Village, and 22 miles of beach. Southport is one of the best family destinations in the North West.",
    href: "/blog/southport-with-kids-full-guide",
    cta: "Full family guide →",
    image: "/images/things-to-do/kids.webp",
  },
  {
    icon: PoundSterling,
    title: "Free Things to Do",
    desc: "King's Gardens, Southport Beach, Ainsdale Beach, Antony Gormley's Another Place, The Atkinson gallery, Botanic Gardens, the Promenade, and the 21-mile Sefton Coastal Path. A full day out costs nothing.",
    href: "/blog/things-to-do-rainy-day-southport",
    cta: "See free days out →",
    image: "/images/things-to-do/free.webp",
  },
  {
    icon: CloudRain,
    title: "Rainy Day Options",
    desc: "The Atkinson (free), Splash World, Funland arcades, Southport Market street food hall, Wayfarers Arcade, and Southport's independent shops on Lord Street. Lancashire weather builds character.",
    href: "/blog/things-to-do-rainy-day-southport",
    cta: "Rainy day guide →",
    image: "/images/things-to-do/rainy.webp",
  },
  {
    icon: Wine,
    title: "Southport for Adults",
    desc: "Golf at England's Golf Coast, cocktails on Lord Street, The Atkinson theatre, spa days, coastal walks, and an events calendar that runs from February to December. Southport without children is a very different experience.",
    href: "/bars-nightlife",
    cta: "Bars & restaurants →",
    image: "/images/things-to-do/adults.webp",
  },
];

const EVENTS_2026 = [
  { month: "Feb", event: "Lightport", desc: "World-class light installation on Lord Street.", free: true },
  { month: "Apr", event: "Cristal Palace", desc: "French street theatre — 15m flying chandelier on Lord Street.", free: true },
  { month: "May", event: "Big Top Festival", desc: "International circus arts. Circa and Gandini Juggling.", free: true },
  { month: "May", event: "Food & Drink Festival", desc: "Best food weekend of the year.", free: true },
  { month: "Jul", event: "The Open Championship", desc: "The 154th Open at Royal Birkdale.", free: false },
  { month: "Aug", event: "Southport Flower Show", desc: "One of England's most prestigious flower shows.", free: false },
  { month: "Aug", event: "Southport Air Show", desc: "Free. Southport Beach. One of the UK's best.", free: true },
  { month: "Sep", event: "British Fireworks Championship", desc: "Victoria Park. Multiple displays over two nights.", free: false },
  { month: "Oct", event: "Southport Comedy Festival", desc: "The Atkinson and venues across town.", free: false },
  { month: "Oct", event: "Books Alive! Literature Festival", desc: "Storytelling installations and author workshops.", free: true },
];

const FAQS = [
  {
    q: "What is there to do in Southport?",
    a: "More than most people expect. Southport has 22 miles of coastline across four distinct beaches, England's Golf Coast with 14 championship courses including Royal Birkdale, the National Trust red squirrel reserve at Formby, Antony Gormley's Another Place at Crosby, The Atkinson cultural centre, the Victorian boulevard of Lord Street (which reportedly inspired the redesign of Paris), WWT Martin Mere wetland, and a year-round events calendar running from Lightport in February to a Comedy Festival in October.",
  },
  {
    q: "Is Southport good for a family day out?",
    a: "Excellent. King's Gardens is free — 17 acres with a large adventure playground. Adventure Coast Southport (the former Pleasureland) has free entry with pay-per-ride. Marine Lake has pedalos and motorboats. Splash World is the indoor water park option for wet days. And there are 22 miles of beach. You can comfortably fill a full day without spending much at all.",
  },
  {
    q: "What is Southport famous for?",
    a: "Southport is best known for its pier (England's second longest at 1,108 metres), its Victorian boulevard Lord Street (reportedly the inspiration for Haussmann's redesign of Paris), the Southport Flower Show, the Air Show, and above all its golf — England's Golf Coast, home to Royal Birkdale, Hillside, and several other courses ranked in the UK's top 100. In 2026, Southport will host The Open Championship for the 11th time.",
  },
  {
    q: "Is Southport Beach worth visiting?",
    a: "Yes, but go with realistic expectations. Southport Beach is enormous — one of the widest in England — but at low tide the sea can be a kilometre away. It's a coastal landscape for walking rather than swimming. The best time to visit is at sunset, or at mid-tide when the water is closer. The beach is most rewarding as part of a wider day combining Marine Lake, King's Gardens, and the Promenade.",
  },
  {
    q: "How far is Formby from Southport?",
    a: "About 7 miles south of Southport town centre — approximately 15 minutes by car, or you can take the Merseyrail Northern Line direct to Formby station, then a short walk to the beach. The National Trust red squirrel reserve is accessed via the Lifeboat Road car park (currently the main car park while Victoria Road is closed for conservation works).",
  },
  {
    q: "What is free to do in Southport?",
    a: "Quite a lot. King's Gardens (free), Southport Beach (free), Ainsdale Beach (free), Crosby Beach and Another Place (free), The Atkinson gallery and museum (free), Botanic Gardens in Churchtown (free), walking the Sefton Coastal Path (free), walking Southport Pier (free entry, though there may be charges for the tram), and the 2026 events Lightport, Cristal Palace, Big Top Festival, Food & Drink Festival, and the Air Show are all free to attend.",
  },
  {
    q: "How long does it take to walk Southport Pier?",
    a: "About 20 minutes each way at a relaxed pace, making the return trip roughly 40 minutes total. The pier is 1,108 metres long. A tram used to run its length but currently walking is the main option. The views from the end are the reward — on a clear day you can see Wales across the estuary.",
  },
  {
    q: "What is the best time to visit Southport?",
    a: "Summer (June to August) for the beach and outdoor events, including the Air Show and Flower Show. Spring and autumn are best for Formby red squirrels and quieter beaches. July 2026 is unmissable for The Open Championship at Royal Birkdale. The town has a solid year-round events calendar — even February has Lightport, one of the best light installations in the North.",
  },
  {
    q: "Are dogs allowed on Southport Beach?",
    a: "Yes. Dogs are welcome year-round on most sections of Southport Beach and on Ainsdale Beach. There are seasonal restrictions on some sections during peak summer months — follow the signage on site. At Formby, dogs must be on leads in the red squirrel reserve but can run on the beach itself.",
  },
];

const PAGE_LD = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Southport",
  description:
    "Southport, Merseyside — seaside resort with 22 miles of coastline, England's Golf Coast, National Trust red squirrel reserve at Formby, and a year-round events calendar.",
  url: `${BASE_URL}/things-to-do`,
  touristType: ["Family", "Golf", "Nature", "Culture", "Beach"],
  geo: { "@type": "GeoCoordinates", latitude: 53.645, longitude: -3.009 },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Things to Do in Southport", item: `${BASE_URL}/things-to-do` },
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

      <div className="min-h-screen bg-[#FAF8F5]">

        {/* ── Hero ── */}
        <div className="relative min-h-[80vh] flex items-end bg-[#1B2E4B] text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/southport-pier.webp"
              alt="Southport Pier and coastline at dusk"
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B2E4B] via-[#1B2E4B]/60 to-[#1B2E4B]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B2E4B]/50 to-transparent" />
          </div>

          <div className="relative container mx-auto px-4 pb-16 pt-32 max-w-7xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-[#C9A84C] text-[#1B2E4B] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  The Complete Guide
                </span>
                <span className="text-white/50 text-sm font-medium">SouthportGuide.co.uk</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-5">
                Things to Do in
                <span className="block text-[#C9A84C]">Southport</span>
              </h1>
              <p className="text-white/75 text-xl max-w-2xl mb-8 leading-relaxed">
                Most people come for the beach. Locals know that&apos;s barely the beginning. Twenty-two miles of coastline.
                England&apos;s Golf Coast. Red squirrels at Formby. Antony Gormley&apos;s iron men at Crosby.
                A street that reportedly inspired the redesign of Paris. This is the guide the tourism boards don&apos;t write.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#beaches"
                  className="bg-[#C9A84C] hover:bg-[#E8C87A] text-[#1B2E4B] px-7 py-3.5 rounded-full font-bold text-sm transition-colors"
                >
                  Explore the Guide
                </a>
                <Link
                  href="/events"
                  className="bg-white/10 border border-white/25 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-colors hover:bg-white/20"
                >
                  Events 2026 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Nav ── */}
        <div className="sticky top-16 z-20 bg-[#1B2E4B]/97 backdrop-blur-sm border-b border-white/10 shadow-lg">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex gap-0.5 overflow-x-auto py-2.5 scrollbar-hide">
              {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 text-white/60 hover:text-[#C9A84C] text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-white/5 whitespace-nowrap transition"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="relative bg-[#1B2E4B] text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/images/things-to-do/stats-bg.webp" alt="" fill sizes="100vw" quality={70} className="object-cover object-center opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B2E4B]/80 via-[#1B2E4B]/60 to-[#1B2E4B]/80" />
          </div>
          <div className="relative container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/10">
              {[
                { value: "22", unit: "miles", label: "of coastline" },
                { value: "14", unit: "courses", label: "England's Golf Coast" },
                { value: "100", unit: "iron figures", label: "Antony Gormley, Crosby" },
                { value: "1,108", unit: "metres", label: "Southport Pier" },
                { value: "1", unit: "of 12", label: "UK red squirrel refuges" },
                { value: "12+", unit: "events", label: "in 2026 alone" },
              ].map((s) => (
                <div key={s.label} className="text-center px-4 py-6">
                  <div className="text-2xl font-extrabold text-[#C9A84C]">{s.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{s.unit}</div>
                  <div className="text-[11px] text-white/40 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-7xl space-y-24">


          {/* ── Terry's Take ── */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 border-l-4 border-l-[#C9A84C]">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-3">Terry&apos;s Take</p>
              <h2 className="font-display text-3xl font-bold text-[#1B2E4B] mb-6">Why Southport Surprises People</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-[1.05rem]">
                <p>
                  Walk down Lord Street on a summer evening and you&apos;re walking down one of Victorian England&apos;s greatest
                  achievements — a mile-long, tree-lined boulevard 80 metres wide, with iron-and-glass verandahs over the
                  shopfronts and architectural detail that would look at home in Paris. Which is apt, because it may have
                  inspired it. Prince Louis-Napoléon Bonaparte lived in Southport from 1846 to 1848. When he later became
                  Emperor Napoleon III and commissioned Haussmann to redesign Paris, those boulevards looked remarkably
                  familiar to anyone who had been to Southport.
                </p>
                <p>
                  But Southport&apos;s offer runs deeper than one brilliant street. Seven miles south, at Formby, red squirrels
                  still live in the pine woodland above the dunes — one of only twelve refuges left in Britain. At Crosby,
                  100 iron figures face out to sea across three kilometres of tidal beach. Inland, WWT Martin Mere is
                  600 acres of wetland with otters and migratory birds that most people driving through Lancashire never
                  know exists. And on the golf course side: Royal Birkdale, Hillside, Southport &amp; Ainsdale, Hesketh —
                  four courses within two miles of each other, three of them ranked in the UK&apos;s top 100, collectively
                  representing some of the finest links golf in the world.
                </p>
                <p>
                  The guide below covers all of it. We&apos;ve been honest about what&apos;s worth your time and what isn&apos;t,
                  and we&apos;ve included the practical details that the official tourism sites tend to leave out.
                  Southport is better than its reputation. Use this guide to find out why.
                </p>
              </div>
            </div>
          </section>

          {/* ── The Beaches ── */}
          <section id="beaches" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Southport&apos;s 22-Mile Coastline</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">The Beaches</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Four very different beaches, each worth knowing about. Not all of them are in Southport, but all of them
                are within easy reach — and each one offers a completely distinct experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {BEACHES.map((beach) => (
                <div key={beach.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`bg-gradient-to-r ${beach.gradient} px-6 py-5`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">{beach.tag}</span>
                        <h3 className="font-display text-xl font-bold text-white mt-1">{beach.name}</h3>
                      </div>
                      <span className="text-3xl">{beach.emoji}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg px-3 py-2 mb-4">
                      <p className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider">{beach.highlight}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-5 text-sm">{beach.description}</p>
                    <div className="space-y-2 mb-5">
                      {beach.practical.map((tip) => (
                        <div key={tip} className="flex gap-2 text-xs text-gray-600">
                          <ChevronRight className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={beach.href}
                      className="inline-flex items-center gap-1.5 text-[#C9A84C] font-semibold text-sm hover:text-[#1B2E4B] transition-colors"
                    >
                      {beach.name === "Southport Beach" ? "Full Beach Guide" : beach.name === "Formby Beach" ? "Formby Guide" : "Explore Beaches & Parks"} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#1B2E4B] rounded-2xl p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-1">21-Mile Walking Route</p>
                  <h3 className="font-display text-xl font-bold">The Sefton Coastal Path</h3>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    A 21-mile signed walking and cycling route running from Crosby Beach in the south to Southport in the north,
                    passing through Formby, Ainsdale, and the Sefton Coast SSSI dunes system. You can walk any section of it independently.
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="flex-shrink-0 bg-[#C9A84C] text-[#1B2E4B] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#E8C87A] transition-colors"
                >
                  Walking &amp; Activities →
                </Link>
              </div>
            </div>
          </section>

          {/* ── Family Days Out ── */}
          <section id="family" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">With Kids</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Family Days Out</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Southport has a strong case as the best family seaside destination in the North West. A summary of what actually exists,
                with the practical details.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FAMILY.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-0.5">{item.name}</h3>
                  <p className="text-[#C9A84C] text-xs font-semibold mb-3">{item.sub}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.detail}</p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-gray-500 font-medium">{item.practical}</p>
                  </div>
                  <Link href={item.href} className="text-[#C9A84C] text-sm font-semibold hover:text-[#1B2E4B] transition-colors flex items-center gap-1">
                    More info <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── Nature & Wildlife ── */}
          <section id="nature" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Beyond the Beach</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Nature &amp; Wildlife</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Three of the best wildlife experiences in the North West — all within 10 miles of Southport, all almost entirely
                overlooked by visitors who come for the beach.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {NATURE.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className={`px-6 py-5 ${item.color === "green" ? "bg-gradient-to-r from-[#1A4020] to-[#2E6830]" : "bg-gradient-to-r from-[#1A5C7A] to-[#1E8AB0]"}`}>
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">{item.org}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <h3 className="font-display text-xl font-bold text-white">{item.name}</h3>
                      <span className="text-3xl">{item.emoji}</span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">{item.vol}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-5 text-sm">{item.story}</p>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B2E4B] mb-3">Practical Information</h4>
                    <div className="space-y-2">
                      {item.tips.map((tip) => (
                        <div key={tip} className="flex gap-2 text-xs text-gray-600">
                          <ChevronRight className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Culture & Heritage ── */}
          <section id="culture" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">History &amp; Culture</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Culture &amp; Heritage</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Southport has a Victorian heritage that most seaside towns can&apos;t match. The Napoleon connection,
                the Atkinson&apos;s Egyptology collection, the medieval village hidden in plain sight — these are the
                things that reward a slower look at the town.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CULTURE.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#C9A84C]/30 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-wider mb-1">{item.tag}</p>
                  <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-3 group-hover:text-[#C9A84C] transition-colors">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Golf ── */}
          <section id="golf" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">England&apos;s Golf Coast</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Golf in Southport</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                England&apos;s Golf Coast encompasses 14 courses, 8 ranked in the UK &amp; Ireland Top 100, and 3 Open Championship venues.
                From Southport you can play four world-class links courses without getting back in the car.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {GOLF_COURSES.map((course) => (
                <div key={course.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${course.tagColor}`}>{course.tag}</span>
                      <h3 className="font-display text-xl font-bold text-[#1B2E4B] mt-2">{course.name}</h3>
                      <p className="text-[#C9A84C] text-xs font-semibold mt-0.5">{course.rank}</p>
                    </div>
                    <span className="text-3xl flex-shrink-0">{course.emoji}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.detail}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">{course.open}</p>
                    <Link href={course.href} className="text-[#C9A84C] text-sm font-semibold hover:text-[#1B2E4B] transition-colors flex items-center gap-1">
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#1A4020] to-[#2E6830] rounded-2xl p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-1">July 2026</p>
                  <h3 className="font-display text-xl font-bold">The Open Championship at Royal Birkdale</h3>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    The 154th Open Championship. 12–19 July 2026. The biggest sporting event in Southport&apos;s modern history.
                    Accommodation is limited — if you&apos;re attending, plan now.
                  </p>
                </div>
                <Link
                  href="/the-open-2026"
                  className="flex-shrink-0 bg-[#C9A84C] text-[#1B2E4B] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#E8C87A] transition-colors"
                >
                  The Open 2026 Guide →
                </Link>
              </div>
            </div>
          </section>

          {/* ── Activities ── */}
          <section id="activities" className="scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Sport &amp; Outdoors</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Activities</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                The coastal setting means the outdoor offer extends well beyond the beach itself.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  emoji: "🚣",
                  title: "Marine Lake Watersports",
                  detail: "Mersey Watersports Centre on Marine Lake offers wakeboarding, sailing, kayaking, and powerboating. The 140-acre lake is sheltered enough for beginners and technical enough to challenge experienced water sports participants.",
                  link: "/activities",
                },
                {
                  emoji: "🏊",
                  title: "Wild Swimming & Sailing",
                  detail: "Crosby Lakeside Adventure Centre, near the Gormley installation, offers sailing lessons, wild swimming, and kayak hire. A good option for a half-day activity alongside a visit to Another Place.",
                  link: "/activities",
                },
                {
                  emoji: "🚴",
                  title: "Coastal Cycling",
                  detail: "NCN Route 62 runs along the Sefton Coast. The Sefton Coastal Path is also suitable for cycling in sections. Flat, scenic, and largely off-road — one of the better cycling routes in the North West.",
                  link: "/activities",
                },
                {
                  emoji: "🥾",
                  title: "Walking",
                  detail: "The Sefton Coastal Path (21 miles, Crosby to Southport) is the headline walk, but shorter options are plentiful — the Formby dune walks, the Lord Street heritage trail, and the Churchtown to Botanic Gardens loop are all worth doing.",
                  link: "/activities",
                },
                {
                  emoji: "🏇",
                  title: "Horse Riding on the Beach",
                  detail: "Seasonal beach rides operate from the Southport area — the wide, flat beach at low tide makes for an exceptional riding surface. Contact local stables for availability.",
                  link: "/activities",
                },
                {
                  emoji: "🎯",
                  title: "Crazy Golf & Leisure",
                  detail: "Multiple crazy golf courses across the town — in King's Gardens and along the Promenade. Traditional seaside amusements at Funland and Fun Palace on the seafront.",
                  link: "/attractions",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#C9A84C]/30 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-2 group-hover:text-[#C9A84C] transition-colors">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Shopping ── */}
          <section id="shopping" className="scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Shops &amp; Markets</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Shopping in Southport</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                Southport has more independent businesses per square metre than most English towns, with Lord Street at the heart.
                Each area has a distinct character.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: "Lord Street",
                  sub: "Victorian boulevard · 1 mile long",
                  detail: "The main event. A mile of Victorian iron-and-glass verandahs sheltering an unusually high concentration of independent boutiques — particularly strong for jewellery, fashion, gifts, and homeware. The street is also simply beautiful; it deserves a slow walk even if you don't intend to buy anything.",
                  href: "/shopping",
                  emoji: "🏛️",
                },
                {
                  name: "Birkdale Village",
                  sub: "Independent · Village atmosphere",
                  detail: "The locals' preference. Liverpool Road in Birkdale has a strong independent retail scene — coffee shops, food, fashion, and lifestyle stores with a neighbourhood feel that Lord Street's scale doesn't always deliver.",
                  href: "/shopping",
                  emoji: "🏘️",
                },
                {
                  name: "Wayfarers Arcade",
                  sub: "Grade II listed · 125 years old",
                  detail: "Lord Street's hidden interior. A Grade II listed Victorian arcade — around 125 years old — with independent traders, antiques, and a café. The architecture alone is worth the detour.",
                  href: "/shopping",
                  emoji: "🏚️",
                },
                {
                  name: "Southport Market",
                  sub: "Street food · Independent traders",
                  detail: "Southport's indoor market hall, with street food vendors alongside independent market traders. Good for a lunch stop while exploring the town centre.",
                  href: "/shopping",
                  emoji: "🏪",
                },
                {
                  name: "Churchtown / Botanic Road",
                  sub: "Design · Local makers",
                  detail: "Botanic Road in Churchtown has a cluster of design-led independent shops — homeware, fashion, accessories, and local makers. Often overlooked by visitors who don't venture out of the town centre.",
                  href: "/shopping",
                  emoji: "🌿",
                },
                {
                  name: "Ocean Plaza & Central 12",
                  sub: "High street brands · Parking",
                  detail: "Southport's retail parks for high street brands. Ocean Plaza is on the seafront; Central 12 is off the main ring road. Both have parking. Neither is the reason to visit Southport, but useful to know.",
                  href: "/shopping",
                  emoji: "🛒",
                },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#C9A84C]/30 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-wider mb-1">{item.sub}</p>
                  <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-2 group-hover:text-[#C9A84C] transition-colors">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Events 2026 ── */}
          <section id="events" className="scroll-mt-28">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Year-Round</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Events in Southport 2026</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg leading-relaxed">
                2026 is exceptional. Ten major events running from February to October — including The Open Championship,
                the Air Show, the Flower Show, and a full cultural programme under the Southport 2026 banner.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              {EVENTS_2026.map((ev) => (
                <div key={ev.event} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#C9A84C] text-xs font-black uppercase tracking-widest">{ev.month}</span>
                    {ev.free && (
                      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">FREE</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-[#1B2E4B] text-sm leading-snug mb-1">{ev.event}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{ev.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[#1B2E4B] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-[#2A4A73] transition-colors"
            >
              Full 2026 Events Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* ── Plan Your Visit ── */}
          <section className="scroll-mt-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Plan Your Visit</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">What Kind of Trip?</h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-lg">
                Different visitors want very different things from Southport. Here&apos;s the guide by type.
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
                    <panel.icon className="w-7 h-7 mb-2 text-[#C9A84C]" />
                    <h3 className="font-display font-bold text-white text-lg mb-1.5 group-hover:text-[#C9A84C] transition-colors">{panel.title}</h3>
                    <p className="text-white/70 text-xs leading-relaxed mb-3 line-clamp-3">{panel.desc}</p>
                    <span className="text-[#C9A84C] text-sm font-semibold flex items-center gap-1">
                      {panel.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Where to Eat & Stay strip ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Complete Your Visit</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1B2E4B]">Where to Eat &amp; Stay</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <Link href="/restaurants" className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-[#FAF8F5] transition">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition">
                  <MapPin className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-1 group-hover:text-[#C9A84C] transition-colors">Restaurants</h3>
                <p className="text-gray-500 text-sm">The best places to eat — from Lord Street fine dining to seafront fish and chips.</p>
              </Link>
              <Link href="/hotels" className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-[#FAF8F5] transition">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-1 group-hover:text-[#C9A84C] transition-colors">Hotels</h3>
                <p className="text-gray-500 text-sm">From The Vincent on Lord Street to B&amp;Bs in Birkdale — accommodation for every budget.</p>
              </Link>
              <Link href="/bars-nightlife" className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-[#FAF8F5] transition">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
                  <Wine className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-display font-bold text-[#1B2E4B] text-lg mb-1 group-hover:text-[#C9A84C] transition-colors">Bars &amp; Pubs</h3>
                <p className="text-gray-500 text-sm">Cocktail bars on Lord Street, village pubs in Birkdale, live music venues across town.</p>
              </Link>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className="scroll-mt-28">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Common Questions</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1B2E4B]">Things to Do in Southport — FAQs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-display font-bold text-[#1B2E4B] text-base mb-2 flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="bg-[#1B2E4B] rounded-2xl p-8 md:p-12 text-center text-white">
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3">Southport Business?</p>
            <h2 className="font-display text-3xl font-bold mb-4">Get Your Business in Front of Visitors</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              SouthportGuide.co.uk is the independent visitor guide to Southport. List your attraction, restaurant,
              hotel, or activity and reach people actively planning a visit.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/claim-listing"
                className="bg-[#C9A84C] hover:bg-[#E8C87A] text-[#1B2E4B] px-8 py-3.5 rounded-full font-bold transition-colors"
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
