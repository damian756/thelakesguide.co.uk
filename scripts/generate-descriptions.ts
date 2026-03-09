/**
 * Generate SEO-optimised, human-readable descriptions for all businesses.
 * Uses sophisticated category-aware templates with real data from the DB.
 * Deterministic (same business always gets same description).
 * Run: npx tsx scripts/generate-descriptions.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── Seeded random for deterministic output ────────────────────────────────
function seededRng(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Data helpers ──────────────────────────────────────────────────────────
function extractArea(address: string): string {
  const areas = ["Birkdale", "Ainsdale", "Churchtown", "Crossens", "Marshside",
                 "Formby", "Ormskirk", "Scarisbrick", "Banks", "Halsall", "Burscough"];
  for (const a of areas) { if (address.includes(a)) return a; }
  return "Southport";
}

function ratingText(rating: number | null): string {
  if (!rating) return "";
  if (rating >= 4.8) return "one of the highest-rated in Southport";
  if (rating >= 4.5) return "consistently highly rated";
  if (rating >= 4.2) return "very well regarded by visitors";
  if (rating >= 3.8) return "well established and popular";
  return "a well-known local choice";
}

function ratingIntro(rating: number | null, reviewCount: number | null): string {
  if (!rating) return "";
  const count = reviewCount && reviewCount > 20
    ? reviewCount >= 1000 ? `over ${Math.floor(reviewCount / 100) * 100} Google reviews`
      : reviewCount >= 100 ? `${reviewCount} Google reviews`
      : `dozens of Google reviews`
    : "";
  if (rating >= 4.5 && count) return `With ${count} averaging ${rating.toFixed(1)} out of 5`;
  if (rating >= 4.0 && count) return `Rated ${rating.toFixed(1)}/5 across ${count}`;
  if (rating >= 4.0) return `Rated ${rating.toFixed(1)}/5 on Google`;
  return "";
}

function priceText(priceRange: string | null): string {
  if (!priceRange) return "";
  if (priceRange === "£") return "budget-friendly prices";
  if (priceRange === "££") return "mid-range prices that represent excellent value";
  if (priceRange === "£££") return "a premium experience at upscale prices";
  if (priceRange === "££££") return "a luxury, fine-dining price point";
  return "";
}

function areaContext(area: string): string {
  const contexts: Record<string, string> = {
    "Birkdale":  "Birkdale Village, one of Southport's most sought-after neighbourhoods",
    "Ainsdale":  "Ainsdale, a coastal village on Southport's southern edge",
    "Churchtown": "Churchtown, Southport's charming historic village",
    "Crossens":  "Crossens, a quiet residential area to the north of Southport",
    "Formby":    "Formby, a short drive south of Southport town centre",
    "Ormskirk":  "Ormskirk, a market town a short drive inland from Southport",
    "Scarisbrick": "Scarisbrick, in the peaceful countryside just outside Southport",
    "Banks":     "Banks, a village in the rural surroundings south of Southport",
  };
  return contexts[area] || "Southport town centre";
}

function hoursSnippet(openingHours: unknown): string {
  if (!openingHours || typeof openingHours !== "object") return "";
  const oh = openingHours as { weekdayText?: string[] };
  if (!oh.weekdayText?.length) return "";
  const lines = oh.weekdayText;
  const open24 = lines.some(l => l.includes("Open 24 hours"));
  if (open24) return "Open every day, around the clock";
  const weekend = lines.find(l => l.startsWith("Saturday") || l.startsWith("Sunday"));
  const weekday = lines.find(l => l.startsWith("Monday"));
  if (weekday && !weekday.includes("Closed")) return "Open throughout the week";
  return "check the opening hours above before visiting";
}

// ── Template generators by category ──────────────────────────────────────

function generateRestaurant(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const ctx = areaContext(area);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const rTxt = ratingText(b.rating);
  const price = priceText(b.priceRange);
  const hours = hoursSnippet(b.openingHours);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} has earned a firm following in ${area} — and it's easy to see why.`,
    `Tucked into ${ctx}, ${b.name} is the kind of place visitors return to again and again.`,
    `For anyone searching for a great meal in ${area}, ${b.name} is a name that comes up time and again.`,
    `${b.name} is a well-established favourite in ${ctx}.`,
    `If you're looking for somewhere to eat in ${area}, ${b.name} is well worth considering.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} is ${rTxt} — a testament to the kitchen's consistency.`,
    `${rIntro}, it's clear that ${b.name} knows how to keep its customers happy.`,
    `${rIntro}, ${b.name} has built the kind of reputation that takes years to earn in a competitive town like Southport.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}, making it a versatile choice whether you're after a quick bite or a longer meal.`,
    `${seedDesc}. That blend of quality and character is exactly what keeps people coming back.`,
    `${seedDesc} — the sort of combination that's harder to find than it should be.`,
  ] : [];

  const middles = [
    `${price ? `At ${price}, it` : "It"} strikes the balance between quality and accessibility that Southport's dining scene does well. Whether you're a visitor or a regular, the welcome feels genuine.`,
    `The team takes obvious pride in what they serve${price ? `, and at ${price}, it makes for an easy choice` : ""}. There's a reliability here that's hard to fake.`,
    `What sets ${b.name} apart in ${area} is the attention to detail — the kind of place where things are done properly, not just efficiently.`,
    `${b.name} is exactly the kind of local restaurant that makes ${area} a worthwhile dining destination in its own right, away from the bustle of Southport town centre.`,
    `For visitors to Southport — whether here for The Open 2026, the MLEC events, or simply exploring — ${b.name} makes a strong case as a dinner destination worth planning around.`,
  ];

  const closers = [
    `${hours ? `${hours}. ` : ""}It's worth booking ahead at weekends when the dining room fills up quickly. ${b.website ? "Check the website for the latest menus and reservation options." : "Call ahead to check availability."}`,
    `${hours ? `It's ${hours.toLowerCase()}` : "Worth checking the opening hours above"} before you make the trip. ${b.phone ? `You can reach them on ${b.phone}.` : ""}`,
    `Located in ${ctx}, ${b.name} is ${area !== "Southport" ? `a short drive from Southport town centre and` : ""} convenient for most parts of town. ${b.website ? "Visit their website for up-to-date menus." : ""}`,
    `${b.name} is one of those restaurants that locals tend to keep to themselves — but once you've been, you'll understand the loyalty.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];

  return parts.join("\n\n");
}

function generateHotel(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const ctx = areaContext(area);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const price = priceText(b.priceRange);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} offers a comfortable base for exploring everything Southport and the surrounding area has to offer.`,
    `For visitors planning a stay in ${area}, ${b.name} is a well-regarded option that combines convenience with character.`,
    `Whether you're visiting for The Open 2026 at Royal Birkdale, the MLEC events, or simply exploring Southport, ${b.name} puts you in a great position.`,
    `${b.name} is situated in ${ctx}, making it a practical and appealing choice for both leisure and business travellers.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} has earned a strong reputation for the quality of its accommodation and service.`,
    `${rIntro}, guests consistently praise the welcome and comfort on offer here.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}. For many guests, that's exactly what they're looking for in a Southport stay.`,
    `${seedDesc} — the sort of combination that makes it easy to settle in and relax.`,
  ] : [];

  const middles = [
    `${price ? `At ${price}, it` : "It"} represents ${price ? price : "solid value"} for the Southport area, particularly during peak periods like The Open Championship week when accommodation books up quickly.`,
    `Southport is a town that rewards exploration, and ${b.name} puts guests within easy reach of Lord Street, the seafront, and the best restaurants and bars the town has to offer.`,
    `The town's golf courses — including the legendary Royal Birkdale — are among the finest in the country, and staying in ${area} keeps you close to the action.`,
    `${b.name} works well for both short breaks and longer stays, with ${area !== "Southport" ? `good connections into Southport town centre` : `easy access to the seafront and Lord Street`}.`,
  ];

  const closers = [
    `Southport's accommodation gets booked up well in advance around major events, so it's worth reserving early. ${b.website ? `Visit the website for the latest availability and rates.` : b.phone ? `Call ${b.phone} to check availability.` : ""}`,
    `${b.name} is popular with both first-time visitors and returning guests — a reliable choice in ${area}. ${b.website ? "Book directly through the website for the best rates." : ""}`,
    `For anyone visiting Southport, ${b.name} is ${area !== "Southport" ? `a short journey from the town centre and` : ``} ideally placed to make the most of what this popular Lancashire seaside town has to offer.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateBar(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const ctx = areaContext(area);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} is one of ${area}'s most popular spots for a drink, with a loyal local following that speaks for itself.`,
    `Whether you're after a quiet pint or somewhere to watch the game, ${b.name} in ${area} is a reliable choice.`,
    `${b.name} has carved out a reputation as one of the better places to drink in ${ctx}.`,
    `For an evening out in ${area}, ${b.name} is a name that locals and visitors alike keep coming back to.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, it's clearly doing something right in a town with plenty of competition.`,
    `${rIntro}, ${b.name} has built a reputation as one of the more dependable options in the area.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}. That's a hard combination to beat on a night out in Southport.`,
    `${seedDesc}, and the atmosphere tends to reflect that.`,
  ] : [];

  const middles = [
    `Southport has a strong pub and bar scene, and ${b.name} holds its own comfortably among the competition. The kind of place where you can settle in for the evening without feeling rushed.`,
    `Located in ${ctx}, it's ${area !== "Southport" ? "a short drive or taxi from the town centre and" : ""} convenient for most parts of town.`,
    `Nights out in Southport tend to start on Lord Street and spread outwards — ${b.name} is worth putting on your list wherever the evening takes you.`,
  ];

  const closers = [
    `${hoursSnippet(b.openingHours) ? `${hoursSnippet(b.openingHours)}.` : ""} At weekends it can get busy, so arrive early if you want a good seat. ${b.phone ? `You can reach ${b.name} on ${b.phone}.` : ""}`,
    `${b.name} is one of those places that's easy to walk past and easy to stay in — the mark of a good local bar in any town.`,
    `Worth knowing about for any visit to ${area}, whether you're here for a weekend break, The Open 2026, or just passing through Southport.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateCafe(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} is a welcome find for anyone in search of good coffee and a proper break in ${area}.`,
    `For a relaxed coffee stop in ${area}, ${b.name} ticks all the right boxes.`,
    `${b.name} has become something of a local institution in ${area} — the kind of cafe you end up returning to every time you're nearby.`,
    `Sometimes a good cafe is all you need, and ${b.name} in ${area} has been delivering exactly that to locals and visitors alike.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, it's one of the more consistently well-reviewed cafes in the Southport area.`,
    `${rIntro}, guests single out the quality of the coffee and the unhurried atmosphere.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}. On a wet Southport afternoon, that's a difficult combination to resist.`,
    `${seedDesc} — the kind of simple pleasures that make a good cafe worth seeking out.`,
  ] : [];

  const middles = [
    `Southport has no shortage of cafes, but ${b.name} stands out for its commitment to doing things well. Good coffee, proper food, and staff who seem to genuinely enjoy what they do.`,
    `There's something particularly satisfying about finding a great cafe off the main drag, and ${b.name} in ${area} fits that description well.`,
    `Whether you're stopping in before a day exploring Southport's seafront and shops, or taking a break mid-afternoon, ${b.name} offers exactly the kind of restorative pause a good visit deserves.`,
  ];

  const closers = [
    `${hoursSnippet(b.openingHours) ? `${hoursSnippet(b.openingHours)}.` : ""} It's popular at peak times, so expect a short wait if you arrive mid-morning at the weekend.`,
    `${b.name} is the kind of cafe that makes ${area} feel like a neighbourhood worth knowing. Easy to recommend.`,
    `For visitors exploring ${area !== "Southport" ? `${area} and the wider Southport area` : "Southport"}, ${b.name} makes a strong case as a pit-stop worth planning around.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateGolf(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} is part of what makes the Southport area one of the finest golfing destinations in the world.`,
    `The Southport coastline is home to some of the best links golf in Britain, and ${b.name} is a proud part of that tradition.`,
    `For any golfer visiting the north-west of England, ${b.name} near Southport is a course that deserves a place on the itinerary.`,
    `${b.name} has long been regarded as one of the notable golfing venues in and around Southport.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} has built a strong reputation among golfers who know the Southport area.`,
  ] : [];

  const descParas = seedDesc ? [`${seedDesc}.`] : [];

  const middles = [
    `Southport sits at the heart of a remarkable stretch of coastline that hosts more top-100 courses within a few miles than almost anywhere else in England. The area's links courses have challenged and delighted golfers for well over a century, and ${b.name} is part of that rich heritage.`,
    `With Royal Birkdale Golf Club — host venue for The Open Championship 2026 — just down the coast, the Southport area attracts serious golfers from around the world. ${b.name} offers a complementary experience to the championship venues.`,
    `The combination of clean sea air, firm fairways and the ever-present challenge of the coastal wind makes golf around Southport a genuinely distinctive experience. ${b.name} captures that spirit well.`,
  ];

  const closers = [
    `${b.website ? `Visit the website for current green fees, tee time availability and membership information.` : b.phone ? `Contact ${b.name} on ${b.phone} for tee time bookings and green fee information.` : ""} Advance booking is recommended, particularly around The Open 2026 when demand across the region is at its peak.`,
    `For golfers planning a trip to Southport, ${b.name} is worth building into the itinerary alongside a visit to Royal Birkdale and the other outstanding courses in the area.`,
    `${b.name} welcomes visitors throughout the season. ${hoursSnippet(b.openingHours) ? hoursSnippet(b.openingHours) + "." : "Check the opening hours above before making the journey."}`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateShopping(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} is a well-established presence on the Southport shopping scene, attracting a steady stream of locals and visitors alike.`,
    `Southport's shopping offer stretches well beyond Lord Street, and ${b.name} in ${area} is a good example of what the town has to offer.`,
    `For anyone planning a shopping trip in ${area}, ${b.name} is one worth knowing about.`,
    `${b.name} has built a loyal customer base in ${area} through a combination of good product and reliable service.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} has built a reputation that speaks for itself in a competitive retail environment.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}. In a town with a strong independent retail culture, that kind of offer stands out.`,
    `${seedDesc}, which has helped it carve out a loyal following in ${area}.`,
  ] : [];

  const middles = [
    `Southport has long been proud of its shopping — Lord Street in particular is one of the finest Victorian shopping streets in the north of England. ${b.name} is part of a retail scene that rewards those willing to explore beyond the high street chains.`,
    `Whether you're a local or a visitor to Southport, ${b.name} offers the kind of experience that's increasingly hard to find online — knowledgeable staff, quality products, and the satisfaction of shopping somewhere that genuinely cares.`,
    `The town's mix of independents and established brands gives Southport a retail character that's worth exploring, and ${b.name} in ${area} plays its part in that.`,
  ];

  const closers = [
    `${hoursSnippet(b.openingHours) ? `${hoursSnippet(b.openingHours)}.` : ""} ${b.website ? `Browse online at their website, or visit in person for the full experience.` : b.phone ? `Call ahead on ${b.phone} to check stock or opening times.` : ""}`,
    `${b.name} is the kind of local retailer that gives ${area} its character — easy to recommend and worth supporting.`,
    `Worth a visit for anyone browsing ${area !== "Southport" ? `${area} or the wider Southport area` : "Southport's shops"}.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateWellness(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} has built a strong following in ${area} as a go-to destination for ${b.name.toLowerCase().includes("barber") || b.name.toLowerCase().includes("barbers") ? "a quality cut" : b.name.toLowerCase().includes("nail") || b.name.toLowerCase().includes("beauty") ? "beauty treatments" : "health and wellness"}.`,
    `For ${area} residents and visitors alike, ${b.name} is a well-regarded name in the local wellness and beauty scene.`,
    `${b.name} offers a professional, welcoming environment for anyone looking to ${b.name.toLowerCase().includes("gym") || b.name.toLowerCase().includes("fitness") ? "train and stay in shape" : b.name.toLowerCase().includes("barber") ? "get a proper haircut" : "treat themselves"} in ${area}.`,
    `In a town that takes its leisure seriously, ${b.name} has carved out a solid reputation in ${area}'s growing wellness scene.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, the team at ${b.name} has clearly earned the trust of its local clientele.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}. That combination keeps clients returning month after month.`,
  ] : [];

  const middles = [
    `Southport has a thriving independent health and beauty scene, and ${b.name} is one of the better examples of what the town has to offer. The staff take their craft seriously, and it shows in the results.`,
    `Whether you're a regular or visiting ${area} for the first time, the welcome at ${b.name} is reliably professional and friendly. No hard sell — just good work, done well.`,
    `Treatments and services at ${b.name} are competitively priced for the Southport area, making it accessible without cutting corners on quality.`,
  ];

  const closers = [
    `${hoursSnippet(b.openingHours) ? `${hoursSnippet(b.openingHours)}.` : ""} Booking in advance is recommended, particularly at busy times. ${b.phone ? `Call ${b.phone} to arrange an appointment.` : b.website ? "Book online through their website." : ""}`,
    `${b.name} is the kind of local business that makes ${area} worth visiting for more than just the coast and the golf. A solid, reliable choice.`,
    `For visitors to Southport looking for ${b.name.toLowerCase().includes("gym") || b.name.toLowerCase().includes("fitness") ? "somewhere to train" : "a beauty or wellness treatment"} during their stay, ${b.name} is worth booking in advance.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateAttraction(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} is one of the things that makes Southport worth visiting — a genuine attraction that appeals to a wide range of visitors.`,
    `For families, couples and solo travellers exploring Southport, ${b.name} is a name that comes up regularly when locals are asked for recommendations.`,
    `${b.name} adds to Southport's growing reputation as a day-trip and short-break destination on the Lancashire coast.`,
    `Southport has more to offer visitors than most people expect, and ${b.name} is a good example of why the town rewards proper exploration.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} is ${ratingText(b.rating)} among visitors to Southport.`,
  ] : [];

  const descParas = seedDesc ? [
    `${seedDesc}. It's the kind of experience that lingers after you've left.`,
    `${seedDesc}, which goes some way to explaining the enthusiasm of the reviews.`,
  ] : [];

  const middles = [
    `Southport has invested significantly in its visitor offer in recent years, with the MLEC development and the return of The Open Championship to Royal Birkdale in 2026 bringing renewed attention to the town. ${b.name} is part of what makes the destination compelling beyond those headline events.`,
    `Whether you're visiting for the day or staying for a few nights, ${b.name} is the kind of thing that justifies the trip. Southport's attractions tend to reward visitors who look beyond the obvious seafront and Lord Street draws.`,
    `${b.name} is ${area !== "Southport" ? `located in ${area}, a short distance from Southport town centre, making it easy to combine with` : "conveniently placed for"} a wider day out exploring the coast and town.`,
  ];

  const closers = [
    `${hoursSnippet(b.openingHours) ? `${hoursSnippet(b.openingHours)}.` : ""} ${b.website ? "Check the website for current opening times, admission prices and any seasonal variations." : b.phone ? `Call ${b.phone} for opening hours and admission details.` : "It's worth checking the current opening hours above before making the journey."}`,
    `${b.name} is a genuine highlight of any visit to Southport. Well worth building into your plans for the area.`,
    `Southport is an easy day trip from Manchester, Liverpool and Preston, and ${b.name} gives visitors another reason to make the journey up the coast.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateBeach(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `${b.name} is one of the natural highlights of the Southport coastline — a place where the scale of the Lancashire coast really hits home.`,
    `Southport's coastline is one of its greatest assets, and ${b.name} is one of the best places to experience it properly.`,
    `Few things sum up Southport better than a walk on ${b.name}, where wide beaches meet open sky in a way that's genuinely hard to find closer to the big cities.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} is clearly doing something right — though in this case, it's largely nature's doing.`,
  ] : [];

  const descParas = seedDesc ? [`${seedDesc}.`] : [];

  const middles = [
    `The beaches around Southport are among the finest in the north-west of England — wide, clean, and backed by sand dunes that stretch for miles in either direction. ${b.name} is one of the most popular and accessible stretches along this coast.`,
    `Southport's position on the Lancashire coast gives it a particular quality of light and space that urban visitors find immediately restorative. ${b.name} is one of the best places to experience that.`,
    `The dunes and coastal habitats around Southport are designated nature reserves, supporting rare species and providing some of the finest coastal walks in the region. ${b.name} sits at the heart of this protected landscape.`,
  ];

  const closers = [
    `${b.name} is accessible throughout the year, though summer and early autumn tend to offer the best conditions for beach walking and water sports. Dogs are generally welcome outside the main summer season.`,
    `Whether you're visiting for a single afternoon or planning a longer stay in Southport, ${b.name} is worth making time for. Pack layers — the coastal breeze can be bracing even on fine days.`,
    `Easily reached from Southport town centre${area !== "Southport" ? ` via ${area}` : ""}, ${b.name} makes an ideal addition to any visit to the town.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateActivities(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `For visitors looking to get more out of their time in Southport, ${b.name} offers exactly the kind of active experience the area does well.`,
    `${b.name} is one of the more interesting options for anyone wanting to experience the Southport area beyond its restaurants and shops.`,
    `Southport and its surrounding countryside offer a surprising range of outdoor and leisure activities, and ${b.name} is one of the better operators in the area.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} has earned a strong reputation among locals and visitors alike.`,
  ] : [];

  const descParas = seedDesc ? [`${seedDesc}.`] : [];

  const middles = [
    `The Southport area — with its coastline, dunes, rural hinterland and inland waterways — lends itself naturally to outdoor activity. ${b.name} makes the most of that geography.`,
    `Whether you're travelling as a couple, a family or a group, ${b.name} offers activities that give a different perspective on this part of the Lancashire coast.`,
    `Southport is easy to reach from Manchester, Liverpool and Preston, making it a popular destination for day trips and short breaks. ${b.name} gives visitors another compelling reason to make the journey.`,
  ];

  const closers = [
    `${b.website ? "Visit their website for full details on what's available, pricing and how to book." : b.phone ? `Call ${b.phone} to find out what's on offer and to make a booking.` : "Check the details above for contact information and booking options."} Booking ahead is recommended, especially during peak season.`,
    `${b.name} is one of those Southport experiences that tends to surprise people — well worth adding to the itinerary.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

function generateTransport(b: Business, rng: () => number): string {
  const area = extractArea(b.address);
  const rIntro = ratingIntro(b.rating, b.reviewCount);
  const seedDesc = b.shortDescription ? b.shortDescription.replace(/\.$/, "") : "";

  const openers = [
    `Getting around Southport is straightforward, and ${b.name} is one of the practical options available to visitors and locals.`,
    `${b.name} is a useful resource for anyone navigating Southport and the surrounding area.`,
    `For visitors to Southport who need reliable local transport or parking, ${b.name} is worth knowing about.`,
  ];

  const ratingParas = rIntro ? [
    `${rIntro}, ${b.name} has earned a solid reputation for reliability and value.`,
  ] : [];

  const descParas = seedDesc ? [`${seedDesc}.`] : [];

  const middles = [
    `Southport is well served by public transport links from Liverpool, Manchester and Preston, with the town's own transport infrastructure making it relatively easy to get around once you arrive. ${b.name} plays a useful role in that network.`,
    `For visitors arriving at Southport for The Open 2026 or the MLEC events, getting around efficiently is part of making the most of the trip. ${b.name} is one of the options worth keeping in mind.`,
  ];

  const closers = [
    `${b.phone ? `Contact ${b.name} directly on ${b.phone} for current rates and availability.` : b.website ? "Check the website for the latest information." : "See the details above for contact information."} ${hoursSnippet(b.openingHours) ? hoursSnippet(b.openingHours) + "." : ""}`,
    `Useful to know about for any visit to Southport, ${b.name} takes some of the logistical headache out of getting around the area.`,
  ];

  const parts = [
    pick(openers, rng),
    ...(ratingParas.length ? [pick(ratingParas, rng)] : []),
    ...(descParas.length ? [pick(descParas, rng)] : []),
    pick(middles, rng),
    pick(closers, rng),
  ];
  return parts.join("\n\n");
}

// ── Main dispatcher ───────────────────────────────────────────────────────

type Business = {
  id: string;
  slug: string;
  name: string;
  address: string;
  postcode: string;
  shortDescription: string | null;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string | null;
  openingHours: unknown;
  phone: string | null;
  website: string | null;
  category: { slug: string };
};

function generateDescription(b: Business): string {
  const rng = seededRng(b.slug);
  const cat = b.category.slug;

  switch (cat) {
    case "restaurants":      return generateRestaurant(b, rng);
    case "hotels":           return generateHotel(b, rng);
    case "bars-nightlife":   return generateBar(b, rng);
    case "cafes":            return generateCafe(b, rng);
    case "golf":             return generateGolf(b, rng);
    case "shopping":         return generateShopping(b, rng);
    case "wellness":         return generateWellness(b, rng);
    case "attractions":      return generateAttraction(b, rng);
    case "beaches-parks":    return generateBeach(b, rng);
    case "activities":       return generateActivities(b, rng);
    case "transport":        return generateTransport(b, rng);
    default:                 return generateAttraction(b, rng);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Generating descriptions for all businesses...\n");

  const businesses = await prisma.business.findMany({
    select: {
      id: true, slug: true, name: true, address: true, postcode: true,
      shortDescription: true, rating: true, reviewCount: true,
      priceRange: true, openingHours: true, phone: true, website: true,
      category: { select: { slug: true } },
    },
    orderBy: { name: "asc" },
  });

  console.log(`Found ${businesses.length} businesses\n`);

  let updated = 0;
  for (const b of businesses) {
    const description = generateDescription(b as Business);
    await prisma.business.update({
      where: { id: b.id },
      data: { description },
    });
    updated++;
    if (updated % 50 === 0) {
      console.log(`  ${updated}/${businesses.length} done...`);
    }
  }

  console.log(`\nComplete! Generated descriptions for ${updated} businesses.`);

  // Show 3 samples
  console.log("\n── Sample outputs ──\n");
  for (const b of businesses.slice(0, 3)) {
    console.log(`=== ${b.name} (${b.category.slug}) ===`);
    console.log(generateDescription(b as Business));
    console.log();
  }

  await prisma.$disconnect();
}

main().catch(console.error);
