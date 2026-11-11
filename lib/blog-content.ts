// Lakes Guide blog content — Damian, TheLakesGuide.co.uk
// Named businesses: say what a place is and offers, from its own website or an
// official page, with no ranking and no criticism (Damian, 11 Nov 2026).

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; emoji?: string; text: string }
  | { type: "quote"; text: string; attr?: string }
  | { type: "cta"; text: string; href: string; label: string }
  | { type: "image"; src: string; alt: string; caption?: string; portrait?: boolean; objectPosition?: string }
  | { type: "video"; src: string; poster: string; caption?: string }
  | { type: "hr" };

export const BLOG_CONTENT: Record<string, ContentBlock[]> = {

  // ─────────────────────────────────────────────────────────────────────────────
  "best-restaurants-keswick": [
    { type: "p", text: "Keswick's cafés, pubs and restaurants are mostly within a few minutes' walk of the Market Square, with a few more out by Derwentwater and up at Whinlatter. These are some of the places you will find. What each one is and serves comes from its own website, checked in November 2026." },
    { type: "h2", text: "In the town centre" },
    { type: "h3", text: "Bryson's, Main Street" },
    { type: "p", text: "42 Main Street, CA12 5JD. A craft bakery and tea rooms, trading in Keswick since 1947. The company also has a tea room in Bowness." },
    { type: "h3", text: "The Square Orange, St John's Street" },
    { type: "p", text: "20 St John's Street, CA12 5AS. A small café bar serving stone-baked Roman-style pizza, tapas and desserts, with coffee, wine and beer. It does not take reservations, and dogs are welcome." },
    { type: "h3", text: "The Dog & Gun, Lake Road" },
    { type: "p", text: "2 Lake Road, CA12 5BT. A pub serving food, known for its homemade Hungarian goulash; the menu also has pies such as steak and ale. It takes walk-ins only, with no advance bookings, and is dog friendly." },
    { type: "h3", text: "Fellpack" },
    { type: "p", text: "Fellpack is a Keswick group with two hotels. Its Fellpack Restaurant is at Fellpack Skiddaw (CA12 4PY), and it also runs The Round, for burgers, and Eight Pizza." },
    { type: "h2", text: "Out of town" },
    { type: "h3", text: "Lodore Falls Hotel & Spa, Borrowdale" },
    { type: "p", text: "On the shore of Derwentwater, CA12 5UX. The hotel has the Mizu Pan-Asian restaurant, the Falls Brasserie and the Lake View Lounge." },
    { type: "h3", text: "The Cottage in the Wood, Whinlatter" },
    { type: "p", text: "Magic Hill, Whinlatter Forest, near Braithwaite, CA12 5TW. A restaurant with eight rooms that describes itself as a Michelin-starred restaurant with rooms, serving a tasting menu. It closes for team holidays from 23 to 29 December 2026 and from 6 to 19 January 2027." },
    { type: "h3", text: "The Pheasant Inn, Bassenthwaite Lake" },
    { type: "p", text: "Bassenthwaite Lake, near Cockermouth, CA13 9YE. A 17th-century coaching inn with rooms, a bar and a restaurant. It is part of The Inn Collection Group and is dog friendly." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "Hours change with the seasons, and some places close for a break in January. Check a place's own website before you set off.",
      "The Dog & Gun and The Square Orange do not take bookings, so arrive early if you want a table at a busy time.",
      "Lakeside car park (CA12 5DJ) is a council car park with 253 spaces, near Theatre by the Lake.",
      "Keswick's street market is on the Market Square every Thursday and Saturday.",
    ]},
    { type: "cta", text: "More on Keswick: Derwentwater, the walks and getting there.", href: "/keswick", label: "Keswick guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "best-pubs-ambleside": [
    { type: "p", text: "Ambleside sits at the head of Windermere, and its pubs are a short walk from each other. The Langdale valley, with its own walkers' inn, is a bus ride west. What each pub is and offers comes from its own website, checked in November 2026." },
    { type: "h2", text: "In Ambleside" },
    { type: "h3", text: "The Golden Rule, Smithy Brow" },
    { type: "p", text: "Smithy Brow, LA22 9AS. A Grade II listed, traditional pub with several rooms, run by Robinsons. It has no background music, no games machines, no big-screen televisions and no meals. There is an open fire and a beer garden. Dogs are welcome throughout, and children until 9pm." },
    { type: "h3", text: "The Unicorn Inn, North Road" },
    { type: "p", text: "North Road, LA22 9DT. A traditional Lakeland pub with rooms, serving Robinsons beer and home-cooked pub food." },
    { type: "h3", text: "The Waterhead Inn, Lake Road" },
    { type: "p", text: "Lake Road, LA22 0ER. A pub with rooms on the shore of Windermere, opposite Waterhead Pier, with a beer garden. It is part of The Inn Collection Group." },
    { type: "h3", text: "The Apple Pie, Rydal Road" },
    { type: "p", text: "Rydal Road, LA22 9AN. Not a pub: an independent, family-run café and bakery, open since 1975, serving breakfast and lunch in the café behind the bakery. It also has rooms." },
    { type: "h2", text: "Near Ambleside" },
    { type: "h3", text: "Old Dungeon Ghyll, Great Langdale" },
    { type: "p", text: "Great Langdale, LA22 9JY. A historic hotel at the head of the Langdale valley. Its bar, the Climbers Bar, has a fireplace, and well-behaved dogs are welcome in the hotel and the bar but not in the dining room. The 516 bus runs from Ambleside to Dungeon Ghyll." },
    { type: "h3", text: "The Drunken Duck, Barngates" },
    { type: "p", text: "Barngates, near Ambleside, LA22 0NG. A small inn with 11 rooms, serving food." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "The Golden Rule serves no meals, so eat first or eat elsewhere.",
      "Ambleside is on the 555 bus, which runs about every hour between Kendal, Windermere, Grasmere and Keswick.",
      "Dogs are welcome in some bars but not always in dining rooms. Check with the pub before you go in with a dog.",
    ]},
    { type: "cta", text: "More on Ambleside: the walks, Waterhead and getting there.", href: "/ambleside", label: "Ambleside guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "helvellyn-what-to-expect": [
    { type: "p", text: "Helvellyn is 950 metres and the third highest summit in England. It is also one of the most popular mountains in the country, so expect company on a fine weekend. Striding Edge, the famous ridge approach, is exposed, and people have died on it. Both things are true." },
    { type: "h2", text: "The routes" },
    { type: "h3", text: "Via Striding Edge from Glenridding" },
    { type: "p", text: "The classic route. Park at the National Park's Beckside car park in Glenridding (CA11 0PD). The path rises from the village via Mires Beck to the foot of Striding Edge. The edge itself is a long, narrow arête of rock requiring hands and feet at the sharpest sections. It is a Grade 1 scramble, not a walk. In dry conditions, confident walkers manage it comfortably. In wet conditions, it is slippery and much more serious. The summit is a short, steep pull above the edge. Return via Swirral Edge to Catstye Cam and down to Glenridding, or back the same way. Around 8 miles, 900m ascent, allow 5 to 6 hours." },
    { type: "h3", text: "Via Swirral Edge from Glenridding" },
    { type: "p", text: "A slightly easier alternative to Striding Edge, though still an exposed ridge. Most people do the horseshoe (up Striding Edge, down Swirral Edge, or the other way round)." },
    { type: "h3", text: "Via Grisedale from Patterdale" },
    { type: "p", text: "A longer approach from Patterdale (CA11 0NW) through Grisedale. Quieter and longer. Good for avoiding the Glenridding crowds. This is the fell walking route without the scrambling commitment of the edges. Around 10 miles, 900m ascent." },
    { type: "h2", text: "What most people get wrong" },
    { type: "ul", items: [
      "Underestimating Striding Edge. It looks fine in photos. In wind and rain, with wet rock, it is a different proposition. Do not attempt it in serious weather.",
      "Starting too late. The Glenridding car park fills early on summer weekends, so start early.",
      "Not carrying a map. The summit plateau is disorienting in mist. Several paths converge there and heading the wrong way puts you on Raise or White Side with a long walk back.",
      "Underestimating the descent. Knees take the punishment on the way down. Poles help.",
    ]},
    { type: "h2", text: "What to bring" },
    { type: "ul", items: [
      "Waterproof jacket and trousers. Always.",
      "Gloves and a hat even in July. The summit plateau in wind is cold.",
      "OS Explorer OL5 (The English Lakes: North Eastern area). Know how to use it.",
      "More water than you think. 1.5 litres minimum for the full route.",
      "Boots with ankle support. Trainers on Striding Edge is a bad idea.",
      "In winter (December to March), the National Park's fell top assessors climb Helvellyn daily and post a conditions report. Their advice includes an ice axe and crampons, and knowing how to use them.",
    ]},
    { type: "h2", text: "After the walk" },
    { type: "p", text: "The Ullswater Inn on the A592 in Glenridding (CA11 0PB), formerly the Glenridding Hotel, is a hotel with a dog-friendly pub, serving food from 7.30am to 9pm daily." },
    { type: "callout", text: "Striding Edge in mist or wet conditions requires experience and caution. Turn back if conditions change above the col. In an emergency, call 999 or 112, ask for the police, then mountain rescue. Keswick Mountain Rescue Team's area includes Helvellyn." },
    { type: "cta", text: "Explore more fell walking routes on Hike The Lakes.", href: "https://www.hikethelakes.com/fells/helvellyn", label: "Helvellyn on Hike The Lakes →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "scafell-pike-complete-guide": [
    { type: "p", text: "Scafell Pike is 978 metres and the highest point in England. It is a popular walk, and on a fine weekend you will not have it to yourself. None of that diminishes the achievement or the mountain." },
    { type: "h2", text: "Routes" },
    { type: "h3", text: "Wasdale Head: the most direct" },
    { type: "p", text: "Park at Lake Head car park, Wasdale Head (CA20 1EX, pay and display). The path rises via Brown Tongue to Hollow Stones beneath the crags, then ascends via Lingmell Col to the summit. 5.6 miles, 920m ascent, allow 5 to 6 hours. The path is well-worn, but the terrain above Hollow Stones is relentless boulder-field. Wasdale Head is at the end of a long, narrow valley road: plan the drive in." },
    { type: "h3", text: "Langdale via Esk Hause: the wilder route" },
    { type: "p", text: "Start at the head of Great Langdale, near the Old Dungeon Ghyll (LA22 9JY). Ascend Rossett Gill, cross the high col at Esk Hause, and climb to the summit via the Great Moss or Great End. 8.5 miles, 1050m ascent, allow 7 to 8 hours. A more committing route through wild country. The Esk Hause junction is complex in mist and requires careful navigation." },
    { type: "h3", text: "The Corridor Route: the most interesting" },
    { type: "p", text: "From Sty Head, follow the Corridor Route, a narrow path cut into the hillside heading west beneath the crags of Great Gable and Scafell. This approach avoids the crowds of the Wasdale path on the upper mountain. Requires a start from Seathwaite (CA12 5XJ) or Wasdale." },
    { type: "h2", text: "The summit" },
    { type: "p", text: "A wide plateau of dark volcanic rock, cairn-strewn, disorienting in mist. The summit cairn is a substantial structure. On a clear day the view takes in much of the Lake District. In mist, you need a bearing: work out the bearing for your descent route on the map before you go up, and know how to follow it." },
    { type: "h2", text: "The one mistake most people make" },
    { type: "p", text: "Starting too late. A summer afternoon brings congestion at the summit and on the descent paths. Start early and you have the upper mountain largely to yourself. Start mid-morning and you are walking with many other people in the same direction." },
    { type: "h2", text: "What to bring" },
    { type: "ul", items: [
      "Compass. Not optional. The summit plateau in cloud is disorienting.",
      "OS Explorer OL6 (The English Lakes: South Western area).",
      "Waterproofs and warm layers. This is the highest point in England and weather changes fast.",
      "Water. At least 2 litres for the full route. No reliable source above Hollow Stones.",
      "Head torch if you start very early or think you might be out after dark.",
    ]},
    { type: "h2", text: "After the walk" },
    { type: "p", text: "The Wasdale Head Inn (CA20 1EX) is at the foot of the Wasdale route: an inn with 11 bedrooms, apartments, a campsite, Ritson's Bar and Abrahams' Restaurant. On the Langdale side, the Old Dungeon Ghyll (LA22 9JY) has the Climbers Bar, where well-behaved dogs are welcome." },
    { type: "callout", text: "Do not attempt Broad Stand, the direct rock route between Scafell and Scafell Pike, without climbing experience and equipment. People have died on it." },
    { type: "cta", text: "Full fell guide for Scafell Pike on Hike The Lakes.", href: "https://www.hikethelakes.com/fells/scafell-pike", label: "Scafell Pike on Hike The Lakes →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "where-to-stay-windermere": [
    { type: "p", text: "Windermere and Bowness are the most visited part of the Lake District and have the widest range of accommodation. The choice is large enough to be confusing. Here is how to navigate it." },
    { type: "h2", text: "Windermere vs Bowness: which to choose" },
    { type: "p", text: "Windermere is the town, set back from the lake on the hill above. Bowness is the lakeside village. Windermere Lake Cruises give the walk from Windermere village to Bowness pier as about 25 minutes, or 10 minutes by bus or car. Windermere town has the railway station. Bowness is busier, closer to the pier and the boats, and has more restaurants and pubs on the doorstep." },
    { type: "p", text: "If you are here mainly to walk, Windermere town works well as a base: the A591 and the 555 bus run north to Ambleside, Grasmere and Keswick. If you want the lake itself, the boats, and The World of Beatrix Potter, Bowness is more convenient." },
    { type: "h2", text: "Hotels" },
    { type: "p", text: "The Belsfield, on Kendal Road in Bowness (LA23 3EL), is a 4-star hotel with 62 bedrooms, a brasserie, an Art Deco bar and a terrace. The Lakeside Hotel at Newby Bridge (LA12 8AT) is on the shore at the southern end of the lake, and you will need a car or the boat for most things." },
    { type: "h2", text: "B&Bs and guesthouses" },
    { type: "p", text: "B&Bs in the Windermere and Bowness area range from simple rooms to larger guesthouses. Breakfast is usually included. The High Street in Windermere town has many guesthouses close together, which makes them easy to compare in person." },
    { type: "h2", text: "Self-catering" },
    { type: "p", text: "Self-catering in the Windermere area means mostly apartments in Bowness and cottages in the surrounding villages. For families, self-catering is usually more practical. Near Sawrey and Far Sawrey, across the lake, have cottages in quiet settings. The Windermere ferry crosses from Ferry Nab, south of Bowness, to Far Sawrey in about 10 minutes, carrying cars, bikes and foot passengers, and is a useful back route to the Hawkshead and Coniston side." },
    { type: "h2", text: "When to book" },
    { type: "p", text: "School holidays (July and August, Easter, half terms) and bank holiday weekends book up early. From October to March, and midweek, there is more choice at shorter notice." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "Parking in Bowness in summer is difficult. Confirm whether your accommodation has parking before booking.",
      "Windermere station is at the end of the Lakes Line from Oxenholme, where you change from West Coast Main Line trains. London Euston to Oxenholme takes about 2 hours 45 minutes.",
      "Windermere Lake Cruises sail from Bowness pier (LA23 3HQ), two minutes from Bowness village. Their Waterhead pier is at the Ambleside end of the lake, half a mile from Ambleside.",
    ]},
    { type: "cta", text: "More on Windermere and Bowness: the boats, Orrest Head and parking.", href: "/windermere", label: "Windermere guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "grasmere-vs-ambleside": [
    { type: "p", text: "Grasmere and Ambleside are about 4 miles apart on the A591, past Rydal Water. They offer different experiences." },
    { type: "h2", text: "Grasmere" },
    { type: "p", text: "Grasmere is a village, not a town. It has a small centre, a handful of restaurants, a couple of pubs, Dove Cottage (Wordsworth's home from 1799 to 1808) and the Grasmere Gingerbread shop beside St Oswald's churchyard. The lake is a short walk from the village. The fells above the village, particularly Helm Crag and the ridge to Fairfield, make good walking." },
    { type: "p", text: "Grasmere is quieter than Ambleside in the evenings. If you want a base that feels like a Lake District village, this is it. The downside is less choice for eating and drinking, and a drive or bus ride to the bigger shops in Ambleside." },
    { type: "h2", text: "Ambleside" },
    { type: "p", text: "Ambleside is a market town. It has supermarkets, a wide range of restaurants and cafés, many outdoor gear shops, and direct access to the lake at Waterhead. It is busier and more commercial than Grasmere. Also more practical." },
    { type: "p", text: "For families with children who need more to do, Ambleside has more on the doorstep: Zeffirellis, a cinema and restaurant, is on Compston Road, and The Apple Pie café and bakery is on Rydal Road. When it rains in Grasmere, your options narrow quickly." },
    { type: "h2", text: "Walking access" },
    { type: "h3", text: "Walks from Grasmere" },
    { type: "ul", items: [
      "Helm Crag (the Howitzer): short, steep, distinctive summit, 45 minutes from the village",
      "Easedale Tarn: valley walk past a waterfall, 3 miles, 2 to 3 hours",
      "Silver How: a viewpoint over Grasmere and Langdale, 4 miles, 3 hours",
      "Fairfield Horseshoe approach: the route goes through Grasmere's eastern fells",
    ]},
    { type: "h3", text: "Walks from Ambleside" },
    { type: "ul", items: [
      "Loughrigg Fell (335m): on the edge of town, with views over Rydal Water and Windermere, 2 to 3 hours",
      "Fairfield Horseshoe: the 11-mile horseshoe from Ambleside",
      "Stock Ghyll Force: 20-minute waterfall walk from the town centre",
      "Langdale: a short drive, or the 516 bus, to the valley walks of the southern Lakes",
    ]},
    { type: "h2", text: "The verdict" },
    { type: "p", text: "If you want a village feel, peace, and walking directly from the door: Grasmere. If you want convenience, more eating options, family activities, and a town base with practical facilities: Ambleside. Most people visiting for a week do both. One night in Grasmere, several in Ambleside, or the other way round." },
    { type: "cta", text: "More on Grasmere: Dove Cottage, the gingerbread and the walks.", href: "/grasmere", label: "Grasmere guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "best-family-days-out-lake-district": [
    { type: "p", text: "These days out suit families with children of different ages. Opening details and prices come from each place's own website or the National Park, checked in November 2026. Check again before you go: several places run shorter hours in winter." },
    { type: "h2", text: "Tarn Hows circular walk" },
    { type: "p", text: "A path circles the tarn for about 2 miles (3.3 km). The National Park lists it as one of its Miles without Stiles routes, though some slopes are as steep as 1 in 5. The main car park is LA22 0PW. Hawkshead village is nearby for lunch afterwards." },
    { type: "h2", text: "Windermere Lake Cruises: Ambleside to Lakeside and back" },
    { type: "p", text: "The full run from Waterhead pier at Ambleside (LA22 0EY) to Lakeside at the south end of Windermere. Children under 5 travel free. At Lakeside, the boats connect with the Lakeside & Haverthwaite Railway, a heritage steam railway. The railway's 2026 season has ended: it runs Tinsel Trains on December weekends, and its next main season is 24 March to 31 October 2027. Boat and train together make a full day." },
    { type: "h2", text: "Aira Force waterfall" },
    { type: "p", text: "CA11 0JS, on the western shore of Ullswater. A series of waterfalls in a wooded ravine, fullest after rain. The National Trust car park is pay and display, with about 130 spaces, and there is a seasonal tearoom. Go on a weekday if you can." },
    { type: "h2", text: "Dodd Wood" },
    { type: "p", text: "CA12 4QE, Forestry England. Woodland trails above Bassenthwaite Lake, where red squirrels live. The Lake District Osprey Project's viewpoint here used to look onto the ospreys' nest, but the National Park says the birds now nest somewhere less visible." },
    { type: "h2", text: "Ullswater 'Steamers': Glenridding to Howtown walk" },
    { type: "p", text: "Take the boat from Glenridding to Howtown, about 35 minutes, and walk back along the lakeshore (about 6 miles). Good for older children who can manage a half-day walk. The boats sail all year apart from 24 and 25 December, on seasonal timetables, and dogs travel for £1.50. There is no parking at Howtown. Carry food and water." },
    { type: "h2", text: "When it rains" },
    { type: "ul", items: [
      "Windermere Jetty Museum, Rayrigg Road, Bowness (LA23 1BN): historic boats and stories of the lake, with a café",
      "Rheged, near Penrith (CA11 0DQ): a cinema, and indoor play for under-8s in booked sessions",
      "The World of Beatrix Potter, Crag Brow, Bowness (LA23 3BX): open every day",
      "Go Ape, Grizedale Forest (LA22 0QJ): runs in most weather, closing only for thick ice, thunderstorms or gales. Check winter opening days and book ahead",
    ]},
    { type: "cta", text: "More things to do across the Lake District.", href: "/things-to-do", label: "Things to do →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "autumn-in-the-lake-district": [
    { type: "p", text: "October and November are my favourite months in the Lakes. The school holidays are over, the car parks are manageable, the light is different, and the landscape does something it does not do at any other time of year." },
    { type: "h2", text: "The colours" },
    { type: "p", text: "The Lake District in October has real autumn colour. The sessile oak woodland on the lower fells and valley sides turns amber and gold. The bracken on the open fell goes russet. The birches go yellow. The larches in the forestry plantations go to copper before dropping. This usually peaks in the second and third weeks of October, and it changes what the landscape looks like." },
    { type: "h2", text: "The red deer rut" },
    { type: "p", text: "Martindale, on the far side of Ullswater, has a large red deer herd. In October the stags rut. You will hear them before you see them: the roaring carries across the valley. Dawn and dusk are the best times. Access via Howtown on the Ullswater 'Steamers' or by road through Pooley Bridge to Martindale. Binoculars help." },
    { type: "h2", text: "The walking" },
    { type: "p", text: "Autumn suits fell walking. Lower temperatures mean comfortable ascents without the July heat. The views are clearer on good days. The paths are less crowded. The midges, a nuisance in August, have mostly gone." },
    { type: "p", text: "The risk factors shift. Weather becomes less predictable from October. Days shorten quickly: in Keswick on 11 November the sun rises at about 7.35am and sets at about 4.18pm, according to the US Naval Observatory's sun tables. Plan accordingly, start early, and aim to be off high ground well before dark." },
    { type: "h2", text: "The pubs in autumn" },
    { type: "p", text: "After a wet day on the fells, an open fire helps. The Old Dungeon Ghyll in Great Langdale (LA22 9JY) has a fireplace in its Climbers Bar, where well-behaved dogs are welcome. The Pooley Bridge Inn (CA10 2NN), at the north end of Ullswater, has open fires in its bar and welcomes dogs and children. The Golden Rule in Ambleside (LA22 9AS) has an open fire and serves no meals." },
    { type: "h2", text: "Practical autumn notes" },
    { type: "ul", items: [
      "Pack a head torch from October. Darkness comes fast if you are running late on the descent.",
      "Waterproof trousers matter more in October than July. The bracken on the fell flanks is wet all day.",
      "Kendal Calling is in late July or early August. Ambleside Sports is in July. Grasmere Lakeland Sports is in August. By October the events calendar is quieter.",
      "Several boats change to winter timetables from November, and the Keswick Launch does not sail in December and January. Check before you plan a boat-and-walk day.",
    ]},
    { type: "cta", text: "Plan your autumn walks.", href: "/lake-district-walks", label: "Lake District walks →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "the-open-2026-staying-lake-district": [
    { type: "callout", text: "The Open was played at Royal Birkdale, Southport, in July 2026. This post was written before the championship and is kept for reference." },
    { type: "p", text: "The Open Championship 2026 was held at Royal Birkdale in Southport, 12 to 19 July. Royal Birkdale is about an hour's drive from the southern Lake District, and the Lakes were largely unaffected by the Open congestion in Southport." },
    { type: "h2", text: "Travel logistics" },
    { type: "p", text: "The M6 connects the Lake District to the M58 and then the A565 south to Southport. From Windermere to Royal Birkdale is around 50 miles, roughly 50 to 60 minutes in normal conditions. The A59 via Ormskirk is the alternative southern route." },
    { type: "p", text: "There were no official shuttle buses from the Lakes to Royal Birkdale. The options were to drive and use the official Open parking and shuttle from the designated car parks outside Southport, or to take the train from Oxenholme or Lancaster to Southport, changing at Preston or Wigan." },
    { type: "h2", text: "Why it worked as a base" },
    { type: "p", text: "The Lake District made sense as an Open week base for anyone combining the golf with a walking holiday: stay in the Lakes, drive to the golf for the day, and have the fells and lakes for the days you were not attending." },
    { type: "h2", text: "Southern Lakes bases for the Open" },
    { type: "ul", items: [
      "Windermere and Bowness: closest to the M6, about 50 minutes from Birkdale. Widest accommodation choice.",
      "Ambleside: about 55 minutes. A town base with walking access.",
      "Coniston: more remote, about 60 minutes. A quiet village rather than a town.",
      "Hawkshead: between Windermere and Coniston, about 55 minutes.",
    ]},
    { type: "cta", text: "More things to do in the Lake District.", href: "/things-to-do", label: "Things to do →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "week-itinerary-lake-district": [
    { type: "p", text: "A week in the Lakes, done properly. This assumes you are based in Ambleside or Grasmere, have a car, and are here for the walking as well as the villages and food. Some boats run less often in winter, and the Keswick Launch does not sail in December and January: check timetables before you go." },
    { type: "h2", text: "Day 1: Arrival and Ambleside" },
    { type: "p", text: "Arrive, check in, walk to Stock Ghyll Force (20 minutes from the town centre). Explore Ambleside. Dinner at Zeffirellis, a cinema and restaurant on Compston Road, or the Unicorn Inn on North Road. Early night." },
    { type: "h2", text: "Day 2: Catbells and Derwentwater" },
    { type: "p", text: "Drive to Keswick. Take the Keswick Launch to Hawes End. Walk up Catbells, along the ridge to Hause Gate, and back to Hawes End for the boat back. 3 to 4 hours. Explore Keswick. Lunch at the Dog & Gun on Lake Road or Bryson's tea rooms on Main Street. Return to base." },
    { type: "h2", text: "Day 3: Langdale and the Pikes" },
    { type: "p", text: "Drive to Great Langdale, or take the 516 bus from Ambleside. Walk up Pike of Blisco or, if you want the full day, the Langdale Pikes via Stickle Ghyll. Return via Pavey Ark if you are taking the longer circuit. A serious walk day. Dinner at the Old Dungeon Ghyll's Climbers Bar." },
    { type: "h2", text: "Day 4: Grasmere and the village circuit" },
    { type: "p", text: "Slower day. Walk round Grasmere lake on mostly flat paths. Dove Cottage and the Wordsworth Museum. Grasmere Gingerbread. Easedale Tarn if you have the energy. Lunch in Grasmere. Afternoon in Rydal if the weather is good." },
    { type: "h2", text: "Day 5: Helvellyn" },
    { type: "p", text: "The big day. Start at Glenridding early. Up via Striding Edge in good weather, or the Grisedale path in uncertain conditions. Summit. Return via Swirral Edge. Afterwards, the Ullswater Inn in Glenridding serves food all day. Allow a full day: 5 to 6 hours walking plus travel." },
    { type: "h2", text: "Day 6: Coniston and Tarn Hows" },
    { type: "p", text: "Drive to Coniston. Walk Coniston Old Man if you want another summit (5 miles, 750m, 4 hours). Or take a lower day: the Tarn Hows circuit (about 2 miles), Coniston village, the Ruskin Museum, and lunch at the Black Bull, a coaching inn with its own brewery, Coniston Brewing Co, next door. The Coniston Launch sails all year, with fewer sailings from November to February." },
    { type: "h2", text: "Day 7: Ullswater and departure" },
    { type: "p", text: "Drive to Glenridding. Take the Ullswater 'Steamer' to Howtown, about 35 minutes. Walk back along the lakeshore (about 6 miles, 3 to 4 hours). Scenic, not too hard, and the boat makes a good finish to the week. Aira Force waterfall is on the A592 along the lake as a final stop before heading home." },
    { type: "cta", text: "Getting around for the week without a car.", href: "/blog/lake-district-without-a-car", label: "The Lake District without a car →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "wainwrights-beginners-guide": [
    { type: "p", text: "Alfred Wainwright wrote seven illustrated guides to the Lake District fells between 1955 and 1966. He described 214 fells in detailed hand-drawn form. Completing all 214 has become an objective for many walkers. This is what you need to know before you start." },
    { type: "h2", text: "What counts as a Wainwright" },
    { type: "p", text: "A Wainwright is any summit included in Wainwright's seven-book series covering the eastern, far eastern, central, southern, northern, north-western and western fells. The 214 fells range from Castle Crag in Borrowdale, at 290 metres, to Scafell Pike at 978 metres. They are not simply the highest hills: Wainwright chose them for their character, viewpoints and interest." },
    { type: "h2", text: "Where to start" },
    { type: "p", text: "Catbells is the standard recommendation. 451m, reached from the Keswick Launch, with a ridge walk and views over Derwentwater. It feels like a proper mountain to a beginner. The return on the boat from Hawes End completes the day (the launch does not sail in December and January)." },
    { type: "p", text: "Other starter Wainwrights: Loughrigg Fell (335m, above Ambleside), Silver How (above Grasmere), Helm Crag (directly above Grasmere), and Haystacks (Buttermere), which Wainwright named as his favourite." },
    { type: "h2", text: "How long does it take" },
    { type: "p", text: "There is no set time. It depends on how often you visit and how many fells you take in each day. The 214 fells include many that are remote, need multi-fell days to reach efficiently, and are best kept for good weather." },
    { type: "h2", text: "The books" },
    { type: "p", text: "Wainwright's seven Pictorial Guides are in print in revised editions, published by Frances Lincoln, an imprint of Quarto. The illustrations and handwriting are his own; the route notes have been updated for current paths. They are useful on the hill and the illustrations are remarkable." },
    { type: "h2", text: "The practical reality" },
    { type: "p", text: "The Wainwrights in the Eastern Fells book, which includes Helvellyn and the popular summits, are the easiest to collect early because they are closest to the main tourist areas. The Western Fells (Great Gable, the Scafell group, Pillar) are more remote and need specific days. The Far Eastern Fells cover a large area including High Street and are often done as multi-fell horseshoe days. The Northern Fells (Skiddaw, Blencathra) are close to Keswick and accessible but distinct." },
    { type: "cta", text: "Explore all 214 Wainwright fells on Hike The Lakes.", href: "https://www.hikethelakes.com/fells", label: "Wainwrights on Hike The Lakes →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "dog-walking-lake-district": [
    { type: "p", text: "The Lake District is broadly good for dogs. Most fells are open, many pubs welcome them, and the lake shores are accessible. Here is the practical version of that." },
    { type: "h2", text: "Fell walking with dogs: the livestock rule" },
    { type: "p", text: "Dogs are permitted on virtually all fell paths including the Wainwrights. The constraint is livestock. The Lakes are a working farming landscape and sheep are everywhere. Dogs that chase sheep can legally be shot by farmers. March to May is lambing season and requires particular care. On enclosed ground below the fell walls, dogs should be on leads wherever sheep are visible. On the open fell tops above the wall line, the risk is lower but use judgement." },
    { type: "h2", text: "Walks with dogs" },
    { type: "ul", items: [
      "Catbells (CA12 5UQ via Hawes End): open fell, minimal enclosed ground, wide views. The Keswick Launch to the start adds novelty (no sailings in December and January).",
      "Haystacks (Gatesgarth, Buttermere): Wainwright's favourite, small tarns on the summit, open ground on the tops.",
      "Tarn Hows (main car park LA22 0PW): a circuit of about 2 miles on a made path. Leads near grazing areas.",
      "Ullswater lakeshore path from Howtown to Glenridding: about 6 miles, lake shore most of the way. Dogs travel on the Ullswater 'Steamers' for £1.50 each.",
      "Grizedale Forest (LA22 0QJ): woodland trails, leads on the main routes.",
    ]},
    { type: "h2", text: "Dog-friendly pubs" },
    { type: "p", text: "Pubs whose own websites say dogs are welcome include the Old Dungeon Ghyll in Great Langdale (LA22 9JY), in the hotel and the Climbers Bar but not the dining room; the Golden Rule on Smithy Brow, Ambleside (LA22 9AS); the Dog & Gun on Lake Road, Keswick (CA12 5BT); the Pooley Bridge Inn (CA10 2NN); and the Pheasant Inn at Bassenthwaite Lake (CA13 9YE). Rules can differ between bars and dining rooms, so ask when you arrive." },
    { type: "h2", text: "Ticks" },
    { type: "p", text: "Sheep ticks are present across the Lake District fells, particularly in bracken. After any fell walk, check your dog thoroughly: around ears, groin, between toes, under the collar. Remove ticks with a tick remover tool (not fingers). Lyme disease is present in ticks in the Lakes. Discuss tick prevention with your vet before a Lake District trip if you are not already on preventative treatment." },
    { type: "h2", text: "Blue-green algae" },
    { type: "p", text: "In warm, still summer conditions (usually July to September) blue-green algae can bloom in the Lakes. This is toxic to dogs and can be fatal quickly if ingested. Warnings are posted on the Lake District National Park Authority website and social media when risk is high. Check before letting dogs swim in warm summer conditions." },
    { type: "cta", text: "More practical advice in the dog-friendly Lake District guide.", href: "/dog-friendly-lake-district", label: "Dog-friendly guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "rainy-day-lake-district-guide": [
    { type: "p", text: "It will rain. The National Park says the valleys see rain on around 200 days a year. Here is the plan." },
    { type: "h2", text: "First option: walk anyway" },
    { type: "p", text: "With proper gear, a rainy day walk in the Lakes has its own rewards. The waterfalls are at full flow. The crowds are gone. The valleys have mist. What changes is the experience, not the quality. You need: waterproof jacket, waterproof trousers (not optional), proper boots, gloves, a warm layer. With those, drizzle and light rain are entirely comfortable." },
    { type: "h2", text: "Wet weather walks" },
    { type: "ul", items: [
      "Aira Force (CA11 0JS): waterfalls at their fullest after rain. National Trust car park and a seasonal tearoom",
      "Sourmilk Gill and Easedale Tarn, Grasmere: the waterfall grows after overnight rain",
      "Grizedale Forest (LA22 0QJ): tree cover helps in the rain, and the visitor centre has a café",
      "Stock Ghyll Force, Ambleside: 20 minutes from the town centre",
    ]},
    { type: "h2", text: "Museums and houses" },
    { type: "ul", items: [
      "Windermere Jetty Museum, Rayrigg Road, Bowness (LA23 1BN): historic boats and stories of the lake, with a café.",
      "Keswick Museum, Station Road (CA12 4NF): local history and collections. Admission is charged (adults £8.50, under-5s free), and it is closed from 24 December 2026 to 31 January 2027.",
      "Brantwood, Coniston (LA21 8AD): John Ruskin's house above Coniston Water. Open Wednesday to Sunday from 16 November.",
      "Dove Cottage and the Wordsworth Museum, Grasmere (LA22 9SH): Wordsworth's home from 1799 to 1808.",
      "The Derwent Pencil Museum in Keswick is closed while it moves to a new site.",
    ]},
    { type: "h2", text: "The pub option" },
    { type: "p", text: "After a walk in the rain, an open fire helps. The Old Dungeon Ghyll in Great Langdale (LA22 9JY) has a fireplace in its Climbers Bar. The Pooley Bridge Inn (CA10 2NN) has open fires in its bar. The Golden Rule in Ambleside (LA22 9AS) has an open fire but serves no meals." },
    { type: "h2", text: "For families in the rain" },
    { type: "ul", items: [
      "Go Ape, Grizedale Forest (LA22 0QJ): runs in most weather, closing for thick ice, thunderstorms or gales. Check winter opening and book ahead",
      "The World of Beatrix Potter, Crag Brow, Bowness (LA23 3BX): open every day",
      "Rheged near Penrith (CA11 0DQ): a cinema, and indoor play for under-8s in booked sessions",
    ]},
    { type: "cta", text: "Full rainy day guide for the Lake District.", href: "/rainy-day-lake-district", label: "Rainy day guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "keswick-market-guide": [
    { type: "p", text: "Keswick's street market is held on the Market Square every Thursday and Saturday. Cumberland Council runs it." },
    { type: "h2", text: "When and where" },
    { type: "p", text: "Market Square, Keswick (CA12 5JR). The council lists the market as running all day on Thursdays and Saturdays, with some 65 to 70 stalls. Its size varies with the season and the weather." },
    { type: "h2", text: "What is there" },
    { type: "p", text: "The council describes it as selling all sorts of things, including food, clothes and homeware. The market has won awards from the National Association of British Market Authorities." },
    { type: "h2", text: "Around the market" },
    { type: "p", text: "Keswick town centre is walkable from the market. Keswick Museum is on Station Road (CA12 4NF); it charges for admission and is closed from 24 December 2026 to 31 January 2027. Bryson's craft bakery and tea rooms is at 42 Main Street. Lakeside car park (CA12 5DJ) is a council car park with 253 spaces, near Theatre by the Lake." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "Go early in the day for the widest choice.",
      "The market is outdoors. Dress for the weather in winter.",
      "Parking in Keswick fills fast on Saturdays. The 555 and X4/X5 buses both stop in Keswick.",
    ]},
    { type: "cta", text: "Find more things to do in Keswick.", href: "/keswick", label: "Keswick guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "ullswater-by-boat": [
    { type: "p", text: "The Ullswater 'Steamers' company dates from 1859. Its two Victorian boats are Lady of the Lake, launched in 1877, and Raven, launched in 1889. Lady of the Lake's steam engines were replaced by diesel in the 1930s, and four heritage boats are in regular service. They sail between three piers: Glenridding at the south end, Howtown on the eastern shore, and Pooley Bridge at the north end. The pier at Aira Force is out of use until 2027." },
    { type: "h2", text: "The routes" },
    { type: "h3", text: "Glenridding to Howtown" },
    { type: "p", text: "The most useful journey for walkers. The boat takes about 35 minutes and leaves you at Howtown pier on the eastern shore. From here, the lakeshore path back to Glenridding is about 6 miles, with the lake on one side and the fells rising steeply on the other. There is no parking at Howtown." },
    { type: "h3", text: "Glenridding to Pooley Bridge" },
    { type: "p", text: "The full length of the lake, around an hour, via Howtown. Good for seeing the whole lake from south to north. Pooley Bridge at the north end is a small village; the Pooley Bridge Inn on Finkle Street has a bar with open fires. Return by boat or by road." },
    { type: "h2", text: "The walk: Howtown to Glenridding" },
    { type: "p", text: "About 6 miles, 3 to 4 hours, with some gentle ups and downs around the headlands. Carry lunch and water. The path passes through Sandwick, where there is a small stream crossing, and along the flanks below Hallin Fell before descending to Patterdale and then Glenridding." },
    { type: "h2", text: "Dogs on the boats" },
    { type: "p", text: "Dogs travel on the Ullswater 'Steamers' for £1.50 each. The walk back from Howtown suits dogs, though there are livestock fields on the lower path sections near Sandwick." },
    { type: "h2", text: "Practical information" },
    { type: "ul", items: [
      "Beckside car park in Glenridding (CA11 0PD) is run by the National Park and fills early on summer weekends.",
      "The boats sail 363 days a year, closing on 24 and 25 December, with seasonal timetables. Times and tickets are on ullswater-steamers.co.uk.",
      "The Ullswater Inn in Glenridding (formerly the Glenridding Hotel) has a dog-friendly pub and serves food from 7.30am to 9pm.",
      "Every boat has outside deck areas, indoor saloons, toilets and a licensed bar, according to the company.",
    ]},
    { type: "cta", text: "More things to do in the Lake District.", href: "/things-to-do", label: "Things to do →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // Sources (fetched 11 Nov 2026): docs/freshen-2026-11/REPORT.md, section 3.
  "lake-district-in-winter": [
    { type: "p", text: "Winter in the Lake District means short days, quiet roads and snow on the high fells, while the valleys mostly get rain. This is what to expect from December to February, and what to check before you set out. The details come from the National Park, the Met Office and the operators' own websites, checked in November 2026." },
    { type: "h2", text: "Short days" },
    { type: "p", text: "In Keswick on 21 December the sun rises at about 8.33am and sets at about 3.48pm, according to the US Naval Observatory's sun tables. By 1 February, sunrise is at about 8.02am and sunset at about 4.51pm. The National Park warns that the deep valleys get dark before sunset, and AdventureSmart UK adds that it gets dark sooner when the sky is overcast. Plan a walk that finishes well before dark, and carry a head torch with spare batteries even if you expect to be back early." },
    { type: "h2", text: "Snow on the tops, rain in the valleys" },
    { type: "p", text: "The National Park says snow usually falls between November and March, and that the valleys get around 20 days of snow and 200 days of rain a year. The difference between the valley and the summit can be large: the temperature drops by about one degree for every 150 metres you climb, before you add the wind chill." },
    { type: "h2", text: "Check the fell top conditions" },
    { type: "p", text: "In winter, the National Park's Fell Top Assessors climb Helvellyn every day and report on conditions at the summit. The Park says they will be back from December 2026 and will climb every day until spring 2027. Each report has a written summary of the conditions, the temperature, wind speed, wind chill and wind direction, and photos. You will find the reports on the Park's Weatherline page and on X at @LakesWeather." },
    { type: "p", text: "For the forecast, the Met Office publishes a Lake District mountain forecast with the weather hazards above 300 metres, summit winds, the chance of cloud-free tops, the freezing level, and sunrise and sunset times. The Mountain Weather Information Service (MWIS) also publishes a Lake District forecast, written by meteorologists 365 days a year. Read both on the morning you go." },
    { type: "h2", text: "Kit for winter walking" },
    { type: "p", text: "Snow and ice change what you need. The Fell Top Assessors' advice for winter conditions is to take an ice axe and crampons and know how to use them, to wear four-season boots that fit your crampons, and to take goggles when snow and wind combine." },
    { type: "p", text: "Their list also includes:" },
    { type: "ul", items: [
      "A map and compass, and the skills to use them. Do not rely on a GPS alone.",
      "A spare hat and gloves: they will get wet, and may blow away.",
      "If in doubt, turn back.",
    ]},
    { type: "p", text: "We would add two things of our own: a head torch with spare batteries (AdventureSmart UK lists one too), and not relying on a phone for navigation." },
    { type: "p", text: "If you have never used an ice axe and crampons, the National Park runs Winter Skills day courses from December 2026 to April 2027, meeting at the Glenridding Information Centre at 8.30am. A place on a group course costs £125, and boots, crampons and an ice axe can each be hired for £15 a day." },
    { type: "callout", text: "In an emergency, call 999 or 112 and ask for the police, then mountain rescue, and stay where you are until mountain rescue contacts you. If you have hearing or speech difficulties, you can contact the emergency services by text, but only once you have registered with the emergencySMS service: text 'register' to 999." },
    { type: "h2", text: "Boats in winter" },
    { type: "p", text: "Windermere Lake Cruises sail every day except Christmas Day, on reduced winter timetables, and some routes run in the peak season only. From 2 November to 23 March, a 48 Hour Freedom ticket for unlimited travel costs £35 for an adult." },
    { type: "p", text: "The Ullswater 'Steamers' are open 363 days a year, closing on 24 and 25 December. The pier at Aira Force is out of use until 2027. There is more on the boats and the lakeshore walk in [Ullswater by boat](/blog/ullswater-by-boat)." },
    { type: "p", text: "The Keswick Launch on Derwentwater does not sail in December and January. Its winter sailings run on set days in November, February and March, so check its winter times before you plan a walk from a jetty such as Hawes End." },
    { type: "h2", text: "Driving in winter" },
    { type: "p", text: "Westmorland and Furness Council grits its priority routes from October to April, and National Highways grits major roads including the M6 and the A66. Cumberland Council says not every road is treated, that gritting does not guarantee an ice-free road, and that it may close roads in extreme weather." },
    { type: "p", text: "The high passes are the first roads to suffer. In December 2023, after snow, Cumberland Council reported that Honister Pass from Seatoller and two sections of Hardknott Pass remained closed, and Westmorland and Furness crews ploughed and gritted the Kirkstone Pass to reopen it. If snow or ice is forecast, plan a route on the main roads." },
    { type: "h2", text: "Getting around without driving" },
    { type: "p", text: "Many buses keep running through the winter. The National Park says buses still run in Borrowdale, Langdale, Grasmere and Coniston in autumn and winter, alongside core services such as the 555, the 599 and the X4/X5. Routes, fares and the lake boats are in [the Lake District without a car](/blog/lake-district-without-a-car)." },
    { type: "h2", text: "When the weather closes in" },
    { type: "p", text: "Some indoor places change their hours in winter. Keswick Museum is closed from 24 December 2026 to 31 January 2027, and Brantwood, John Ruskin's house above Coniston Water, opens Wednesday to Sunday in winter. For more ideas, see the [rainy day guide](/rainy-day-lake-district)." },
    { type: "cta", text: "Plan walks for a clear, settled winter day.", href: "/lake-district-walks", label: "Lake District walks →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // Sources (fetched 11 Nov 2026): docs/freshen-2026-11/REPORT.md, section 3.
  "lake-district-without-a-car": [
    { type: "p", text: "You can see a good deal of the Lake District without a car. Trains reach Windermere and Penrith, buses link the main towns and valleys, and boats cross the bigger lakes. This is how the pieces fit together, from the operators' and the National Park's own websites, checked in November 2026. Timetables change, especially in winter, so check the day before you travel." },
    { type: "h2", text: "By train" },
    { type: "p", text: "The main-line stations for the Lake District are Oxenholme, Penrith and Carlisle, on the West Coast Main Line, served by Avanti. Cumbria Tourism gives the journey from London Euston to Oxenholme as about 2 hours 45 minutes." },
    { type: "p", text: "From Oxenholme, Northern's Lakes Line runs to Windermere, calling at Kendal, Burneside and Staveley. Northern also runs direct trains from Manchester to Windermere. Windermere station is in Windermere town, about a 25-minute walk from Bowness pier." },
    { type: "p", text: "For the north of the Lakes, get off at Penrith and take the X4/X5 bus to Keswick, about 45 minutes away." },
    { type: "h2", text: "By bus" },
    { type: "p", text: "Stagecoach runs most of the buses. The National Park lists the 555, the 599 and the X4/X5 as core services, and says buses still run in Borrowdale, Langdale, Grasmere and Coniston through autumn and winter. The main routes, as the operators and councils describe them:" },
    { type: "ul", items: [
      "555: Lancaster, Kendal, Windermere station, Ambleside, Grasmere and Keswick. Stagecoach says it runs every 60 minutes for most of the day, from 7am. Kendal to Keswick takes about 1 hour 37 minutes.",
      "599: an open-top bus between Bowness, Windermere, Ambleside and Grasmere, every hour.",
      "X4/X5: Penrith, Keswick, Cockermouth and Workington, seven days a week all year, except Christmas Day and New Year's Day.",
      "516: Ambleside to Dungeon Ghyll in Great Langdale, via Skelwith Bridge and Elterwater, every day.",
      "505: Windermere and Ambleside to Coniston via Hawkshead. Ambleside to Coniston takes about 38 minutes.",
      "508: Penrith to Patterdale via Pooley Bridge and Glenridding, continuing over the Kirkstone Pass to Windermere in summer.",
      "78: Keswick up Borrowdale to Seatoller, every day of the year.",
      "77/77A, the Honister Rambler: Keswick to Cat Bells, Honister, Buttermere and Whinlatter. The National Park lists it as running daily from March to November.",
    ]},
    { type: "h3", text: "Bus fares" },
    { type: "p", text: "Single fares on most of these routes come under the government's national bus fare cap: £3 until the end of 2026, then £2 from 1 January 2027 until the end of 2027. The government's list of routes in the scheme includes the 78, 505, 508, 516, 555, 599, X4 and X5. The 77/77A is not on it." },
    { type: "p", text: "For a day of getting on and off, Stagecoach's North West Explorer ticket costs £12.50 for an adult for one day, or £28 for three days. If you hold an English concessionary bus pass, you travel free from 9.30am on weekdays and all day at weekends and on public holidays." },
    { type: "p", text: "If you are mixing trains, buses and boats, Northern's Cumbria Travel Pass covers Northern, TransPennine Express and Avanti trains, Stagecoach buses and some Windermere Lake Cruises boats, for £40 a day or £99 for three days." },
    { type: "h2", text: "By boat" },
    { type: "p", text: "Windermere Lake Cruises sail every day except Christmas Day, from piers at Bowness, Ambleside (Waterhead), Lakeside, Brockhole, Wray, Ash Landing and Windermere Jetty Museum. Bowness to Ambleside takes 35 minutes. Some routes run in the peak season only, and winter timetables are reduced." },
    { type: "p", text: "On Derwentwater, the Keswick Launch calls at seven jetties, including Hawes End for Catbells. It does not sail in December and January." },
    { type: "p", text: "On Ullswater, the 'Steamers' sail between Glenridding, Howtown and Pooley Bridge, 363 days a year. There is no parking at Howtown, so the boat is the easy way to start the lakeshore walk back to Glenridding. More in [Ullswater by boat](/blog/ullswater-by-boat)." },
    { type: "h2", text: "The Windermere ferry" },
    { type: "p", text: "Westmorland and Furness Council runs a ferry across Windermere from Ferry Nab, in Bowness, to Far Sawrey, for the Hawkshead side of the lake. It carries cars, bikes and foot passengers, takes around 10 minutes, and has no set timetable or booking. The first crossing from Ferry Nab is at 6.50am Monday to Saturday and 8.50am on Sundays. A foot passenger pays £1.50, a cyclist £2.70 and a car up to 6 metres £8, by card only. In winter the service finishes an hour earlier than in summer, and it does not run on Christmas Day or Boxing Day." },
    { type: "h2", text: "Car-free bases" },
    { type: "p", text: "Windermere, Ambleside, Grasmere and Keswick are all on the 555, and Keswick is also on the X4/X5 from Penrith station. The town guides to [Windermere](/windermere) and [Keswick](/keswick) have more on each." },
    { type: "callout", text: "Timetables change between seasons, and some services stop for the winter. Check the operator's own website, or Traveline, the day before you travel." },
    { type: "cta", text: "Ideas for days out, most of them reachable by bus or boat.", href: "/things-to-do", label: "Things to do in the Lake District →" },
  ],

};
