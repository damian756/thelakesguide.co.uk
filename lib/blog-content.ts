// Lakes Guide blog content — Damian, TheLakesGuide.co.uk

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; emoji: string; text: string }
  | { type: "quote"; text: string; attr?: string }
  | { type: "cta"; text: string; href: string; label: string }
  | { type: "image"; src: string; alt: string; caption?: string; portrait?: boolean; objectPosition?: string }
  | { type: "video"; src: string; poster: string; caption?: string }
  | { type: "hr" };

export const BLOG_CONTENT: Record<string, ContentBlock[]> = {

  // ─────────────────────────────────────────────────────────────────────────────
  "best-restaurants-keswick": [
    { type: "p", text: "I have eaten in most of the restaurants in Keswick over many visits. Some are excellent. Some trade entirely on the captive walking crowd and do not have to try very hard. Here are the ones that actually deserve your time." },
    { type: "h2", text: "The Mortal Man (Troutbeck, but worth the drive)" },
    { type: "p", text: "Technically not in Keswick but close enough to mention. A 16th-century inn in the Troutbeck valley with one of the better menus in the area. Proper Lake District food: Herdwick lamb, local game, cumbrian cheeses. Book ahead. The drive through the valley is worth it in itself." },
    { type: "h2", text: "The Square Orange" },
    { type: "p", text: "On St John's Street, central Keswick. A relaxed cafe-bar with good food and a sensible drinks list. Not a destination restaurant but consistently reliable for lunch or an early dinner. No pretension, reasonable prices. The kind of place you go back to on a wet afternoon when you want something decent without the fuss of booking." },
    { type: "h2", text: "Zeffirellis (Ambleside, not Keswick)" },
    { type: "p", text: "Again, not Keswick proper. But if you are driving through Ambleside, Zeffirellis is a genuine vegetarian restaurant worth knowing about. Attached to a cinema. The food is serious, the pasta is excellent, and the setting is unusual. Worth the 20-minute drive from Keswick on a Wednesday evening when Keswick options are thin." },
    { type: "h2", text: "The Dog and Gun" },
    { type: "p", text: "Lake Road, CA12 5JB. The Dog and Gun is primarily a pub with a decent bar menu rather than a restaurant, but after a long day on the fells the distinction stops mattering. Good pies, proper chips, Cumbrian sausages. Dogs welcome. It fills up fast on wet evenings in summer, so get there early or accept standing in the bar. Which is not the worst outcome." },
    { type: "h2", text: "Bryson's Tearoom" },
    { type: "p", text: "Main Street, Keswick. A bakery and tearoom that has been in Keswick for decades. The Cumberland rum nicky tart is a thing. So is the bread. If you want a proper sit-down lunch that is not going to cost you £40 a head, Bryson's is the answer. Gets busy at noon on weekends, early arrival or late lunch is easier." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "Book ahead for any restaurant at weekends in peak season (July to August). Keswick fills up and the decent places go fast.",
      "Wednesday and Thursday evenings are easier than Friday to Sunday for finding a table without a reservation.",
      "The Market Square area has several reliable options in close proximity — useful if your first choice is full.",
      "Most pubs in Keswick serve food until around 9pm. Later than most. Useful to know after a long fell day.",
    ]},
    { type: "cta", text: "Find more places to eat and drink across the Lake District.", href: "/restaurants", label: "Browse restaurants →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "best-pubs-ambleside": [
    { type: "p", text: "Ambleside is a walking town, which means it has pubs that understand walkers. Boots in the bar. Dogs welcome. Wet gear hanging. Food that actually fills you up. These are the ones worth going to." },
    { type: "h2", text: "The Golden Rule" },
    { type: "p", text: "Smithy Brow, LA22 9AS. This is the best pub in Ambleside. A Robinson's tied house with a tiny beer garden, a main bar that has not changed significantly in forty years, and a back room. No music, no fruit machines, no food. Just beer, conversation, and warmth. It is quiet early evening and fills up with locals and walkers later. Do not miss it." },
    { type: "h2", text: "The Unicorn" },
    { type: "p", text: "North Road, LA22 9DT. One of the better food pubs in the town. Good beer selection, a kitchen that takes things seriously, and a covered beer garden. Good for a meal after Loughrigg or the Fairfield Horseshoe. Book ahead on Friday and Saturday." },
    { type: "h2", text: "The Waterhead Inn" },
    { type: "p", text: "On the southern shore of Windermere at Waterhead, LA22 0EY. Technically on the outskirts of Ambleside. A large pub with a terrace directly on the water. The setting is exceptional, the food is above average for a lakeside pub, and the beer garden is probably the best in the area. Gets very busy in summer. Worth it anyway." },
    { type: "h2", text: "Old Dungeon Ghyll, Great Langdale" },
    { type: "p", text: "LA22 9JU, 20 minutes' drive from Ambleside. Not in Ambleside but effectively the walkers' pub for the area. The hikers' bar is one of the great pub experiences in the north of England. Low ceiling, flagstone floor, open fire, Langdale beer from the local brewery. Dogs welcome, muddy boots expected. No music. If you have not been, go." },
    { type: "h2", text: "Apple Pie Eating House" },
    { type: "p", text: "Rydal Road, LA22 9AN. Not a pub but worth knowing: the Apple Pie is the best cafe-bakery in Ambleside and does lunch until mid-afternoon. Good sandwiches, exceptional cakes, proper coffee. When the pubs feel like too much commitment, this is the alternative." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "The Golden Rule does not do food. Plan accordingly — eat first, then go.",
      "Most Ambleside pubs are full by 7pm on a summer weekend. Get there at 6pm if you want a table.",
      "Dogs are welcome in the bar areas of most Ambleside pubs. Confirm before taking them into restaurant sections.",
      "The car parks in Ambleside fill early on summer weekends. Use the Rydal Road car park (LA22 9AH) as a fallback.",
    ]},
    { type: "cta", text: "Find more pubs and places to drink across the Lake District.", href: "/pubs", label: "Browse pubs →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "helvellyn-what-to-expect": [
    { type: "p", text: "Helvellyn is 950 metres and the third highest summit in England. It is also one of the most popular mountains in the country. On a summer Saturday the summit can have two hundred people on it. Striding Edge, the famous ridge approach, is genuinely exposed and has killed people. Both things are true." },
    { type: "h2", text: "The routes" },
    { type: "h3", text: "Via Striding Edge from Glenridding" },
    { type: "p", text: "The classic route. Park at Glenridding (CA11 0PA, pay and display). The path rises from the village via Mires Beck to the foot of Striding Edge. The edge itself is a long, narrow arete of rock requiring hands and feet at the sharpest sections. It is a Grade 1 scramble, not a walk. In dry conditions, confident walkers manage it comfortably. In wet conditions, it is slippery and significantly more serious. The summit is a short, steep pull above the edge. Return via Swirral Edge to Catstye Cam and down to Glenridding, or back the same way. Around 8 miles, 900m ascent, allow 5 to 6 hours." },
    { type: "h3", text: "Via Swirral Edge from Glenridding" },
    { type: "p", text: "A slightly easier alternative to Striding Edge, though still an exposed ridge. Most people do the horseshoe (up Striding Edge, down Swirral Edge, or vice versa)." },
    { type: "h3", text: "Via Grisedale from Patterdale" },
    { type: "p", text: "A longer approach from Patterdale (CA11 0NW) through Grisedale. Quieter and longer. Good for avoiding the Glenridding crowds. This is the fell walking route without the scrambling commitment of the edges. Around 10 miles, 900m ascent." },
    { type: "h2", text: "What most people get wrong" },
    { type: "ul", items: [
      "Underestimating Striding Edge. It looks fine in photos. In wind and rain, with wet rock, it is a different proposition. Do not attempt it in serious weather.",
      "Starting too late. The car park at Glenridding fills by 9am on summer Saturdays. Start by 7:30am or use the overflow parking on the edge of the village.",
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
    ]},
    { type: "h2", text: "After the walk" },
    { type: "p", text: "The Travellers Rest at Glenridding (CA11 0PA) is the post-walk option. Good beer, food until 9pm, dogs welcome in the bar. The Glenridding Hotel also has a bar open to non-guests. Both are two minutes from the car park." },
    { type: "callout", emoji: "⚠️", text: "Striding Edge in mist or wet conditions requires experience and caution. Turn back if conditions change above the col. Mountain Rescue Keswick covers this area." },
    { type: "cta", text: "Explore more fell walking routes on Hike The Lakes.", href: "https://www.hikethelakes.com/fells/helvellyn", label: "Helvellyn on Hike The Lakes →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "scafell-pike-complete-guide": [
    { type: "p", text: "Scafell Pike is 978 metres and the highest point in England. It is also the most climbed mountain in the country. On a summer weekend there will be several hundred people on the summit. None of that diminishes the achievement or the mountain." },
    { type: "h2", text: "Routes" },
    { type: "h3", text: "Wasdale Head: the most direct" },
    { type: "p", text: "Park at the NT car park at Wasdale Head (CA20 1EX, charged). The path rises via Brown Tongue to Hollow Stones beneath the crags, then ascends via Lingmell Col to the summit. 5.6 miles, 920m ascent, allow 5 to 6 hours. The path is well-worn and never in doubt, but the terrain above Hollow Stones is relentless boulder-field. Wasdale Head is 40 minutes from the nearest A-road. Plan the drive in." },
    { type: "h3", text: "Langdale via Esk Hause: the wilder route" },
    { type: "p", text: "Park at Old Dungeon Ghyll (LA22 9JU, National Trust). Ascend Rossett Gill, cross the high col at Esk Hause, and climb to the summit via the Great Moss or Great End. 8.5 miles, 1050m ascent, allow 7 to 8 hours. A more committing route through genuinely wild country. The Esk Hause junction is complex in mist and requires careful navigation." },
    { type: "h3", text: "The Corridor Route: the most interesting" },
    { type: "p", text: "From Sty Head, follow the Corridor Route, a narrow path cut into the hillside heading west beneath the crags of Great Gable and Scafell. This is the most spectacular approach and avoids the crowds of the Wasdale path on the upper mountain. Requires a start from Seathwaite (CA12 5XJ) or Wasdale." },
    { type: "h2", text: "The summit" },
    { type: "p", text: "A wide plateau of dark volcanic rock, cairn-strewn, disorienting in mist. The summit cairn is a substantial structure. On a clear day the Isle of Man is visible and the view encompasses the whole of the Lake District. In mist, you need a bearing. The compass bearing from the summit to the Lingmell descent is 310 degrees. Know this before you go up." },
    { type: "h2", text: "The one mistake most people make" },
    { type: "p", text: "Starting too late. The summit of Scafell Pike in July at 2pm has queues at the summit cairn and congestion on the descent paths. Start by 7am and you have the upper mountain largely to yourself. Start at 10am and you are walking with hundreds of other people in the same direction." },
    { type: "h2", text: "What to bring" },
    { type: "ul", items: [
      "Compass. Not optional. The summit plateau in cloud is genuinely disorienting.",
      "OS Explorer OL6 (The English Lakes: South Western area).",
      "Waterproofs and warm layers. This is the highest point in England and weather changes fast.",
      "Water. At least 2 litres for the full route. No reliable source above Hollow Stones.",
      "Head torch if you start very early or think you might be out after dark.",
    ]},
    { type: "h2", text: "After the walk" },
    { type: "p", text: "The Wasdale Head Inn (CA20 1EX) is the post-walk destination if you come from Wasdale. It is one of the great post-fell pubs in England. Dogs welcome in the bar. The Old Dungeon Ghyll (LA22 9JU) serves the same purpose for the Langdale approach." },
    { type: "callout", emoji: "⚠️", text: "Do not attempt Broad Stand, the direct rock route between Scafell and Scafell Pike, without climbing experience and equipment. People have died on it." },
    { type: "cta", text: "Full fell guide for Scafell Pike on Hike The Lakes.", href: "https://www.hikethelakes.com/fells/scafell-pike", label: "Scafell Pike on Hike The Lakes →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "where-to-stay-windermere": [
    { type: "p", text: "Windermere and Bowness are the most visited part of the Lake District and have the widest range of accommodation. The choice is large enough to be confusing. Here is how to navigate it." },
    { type: "h2", text: "Windermere vs Bowness: which to choose" },
    { type: "p", text: "Windermere is the town (about a mile from the lake, confusingly). Bowness is the lakeside village. They are connected by a 20-minute walk or a 5-minute drive. Windermere town is quieter, cheaper, and has the railway station. Bowness is busier, more expensive, closer to the pier and the boats, and has more restaurants and pubs immediately accessible." },
    { type: "p", text: "If you are here primarily to walk, Windermere town is the better base. The A591 gives quick access to Ambleside and the central Lakes. If you want the lake itself, the boats, and the Beatrix Potter visitor centre, Bowness is more convenient." },
    { type: "h2", text: "Hotels" },
    { type: "p", text: "The Windermere Hotel (LA23 2JF) is a comfortable, centrally located mid-range option in Windermere town. The Lakeside Hotel (LA12 8AT) at the south end of the lake is the most atmospheric hotel on Windermere itself, though it is at the far end of the lake and requires a car for most things. The Belsfield Hotel in Bowness has the best lake views of any hotel in the immediate area." },
    { type: "h2", text: "B&Bs and guesthouses" },
    { type: "p", text: "B&Bs in the Windermere and Bowness area range from basic to genuinely excellent. The competition is fierce and standards are generally high. Expect to pay £80 to £140 per room per night for a good B&B in peak summer. Breakfast is usually included. The High Street in Windermere town has a concentration of options that are easy to compare in person." },
    { type: "h2", text: "Self-catering" },
    { type: "p", text: "Self-catering in the Windermere area means primarily apartments in Bowness and cottages in the surrounding villages. For families, self-catering is usually more practical and often more economical. Near Sawrey and Far Sawrey, across the ferry, have good cottage stock in quiet settings. The Windermere ferry (LA22 0LP) crosses the lake in 10 minutes and is a useful back route to the Coniston side." },
    { type: "h2", text: "When to book" },
    { type: "p", text: "School holiday weeks (July and August, Easter, half terms) require 6 to 12 months' advance booking for the best options. Bank holiday weekends in the Lakes are extremely busy. Off-season, October to March, and midweek options remain available with shorter notice and at lower prices." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "Parking in Bowness in summer is a significant problem. Confirm whether your accommodation has parking before booking.",
      "Windermere railway station connects to Oxenholme on the West Coast Main Line. London to Windermere by train is around 3 hours with one change.",
      "The Windermere Lake Cruises pier at Waterhead (LA22 0EY) is a 20-minute walk from Windermere town or a 10-minute walk from central Bowness.",
    ]},
    { type: "cta", text: "Find accommodation across the Lake District.", href: "/accommodation", label: "Browse accommodation →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "grasmere-vs-ambleside": [
    { type: "p", text: "Grasmere and Ambleside are about 4 miles apart on the A591, connected by the most beautiful stretch of road in the southern Lakes. They offer genuinely different experiences." },
    { type: "h2", text: "Grasmere" },
    { type: "p", text: "Grasmere is a village, not a town. The population is small. It has one main street, a handful of restaurants, a couple of pubs, Dove Cottage (Wordsworth's home), and the famous gingerbread shop. The lake is a 10-minute walk from the village. The fells above the village, particularly Helm Crag and the ridge to Fairfield, are exceptional." },
    { type: "p", text: "Grasmere is quieter than Ambleside in the evenings. If you want a base that feels like a proper Lake District village, this is it. The downside is less choice for eating and drinking, and a slightly longer drive to the big supermarkets in Ambleside." },
    { type: "h2", text: "Ambleside" },
    { type: "p", text: "Ambleside is a proper market town. It has two supermarkets, a wide range of restaurants and cafes, a leisure centre with a pool, an outdoor gear concentration that makes it the outdoor equipment capital of the Lakes, and direct access to the lake at Waterhead. It is busier, louder, and more commercial than Grasmere. Also more practical." },
    { type: "p", text: "For families with children who need more to do, Ambleside is the better base. The Zeffirellis cinema-restaurant is here. The Apple Pie bakery is here. When it rains in Grasmere, your options narrow quickly. When it rains in Ambleside, there is still plenty to do." },
    { type: "h2", text: "Walking access" },
    { type: "h3", text: "Grasmere's best walks" },
    { type: "ul", items: [
      "Helm Crag (the Howitzer): short, steep, distinctive summit, 45 minutes from the village",
      "Easedale Tarn: classic valley walk with waterfall, 3 miles, 2 to 3 hours",
      "Silver How: good viewpoint, underused, 4 miles, 3 hours",
      "Fairfield Horseshoe approach: the classic route goes through Grasmere's eastern fells",
    ]},
    { type: "h3", text: "Ambleside's best walks" },
    { type: "ul", items: [
      "Loughrigg Fell: town edge, excellent views over both Rydal Water and Windermere, 2 to 3 hours",
      "Fairfield Horseshoe: the classic 11-mile horseshoe from Ambleside",
      "Stock Ghyll Force: 20-minute waterfall walk from the town centre",
      "Langdale access: 20-minute drive to the best valley walks in the southern Lakes",
    ]},
    { type: "h2", text: "The verdict" },
    { type: "p", text: "If you want a proper village feel, peace, and walking directly from the door: Grasmere. If you want convenience, more eating options, family activities, and a town base with practical facilities: Ambleside. Most people visiting for a week do both. One night in Grasmere, several in Ambleside, or vice versa." },
    { type: "cta", text: "Browse accommodation in Ambleside and Grasmere.", href: "/accommodation", label: "Browse accommodation →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "best-family-days-out-lake-district": [
    { type: "p", text: "I have brought my kids to the Lakes repeatedly. These are the days out that actually work, not the ones that look good on a brochure." },
    { type: "h2", text: "Tarn Hows circular walk" },
    { type: "p", text: "LA21 8DP, National Trust car park, charged. A flat circular path around a dramatic tarn, 1.5 miles, accessible for small children and pushchairs on the main path. The setting is excellent. The walk is short enough that it does not become a problem. Good for ages 2 and up. Combine with lunch in Hawkshead village (10 minutes drive) afterwards." },
    { type: "h2", text: "Windermere Lake Cruises: Ambleside to Lakeside and back" },
    { type: "p", text: "The full run from Waterhead at Ambleside to Lakeside at the south end of Windermere. Covered boats with outdoor deck sections. Children under 5 free. At Lakeside, the Haverthwaite Railway connects for a steam train section. Doing the whole thing boat-train-boat makes a full day and works for most ages. Book at Waterhead pier (LA22 0EY) or online." },
    { type: "h2", text: "Aira Force waterfall" },
    { type: "p", text: "CA11 0JS, National Trust, car park charged. A series of waterfalls in a wooded ravine, 2-mile circular walk, accessible for children of all ages. After overnight rain they are extraordinary. NT café on site. One of the most-visited NT sites in the Lakes and deservedly so. Go on a weekday if possible." },
    { type: "h2", text: "Dodd Wood red squirrel trail" },
    { type: "p", text: "CA12 4QE, Forestry England. A red squirrel trail through conifer woodland above Bassenthwaite Lake. Feeders on the trail attract squirrels. Go in the morning, move quietly, and there is a real chance of sightings at close range. The osprey viewpoint at the car park base operates April to August with telescopes and RSPB staff. Combine both for a full morning." },
    { type: "h2", text: "Ullswater Steamers: Glenridding to Howtown walk" },
    { type: "p", text: "Take the steamer from Glenridding (CA11 0PD) to Howtown and walk back along the lakeshore (6 miles, mostly flat). Good for older children who can manage a half-day walk. The combination of the boat outward and the walk back is better than just the boat. Carry lunch as there is nothing at Howtown." },
    { type: "h2", text: "When it rains" },
    { type: "ul", items: [
      "Pencil Museum, Keswick (CA12 5NG): genuinely interesting, two hours, not expensive",
      "Windermere Jetty Museum (LA23 3JH): the best museum building in the Lakes, excellent for ages 8+",
      "Go Ape, Grizedale (LA22 0QJ): operates in most weather, book ahead",
      "World of Beatrix Potter, Bowness (LA23 3BX): aimed at under-8s, about an hour",
    ]},
    { type: "cta", text: "Find more things to do across the Lake District.", href: "/things-to-do", label: "Browse things to do →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "autumn-in-the-lake-district": [
    { type: "p", text: "October and November are my favourite months in the Lakes. The school holidays are over, the car parks are manageable, the light is different, and the landscape does something it does not do at any other time of year." },
    { type: "h2", text: "The colours" },
    { type: "p", text: "The Lake District in October has genuine autumn colour. The sessile oak woodland on the lower fells and valley sides turns amber and gold. The bracken on the open fell goes russet. The birches go yellow. The larches in the forestry plantations go to copper before dropping. This peaks typically in the second and third week of October. It is not a minor variation — it genuinely changes what the landscape looks like." },
    { type: "h2", text: "The red deer rut" },
    { type: "p", text: "Martindale, on the far side of Ullswater, has one of the best red deer populations in England. In October the stags rut. You will hear them before you see them: the roaring carries across the valley. Dawn and dusk are the best times. Access via Howtown on the Ullswater Steamer or by road through Pooley Bridge to Martindale. Binoculars help, but the deer herd is large enough that bare-eye sightings at 200 metres are not unusual." },
    { type: "h2", text: "The walking" },
    { type: "p", text: "Autumn is better for fell walking than summer in almost every way. Lower temperatures mean comfortable ascent rates without the July heat. The views are clearer on good days as the haze drops. The paths are less crowded. The midges, which are a genuine nuisance in August, are gone by September." },
    { type: "p", text: "The risk factors shift. Weather becomes less predictable from October. Days shorten significantly by November. Daylight on a fell by mid-November is from around 7:30am to 4:30pm. Plan accordingly, start early, and be off high ground by 3:30pm." },
    { type: "h2", text: "The pubs in autumn" },
    { type: "p", text: "This is not a small thing. A Lakes pub in October with an open fire, wet gear on the drying rack, and a proper cask ale after six hours on the fells is one of the best evenings available in England. The Old Dungeon Ghyll in Langdale (LA22 9JU), the Wasdale Head Inn (CA20 1EX), and the Kirkstone Pass Inn (LA23 1LU) all operate year-round and are better in autumn than in summer because there is more room and the fires are on." },
    { type: "h2", text: "Practical autumn notes" },
    { type: "ul", items: [
      "Pack a head torch from October. Darkness comes fast if you are running late on the descent.",
      "Waterproof trousers matter more in October than July. The bracken on the fell flanks is wet all day.",
      "Kendal Calling is in late July or early August. Ambleside Sports is in July. Grasmere Lakeland Sports is in August. By October the events calendar is quieter.",
      "Accommodation prices drop in October and November compared to peak summer. The same hotels are 20 to 40% cheaper.",
    ]},
    { type: "cta", text: "Find accommodation and plan your autumn Lakes trip.", href: "/accommodation", label: "Browse accommodation →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "the-open-2026-staying-lake-district": [
    { type: "p", text: "The Open Championship 2026 is at Royal Birkdale, 12 to 19 July. Royal Birkdale is in Southport. Southport accommodation has been fully booked for over a year. Formby is similar. But Royal Birkdale is 45 minutes from the southern Lake District by car, and the Lakes are largely unaffected by the usual Open congestion." },
    { type: "h2", text: "Travel logistics" },
    { type: "p", text: "The M6 connects the Lake District to the M58 and then the A565 south to Southport. From Windermere to Royal Birkdale is around 50 miles, roughly 50 to 60 minutes in normal conditions. During Open week, the A565 approaching Southport will have significant traffic from 8am onwards. Allow extra time. The A59 via Ormskirk is the alternative southern route." },
    { type: "p", text: "There are no official shuttle buses from the Lakes to Royal Birkdale. The options are drive and use the official Open parking and shuttle from the designated car parks outside Southport, or train from Oxenholme or Lancaster to Southport via Preston. The train route works but requires planning — trains to Southport require a change at Preston or Wigan." },
    { type: "h2", text: "Why it works as a base" },
    { type: "p", text: "The Lake District as an Open week base makes practical sense if you are combining the golf with a walking holiday. You get proper accommodation in a world-class landscape, you drive to the golf for the day, and you have the fells and lakes for the days you are not attending. The lakes and hills are completely unaffected by the Birkdale crowds." },
    { type: "h2", text: "Best southern Lakes bases for the Open" },
    { type: "ul", items: [
      "Windermere and Bowness: closest to the M6, 50 minutes from Birkdale. Widest accommodation choice.",
      "Ambleside: 55 minutes. Good town base with walking access.",
      "Coniston: more remote, 60 minutes. Good if you want a quiet village over a town.",
      "Hawkshead: a compromise between Windermere and Coniston. 55 minutes. Beautiful village.",
    ]},
    { type: "h2", text: "Book now" },
    { type: "p", text: "If you are reading this in early 2026, the time to book is now. Open week fills the Lakes too, particularly for families who want a holiday that covers more than just the golf. The best Lake District accommodation for July will go before May." },
    { type: "cta", text: "Find accommodation across the Lake District for Open week.", href: "/accommodation", label: "Browse accommodation →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "week-itinerary-lake-district": [
    { type: "p", text: "A week in the Lakes, done properly. This assumes you are based in Ambleside or Grasmere, have a car, and are here for the walking as well as the villages and food." },
    { type: "h2", text: "Day 1: Arrival and Ambleside acclimatisation" },
    { type: "p", text: "Arrive, check in, walk Stock Ghyll Force (20 minutes from the town centre, good waterfall). Explore Ambleside. Dinner at Zeffirellis or the Unicorn pub. Early night." },
    { type: "h2", text: "Day 2: Catbells and Derwentwater" },
    { type: "p", text: "Drive to Keswick (30 minutes). Take the Keswick Launch to Hawes End. Walk up Catbells, along the ridge to Hause Gate, and back to Hawes End for the boat back. 3 to 4 hours. Explore Keswick. Lunch at the Dog and Gun or Bryson's. Return to base." },
    { type: "h2", text: "Day 3: Langdale and the Pikes" },
    { type: "p", text: "Drive to Great Langdale (20 minutes). Walk up Pike of Blisco or, if you want the full day, the Langdale Pikes via Stickle Ghyll. Return via Pavey Ark if you are taking the longer circuit. A serious walk day. Dinner at the Old Dungeon Ghyll hikers' bar. Worth the drive back after." },
    { type: "h2", text: "Day 4: Grasmere and the village circuit" },
    { type: "p", text: "Slower day. Walk the Grasmere lake circuit (3.5 miles, flat). Dove Cottage and the Wordsworth Museum. Grasmere Gingerbread Shop. Easedale Tarn if you have the energy (adds 3 miles and 190m). Lunch in Grasmere. Afternoon in Rydal if the weather is good." },
    { type: "h2", text: "Day 5: Helvellyn" },
    { type: "p", text: "The big day. Start at Glenridding by 7:30am. Up via Striding Edge in good weather, or the Grisedale path in uncertain conditions. Summit. Return via Swirral Edge. Post-walk at the Travellers Rest at Glenridding. Allow a full day — 5 to 6 hours walking plus travel." },
    { type: "h2", text: "Day 6: Coniston and Tarn Hows" },
    { type: "p", text: "Drive to Coniston (25 minutes). Walk Coniston Old Man if you want another summit (5 miles, 750m, 4 hours). Or take a lower day: Tarn Hows circular (1.5 miles, flat), Coniston village, the Ruskin Museum, lunch at the Black Bull in Coniston. Take the Coniston Launch for an afternoon on the water." },
    { type: "h2", text: "Day 7: Ullswater and departure" },
    { type: "p", text: "Drive to Glenridding (30 minutes). Take the Ullswater Steamer to Howtown. Walk back along the lakeshore (6 miles, 3 to 4 hours). The best end-of-week walk in the Lakes for most people. Scenic, not too hard, and the boat adds the right note to finish on. Aira Force waterfall is 10 minutes from the Glenridding car park as a final stop before heading home." },
    { type: "cta", text: "Find accommodation for your week in the Lakes.", href: "/accommodation", label: "Browse accommodation →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "wainwrights-beginners-guide": [
    { type: "p", text: "Alfred Wainwright wrote seven illustrated guides to the Lake District fells between 1955 and 1966. He described 214 named summits in detailed hand-drawn form. Completing all 214 has become an objective for thousands of walkers. This is what you need to know before you start." },
    { type: "h2", text: "What counts as a Wainwright" },
    { type: "p", text: "A Wainwright is any summit included in Wainwright's seven-book series covering the eastern, western, northern, southern, central, north-western, and far eastern fells. The 214 fells range from 100-metre outcrops like Castle Crag in Borrowdale (not many fells have their own book chapter below 300m) to Scafell Pike at 978 metres. They are not simply the highest hills — Wainwright included them based on a combination of character, viewpoints, and intrinsic interest." },
    { type: "h2", text: "Where to start" },
    { type: "p", text: "Catbells is the standard recommendation and it deserves the reputation. 451m, accessible from the Keswick Launch, with an excellent ridge walk and views over Derwentwater. It is a genuine fell, not a hill, and feels like a proper mountain to a beginner. The return journey on the boat from Hawes End completes the experience." },
    { type: "p", text: "Other good starter Wainwrights: Loughrigg Fell (350m, above Ambleside), Silver How (395m, above Grasmere), Helm Crag (405m, directly above Grasmere), and Haystacks (597m, Buttermere — Wainwright's own favourite)." },
    { type: "h2", text: "How long does it take" },
    { type: "p", text: "Most people who set out to complete the Wainwrights never do. Of those who do, the average completion time is somewhere between 10 and 20 years of regular visits. A very committed walker doing 4 to 5 Wainwrights per trip, visiting 3 to 4 times a year, might complete in 5 to 7 years. The 214 fells include many that are remote, require multi-fell days to access efficiently, and need specific weather conditions to be enjoyable." },
    { type: "h2", text: "The books" },
    { type: "p", text: "Wainwright's seven pictorial guides are available in revised editions. The illustrations and handwriting are his own, the route notes have been updated for current paths and conditions. Buy them. They are genuinely useful on the hill and the illustrations are remarkable. The Westmorland Gazette published the originals and republishes updated editions. Most outdoor shops in Keswick and Ambleside stock the full set." },
    { type: "h2", text: "The practical reality" },
    { type: "p", text: "The Wainwrights in the Eastern Fells book, which includes Helvellyn and the popular summits, are the easiest to accumulate early because they are closest to the main tourist areas. The Western Fells (Great Gable, the Scafell group, Pillar) are more remote and require specific days. The Far Eastern Fells cover a large area including High Street and are often done as multi-fell horseshoe days. The Northern Fells (Skiddaw, Blencathra) are close to Keswick and accessible but distinct." },
    { type: "callout", emoji: "📖", text: "Wainwright's Pictorial Guides are sold in most outdoor gear shops in Keswick and Ambleside, and at the Keswick Museum and Grasmere Gift Shop." },
    { type: "cta", text: "Explore all 214 Wainwright fells on Hike The Lakes.", href: "https://www.hikethelakes.com/fells", label: "Wainwrights on Hike The Lakes →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "dog-walking-lake-district": [
    { type: "p", text: "The Lake District is broadly good for dogs. Most fells are open, most pubs welcome them, and the lake shores are accessible. Here is the practical version of that." },
    { type: "h2", text: "Fell walking with dogs: the livestock rule" },
    { type: "p", text: "Dogs are permitted on virtually all fell paths including the Wainwrights. The constraint is livestock. The Lakes are a working farming landscape and sheep are everywhere. Dogs that chase sheep can legally be shot by farmers. March to May is lambing season and requires particular care. On enclosed ground below the fell walls, dogs should be on leads wherever sheep are visible. On the open fell tops above the wall line, the risk is lower but use judgment." },
    { type: "h2", text: "Best walks with dogs" },
    { type: "ul", items: [
      "Catbells (CA12 5UQ via Hawes End): open fell, minimal enclosed ground, excellent views. Boat to the start adds novelty.",
      "Haystacks (CA13 9XA, Gatesgarth Farm): Wainwright's favourite, small tarns on the summit, dogs can run freely on the tops.",
      "Tarn Hows (LA21 8DP): flat circular, must be on leads near grazing areas but the path is easy for any dog.",
      "Ullswater lakeshore path (CA11 0PD, Glenridding): 6 miles, mostly flat, lake shore the whole way. Dogs welcome on the Ullswater Steamers.",
      "Grizedale Forest (LA22 0QJ): woodland trails, leads on the main routes, red squirrels in the upper sections.",
    ]},
    { type: "h2", text: "Dog-friendly pubs" },
    { type: "p", text: "Most walkers' pubs in the Lakes are dog-friendly in the bar area. The best ones for dogs specifically: the Old Dungeon Ghyll in Langdale (LA22 9JU) — dogs are part of the furniture in the hikers' bar. The Wasdale Head Inn (CA20 1EX) — as remote as it gets, dogs very welcome. The Dog and Gun in Keswick (CA12 5JB) — the name is a reasonable clue. The Fish Inn at Buttermere (CA13 9XA) — small, good beer, dogs in the bar." },
    { type: "h2", text: "Ticks" },
    { type: "p", text: "Sheep ticks are present across the Lake District fells, particularly in bracken. After any fell walk, check your dog thoroughly: around ears, groin, between toes, under the collar. Remove ticks with a tick remover tool (not fingers). Lyme disease is present in ticks in the Lakes. Discuss tick prevention with your vet before a Lake District trip if you are not already on preventative treatment." },
    { type: "h2", text: "Blue-green algae" },
    { type: "p", text: "In warm, still summer conditions (usually July to September) blue-green algae can bloom in the Lakes. This is toxic to dogs and can be fatal quickly if ingested. Warnings are posted on the Lake District National Park Authority website and social media when risk is high. Check before letting dogs swim in warm summer conditions." },
    { type: "cta", text: "More practical advice in the dog-friendly Lake District guide.", href: "/dog-friendly-lake-district", label: "Dog-friendly guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "rainy-day-lake-district-guide": [
    { type: "p", text: "It will rain. The Lake District has the highest rainfall in England. Here is the plan." },
    { type: "h2", text: "First option: walk anyway" },
    { type: "p", text: "With proper gear, a rainy day walk in the Lakes is one of the best experiences the place offers. The waterfalls are at full flow. The crowds are gone. The valleys have mist. The light is different from a clear summer day. What changes is the experience, not the quality. You need: waterproof jacket, waterproof trousers (not optional), proper boots, gloves, a warm layer. With those, drizzle and light rain are entirely comfortable." },
    { type: "h2", text: "Best wet weather walks" },
    { type: "ul", items: [
      "Aira Force (CA11 0JS): spectacular after rain, 2-mile circuit, NT café, any age",
      "Sourmilk Gill and Easedale Tarn, Grasmere: the waterfall doubles in size after overnight rain",
      "Grizedale Forest (LA22 0QJ): tree cover makes this the most comfortable wet walk in the Lakes",
      "Stock Ghyll Force, Ambleside: 20 minutes from the town centre, excellent after heavy rain",
    ]},
    { type: "h2", text: "Best museums" },
    { type: "ul", items: [
      "Windermere Jetty Museum (LA23 3JH): the best museum building in the Lakes, boats on the water. Allow 2 to 3 hours.",
      "Pencil Museum, Keswick (CA12 5NG): unexpectedly good. 2 hours. Not expensive.",
      "Keswick Museum and Art Gallery (CA12 5NJ): free entry, local natural history and literary connections.",
      "Brantwood, Coniston (LA21 8AD): Ruskin's house with woodland gardens. Half a day.",
      "Dove Cottage and Wordsworth Museum, Grasmere (LA22 9SH): literary history, guided tours.",
    ]},
    { type: "h2", text: "The pub option" },
    { type: "p", text: "A good Lake District pub in October with an open fire and a proper cask ale after a walk in the rain is one of the better evenings available anywhere. The Old Dungeon Ghyll in Langdale (LA22 9JU) is the gold standard. The Wasdale Head Inn (CA20 1EX) requires more of a drive but is worth it. The Kirkstone Pass Inn (LA23 1LU) is atmospheric on a stormy day, situated on the pass between Windermere and Ullswater." },
    { type: "h2", text: "For families in the rain" },
    { type: "ul", items: [
      "Go Ape, Grizedale Forest (LA22 0QJ): operates in most conditions, book ahead",
      "World of Beatrix Potter, Bowness (LA23 3BX): under-8s, about an hour",
      "Keswick leisure centre (CA12 5NB): public pool with family swim sessions",
      "Rheged near Penrith (CA11 0DQ): cinema, climbing wall, soft play",
    ]},
    { type: "cta", text: "Full rainy day guide for the Lake District.", href: "/rainy-day-lake-district", label: "Rainy day guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "keswick-market-guide": [
    { type: "p", text: "Keswick market runs on Thursday and Saturday on the Market Square. It is not the biggest market in the north of England, but it is a genuine working market with local produce, not a tourist market dressed up as one." },
    { type: "h2", text: "When and where" },
    { type: "p", text: "Market Square, Keswick (CA12 5JA). Thursday: 9am to 3pm. Saturday: 9am to 3pm. Outdoor market with around 40 stalls on a good day. Can vary significantly in size depending on season and weather. Summer Saturdays have the most stalls. November Thursdays can be quiet." },
    { type: "h2", text: "What is there" },
    { type: "p", text: "Local produce is the main event: Cumbrian cheeses, local meats (Herdwick lamb, pork, beef), eggs, seasonal vegetables, homemade preserves and chutneys. There are usually two or three hot food stalls, a decent cheese counter, a bakery stall, and several craft and gift stalls. The produce quality is genuinely good and the prices are reasonable compared to the farm shops." },
    { type: "h2", text: "What is not worth it" },
    { type: "p", text: "The tourist-facing stalls with the same mass-produced goods you find at every market. The cheap clothing stalls. Skip those and head for the food. The cheese counter and the Herdwick lamb stall are the best reasons to go." },
    { type: "h2", text: "Around the market" },
    { type: "p", text: "Keswick town centre is walkable from the market. The Keswick Museum is 5 minutes away in Fitz Park. The Pencil Museum is 10 minutes on foot. Bryson's bakery on Main Street is the best place for a coffee and something to eat before or after. The Car parking closest to the market is the central Lakeside car park (CA12 5DJ)." },
    { type: "h2", text: "Practical notes" },
    { type: "ul", items: [
      "Get there by 10am if you want the best of the produce stalls before they sell out.",
      "The market is outdoor and unshielded. Bring appropriate clothing in winter.",
      "Parking in Keswick fills fast on Saturdays. The Lakeside car park (CA12 5DJ) is closest to the market. The station road car park is a 10-minute walk.",
      "Card payments are accepted by most stalls now, though cash is still useful for the smaller producers.",
    ]},
    { type: "cta", text: "Find more things to do in Keswick.", href: "/keswick", label: "Keswick guide →" },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  "ullswater-by-boat": [
    { type: "p", text: "The Ullswater Steamers have been running on Ullswater since 1859. The current fleet includes two Victorian steam-powered vessels. They connect three piers: Glenridding at the south end, Howtown on the eastern shore, and Pooley Bridge at the north end. Taking the steamer is the best single day out on Ullswater, and the Howtown to Glenridding walk makes it genuinely memorable." },
    { type: "h2", text: "The routes" },
    { type: "h3", text: "Glenridding to Howtown" },
    { type: "p", text: "The most useful journey for walkers. The steamer takes approximately 35 minutes and deposits you at Howtown pier on the wild eastern shore. From here, the lakeshore path back to Glenridding is 6 miles of excellent walking. The path is signed and clear throughout, mostly flat, with the lake to the left and the eastern fells rising steeply to the right." },
    { type: "h3", text: "Glenridding to Pooley Bridge" },
    { type: "p", text: "The full lake crossing, around an hour, via Howtown. Good for seeing the whole lake and the landscape variety from north to south. Pooley Bridge at the north end is a small village with a decent pub. Return from Pooley Bridge by road or by steamer on the return service." },
    { type: "h2", text: "The walk: Howtown to Glenridding" },
    { type: "p", text: "6 miles, 3 to 4 hours, mostly flat with some gentle ups and downs around the headlands. The path is well-established and clear throughout. There is nothing between Howtown pier and Patterdale in terms of food or facilities, so carry lunch and water for the walk. The path passes through Sandwick, where there is a small stream crossing, and along the higher flanks above Hallin Fell before descending to Patterdale and then Glenridding." },
    { type: "h2", text: "Dogs on the steamers" },
    { type: "p", text: "Dogs are welcome on the Ullswater Steamers at no extra charge. They must be kept on a lead on the boat. The decks are manageable for dogs of any size. The walk back from Howtown is excellent with dogs, though there are some livestock fields on the lower path sections near Sandwick." },
    { type: "h2", text: "Practical information" },
    { type: "ul", items: [
      "Glenridding car park (CA11 0PD): pay and display, fills early on summer weekends",
      "The steamer service is seasonal, with a full timetable from Easter to October and reduced winter services",
      "Book online at ullswater-steamers.co.uk, or buy at the pier kiosk — arrive 15 minutes before departure",
      "The Glenridding Hotel bar is the best post-walk option at the southern pier",
      "The Pooley Bridge Inn at the northern pier is good if you are doing the full lake crossing",
    ]},
    { type: "callout", emoji: "⛵", text: "The Victorian steamers SS Raven and MV Lady of the Lake are the two historic vessels. Check the website for which vessel is scheduled on your date." },
    { type: "cta", text: "Find accommodation near Ullswater and Glenridding.", href: "/accommodation", label: "Browse accommodation →" },
  ],

};
